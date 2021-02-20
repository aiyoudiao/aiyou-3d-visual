import * as THREE from 'three'
import MachineRoom from "../MachineRoom/MachineRoom"
import ServerDevice from "../ServerDevice/ServerDevice"
import { mergeModel, handleRotaion } from "../Helper/calc"
import { generateCube, addObject, generateHole, generateGroup, createPlaneGeometry, getTarget, clearHightBox } from '../Helper/core'
import { findTopObj, generateUUID, isClickModel, isExists } from '../Helper/util'
import { dataSet, scene, BASE_PATH, alarmColor, orbitControls, camera, vueModel, outlinePass } from '../Helper/initThree'
import { EventHandler1 } from '../Event/Event'
import { flyToCabinet, openCabinetDoor } from '../Helper/action'



export default class Cabinet {
    name: string = '机柜'
    parent: MachineRoom
    cabinet: THREE.Group // 每一个机柜是所有机柜部件的组合
    listen: EventHandler1

    serverDevices: Array<ServerDevice> = []

    constructor(cfg, machineRoom: MachineRoom) {
        this.parent = machineRoom
        this.init(cfg)
        this.bindEvent()
    }

    init(item) {
        this.listen = EventHandler1.getEventListen()
        this.drawingCabinet(item)
    }

    bindEvent() {
        this.bindHoverCabinet()
        this.bindThreeClickCabinet()
        this.binDBClickCabinetDoor()
    }

    bindHoverCabinet() {
        this.listen.receive('hover', (target, event) => {

            if (!target) {
                return
            }

            if (this.isNotMe(target)) {
                const isClear = clearHightBox(this.cabinet)
                if (isClear) {
                    vueModel.currentMesh.show = false
                    vueModel.currentCabnet.show = false
                }
                return
            }

            let SELECTED = target.object

            if (isExists(SELECTED) && isClickModel('cabinet', SELECTED)) {
                this.hoverCabinet(SELECTED, event)
            } else {
                vueModel.currentMesh.show = false
                vueModel.currentCabnet.show = false
                outlinePass.selectedObjects = []
            }
        })
    }

    hoverCabinet(targetObj, event) {
        let SELECTED = targetObj
        SELECTED = findTopObj('cabinet', SELECTED)
        outlinePass.selectedObjects = [SELECTED]

        vueModel.currentMesh.left = (event.pageX + 10);
        vueModel.currentMesh.top = (event.pageY + 10);
        vueModel.currentMesh.show = true
        vueModel.currentCabnet.show = true
        vueModel.currentCabnet.name = SELECTED.userData.name

        // scene.updateMatrixWorld(true)
    }

    /**
     * 绑定三击机柜门的事件
     */
    bindThreeClickCabinet() {
        this.listen.receive('threeclick', target => {
            if (!target) {
                return
            }

            if (this.isNotMe(target)) {
                return
            }

            if (isExists(target.object) && isClickModel('cabinet', target.object)) {
                this.threeClickCabinet(target)
            }
        })
    }

    /**
     * 三击跳转到机柜面前
     * @param event 
     */
    threeClickCabinet(target) {
        let SELECTED = target.object
        if (isExists(SELECTED)) {
            flyToCabinet(SELECTED, true)
        }
    }

    /**
     * 绑定双击机柜门的事件
     */
    binDBClickCabinetDoor() {
        this.listen.receive('dbclick', target => {
            if (!target) {
                return
            }

            if (this.isNotMe(target)) {
                return
            }

            if (isClickModel('door', target.object)) {
                this.dbClickCabinetDoor(target)
            }
        })
    }

    /**
     * 双击打开机柜门
     * @param target 
     */
    dbClickCabinetDoor(target) {
        orbitControls.enabled = false;
        let SELECTED = target.object;

        if (SELECTED.name.includes("cabinet") && SELECTED.name.includes("door")) {
            openCabinetDoor(SELECTED, () => { })
        }

        orbitControls.enabled = true;
    }

    private isNotMe(target) {
        return findTopObj('cabinet', target.object) !== this.cabinet
    }

    private isMe(target) {
        return findTopObj('cabinet', target.object) === this.cabinet
    }

    private generateObjModel(style) {
        const { skinColor: styleSkinColor, skin: styleSkin } = style
        return {
            show: true,
            uuid: '',
            name: '',
            objType: 'cube',
            width: 0,
            height: 0,
            depth: 0,
            x: 0,
            y: 0,
            z: 0,
            style: {
                skinColor: styleSkinColor,
                skin: styleSkin
            }
        }
    }

