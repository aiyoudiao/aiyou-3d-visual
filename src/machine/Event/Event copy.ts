/**
 * 事件处理
 * 设计模式： 发布订阅、单例模式
 */

import { findTopObj, isExists } from "../Helper/util"

const eventTypes = ['click', 'dbclick', 'threeclick', 'hover']

export class EventHandler1 {
    private static listen: EventHandler1
    private eventDictionary: {}
    private constructor() { }

    public static getEventListen() {
        if (!isExists(this.listen)) {
            this.listen = new EventHandler1()
            this.listen.eventDictionary = {}
        }

        return this.listen
    }

    /**
     * 接收事件
     * @param eventType 
     * @param eventCallback 
     */
    receive(eventType, id, eventCallback) {
        if (!eventTypes.includes(eventType)) {
            // console.warn('事件必须在' + eventTypes + '之内。');
            return
        }

        if (!isExists(this.eventDictionary[eventType])) {
            this.eventDictionary[eventType] = {}
        }

        this.eventDictionary[eventType][id] = eventCallback
        return id
    }

    /**
     * 移除事件
     * @param eventType 
     * @param index 
     */
    delete(eventType, index) {
        if (!eventTypes.includes(eventType)) {
            // console.warn('事件必须在' + eventTypes + '之内。');
            return
        }

        if (!isExists(this.eventDictionary[eventType])) {
            return
        }

        delete this.eventDictionary[eventType][index]
    }

    /**
     * 发布事件
     * @param eventType 
     */
    broadcasting(eventType, eventTarget, eventArgs) {
        // FIX 这里有一个很耗费性能的bug，悬浮的事件太多太多了
        // console.log('this.eventDictionary[eventType]', this.eventDictionary[eventType])
        if (!eventTarget || !this.eventDictionary[eventType]) {
            return
        }

        const obj = findTopObj('cabinet', eventTarget.object)
        if (obj === null) {
            return
        }

        if (this.eventDictionary[eventType][obj.name]) {
            this.eventDictionary[eventType][obj.name](eventTarget, eventArgs)
        }
    }
}