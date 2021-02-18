import Cabinet from "../Cabinet/Cabinet"
import DataCenter from "../DataCenter/DataCenter"
import { mergeModel, mergeModel2 } from "../Helper/calc"
import { generateCube, addObject, generateHole } from '../Helper/core'
import { dataSet, scene } from '../Helper/initThree'


export default class MachineRoom {
    name: string = '机房'
    parent?: DataCenter
    cabinets: Array<Cabinet> = []

    constructor(cfgs, dataCenter?: DataCenter) {
        this.parent = dataCenter
        const { name, items } = cfgs

        this.init(items)

    }

    init(items) {
        /**
         * 绘制机房的地板
         * 绘制机房的围墙
         * 绘制机房的玻璃
         * 绘制机房的壁画
         * ...装饰性的东西
         */

        items.forEach(item => {

            if (item.objType === 'floor') {
                const floor = this.drawFloor(item)
                addObject(floor, 'scene')
            }

            if (item.objType === 'wall') {
                this.drawWall(item)
            }

            if (item.objType === 'emptyCabinet') {
                const cabinet1 = new Cabinet(item, this)
                this.cabinets.push(cabinet1)
                addObject(cabinet1.cabinet, 'scene')
            }

            if (item.objType === 'glasses') {

            }
        })

    }

    drawFloor(item) {
        return generateCube(item)
    }

    drawWall(item: { style?: any; wallData?: any; depth?: any; height?: any; width?: any }) {
        /* 墙体的厚度、高度、宽度 */
        const { depth: commonDepth = 40, height: commonHeight = 100, width: commonWidth = 300 } = item
        const { skinColor: commonSkin = 0x98750f } = item.style

        /* 建立墙面 */
        item.wallData.forEach((wallObj: { depth?: any; startDot?: any; endDot?: any; height?: any; rotation?: any; uuid?: any; name?: any; skin?: any; childrens?: any }, index: any) => {
            let wallWidth = commonWidth
            let wallDepth = wallObj.depth || commonDepth
            const { startDot, endDot } = wallObj
            const { x: sX = 0, y: sY = 0, z: sZ = 0 } = startDot
            const { x: eX = 0, y: eY = 0, z: eZ = 0 } = endDot

            const [positionX, positionY, positionZ] = [
                (sX + eX) / 2,
                (sY + eY) / 2,
                (sZ + eZ) / 2,
            ]

            if (sZ === eZ) {
                wallWidth = Math.abs(sX - eX)
                wallDepth = wallObj.depth || commonDepth
            } else if (sX === eX) {
                wallWidth = wallObj.depth || commonDepth
                wallDepth = Math.abs(sZ - eZ)
            }

            const { height, rotation, uuid, name, skin } = wallObj
            const cubeObj = {
                width: wallWidth,
                height: height || commonHeight,
                depth: wallDepth,
                rotation,
                x: positionX,
                y: positionY,
                z: positionZ,
                uuid,
                name,
                style: {
                    skinColor: commonSkin,
                    skin
                }
            }

            let cube = generateCube(cubeObj)
            const { childrens } = wallObj
            // let close = false
            if (![null, undefined].includes(childrens) && Array.isArray(childrens)) {
                childrens.forEach((wallChildren: { op: any, name: string }, index: any) => {
                    // if (close) {
                    //     return
                    // }

                    const { op } = wallChildren
                    const newObj = generateHole(wallChildren)
                    cube = mergeModel(op, cube, newObj, commonSkin)
                    // cube = mergeModel(op, cube, newObj, commonSkin)
                    // if (wallChildren.name === 'doorhole') {
                    //     close = true
                    // }
                });
            }
            addObject(cube, 'scene')
        });
    }

    drawCabinet () {
        this.cabinets.forEach(cabinet => cabinet.show())
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