    drawingCabinet(item) {
        const { size, style, doors, userData, childrens, rotation } = item
        const emptyCabinet = this.drawingEmptyCabinet(item)

        this.drawingUbit(item, emptyCabinet)
        this.drawingCabinetDoors(item, emptyCabinet)
        this.drawingAlarmInfo(item, emptyCabinet)
        this.stepServerDevices(item, emptyCabinet)
        handleRotaion(item.rotation, emptyCabinet)
        this.cabinet = emptyCabinet

    }

    drawingEmptyCabinet(item: { uuid?: any; size?: any; style?: any; name?: any; userData?: any; doors?: any; rotation?: any; x?: any; y?: any; z?: any; width?: any; height?: any; childrens?: any }) {
        let cabinet: THREE.Mesh, floorHeight = 10
        item.uuid = item.uuid || generateUUID()
        const { uuid } = item

        const { thick: sizeThick, width: sizeWidth, height: sizeHeight, depth: sizeDepth } = item.size

        const objModel = this.generateObjModel(item.style)
        const downObj = {
            ...objModel,
            name: 'cabinet-down',
            width: sizeWidth,
            height: sizeThick,
            depth: sizeDepth,
            y: - sizeHeight / 2 + sizeThick / 2
        }
        const upObj = {
            ...objModel,
            name: 'cabinet-up',
            width: sizeWidth,
            height: sizeThick,
            depth: sizeDepth,
            y: sizeHeight - sizeThick
        }

        const leftObj = {
            ...objModel,
            name: 'cabinet-left',
            width: sizeThick,
            height: sizeHeight - 2 * sizeThick,
            depth: sizeDepth,
            x: - sizeWidth / 2 + sizeThick / 2,
            y: sizeHeight / 2 - sizeThick / 2
        }
        const rightObj = {
            ...objModel,
            name: 'cabinet-right',
            width: sizeThick,
            height: sizeHeight - 2 * sizeThick,
            depth: sizeDepth,
            x: sizeWidth / 2 - sizeThick / 2,
            y: sizeHeight / 2 - sizeThick / 2
        }
        const foreObj = {
            ...objModel,
            name: 'cabinet-down',
            width: sizeWidth,
            height: sizeHeight - 2 * sizeThick,
            depth: sizeThick,
            y: sizeHeight / 2 - sizeThick / 2,
            z: 0
        }
        const behindObj = {
            ...objModel,
            name: 'cabinet-behind',
            width: sizeWidth,
            height: sizeHeight - 2 * sizeThick,
            depth: sizeThick,
            y: sizeHeight / 2 - sizeThick / 2,
            z: - sizeDepth / 2 + sizeThick / 2
        }

        const downCube = generateCube(downObj)
        const upCube = generateCube(upObj)
        const leftCube = generateCube(leftObj)
        const rightCube = generateCube(rightObj)
        const foreCube = generateCube(foreObj)
        const behindCube = generateCube(behindObj)
        cabinet = mergeModel('+', downCube, upCube)
        cabinet = mergeModel('+', cabinet, leftCube)
        cabinet = mergeModel('+', cabinet, rightCube)
        cabinet = mergeModel('+', cabinet, foreCube)
        cabinet = mergeModel('+', cabinet, behindCube)

        const emptyCabinet = new THREE.Group
        emptyCabinet.add(cabinet)
        emptyCabinet.name = item.name
        emptyCabinet.uuid = uuid
        emptyCabinet.userData = item.userData || { name: item.name, alarmInfo: [] }
        const { x = 0, y = 0, z = 0 } = item
        emptyCabinet.position.set(x, y + floorHeight, z)
        addObject(emptyCabinet, 'object')

        return emptyCabinet
    }

    drawingUbit(item, emptyCabinet) {
        const { uuid } = item
        const { thick: sizeThick, width: sizeWidth, height: sizeHeight, depth: sizeDepth } = item.size


        const ubitGroup = this.drawingUbitFn(6, 6, 6, 42)
        const [x, y, z] = [
            sizeWidth / 2,
            0,
            sizeDepth / 2 - sizeThick / 2 + 1 + sizeWidth / 2
        ]
        ubitGroup.position.set(40, -124, 35)
        const ubitGroup2 = ubitGroup.clone()
        ubitGroup2.position.set(-40, -124, 35)


        emptyCabinet.add(ubitGroup)
        emptyCabinet.add(ubitGroup2)
        addObject(ubitGroup, 'object')
        addObject(ubitGroup2, 'object')


        const ubitGroup3 = ubitGroup.clone()
        ubitGroup3.position.set(40, -124, 2)
        const ubitGroup4 = ubitGroup.clone()
        ubitGroup4.position.set(-40, -124, 2)
        emptyCabinet.add(ubitGroup3)
        emptyCabinet.add(ubitGroup4)
        addObject(ubitGroup3, 'object')
        addObject(ubitGroup4, 'object')
    }

