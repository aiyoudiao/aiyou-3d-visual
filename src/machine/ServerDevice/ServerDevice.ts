import Cabinet from "../Cabinet/Cabinet"
import * as THREE from 'three'
import { mergeModel, handleRotaion, getAreaPageXAndY } from "../Helper/calc"
import { generateCube, addObject, generateHole, generateGroup, createPlaneGeometry, getTarget, clearHightBox } from '../Helper/core'
import { addIdentification, findTopObj, generateUUID, isClickModel, isExists, setMaterialColor } from '../Helper/util'
import { dataSet, scene, BASE_PATH, alarmColor, orbitControls, domElement, outlinePass, vueModel } from '../Helper/initThree'
import { EventHandler1 } from "../Event/Event"
import { openEquipmentDoor } from "../Helper/action"


export default class ServerDevice {
    name: string = '设备服务器'
    serviceUUID: string
    serverDevice: any
    listen: EventHandler1
    parent: Cabinet
    isError = false

    clickEventIndex: Number
    hoverEventIndex: Number


    constructor(cfg, cabinet: Cabinet) {
        this.parent = cabinet
        this.listen = cabinet.listen

        this.init(cfg)
        // this.hide()
        this.initErrorDevice()
    }


    show() {
        // 可见性设置
        this.serverDevice.visible = true
        this.bindEvent()

    }

    hide() {
        // 不可见行设置
        this.serverDevice.visible = false
        this.unbindEvent()
    }

    init(cfg) {

        const {
            serverDeviceCfg,
            uuid,
            equipmentUUID
        } = cfg

        let serviceUUID = serverDeviceCfg.uuid || generateUUID()

        const newObj = generateCube(serverDeviceCfg)

        const { deviceType } = serverDeviceCfg.userData

        // 当设备类型为虚拟时，就隐藏
        if (deviceType === '虚拟') {
            newObj.visible = false
        }

        newObj.userData = serverDeviceCfg.userData
        newObj.userData['equipmentUUID'] = uuid
        newObj.uuid = serviceUUID
        this.serviceUUID = serviceUUID
        newObj.visible = false
        // addObject(newObj)

        this.serverDevice = newObj
    }

    // 初始化异常设备
    initErrorDevice() {
        /**
         * 1. 遍历当前机柜已有的所有设备
         * 2. 判断U数是否重叠，如果重叠就把当前设备打上红色标记
         * 3. 同时给当前机柜的头顶添加上一个黄色的三角标记
         */

        this.parent.serverDevices.forEach(otherServerDevice => {
            // 虚拟设备不作为重叠的范畴内
            const { deviceType } = otherServerDevice.serverDevice.userData
            if (deviceType === '虚拟') {
                return
            }

            if (this === otherServerDevice) {
                return
            }


            const { startU: oSU, endU: oEU } = otherServerDevice.serverDevice.userData

            const { startU, endU } = this.serverDevice.userData
            const len = oEU - oSU + 1

            let container = []
            for (let i = oSU; i < oSU + len; i++) {
                container.push(i)
            }

            if (container.includes(startU) || container.includes(endU)) {
                this.isError = true

            }

            if (this.isError) {
                var valarmanme = 'equipment_Identification_alarm' + this.serverDevice.userData['equipmentUUID'];

                // 给当前设备打上标记
                setMaterialColor(this.serverDevice, 0xff0000);

                // 如果机柜已经打上了标记，就不用重复打标记了
                if (!this.parent.isError) {

                    // 给当前机柜打上标记
                    var vtreeanme = 'cabinet_Identification_flag' + generateUUID();
                    const y = this.parent.cabinet.position.y
                    var errorobj = {
                        name: vtreeanme,
                        size: { x: 48, y: 64 },
                        position: { x: 0, y: y + 32, z: 0 },
                        // imgurl: BASE_PATH + 'marker1.png'
                        imgurl: BASE_PATH + 'down.png'
                    };

                    addIdentification(this.parent.cabinet, errorobj);
                    this.parent.isError = true
                }


            }

        })
    }

    bindEvent() {
        this.bindHoverServerDevice()
        this.bindClickServerDevice()
    }

    unbindEvent () {
        this.unbindHoverServerDevice()
        this.unbindClickServerDevice()
    }

    bindHoverServerDevice() {
        this.hoverEventIndex = this.listen.receive('hover', (target, event) => {

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

    unbindHoverServerDevice() {
        this.hoverEventIndex !== undefined && this.listen.delete('hover', this.hoverEventIndex)
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
            vueModel.currentTab = '设备服务器信息'
            
            vueModel.currentServerDevice.deviceName = SELECTED.userData.deviceName || SELECTED.name || '未有数据'

            // 找出相同的虚拟设备，然后把虚拟设备的信息也一并加入到里面去
            const visualContainer = []
            this.parent.serverDevices.filter(otherServerDevice => {
                // 根据某些情况来判断是否是虚拟设备，比如 起始U位和结束U位 和我当前这台设备一样，同时它的类型为虚拟设备

                const { startU: oSU, endU: oEU, deviceType } = otherServerDevice.serverDevice.userData

                const { startU, endU } = this.serverDevice.userData
                if (startU === oSU && endU === oEU && deviceType === '虚拟') {
                    visualContainer.push(otherServerDevice.serverDevice.userData)
                }
            })


            // vueModel.$set(vueModel, 'currentServerDevice', {
            //     ...vueModel.currentServerDevice,
            //     ...SELECTED.userData
            // })
            vueModel.$set(vueModel, 'currentServerDevice', {
                ...vueModel.currentServerDevice,
                container: [
                    SELECTED.userData,
                    ...visualContainer
                ]
            })
        }
    }




    bindClickServerDevice() {
        this.clickEventIndex = this.listen.receive('click', target => {

            if (!target) {
                return
            }

            if (this.isNotMe(target)) {
                return
            }

            this.clickServerDevice(target)
        })
    }

    unbindClickServerDevice() {
        this.clickEventIndex !== undefined && this.listen.delete('click', this.clickEventIndex)
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


    dispose() {

    }
}