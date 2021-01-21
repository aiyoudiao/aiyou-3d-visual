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

    
    render() {
        // TODO
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
            x: (item: itemType) => {
                plane.rotateX(item.degree as number)
            },
            y: (item: itemType) => {
                plane.rotateY(item.degree as number)
            },
            z: (item: itemType) => {
                plane.rotateZ(item.degree as number)
            },
            arb: (item: itemType) => {
                plane.rotateOnAxis(
                    new THREE.Vector3(...(item.degree as Array<number>).slice(0, 3)),
                    item.degree[3]
                )
            }
        }
        obj.rotation.forEach((rotationItem: { direction: string | number }) => {
            const action = rotationAction[rotationItem.direction]
            action(rotationItem)
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