    drawingUbitFn(width, height, yAxisSpace, count) {
        const xSpace = 0.09
        const ySpace = 0.1

        const meshTemp = ganerateTempate()
        meshTemp.position.y = -500

        let ubitGroup = new THREE.Group()
        ubitGroup.name = '1-60个U位渲染'
        let ubitSet = []
        for (let index = 0; index < 6; index++) {
            for (let subIndex = 0; subIndex < 10; subIndex++) {
                const meshObj = meshTemp.clone()
                let point2 = [
                    new THREE.Vector2(calcAdd(0, index * xSpace), calcAdd(0, ySpace * subIndex)),
                    new THREE.Vector2(calcAdd(xSpace, index * xSpace), calcAdd(0, ySpace * subIndex)),
                    new THREE.Vector2(calcAdd(xSpace, index * xSpace), calcAdd(ySpace, ySpace * subIndex)),
                    new THREE.Vector2(calcAdd(0, index * xSpace), calcAdd(ySpace, ySpace * subIndex)),
                ]

                meshObj.geometry = new THREE.PlaneGeometry(width, height);
                meshObj.geometry.faceVertexUvs[0][0] = [point2[0], point2[1], point2[3]]
                meshObj.geometry.faceVertexUvs[0][1] = [point2[1], point2[2], point2[3]]
                meshObj.position.y = 0 + calcAdd((yAxisSpace * 10 * index), (yAxisSpace * subIndex))
                ubitSet.push(meshObj)
            }
        }

        ubitSet.splice(count, ubitSet.length)

        ubitSet.forEach(meshItem => ubitGroup.add(meshItem))
        return ubitGroup

        function ganerateTempate() {
            let geometry = new THREE.PlaneGeometry(width, height); //矩形平面
            let textureLoader = new THREE.TextureLoader();
            const texture: THREE.Texture = textureLoader.load(BASE_PATH + '5EDB1B5608A4A1A95FB81C93F960CDA3.jpg')

            let material = new THREE.MeshLambertMaterial({
                // color: 0x0000ff,
                // 设置纹理贴图：Texture对象作为材质map属性的属性值
                map: texture,
                side: THREE.DoubleSide
            }); //材质对象Material
            let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh

            const point = [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(xSpace, 0),
                new THREE.Vector2(xSpace, ySpace),
                new THREE.Vector2(0, ySpace),
            ]
            geometry.faceVertexUvs[0][0] = [point[0], point[1], point[3]]
            geometry.faceVertexUvs[0][1] = [point[1], point[2], point[3]]
            mesh.rotation.z = 0.5 * Math.PI

            return mesh
        }

        // 简单处理一下小数相加时的精度丢失问题
        function calcAdd(num1, num2) {
            return (num1 * 10 + num2 * 10) / 10
        }
    }


    drawingCabinetDoors(item, emptyCabinet) {
        const { uuid } = item
        const { thick: sizeThick, width: sizeWidth, height: sizeHeight, depth: sizeDepth } = item.size
        const objModel = this.generateObjModel(item.style)

        /* 门 */
        const { doors } = item
        if (isExists(doors)) {
            /* 单门 */
            const { skins: doorSkins, doorname, rotation = null } = item.doors
            if (doorSkins.length === 1 && doorname.length === 1) {
                // console.log('doorname', doorname[0], doorname, item)
                const doorObj = {
                    ...objModel,
                    name: item.name + '&&' + doorname[0],
                    width: sizeWidth,
                    height: sizeHeight - 2 * sizeThick,
                    depth: sizeThick,
                    z: sizeDepth / 2 - sizeThick / 2 + 1,
                    rotation: rotation,
                    style: {
                        skinColor: doorSkins[0].skinColor,
                        skin: doorSkins[0]
                    }
                }
                const doorCube = generateCube(doorObj)
                if (rotation) {
                    const [x, y, z] = [
                        sizeWidth / 2,
                        0,
                        sizeDepth / 2 - sizeThick / 2 + 1 + sizeWidth / 2
                    ]
                    doorCube.position.set(x, y, z)
                }
                emptyCabinet.add(doorCube)
                addObject(doorCube, 'object')
            } else if (doorSkins.length === 2 && doorname.length === 2) {
                /* 双门 */
                doorSkins.forEach((subSkin: any, subIndex: number) => {
                    const x = subIndex === 0 ? (- sizeWidth / 4) : (sizeWidth / 4)
                    const doorObj = {
                        ...objModel,
                        name: doorname[subIndex],
                        width: sizeWidth / 2,
                        height: sizeHeight,
                        depth: sizeThick,
                        x: x,
                        z: sizeDepth / 2 - sizeThick / 2 + 1,
                        style: {
                            skinColor: doorSkins[subIndex].skinColor,
                            skin: doorSkins[subIndex]
                        }
                    }

                    const doorCube = generateCube(doorObj)
                    emptyCabinet.add(doorCube)
                    addObject(doorCube, 'object')
                });
            }
        }

    }

