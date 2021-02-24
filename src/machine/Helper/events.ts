import * as THREE from 'three'
import { EventHandler1 } from '../Event/Event'
import { getTarget } from './core'
import { mouseClick, domElement, raycaster, camera, scene, outlinePass, vueModel, alarmColor, orbitControls, eventList } from './initThree'
import { isClickModel, findTopObj } from './util'


let lastElement: any = null

let tooltip: HTMLDivElement | HTMLElement
let tooltipBackground: string = '#ACDEFE'
let tooltipBG = '#ACDEFE'
let lastEvent: any = null

let tipTimer: any = undefined
let clickCount = 0
let clickTimer: any = undefined
let hoverTimer: any = undefined
const listen = EventHandler1.getEventListen()

/**
 * 事件：鼠标右键按下
 * @param event 
 */
export function onDocumentMouseDown(event) {
    clickCount++;
    if (clickTimer) {
        clearTimeout(clickTimer)
    }
    let target = getTarget(event)
    clickTimer = setTimeout(() => {
        switch (clickCount) {
            case 1: {
                listen.broadcasting('click', target, event)
            } break;
            case 2: {
                listen.broadcasting('dbclick', target, event)
            } break;
            case 3: {
                listen.broadcasting('threeclick', target,event)
            } break;
            default: {
                /**
                 * 暂时不做处理
                 */
            } break;
        }

        clickCount = 0
    }, 16.8 * 15); // 在15帧内处理点击操作

    event.preventDefault();
}

/**
 * 事件：鼠标悬浮
 */
export function onDocumentMouseMove(event) {
    if (hoverTimer) {
        clearTimeout(hoverTimer)
    }
    let target = getTarget(event)
    hoverTimer = setTimeout(() => {
        listen.broadcasting('hover', target, event)
    }, 0) // 在5帧内处理鼠标悬浮操作
}