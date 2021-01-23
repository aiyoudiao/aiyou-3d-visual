import * as THREE from 'three'
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Object3D, PerspectiveCamera, Vector3, WebGLRenderer, } from 'three'


export default class ThreeHandle {

    BASE_PATH: string
    dataSet: Array<any>
    eventList: Array<any>

    scene: Screen | any
    camera: PerspectiveCamera
    renderer: WebGLRenderer
    orbitControls: OrbitControls

    domElement: HTMLDivElement | HTMLElement
    tooltip: HTMLDivElement | HTMLElement
    tooltipBackground: string = '#ACDEFE'

    constructor(ThreeSet: { props: any; dataSet: any; eventList: any; sourcePath?: "./static/three.js/" }) {
        const {
            props, dataSet, eventList, sourcePath = './static/three.js/',
        } = ThreeSet


        this.BASE_PATH = sourcePath
        this.dataSet = dataSet
        this.eventList = eventList
    }

    /**
     * @Description 全局的初始化方法
     * @date 2021-01-21
     * @returns {any}
     */


    init() {

        /**
         * initScene: 初始化场景
         * initCamera: 初始化相机
         * initRenderer: 初始化渲染器
         * initLight: 初始化灯光
         * initControl: 初始化控制器
         * initData: 初始化数据
         * initEvent: 初始化事件
         */


        this.initScene()
        this.initCamera()
        this.initRenderer()
        this.initLight()
        this.initControl()
        this.initData()
        this.render()
        this.initEvent()


    }

    /**
     * @Description 初始化场景
     * @date 2021-01-21
     * @returns {any}
     */


    initScene() {
        this.scene = new THREE.Scene()
        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load('images/back.jpg')
        this.scene.background = texture
        // this.scene.background = new THREE.Color(0x000000)
    }