    drawingAlarmInfo(item, emptyCabinet) {
        /* 机柜告警信息 */
        if (isExists(item.userData)) {
            const { uuid } = item
            const { width: textAreaWidth = 70, height: textAreaHeight = 70 } = item.size
            const { userData: userData } = item
            const canvas = document.createElement('canvas')
            canvas.width = textAreaWidth
            canvas.height = textAreaWidth
            const context = canvas.getContext('2d')
            context.beginPath()
            context.rect(0, 0, textAreaWidth, textAreaWidth)
            context.fillStyle = 'rgba(255, 255, 255, 0)' /* 默认为透明 */
            context.fill()

            /**
             * @Description 在画布上打标记
             * @date 2021-01-23
             * @param {any} context:CanvasRenderingContext2D
             * @param {any} x:number
             * @param {any} y:number
             * @param {any} text:string
             * @returns {any}
             */
            const marker = function (context: CanvasRenderingContext2D, x: number, y: number, text: string): void {

                let color = '#FFFFFF';
                context.font = 12 + 'px "Microsoft Yahei"'
                context.fillStyle = color
                context.textAlign = 'center'
                context.textBaseline = 'middle'
                // context.shadowBlur = 30
                context.strokeStyle = color
                context.fillText(text, x, y)
            }

            marker(context, textAreaWidth / 2, textAreaWidth / 2, userData.name)

            const alarmObj = {
                width: textAreaWidth - 20,
                height: textAreaWidth - 20,
                imgurl: canvas,
                z: 0,
                y: textAreaHeight / 2 + 1,
                opacity: 0.8,
                transparent: true,
                rotation: [
                    { direction: 'x', degree: - 0.5 * Math.PI }
                ]
            }
            const text = createPlaneGeometry(alarmObj)
            emptyCabinet.add(text)
            /* NOTE 告警信息 */
            const url = BASE_PATH + 'images/marker1.png'
            const texture = new THREE.TextureLoader().load(url)
            const spriteMaterial = new THREE.SpriteMaterial({
                color: alarmColor.level1, /* 设置精灵矩形区域颜色 */
                map: texture /* 设置精灵纹理图贴图 */
            })
            /* 创建精灵模型对象，不需要几何体 geometry 参数 */
            const sprite = new THREE.Sprite(spriteMaterial)
            const { x, y, z, height: sizeHeight } = item
            sprite.position.set(x, y + sizeHeight / 2 + 22, z)
            sprite.scale.set(25, 25, 1) /* 控制精灵大小，比如可视化中精灵大小表征数据大小 只需要设置x、y两个分量就可以 */
            sprite.userData = { "cabinetUUID": uuid, "level": "1", alarmInfo: [] } /* 告警等级默认为1，也就是最低告警 */
            sprite.name = 'spriteAlarm'
            sprite.visible = false
            addObject(sprite)
        }
    }

    stepServerDevices(item, emptyCabinet) {
        let floorHeight = 10
        const { uuid } = item
        const { thick: sizeThick, width: sizeWidth, height: sizeHeight, depth: sizeDepth } = item.size

        /* 处理机柜子对象 */
        const { childrens } = item
        if (isExists(childrens) && Array.isArray(childrens)) {
            let equipmentUUID = []
            const { x, y, z, rotation = null } = item
            childrens.forEach((serverDeviceCfg, index) => {
                serverDeviceCfg.x = x
                serverDeviceCfg.y = serverDeviceCfg.y + floorHeight + (y - (sizeHeight - 2 * sizeThick) / 2)
                serverDeviceCfg.z = z
                serverDeviceCfg.rotation = rotation

                const cfg = {
                    serverDeviceCfg,
                    uuid,
                    equipmentUUID
                }

                const serverDevice1 = new ServerDevice(cfg, this)
                this.serverDevices.push(serverDevice1)

                equipmentUUID.push(serverDevice1.serviceUUID)
            })
            emptyCabinet.userData["equipmentUUID"] = equipmentUUID
        }

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