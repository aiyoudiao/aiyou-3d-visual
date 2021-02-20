/**
 * 事件处理
 * 设计模式： 发布订阅、单例模式
 */

import { isExists } from "../Helper/util"

const eventTypes= ['click', 'dbclick', 'threeclick', 'hover']

export class EventHandler1 {
    private static listen: EventHandler1
    private eventDictionary: {} 
    private constructor () {}

    public static getEventListen () {
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
    receive (eventType, eventCallback) {
        if (!eventTypes.includes(eventType)) {
            console.warn('事件必须在' + eventTypes + '之内。');
            return
        }

        if (!isExists(this.eventDictionary[eventType])) {
            this.eventDictionary[eventType] = []
        }

        this.eventDictionary[eventType].push(eventCallback)
    }

    /**
     * 发布事件
     * @param eventType 
     */
    broadcasting (eventType, eventTarget, eventArgs) {
        if (isExists(this.eventDictionary[eventType])) {
            this.eventDictionary[eventType].forEach(eventCallback => eventCallback(eventTarget, eventArgs))
        }
    }
}