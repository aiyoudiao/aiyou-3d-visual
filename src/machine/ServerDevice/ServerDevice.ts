import Cabinet from "../Cabinet/Cabinet"
import * as THREE from 'three'
import { mergeModel, handleRotaion, getAreaPageXAndY } from "../Helper/calc"
import { generateCube, addObject, generateHole, generateGroup, createPlaneGeometry, getTarget, clearHightBox } from '../Helper/core'
import { findTopObj, generateUUID, isClickModel, isExists } from '../Helper/util'
import { dataSet, scene, BASE_PATH, alarmColor, orbitControls, domElement, outlinePass, vueModel } from '../Helper/initThree'
import { EventHandler1 } from "../Event/Event"
import { openEquipmentDoor } from "../Helper/action"


export default class ServerDevice {
    name: string = '设备服务器'
    serviceUUID: string
    serverDevice: any
    listen: EventHandler1
    parent: Cabinet

    constructor(cfg, cabinet: Cabinet) {
        this.parent = cabinet
        this.listen = cabinet.listen

        this.init(cfg)
        this.bindEvent()
    }

    init(cfg) {

        const {
            serverDeviceCfg,
            uuid,
            equipmentUUID
        } = cfg

        let serviceUUID = serverDeviceCfg.uuid || generateUUID()

        const newObj = generateCube(serverDeviceCfg)
        newObj.userData = serverDeviceCfg.userData
        newObj.userData['equipmentUUID'] = uuid
        newObj.uuid = serviceUUID
        this.serviceUUID = serviceUUID
        addObject(newObj)

        this.serverDevice = newObj
    }

    bindEvent() {
        this.bindHoverServerDevice()
        this.bindClickServerDevice()
    }

    bindHoverServerDevice() {
        this.listen.receive('hover', (target, event) => {

            if (!target) {
                return
            }

            if (this.isNotMe(target)) {
                const isClear = clearHightBox(this.serverDevice)
                if (isClear) {
                    vueModel.currentMesh.show = false
                    vueModel.currentCabnet.show = false
                    vueModel.currentServerDevice.show = false
                }
                return
            }

            let SELECTED = target.object

            if (isExists(SELECTED) && isClickModel('cabinet', SELECTED)) {
                this.parent.hoverCabinet(SELECTED, event)
            }

            this.hoverServerDevice(SELECTED, event)


        })
    }


    hoverServerDevice(targetObj, event) {
        var currentElement = null;

        let SELECTED = targetObj;
        if (SELECTED.name.toString().indexOf("equipment") != -1 || SELECTED.name.toString().indexOf("spriteAlarm") != -1) {
            currentElement = SELECTED;
        }

        if (currentElement) {
            let SELECTED = targetObj
            outlinePass.selectedObjects = [SELECTED]
            const width = document.getElementById('tan').offsetWidth
            const height = document.getElementById('tan').offsetHeight
            // vueModel.currentMesh.left = (event.pageX + 10);
            // vueModel.currentMesh.top = (event.pageY + 10);
            const target = getAreaPageXAndY(event, width + 30, height + 80)
            vueModel.currentMesh.left = target.x;
            vueModel.currentMesh.top = target.y;
            vueModel.currentMesh.show = true
            vueModel.currentServerDevice.show = true
            vueModel.currentServerDevice.deviceName = SELECTED.userData.deviceName || SELECTED.name  || '未有数据'

            vueModel.$set(vueModel, 'currentServerDevice', {
                ...vueModel.currentServerDevice,
                ...SELECTED.userData
            })
        }
    }


    bindClickServerDevice() {
        this.listen.receive('click', target => {

            if (!target) {
                return
            }

            if (this.isNotMe(target)) {
                return
            }

            this.clickServerDevice(target)
        })
    }

    clickServerDevice(target) {
        orbitControls.enabled = false;
        let SELECTED = target.object;

        if (SELECTED.name.includes("equipment") && SELECTED.name.includes("server")) {
            openEquipmentDoor(SELECTED, () => { })
        }

        orbitControls.enabled = true;
    }

    private isNotMe(target) {
        return target.object !== this.serverDevice
    }

    private isMe(target) {
        return target.object === this.serverDevice
    }

    show() {
        // 可见性设置
    }

    hide() {
        // 不可见行设置
    }

    dispose() {

    }
}