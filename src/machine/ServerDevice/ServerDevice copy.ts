import Cabinet from "../Cabinet/Cabinet"
import * as THREE from 'three'
import { mergeModel, handleRotaion } from "../Helper/calc"
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

    lastElement: any
    tipTimer: any
    tooltipBG: string = '#ACDEFE'
    lastEvent: any
    tooltip: HTMLDivElement

    constructor(cfg, cabinet: Cabinet) {
        this.parent = cabinet
        this.listen = cabinet.listen

        this.init(cfg)
        this.initToolTip()
        this.bindEvent()
    }

    initToolTip() {
        this.tooltip = document.createElement('div');
        this.tooltip.setAttribute('id', 'tooltip');
        this.tooltip.style.display = 'none';
        this.tooltip.style.position = 'absolute';
        this.tooltip.style.color = "#000";
        this.tooltip.style.maxWidth = "200px";
        this.tooltip.style.width = '32px';
        this.tooltip.style.height = 'auto';
        this.tooltip.style.lineHeight = "22px";
        this.tooltip.style.textAlign = "center";
        this.tooltip.style.padding = "10px";
        this.tooltip.style.background = this.tooltipBG;
        this.tooltip.style.opacity = '0.8';
        this.tooltip.style['border-radius'] = '5px';
        let tipdiv = document.createElement('div');
        tipdiv.setAttribute("id", "tipdiv");
        let tipspan = document.createElement('span');
        tipspan.style.marginLeft = "50%";
        tipspan.style.bottom = "-10px";
        tipspan.style.left = "-10px";
        tipspan.style.position = "absolute";
        tipspan.style.borderTop = "10px solid " + this.tooltipBG;
        tipspan.style.borderLeft = "10px solid transparent";
        tipspan.style.borderRight = "10px solid transparent";
        this.tooltip.appendChild(tipspan);
        this.tooltip.appendChild(tipdiv);
        domElement.appendChild(this.tooltip);
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

        clearTimeout(this.tipTimer);
        if (currentElement) {
            let SELECTED = targetObj
            outlinePass.selectedObjects = [SELECTED]
    
            vueModel.currentMesh.left = (event.pageX + 10);
            vueModel.currentMesh.top = (event.pageY + 10);
            vueModel.currentMesh.show = true
            vueModel.currentServerDevice.show = true
            vueModel.currentServerDevice.deviceName = SELECTED.userData.deviceName || '未有数据'
        }
    }

    // hoverServerDevice(targetObj, event) {
    //     var currentElement = null;

    //     let SELECTED = targetObj;
    //     if (SELECTED.name.toString().indexOf("equipment") != -1 || SELECTED.name.toString().indexOf("spriteAlarm") != -1) {
    //         currentElement = SELECTED;
    //     }

    //     clearTimeout(this.tipTimer);
    //     if (currentElement) {
    //         outlinePass.selectedObjects = [SELECTED]
    //         this.tipTimer = setTimeout(() => {
    //             // console.log(currentElement)
    //             let tipInfo = "";
    //             if (currentElement.name.toString().indexOf("equipment") != -1) {
    //                 tipInfo = currentElement.userData.tipInfo;
    //                 this.tooltip.style.background = this.tooltipBG;
    //                 this.tooltip.querySelector("span").style.borderTop = "10px solid " + this.tooltipBG;
    //             }
    //             if (currentElement.name.toString().indexOf("spriteAlarm") != -1) {
    //                 // console.log(currentElement)
    //                 if (currentElement.userData.alarmInfo.length > 0) {
    //                     let levelArr = [];
    //                     for (let i = 0; i < currentElement.userData.alarmInfo.length; i++) {
    //                         levelArr.push(currentElement.userData.alarmInfo[i].level);
    //                         tipInfo += currentElement.userData.alarmInfo[i].name + currentElement.userData.alarmInfo[i].alarmInfo + "；"
    //                     }
    //                     let max = Math.max(...levelArr);
    //                     this.tooltip.style.background = alarmColor["level" + max];
    //                     this.tooltip.querySelector("span").style.borderTop = "10px solid " + alarmColor["level" + max];
    //                 }
    //             }
    //             let tiplen = tipInfo.length;
    //             this.tooltip.querySelector("#tipdiv").innerHTML = tipInfo
    //             this.tooltip.style.width = tiplen * 15 + "px";
    //             this.tooltip.style.display = 'block';
    //             this.tooltip.style.left = (this.lastEvent.pageX - this.tooltip.clientWidth / 2) + 'px';
    //             this.tooltip.style.top = (this.lastEvent.pageY - this.tooltip.clientHeight - 15) + 'px';
    //         }, 16.8 * 5);
    //     }

    //     //设置每次移动时鼠标的事件对象
    //     this.lastEvent = event;
    // }

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