    /**
     * @Description 初始化相机
     * @date 2021-01-21
     * @returns {any}
     */


    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.domElement.offsetWidth / this.domElement.offsetHeight, 1, 10000)
        this.camera.name = 'mainCamera'
        this.camera.position.set(0, 1000, 1800)
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.scene.add(this.camera)
    }

    /**
     * @Description 初始化渲染器
     * @date 2021-01-21
     * @returns {any}
     */


    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
        this.domElement.appendChild(this.renderer.domElement)
    }

    /**
     * @Description 初始化灯光
     * @date 2021-01-21
     * @returns {any}
     */


    initLight() {
        /**
         *  light1: 环境光
         *  light2: 点光源
         */
        const light1 = new THREE.AmbientLight(0xcccccc)
        light1.position.set(0, 0, 0)
        this.scene.add(light1)

        const light2 = new THREE.PointLight(0x555555)
        light2.shadow.camera.near = 1
        light2.shadow.camera.far = 5000
        light2.position.set(0, 350, 0)
        light2.castShadow = true
        this.scene.add(light2)
    }

    /**
     * @Description 初始化控制器
     * @date 2021-01-21
     * @returns {any}
     */


    initControl() {
        this.orbitControls = new OrbitControls(this.camera, this.domElement)
        this.orbitControls.update()
    }

    /**
     * @Description 初始化数据
     * @date 2021-01-21
     * @returns {any}
     */


    initData() {

        this.dataSet.forEach(item => {
            this.__init3DObject(item)
        })

        this.__generateText(this.dataSet[0].width, this.dataSet[0].depth)
        this.__initToolTip()
    }

    /**
     * @Description 渲染动画
     * @date 2021-01-22
     * @returns {any}
     */


    render() {
        this.__ainimate()
    }

    /**
     * @Description 动画走起
     * @date 2021-01-22
     * @returns {any}
     */


    __ainimate() {
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * @Description 初始化工具提示
     * @date 2021-01-21
     * @returns {any}
     */


    __initToolTip() {
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
        this.tooltip.style.background = this.tooltipBackground;
        this.tooltip.style.opacity = '0.8';
        this.tooltip.style['border-radius'] = '5px';
        let tipdiv = document.createElement('div');
        tipdiv.setAttribute("id", "tipdiv");
        let tipspan = document.createElement('span');
        tipspan.style.marginLeft = "50%";
        tipspan.style.bottom = "-10px";
        tipspan.style.left = "-10px";
        tipspan.style.position = "absolute";
        tipspan.style.borderTop = "10px solid " + this.tooltipBackground;
        tipspan.style.borderLeft = "10px solid transparent";
        tipspan.style.borderRight = "10px solid transparent";
        this.tooltip.appendChild(tipspan);
        this.tooltip.appendChild(tipdiv);
        this.domElement.appendChild(this.tooltip);
    }

    /**
     * @Description 在场景中添加几段文本
     * @date 2021-01-22
     * @param {any} floorWidth:any
     * @param {any} floorHeight:any
     * @returns {any}
     */


    __generateText(floorWidth: any, floorHeight: any) {
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 1024

        const context = canvas.getContext('2d')
        context.beginPath()
        context.rect(0, 0, 1024, 1024)
        context.fillStyle = 'rgba(255, 255, 255, 0)'
        context.fill()

        marker(context, '阿里巴巴', 'ip待分配', 500, 380)
        marker(context, '腾讯', '192.168.1.150', 500, 495)
        marker(context, '依米康·龙控', '192.168.1.100', 500, 610)

        const obj = {
            width: floorHeight,
            height: floorWidth,
            imgUrl: canvas,
            y: 6,
            transparent: true,
            opacity: 0.8,
            rotation: [{ direction: 'x', degree: -0.5 * Math.PI }, { direction: 'z', degree: 0.5 * Math.PI }],
        }
        const text = this.__createPlaneGeometry(obj)
        this.scene.add(text)

        /**
         * @Description 给上面创建的canvas 打上标记
         * @date 2021-01-21
         * @param {any} context:CanvasRenderingContext2D
         * @param {any} text:string
         * @param {any} text2:string
         * @param {any} x:number
         * @param {any} y:number
         * @returns {any}
         */
        function marker(context: CanvasRenderingContext2D, text: string, text2: string, x: number, y: number) {
            /**
             * 绘制第一段文本
             */


            let color = '#0B2F3A';
            context.font = 30 + 'px "Microsoft Yahei"'
            context.fillStyle = color
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            // context.shadowBlur = 30
            context.strokeStyle = color
            context.lineWidth = 3
            context.strokeText(text, x, y)

            if (!text2) return
            /**
             * 绘制第二段文本
             */
            y += 30
            color = '#FE642E'
            context.font = 16 + 'px "Microsoft Yahei" ';
            context.fillStyle = color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text2, x, y);
        }
    }

    /**
     * @description 创建一个几何平面
     * @param obj 
     */


    __createPlaneGeometry(obj: { width: any; height: any; imgUrl: any; y: any; transparent: any; opacity: any; rotation: any; side?: any; blending?: any; x?: any; z?: any }) {
        let texture: THREE.Texture
        let transparent = obj.transparent || false

        if (typeof obj.imgUrl === 'string') {
            let imgUrl = obj.imgUrl
            if (!imgUrl.includes("data:image/")) {
                imgUrl = this.BASE_PATH + imgUrl
            }

            texture = new THREE.TextureLoader().load(imgUrl)
        } else {
            texture = new THREE.CanvasTexture(obj.imgUrl as HTMLCanvasElement)
        }

        const materialModel = {
            map: texture,
            side: obj.side || THREE.DoubleSide || THREE.FrontSide,
            transparent: transparent,
            opacity: obj.opacity || 1,
            blending: obj.blending && THREE.AdditiveBlending /* 使用饱和度叠加渲染 */
        }

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(obj.width, obj.height, 1, 1),
            new THREE.MeshBasicMaterial(materialModel)
        )

        plane.position.x = obj.x || 0;
        plane.position.y = obj.y || 0;
        plane.position.z = obj.z || 0;

        type itemType =
            { direction: string; degree: number } | { direction: 'arb', degree: [x: number, y: number, z: number, angle: number] /* x,y,z是向量0,1,0  angle表示y轴旋转 */ }
        const rotationAction = {
            x: (item: itemType, plane: { rotateX: (arg0: number) => void }) => {
                plane.rotateX(item.degree as number)
            },
            y: (item: itemType, plane: { rotateY: (arg0: number) => void }) => {
                plane.rotateY(item.degree as number)
            },
            z: (item: itemType, plane: { rotateZ: (arg0: number) => void }) => {
                plane.rotateZ(item.degree as number)
            },
            arb: (item: itemType, plane: { rotateOnAxis: (arg0: THREE.Vector3, arg1: any) => void }) => {
                plane.rotateOnAxis(
                    new THREE.Vector3(...(item.degree as Array<number>).slice(0, 3)),
                    item.degree[3]
                )
            }
        }
        obj.rotation.forEach((rotationItem: { direction: string | number }) => {
            const action = rotationAction[rotationItem.direction]
            action(rotationItem, plane)
        })

        return plane
    }


    /**
     * @Description 初始化 场景中的3D对象
     * @date 2021-01-22
     * @param {any} item:any
     * @returns {any}
     */


    __init3DObject(item: any) {
        if (!item.show) {
            return
        }

        switch (item.objType) {
            case 'cube': { /* 立方体 */
                const cube = this.__generateCube(item)
                this.__addObject(cube, 'scene')
            } break;
            case 'wall': { /* 围墙 */
                this.__generateWall(item)
            } break;
            case 'emptyCabinet': { /* 空机柜 */
                const emptyCabinet = this.__generateEmptyCabinet(item)
                this.__addObject(emptyCabinet, 'scene')
            } break;
            // case 'cylinderPlant': { /* 圆柱植物 */
            //     const cylinderPlant = this.__generateCylinderPlant(item)
            //     this.__addObject(cylinderPlant,"scene");
            // } break;
            case 'objPlant': { /* 模型花 */
                this.__generateObjPlant(item);
            } break;
            case 'objAnnihilator': { /* 模型灭火器 */
                this.__generateObjAnnihilator(item);
            } break;
            case 'objCamera': { /* 模型摄像头 */
                this.__generateObjCamera(item);
            } break;
        }
    }

    __generateWall(item: any) {
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

            let cube = this.__generateCube(cubeObj)
            const { childrens } = wallObj
            if (![null, undefined].includes(childrens)) {
                childrens.forEach((wallChildren: { op: any }, index: any) => {
                    const { op } = wallChildren
                    const newObj = this.__generateHole(wallChildren)
                    cube = this.__mergeModel(op, cube, newObj, commonSkin)
                });
            }

            this.__addObject(cube, 'scene')
        });
    }

    /**
     * @Description 往墙上 追加东西，比如挖洞、挂玻璃、挂一些装饰
     * @date 2021-01-22
     * @param {any} wallChilrenObj:{depth?:any;height?:any;width?:any;startDot?:any;endDot?:any;rotation?:any;uuid?:any;name?:any;skin?:any;objType?:any;skinColor?:any}
     * @returns {any}
     */    


    __generateHole(wallChilrenObj: { depth?: any; height?: any; width?: any; startDot?: any; endDot?: any; rotation?: any; uuid?: any; name?: any; skin?: any; objType?: any; skinColor?: any }) {
        /* 物体的厚度、高度、宽度 */
        const { depth: commonDepth = 40, height: commonHeight = 100, width: commonWidth = 300 } = wallChilrenObj
        const commonSkin = 0x98750f

        let wallWidth = commonWidth
        let wallDepth = wallChilrenObj.depth || commonDepth
        const { startDot, endDot } = wallChilrenObj
        const { x: sX = 0, y: sY = 0, z: sZ = 0 } = startDot
        const { x: eX = 0, y: eY = 0, z: eZ = 0 } = endDot

        const [positionX, positionY, positionZ] = [
            (sX + eX) / 2,
            (sY + eY) / 2,
            (sZ + eZ) / 2,
        ]

        if (sZ === eZ) {
            wallWidth = Math.abs(sX - eX)
            wallDepth = wallChilrenObj.depth || commonDepth
        } else if (sX === eX) {
            wallWidth = wallChilrenObj.depth || commonDepth
            wallDepth = Math.abs(sZ - eZ)
        }

        const { height, rotation, uuid, name, skin, objType, skinColor } = wallChilrenObj
        const cubeObj = {
            width: wallWidth,
            height: height || commonHeight,
            depth: wallDepth,
            rotation,
            objType,
            x: positionX,
            y: positionY,
            z: positionZ,
            uuid,
            name,
            style: {
                skinColor: skinColor || commonSkin,
                skin
            }
        }

        let cube = this.__generateCube(cubeObj)
        return cube
    }

    /**
     * @Description 生成一个立方体
     * @date 2021-01-22
     * @param {any} item:{width?:any;height?:any;depth?:any;rotation?:any;x?:any;y?:any;z?:any;uuid?:any;name?:any;style?:any;objType?:any}
     * @returns {any}
     */
    __generateCube(item: { width?: any; height?: any; depth?: any; rotation?: any; x?: any; y?: any; z?: any; uuid?: any; name?: any; style?: any; objType?: any }) {

        const { width = 1000, height = 10, depth = width /* x、y、z 轴上的长度*/ } = item
        const { x = 0, y = 0, z = 0 } = item
        const { skinColor = '' } = item.style || {}
        const cubeGeometry = new THREE.BoxGeometry(width, height, depth, 0, 0, 1)

        /**
         * 六面着色，每两面颜色一致（后续会在这方面做扩展）
         */


        cubeGeometry.faces.forEach((face, index, faces) => {
            face.color.setHex(skinColor)
            // if (index % 2 === 0) {
            //     face.color.setHex(skinColor)
            //     faces[index + 1].color.setHex(skinColor)
            // }
        })

        /* 上、下、前、后、左、右 */
        let [skin_up_obj, skin_down_obj, skin_fore_obj, skin_behind_obj, skin_left_obj, skin_right_obj] = Array(6).fill({
            vertexColors: THREE.FaceColors
        })


        let skin_opacity = 1
        const { skin } = item.style || {}

        /**
         * 根据皮肤属性来生成六个面的皮肤
         */


        if (skin) {
            skin_opacity = [null, undefined].includes(skin.opacity) ? skin_opacity : skin.opacity

            let {
                skin_right = '',
                skin_left = '',
                skin_up = '',
                skin_down = '',
                skin_fore = '',
                skin_behind = '',
                skinColor = ''
            } = skin

            const middleData = new Array(skin_right, skin_left, skin_up, skin_down, skin_fore, skin_behind)
            middleData.forEach((tempItem, index) => {
                if (![undefined, null, ''].includes(tempItem)) {
                    middleData[index] = tempItem.skinColor
                } else {
                    middleData[index] = skinColor
                }
            })
            const [skin_right_handle_end, skin_left_handle_end, skin_up_handle_end, skin_down_handle_end, skin_fore_handle_end, skin_behind_handle_end] = middleData

            skin_right_obj = this.__generateSkinOption(depth, height, skin_right, cubeGeometry, skin_right_handle_end, 0)
            skin_left_obj = this.__generateSkinOption(depth, height, skin_left, cubeGeometry, skin_left_handle_end, 2)
            skin_up_obj = this.__generateSkinOption(depth, height, skin_up, cubeGeometry, skin_up_handle_end, 4)
            skin_down_obj = this.__generateSkinOption(depth, height, skin_down, cubeGeometry, skin_down_handle_end, 6)
            skin_fore_obj = this.__generateSkinOption(depth, height, skin_fore, cubeGeometry, skin_fore_handle_end, 8)
            skin_behind_obj = this.__generateSkinOption(depth, height, skin_behind, cubeGeometry, skin_behind_handle_end, 10)

        }

        /**
         * 生成六个面的皮肤材质
         * 结合六个面的几何立方来生成一个完整的立方体
         */


        const cubeMaterialArray = []
        /* 顺序是 右 左 上 下 前 后 */
        new Array(skin_right_obj, skin_left_obj, skin_up_obj, skin_down_obj, skin_fore_obj, skin_behind_obj).forEach(tempItem => {
            cubeMaterialArray.push(new THREE.MeshLambertMaterial(tempItem))
        })

        const cube = new THREE.Mesh(cubeGeometry, cubeMaterialArray)
        cube.castShadow = true
        cube.receiveShadow = true
        cube.uuid = item.uuid
        cube.name = item.name
        cube.position.set(x, y, z)

        /**
         * 进行立方体的旋转操作
         */


        if (![null, undefined].includes(item.rotation)) {
            type itemType =
                { direction: string; degree: number } | { direction: 'arb', degree: [x: number, y: number, z: number, angle: number] /* x,y,z是向量0,1,0  angle表示y轴旋转 */ }
            const rotationAction = {
                x: (item: itemType, cube: { rotateX: (arg0: number) => void }) => {
                    cube.rotateX(item.degree as number)
                },
                y: (item: itemType, cube: { rotateY: (arg0: number) => void }) => {
                    cube.rotateY(item.degree as number)
                },
                z: (item: itemType, cube: { rotateZ: (arg0: number) => void }) => {
                    cube.rotateZ(item.degree as number)
                },
                arb: (item: itemType, cube: { rotateOnAxis: (arg0: THREE.Vector3, arg1: any) => void }) => {
                    cube.rotateOnAxis(
                        new THREE.Vector3(...(item.degree as Array<number>).slice(0, 3)),
                        item.degree[3]
                    )
                }
            }
            item.rotation.forEach((rotationItem: { direction: string | number }) => {
                const action = rotationAction[rotationItem.direction]
                action(rotationItem, cube)
            })
        }

        return cube
    }

    /**
     * @Description 生成一个皮肤选项
     * @date 2021-01-22
     * @param {any} width:any
     * @param {any} height:any
     * @param {any} skin_obj:any
     * @param {any} cubeGeometry:THREE.BoxGeometry
     * @param {any} cubeColor:any
     * @param {any} cubeFaceNumber: number
     * @returns {any}
     */


    __generateSkinOption(width: any, height: any, skin_obj: any, cubeGeometry: THREE.BoxGeometry, cubeColor: any, cubeFaceNumber: number): any {
        /**
         * 为 null、undefined
         * 类型为 数组，不为 object
         */
        if ([null, undefined].includes(skin_obj) || Array.isArray(skin_obj) || typeof skin_obj !== 'object') {
            return {
                vertexColors: THREE.FaceColors
            }
        }


        const { imgurl, transparent, blending, skinColor } = skin_obj
        if ([null, undefined].includes(imgurl)) {
            if (![null, undefined].includes(skinColor)) {
                cubeGeometry.faces[cubeFaceNumber].color.setHex(skinColor)
                cubeGeometry.faces[cubeFaceNumber + 1].color.setHex(skinColor)
                return {
                    vertexColors: THREE.FaceColors
                }
            }
        } else {
            const textureMap = this.__generateImgageTexture(width, height, skin_obj)
            const materialModel = {
                color: cubeColor,
                map: textureMap,
                opacity: skin_obj.opacity || 1,
                transparent,
                blending: blending || THREE.AdditiveBlending  /* 使用饱和度叠加渲染 */
            }
            return materialModel
        }
    }

    /**
     * @Description 生成带图片的材质
     * @date 2021-01-22
     * @param {any} width:any
     * @param {any} height:any
     * @param {any} skin_obj:any
     * @returns {any}
     */


    __generateImgageTexture(width: any, height: any, skin_obj: any) {

        let [imgWidth, imgHeight] = [128, 128]

        imgWidth = skin_obj.width || imgWidth
        imgHeight = skin_obj.height || imgHeight

        const { imgurl, repeatx = false, repeaty = false } = skin_obj
        const texture = new THREE.TextureLoader().load(this.BASE_PATH + imgurl)
        let repeat = false
        if (repeatx) {
            texture.wrapS = THREE.RepeatWrapping
            repeat = true
        }
        if (repeaty) {
            texture.wrapT = THREE.RepeatWrapping
            repeat = true
        }
        if (repeat) {
            texture.repeat.set(width / imgWidth, height / imgWidth)
        }

        return texture
    }

    /**
     * @Description 给数据集合、场景对象添加 `几何多方体`数据
     * @date 2021-01-22
     * @param {any} cube:any
     * @param {any} key:string
     * @returns {any}
     */


    __addObject(cube: any, key: string) {

        switch (key) {
            case 'object': {
                this.dataSet.push(cube)
            } break;
            case 'scene': {
                this.scene.add(cube)
            } break;
            default: {
                this.dataSet.push(cube)
                this.scene.add(cube)
            } break;
        }
    }

    /**
     * @Description 初始化事件
     * @date 2021-01-21
     * @returns {any}
     */


    initEvent() {
        this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false)
        this.renderer.domElement.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false)
    }
}