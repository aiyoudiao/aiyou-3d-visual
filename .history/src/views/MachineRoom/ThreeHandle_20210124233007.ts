import * as THREE from 'three'
import { RenderPass, EffectComposer, OutlinePass } from "./three-outlinepass"
// import ThreeBSP from './threebsp'
// const ThreeBSP = require('three-js-csg')(THREE)
import { CSG } from 'three-csg-ts'
import Vue from 'vue'

import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { isClickModel } from './ThreeTool'

import { Object3D, PerspectiveCamera, Vector3, WebGLRenderer, } from 'three'



export default class ThreeHandle {

    BASE_PATH: string
    dataSet: Array<any> = []
    eventList: { dbclick: Array<any> }
    cabinet: Array<any> = []
    sprite: Array<any> = []
    equipment: Array<any> = []
    outlinePass: any


    scene: Screen | any
    camera: PerspectiveCamera
    stats: Stats
    renderer: WebGLRenderer
    compose: any
    orbitControls: OrbitControls
    raycaster: THREE.Raycaster
    clock: THREE.Clock

    vueModel: Vue | any
    domElement: HTMLDivElement | HTMLElement
    tooltip: HTMLDivElement | HTMLElement
    tooltipBackground: string = '#ACDEFE'
    alarmColor = {
        level1: "#00c5ff",
        level2: "#b0f604",
        level3: "#fcff00",
        level4: "#ff8d00",
        level5: "#ff0000"
    }
    progressSuccess = 0
    dbclick = 0
    mouseClick: THREE.Vector2

    lastElement: any = null
    tipTimer: any = null
    tooltipBG = '#ACDEFE'
    lastEvent: any = null


    constructor(ThreeSet: { props: any; dataSet: any; eventList: any; sourcePath?: "./static/three.js/images/"; dataJson: any, vueModel: Vue | any }) {
        const {
            props, dataSet, eventList, sourcePath = './static/three.js/images/', dataJson, vueModel
        } = ThreeSet

        this.domElement = document.getElementById(props.domID)
        this.BASE_PATH = sourcePath
        this.dataSet = dataSet
        this.eventList = eventList
        this.alarmColor = Object.assign(this.alarmColor, dataJson.alarmColor)

        this.mouseClick = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.clock = new THREE.Clock();
        this.vueModel = vueModel

        console.log('vueModel', this.vueModel)

        this.init()
    }

    /**
     * @Description 全局的初始化方法
     * @date 2021-01-21
     * @returns {any}
     */


    init(): any {

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
        this.initStats()
        this.initCamera()
        this.initRenderer()
        this.initControl()
        this.initLight()
        this.initHelpGrid()
        this.render()
        this.initData()
        this.initEvent()


    }

    /**
     * @Description 初始化场景
     * @date 2021-01-21
     * @returns {any}
     */


    initScene(): any {
        this.scene = new THREE.Scene()
        const textureLoader = new THREE.TextureLoader()
        // const texture = textureLoader.load(this.BASE_PATH + 'back.jpg')
        // this.scene.background = texture
        this.scene.background = new THREE.Color(0x000000)
    }

    /**
     * @Description 初始化 左上角的 渲染趋势图
     * @date 2021-01-24
     * @returns {any}
     */
    initStats() {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.left = '0px';
        this.domElement.append(this.stats.domElement);
    }


    /**
     * @Description 初始化相机
     * @date 2021-01-21
     * @returns {any}
     */


    initCamera(): any {
        this.camera = new THREE.PerspectiveCamera(45, this.domElement.offsetWidth / this.domElement.offsetHeight, 1, 10000)
        this.camera.name = 'mainCamera'
        this.camera.position.set(0, 1000, 1800)

        // this.camera.up.x = 0;
        // this.camera.up.y = 1;
        // this.camera.up.z = 0;

        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.scene.add(this.camera)
    }

    /**
     * @Description 初始化渲染器
     * @date 2021-01-21
     * @returns {any}
     */


    initRenderer(): any {
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
        this.domElement.appendChild(renderer.domElement)

        renderer.setClearColor(0xffffff, 1.0);
        renderer.shadowMap.enabled = true; //阴影

        var compose = new EffectComposer(renderer);
        var selectedObjects = []
        var renderPass = new RenderPass(this.scene, this.camera);
        var outlinePass = new OutlinePass(new THREE.Vector2(this.domElement.offsetWidth, this.domElement.offsetHeight), this.scene, this.camera);
        outlinePass.renderToScreen = true;
        outlinePass.selectedObjects = selectedObjects;
        var params = {
            edgeStrength: 3,
            edgeGlow: 2,
            edgeThickness: 2,
            pulsePeriod: 1,
            usePatternTexture: false
        };


        outlinePass.edgeStrength = params.edgeStrength;
        outlinePass.edgeGlow = params.edgeGlow;
        outlinePass.edgeThickness = params.edgeThickness //光晕粗
        outlinePass.pulsePeriod = params.pulsePeriod //闪烁
        outlinePass.usePatternTexture = params.usePatternTexture //是否使用贴图
        outlinePass.visibleEdgeColor.set(0xffffff);
        outlinePass.hiddenEdgeColor.set(0xff00ff);
        compose.addPass(renderPass);
        compose.addPass(outlinePass);

        this.renderer = renderer
        this.compose = compose
        this.outlinePass = outlinePass
    }

    /**
     * @Description 初始化灯光
     * @date 2021-01-21
     * @returns {any}
     */


    initLight(): any {
        /**
         *  light: 方向光
         *  light1: 环境光
         *  light2: 点光源
         */

        // const light = new THREE.DirectionalLight(0xFF0000, 1.0);
        // light.position.set(100, 100, 200);
        // this.scene.add(light);

        const light1 = new THREE.AmbientLight(0xcccccc)
        light1.position.set(0, 0, 0)
        this.scene.add(light1)

        const light2 = new THREE.PointLight(0x555555)
        light2.shadow.camera.near = 1
        light2.shadow.camera.far = 5000
        light2.position.set(0, 500, 0)
        light2.castShadow = true
        this.scene.add(light2)

        // //点光源辅助线
        // var plightHelper = new THREE.PointLightHelper(light2, 500); // 50 is helper size
        // this.scene.add(plightHelper);
    }

    /**
     * @Description 初始化网格
     * @date 2021-01-24
     * @returns {any}
     */
    initHelpGrid() {
        // // 网格辅助线
        // var helpGrid = new THREE.GridHelper(1600, 50);
        // this.scene.add(helpGrid);

        // // //坐标轴辅助线
        // var axesHelper = new THREE.AxesHelper(800); // 500 is size
        // this.scene.add(axesHelper);

        // // 向量辅助线
        // var directionV3 = new THREE.Vector3(1, 0, 1);
        // var originV3 = new THREE.Vector3(0, 200, 0);
        // var arrowHelper = new THREE.ArrowHelper(directionV3, originV3, 100, 0xff0000, 20, 10); // 100 is length, 20 and 10 are head length and width
        // this.scene.add(arrowHelper);

        //// 对象辅助线
        // $.each(this.objects, function (index, _obj) {
        //     if (_obj.type != "PerspectiveCamera") {      
        //         var bboxHelper = new THREE.BoundingBoxHelper(_obj, 0x999999);
        //         this.scene.add(bboxHelper);
        //     }
        // });

        // 相机辅助线
        var cameraHelper = new THREE.CameraHelper(this.camera);
        this.scene.add(cameraHelper);
    }

    /**
     * @Description 初始化控制器
     * @date 2021-01-21
     * @returns {any}
     */


    initControl(): any {
        this.orbitControls = new OrbitControls(this.camera, this.domElement)
        this.orbitControls.update()
    }

    /**
     * @Description 初始化数据
     * @date 2021-01-21
     * @returns {any}
     */


    initData(): any {
        let open = false
        this.dataSet.forEach(item => {

            // if (open) {
            //     return
            // }

            // if (item.name === 'floor') {
            //     open = true
            // }
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


    render(): any {
        this.__ainimate()
    }

    /**
     * @Description 动画走起
     * @date 2021-01-22
     * @returns {any}
     */


    __ainimate(): any {

        const delta = this.clock.getDelta();
        requestAnimationFrame(this.render.bind(this))
        if (this.outlinePass.selectedObjects.length) {
            this.compose.render(delta)
        } else {
            this.renderer.render(this.scene, this.camera)
        }
        this.orbitControls.update()
        this.stats.update(delta)
    }

    /**
     * @Description 初始化工具提示
     * @date 2021-01-21
     * @returns {any}
     */


    __initToolTip(): any {
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


    __generateText(floorWidth: any, floorHeight: any): any {
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
            imgurl: canvas,
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
        function marker(context: CanvasRenderingContext2D, text: string, text2: string, x: number, y: number): any {
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


    __createPlaneGeometry(obj: { width: any; height: any; imgurl: any; y: any; transparent: any; opacity: any; rotation: any; side?: any; blending?: any; x?: any; z?: any }) {
        let texture: THREE.Texture
        let transparent = obj.transparent || false

        if (typeof obj.imgurl === 'string') {
            let imgurl = obj.imgurl
            if (!imgurl.includes("userData:image/")) {
                imgurl = this.BASE_PATH + imgurl
            }

            texture = new THREE.TextureLoader().load(imgurl)
        } else {
            texture = new THREE.CanvasTexture(obj.imgurl as HTMLCanvasElement)
        }

        const materialModel = {
            map: texture,
            side: obj.side || THREE.DoubleSide || THREE.FrontSide,
            transparent: transparent,
            opacity: obj.opacity || 1,
        } as any

        if (obj.blending) {
            materialModel.blending = THREE.AdditiveBlending /* 使用饱和度叠加渲染 */
        }

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(obj.width, obj.height, 1, 1),
            new THREE.MeshBasicMaterial(materialModel)
        )

        plane.position.x = obj.x || 0;
        plane.position.y = obj.y || 0;
        plane.position.z = obj.z || 0;

        /**
        * 进行立方体的旋转操作
        */


        this.__handleRotaion(obj.rotation, plane)

        return plane
    }


    /**
     * @Description 初始化 场景中的3D对象
     * @date 2021-01-22
     * @param {any} item:any
     * @returns {any}
     */


    __init3DObject(item: any): any {
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

            // TODO
            // case 'cylinderPlant': { /* 圆柱植物 */
            //     const cylinderPlant = this.__generateCylinderPlant(item)
            //     this.__addObject(cylinderPlant,"scene");
            // } break;
            case 'objPlant': { /* 模型花 */
                this.____generateObjPlant(item);
            } break;
            case 'objAnnihilator': { /* 模型灭火器 */
                this.____generateObjAnnihilator(item);
            } break;
            case 'objCamera': { /* 模型摄像头 */
                this.____generateObjCamera(item);
            } break;
        }
    }

    /**
     * @Description 生成 相机模型
     * @date 2021-01-24
     * @param {any} item:any
     * @returns {any}
     */


    ____generateObjCamera(item: any) {

        var mtlLoader = new MTLLoader();
        mtlLoader.load(this.BASE_PATH + ('camera/camera.mtl'), (materials) => {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(this.BASE_PATH + ('camera/camera.obj'), (object: any) => {
                item.childrens.forEach((childobj) => {
                    var newobj = object.clone();
                    if (!newobj.objHandle) {
                        if (childobj.objHandle) {
                            newobj.objHandle = childobj.objHandle;
                        } else if (item.objHandle) {
                            newobj.objHandle = item.objHandle;
                        }
                    }
                    newobj = this.____handleObj(newobj);
                    newobj.position.set(childobj.x || 0, childobj.y || 0, childobj.z || 0);
                    this.scene.add(newobj);
                });
                this.progressSuccess += 1;
            }, this.onProgress, this.onError);
        });
    }

    /**
     * @Description 生成灭火器对象
     * @date 2021-01-24
     * @param {any} item:any
     * @returns {any}
     */


    ____generateObjAnnihilator(item: any) {
        let _this = this;
        var mtlLoader = new MTLLoader();
        mtlLoader.load(this.BASE_PATH + ('annihilator/annihilator.mtl'), (materials) => {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(this.BASE_PATH + ('annihilator/annihilator.obj'), (object: any) => {
                item.childrens.forEach((childobj) => {
                    var newobj = object.clone();
                    if (!newobj.objHandle) {
                        if (childobj.objHandle) {
                            newobj.objHandle = childobj.objHandle;
                        } else if (item.objHandle) {
                            newobj.objHandle = item.objHandle;
                        }
                    }
                    newobj = _this.____handleObj(newobj);
                    newobj.position.set(childobj.x || 0, childobj.y || 0, childobj.z || 0);
                    _this.scene.add(newobj);
                });
                _this.progressSuccess += 1;
            }, _this.onProgress, _this.onError);
        });
    }

    /**
     * @Description  生成模型花
     * @date 2021-01-24
     * @param {any} item
     * @returns {any}
     */


    ____generateObjPlant(item) {
        var mtlLoader = new MTLLoader();
        mtlLoader.load(this.BASE_PATH + ('plant/plant.mtl'), (materials) => {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(this.BASE_PATH + ('plant/plant.obj'), (object: any) => {
                item.childrens.forEach((childobj) => {
                    var newobj = object.clone();
                    if (!newobj.objHandle) {
                        if (childobj.objHandle) {
                            newobj.objHandle = childobj.objHandle;
                        } else if (item.objHandle) {
                            newobj.objHandle = item.objHandle;
                        }
                    }
                    newobj = this.____handleObj(newobj);
                    newobj.position.set(childobj.x || 0, childobj.y || 0, childobj.z || 0);
                    this.scene.add(newobj);
                });
                this.progressSuccess += 1;
            }, this.onProgress, this.onError);
        });
    }

    ____handleObj(obj) {
        if (obj.objHandle != null && typeof (obj.objHandle) != 'undefined' && obj.objHandle.length > 0) {
            obj.objHandle.forEach(function (childobj) {
                // objHandle: [{ direction: 'x', ratio: 0.5 ,degree:0.5*Math.PI}], 
                switch (childobj.direction) {
                    case 'x':
                        if (childobj.ratio) {
                            obj.scale.x = childobj.ratio;
                        }
                        if (childobj.degree) {
                            obj.rotateX(childobj.degree);
                        }
                        break;
                    case 'y':
                        if (childobj.ratio) {
                            obj.scale.y = childobj.ratio;
                        }
                        if (childobj.degree) {
                            obj.rotateY(childobj.degree);
                        }
                        break;
                    case 'z':
                        if (childobj.ratio) {
                            obj.scale.z = childobj.ratio;
                        }
                        if (childobj.degree) {
                            obj.rotateZ(childobj.degree);
                        }
                        break;
                    case 'arb':  //{ direction: 'arb', handleScale: [0.01,0.01,0.01], handleRotale: [0,1,0,0.5*Math.PI]}
                        if (childobj.handleScale && childobj.handleScale.length == 3) {
                            obj.scale.set(childobj.handleScale[0], childobj.handleScale[1], childobj.handleScale[2]);
                        }
                        if (childobj.handleRotale && childobj.handleRotale.length == 4) {
                            obj.rotateOnAxis(new THREE.Vector3(childobj.handleRotale[0], childobj.handleRotale[1], childobj.handleRotale[2]), childobj.handleRotale[3]);
                        }
                        break;
                }
            });
        }
        return obj;
    }

    /**
     * @Description 生成一个空的机柜
     * @date 2021-01-23
     * @param {any} item:{uuid?:any;size?:any;style?:any;name?:any;userData?:any;doors?:any;rotation?:any;x?:any;y?:any;z?:any;width?:any;height?:any;childrens?:any}
     * @returns {any}
     */


    __generateEmptyCabinet(item: { uuid?: any; size?: any; style?: any; name?: any; userData?: any; doors?: any; rotation?: any; x?: any; y?: any; z?: any; width?: any; height?: any; childrens?: any }) {
        let cabinet: THREE.Object3D, floorHeight = 10, uuid = item.uuid || (Math.random() * Math.random() * Math.random()).toString().slice(2)

        const { thick: sizeThick, width: sizeWidth, height: sizeHeight, depth: sizeDepth } = item.size
        const { skinColor: styleSkinColor, skin: styleSkin } = item.style
        const objModel = {
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
            z: -sizeDepth / 2 + sizeThick / 2
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

        const downCube = this.__generateCube(downObj)
        const upCube = this.__generateCube(upObj)
        const leftCube = this.__generateCube(leftObj)
        const rightCube = this.__generateCube(rightObj)
        const foreCube = this.__generateCube(foreObj)
        const behindCube = this.__generateCube(behindObj)
        cabinet = this.__mergeModel('+', downCube, upCube)
        cabinet = this.__mergeModel('+', cabinet, leftCube)
        cabinet = this.__mergeModel('+', cabinet, rightCube)
        cabinet = this.__mergeModel('+', cabinet, foreCube)
        cabinet = this.__mergeModel('+', cabinet, behindCube)

        const tempObj = new THREE.Object3D()
        tempObj.add(cabinet)
        tempObj.name = item.name
        tempObj.uuid = uuid
        tempObj.userData = item.userData || { name: item.name, alarmInfo: [] }
        const { x = 0, y = 0, z = 0 } = item
        tempObj.position.set(x, y + floorHeight, z)
        this.__addObject(tempObj, 'object')
        this.cabinet.push(tempObj)

        /* 门 */
        const { doors } = item
        if (![null, undefined].includes(doors)) {
            /* 单门 */
            const { skins: doorSkins, doorname, rotation = null } = item.doors
            if (doorSkins.length === 1 && doorname.length === 1) {
                const doorObj = {
                    ...objModel,
                    name: doorname[0],
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
                const doorCube = this.__generateCube(doorObj)
                if (rotation) {
                    const [x, y, z] = [
                        sizeWidth / 2,
                        0,
                        sizeDepth / 2 - sizeThick / 2 + 1 + sizeWidth / 2
                    ]
                    doorCube.position.set(x, y, z)
                }
                tempObj.add(doorCube)
                this.__addObject(doorCube, 'object')
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

                    const doorCube = this.__generateCube(doorObj)
                    tempObj.add(doorCube)
                    this.__addObject(doorCube, 'object')
                });
            }
        }


        /* 机柜告警信息 */
        if (![null, undefined].includes(item.userData)) {
            const { width: textAreaWidth = 70, height: textAreaHeight = 70 } = item.size
            const { userData: userData } = item
            const canvas = document.createElement('canvas')
            canvas.width = textAreaWidth
            canvas.height = textAreaHeight
            const context = canvas.getContext('2d')
            context.beginPath()
            context.rect(0, 0, textAreaWidth, textAreaHeight)
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

            marker(context, textAreaWidth / 2, textAreaHeight / 2, userData.name)

            const alarmObj = {
                width: textAreaWidth,
                height: textAreaHeight,
                imgurl: canvas,
                y: textAreaHeight / 2 + 1,
                opacity: 0.8,
                transparent: true,
                rotation: [
                    { direction: 'x', degree: - 0.5 * Math.PI }
                ]
            }
            const text = this.__createPlaneGeometry(alarmObj)
            tempObj.add(text)
            /* NOTE 告警信息 */
            const url = this.BASE_PATH + 'images/marker1.png'
            const texture = new THREE.TextureLoader().load(url)
            const spriteMaterial = new THREE.SpriteMaterial({
                color: this.alarmColor.level1, /* 设置精灵矩形区域颜色 */
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
            this.__addObject(sprite)
            this.sprite.push(sprite)
        }


        /* 处理机柜子对象 */
        const { childrens } = item
        if (![null, undefined].includes(childrens) && Array.isArray(childrens)) {
            let equipmentUUID = []
            const { x, y, z, rotation = null } = item
            childrens.forEach((service, index) => {
                let serviceUUID = service.uuid || (Math.random() * Math.random() * Math.random()).toString().slice(2)
                service.x = x
                service.y = service.y + floorHeight + (y - (sizeHeight - 2 * sizeThick) / 2)
                service.z = z
                service.rotation = rotation

                const newObj = this.__generateCube(service)
                newObj.userData = service.userData
                newObj.userData['equipmentUUID'] = uuid
                newObj.uuid = serviceUUID
                equipmentUUID.push(serviceUUID)
                this.__addObject(newObj)
                this.equipment.push(newObj)
            })
            tempObj.userData["equipmentUUID"] = equipmentUUID
        }

        /**
        * 进行立方体的旋转操作
        */

        this.__handleRotaion(item.rotation, tempObj)

        return tempObj
    }

    /**
     * @Description 处理立方体的旋转操作
     * @date 2021-01-23
     * @param {any} rotation:{direction:string|number}[]
     * @param {any} cubeObj:THREE.Object3D
     * @returns {any}
     */


    __handleRotaion(rotation: { direction: string | number }[], cubeObj: THREE.Object3D) {
        if (![null, undefined].includes(rotation)) {
            type itemType =
                { direction: string; degree: number } | { direction: 'arb'; degree: [x: number, y: number, z: number, angle: number] /* x,y,z是向量0,1,0  angle表示y轴旋转 */ }
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
            rotation.forEach((rotationItem: { direction: string | number }) => {
                const action = rotationAction[rotationItem.direction]
                action(rotationItem, cubeObj)
            })
        }
    }

    /**
     * @Description 生成墙体
     * @date 2021-01-23
     * @param {any} item:{style?:any;wallData?:any;depth?:any;height?:any;width?:any}
     * @returns {any}
     */


    __generateWall(item: { style?: any; wallData?: any; depth?: any; height?: any; width?: any }): any {
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
            // let close = false
            if (![null, undefined].includes(childrens) && Array.isArray(childrens)) {
                childrens.forEach((wallChildren: { op: any, name: string }, index: any) => {
                    // if (close) {
                    //     return
                    // }

                    const { op } = wallChildren
                    const newObj = this.__generateHole(wallChildren)
                    cube = this.__mergeModel(op, cube, newObj, commonSkin)
                    // if (wallChildren.name === 'doorhole') {
                    //     close = true
                    // }
                });
            }

            this.__addObject(cube, 'scene')
        });
    }



    /**
     * @Description 模型合并
     * @date 2021-01-23
     * @param {any} mergeOp:any
     * @param {any} firstObj:any
     * @param {any} secondObj:THREE.Mesh<THREE.BoxGeometry
     * @param {any} any[]>
     * @param {any} commonSkin?:any
     * @returns {any}
     */


    __mergeModel(mergeOp: any, firstObj: any, secondObj: THREE.Mesh<THREE.BoxGeometry, any[]>, commonSkin?: any): any {

        firstObj.updateMatrix()
        secondObj.updateMatrix()
        const firstObjBSP = CSG.fromMesh(firstObj)
        const secondObjBSP = CSG.fromMesh(secondObj)

        let resultObjBSP = null;
        switch (mergeOp) {
            case '-': {
                resultObjBSP = firstObjBSP.subtract(secondObjBSP)
            } break;
            case '+': {
                // const subMesh = new THREE.Mesh(secondObj as any)
                secondObj.updateMatrix();
                firstObj.geometry.merge(secondObj.geometry, secondObj.matrix)
                return firstObj
            }
            case '&': {
                resultObjBSP = firstObjBSP.intersect(secondObjBSP)
            } break;
            default: {
                this.__addObject(secondObj)
                return firstObj
            }
        }

        // const cubeMaterialArray = [
        //     new THREE.MeshLambertMaterial({
        //         // map: this.__generateImgageTexture(128, 128, {imgurl: ''})
        //         vertexColors: !!THREE.FaceColors
        //     })
        // ]

        const result = CSG.toMesh(resultObjBSP, firstObj.matrix) // resultObjBSP.toMesh(cubeMaterialArray)
        // result.material.shading = THREE.FlatShading
        result.geometry.computeFaceNormals()
        result.geometry.computeVertexNormals()
        result.uuid = firstObj.uuid + mergeOp + secondObj.uuid
        result.name = firstObj.name + mergeOp + secondObj.name
        // result.material.needsUpdate = true
        // result.geometry.bufferNeedUpdate = true
        result.geometry.uvsNeedUpdate = true
        result.material = firstObj.material


        /**
         * 循环处理 整合后的模型的面
         * 最终的结果的所有面 与 firstObj模型的所有面 和 secondObj模型的所有面的三维 x y z 进行比较
         * 如果有相同的就设置 最终结果的那一面的 颜色 以及 materialIndex
         */


        const [resultFaces, firstObjFace, secondObjFace] = [result.geometry.faces, firstObj.geometry.faces, secondObj.geometry.faces]
        resultFaces.forEach((resultFaceItem: { vertexNormals: any[]; color: { setHex: (arg0: any) => void }; materialIndex: number }, resultFaceIndex: any) => {
            let faceset = false

            firstObjFace.forEach((firstFaceItem: any, firstFaceIndex: any) => {
                // const {} = resultFaceItem.vertexNormals[0]
                /* resultFaceItem.vertexNormals == firstFaceItem.vertexNormals*/
                const faceset = resultFaceItem.vertexNormals.every((subItem: { x: any; y: any; z: any }, subIndex: string | number) => {
                    return subItem.x === firstFaceItem.vertexNormals[subIndex].x &&
                        subItem.y === firstFaceItem.vertexNormals[subIndex].y &&
                        subItem.z === firstFaceItem.vertexNormals[subIndex].z
                })

                if (faceset) {
                    resultFaceItem.color.setHex(commonSkin)
                    resultFaceItem.materialIndex = firstFaceItem.materialIndex
                }
            })

            if (faceset === false) {
                secondObjFace.forEach((secondFaceItem, secondFaceIndex) => {
                    // const {} = resultFaceItem.vertexNormals[0]
                    /* resultFaceItem.vertexNormals == secondFaceItem.vertexNormals*/
                    const faceset = resultFaceItem.vertexNormals.every((subItem: { x: number; y: number; z: number }, subIndex: string | number) => {
                        return subItem.x === secondFaceItem.vertexNormals[subIndex].x &&
                            subItem.y === secondFaceItem.vertexNormals[subIndex].y &&
                            subItem.z === secondFaceItem.vertexNormals[subIndex].z
                    })

                    if (faceset) {
                        resultFaceItem.color.setHex(commonSkin)
                        resultFaceItem.materialIndex = secondFaceItem.materialIndex
                    }
                })
            }

            if (faceset === false) {
                resultFaceItem.color.setHex(commonSkin)
            }
        })

        result.castShadow = true
        result.receiveShadow = true

        return result
    }

    /**
     * @Description 往墙上 追加东西，比如挖洞、挂玻璃、挂一些装饰
     * @date 2021-01-22
     * @param {any} wallChilrenObj:{depth?:any;height?:any;width?:any;startDot?:any;endDot?:any;rotation?:any;uuid?:any;name?:any;skin?:any;objType?:any;skinColor?:any}
     * @returns {any}
     */


    __generateHole(wallChilrenObj: { depth?: any; height?: any; width?: any; startDot?: any; endDot?: any; rotation?: any; uuid?: any; name?: any; skin?: any; objType?: any; skinColor?: any } | any): any {
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


    __generateCube(item: { width?: any; height?: any; depth?: any; rotation?: any; x?: any; y?: any; z?: any; uuid?: any; name?: any; style?: any; objType?: any }): any {

        const { width = 1000, height = 10, depth = width /* x、y、z 轴上的长度*/ } = item
        const { x = 0, y = 0, z = 0 } = item
        const { skinColor = '' } = item.style || {}
        // const cubeGeometry = new THREE.BoxGeometry(width, height, depth, 0, 0, 1) /* 2020-01-24 00:00 有一个bug，如果后面三个参数中前两个设置为0，则会报没有 face，并且也不会渲染出来 */
        const cubeGeometry = new THREE.BoxGeometry(width, height, depth)

        /**
         * 六面着色，每两面颜色一致（后续会在这方面做扩展）
         */


        cubeGeometry.faces.forEach((face, index, faces) => {
            // face.color.setHex(skinColor)
            if (index % 2 === 0) {
                face.color.setHex(skinColor)
                faces[index + 1].color.setHex(skinColor)
            }
        })

        const default_obj = {
            vertexColors: THREE.FaceColors
        }
        /* 上、下、前、后、左、右 */
        let [skin_up_obj, skin_down_obj, skin_fore_obj, skin_behind_obj, skin_left_obj, skin_right_obj] = Array(6).fill(default_obj)


        let skin_opacity = 1
        const { skin } = item.style || undefined

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
                    middleData[index] = tempItem.skinColor || 0xffffff
                } else {
                    middleData[index] = skinColor || 0xffffff
                }
            })
            const [skin_right_handle_end, skin_left_handle_end, skin_up_handle_end, skin_down_handle_end, skin_fore_handle_end, skin_behind_handle_end] = middleData

            skin_right_obj = this.__generateSkinOption(depth, height, skin_right, cubeGeometry, skin_right_handle_end, 0)
            skin_left_obj = this.__generateSkinOption(depth, height, skin_left, cubeGeometry, skin_left_handle_end, 2)
            skin_up_obj = this.__generateSkinOption(width, depth, skin_up, cubeGeometry, skin_up_handle_end, 4)
            skin_down_obj = this.__generateSkinOption(width, depth, skin_down, cubeGeometry, skin_down_handle_end, 6)
            skin_fore_obj = this.__generateSkinOption(width, height, skin_fore, cubeGeometry, skin_fore_handle_end, 8)
            skin_behind_obj = this.__generateSkinOption(width, height, skin_behind, cubeGeometry, skin_behind_handle_end, 10)
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


        this.__handleRotaion(item.rotation, cube)
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
            } as any

            if (transparent) {
                materialModel.transparent = transparent
            }

            /* NOTE THREE.AdditiveBlending 这种渲染方式 会让物体呈现半透明状态*/
            if (blending) {
                materialModel.blending = THREE.AdditiveBlending//使用饱和度叠加渲染
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


    __generateImgageTexture(width: any, height: any, skin_obj: any): any {

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

        // console.log('width / imgWidth, height / imgWidth', width / imgWidth, height / imgWidth)

        return texture
    }

    /**
     * @Description 给数据集合、场景对象添加 `几何多方体`数据
     * @date 2021-01-22
     * @param {any} cube:any
     * @param {any} key:string
     * @returns {any}
     */


    __addObject(cube: any, key?: string): any {

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


    initEvent(): any {
        this.renderer.domElement.addEventListener('click', this.onDocumentMouseDown.bind(this), false);
        this.renderer.domElement.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false)
    }

    /**
     * @Description 鼠标按下
     * @date 2021-01-24
     * @param {any} event
     * @returns {any}
     */


    onDocumentMouseDown(event) {
        // console.log('event', event)
        this.dbclick++;
        var _this = this;
        setTimeout(function () { _this.dbclick = 0 }, 500);
        event.preventDefault();
        if (this.dbclick >= 2) {
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
            this.mouseClick.x = (event.offsetX / this.domElement.offsetWidth) * 2 - 1;
            this.mouseClick.y = -(event.offsetY / this.domElement.offsetHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouseClick, this.camera);
            var intersects = this.raycaster.intersectObjects(this.dataSet.filter(item => item instanceof THREE.Object3D));
            if (intersects.length > 0) {
                this.orbitControls.enabled = false;
                let SELECTED = intersects[0].object;
                // NOTE console.log(SELECTED)
                // console.log(SELECTED)
                if (this.eventList != null && this.eventList.dbclick != null && this.eventList.dbclick.length > 0) {
                    this.eventList.dbclick.forEach(function (_obj, index) {
                        if ("string" == typeof (_obj.obj_name)) {
                            if (_obj.obj_name == SELECTED.name) {
                                _obj.obj_event(SELECTED, _this);
                            }
                        } else if (_obj.findObject != null || 'function' == typeof (_obj.findObject)) {
                            if (_obj.findObject(SELECTED.name)) {
                                _obj.obj_event(SELECTED, _this);
                            }
                        }
                    })
                }
                this.orbitControls.enabled = true;
            }
        }
    }

    openCloseDoor(obj, x, y, z, info) {
        console.log(obj)
        var doorstate = "close";
        var tempobj = null;
        if (obj.doorState != null && typeof (obj.doorState) != 'undefined') {
            doorstate = obj.doorState;
            tempobj = obj.parent;
        } else {
            console.log("add parent");
            var objparent = obj.parent;
            tempobj = new THREE.Object3D();
            tempobj.position.set(obj.position.x + x, obj.position.y + y, obj.position.z + z);
            obj.position.set(-x, -y, -z);
            tempobj.add(obj);
            objparent.add(tempobj);
        }
        obj.doorState = (doorstate == "close" ? "open" : "close");
        if (info == "left" || info == "right") {
            let sign = info == "left" ? 1 : -1;
            if (obj.doorState == "close") {
                tempobj.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.5 * sign * Math.PI);
            } else {
                tempobj.rotateOnAxis(new THREE.Vector3(0, 1, 0), -0.5 * sign * Math.PI);
            }
        } else if (info == "outin") {
            //沿点击的法向量移动
            // var intersects = this.raycaster.intersectObjects([obj]);
            // if (intersects.length > 0) {
            //     // 射线位置赋值给移动网格模型
            //     tempobj.position.copy(intersects[0].point);
            //     // 沿着法线方向平移移动的网格模型
            //     var normal = intersects[0].face.normal;// 当前位置曲面法线
            //     tempobj.translateOnAxis(normal,50); //平移50
            // }

            var targetPos = new THREE.Vector3(1, 0, 0);
            // var euler = new THREE.Euler( 1, 0,0);
            // var matrix = new THREE.Matrix4();  //创建一个4维矩阵
            // matrix.lookAt(obj.position.clone() , obj.position.clone() , targetPos) //设置朝向
            // matrix.multiply(new THREE.Matrix4().makeRotationFromEuler(euler))
            // var toRot = new THREE.Quaternion().setFromRotationMatrix(matrix) 
            // tempobj.translateOnAxis(toRot,50);
            if (obj.doorState == "close") {
                tempobj.translateOnAxis(targetPos, -obj.geometry.parameters.depth + 20);
            } else {
                tempobj.translateOnAxis(targetPos, obj.geometry.parameters.depth - 20);
            }

            //使用四元素朝某个角度移动
            // var targetPos = new THREE.Vector3(0,0,1)   //目标位置点
            // var offsetAngle = Math.PI/2  //目标移动时的朝向偏移
            // // var obj =  你的三维模型(或者其他物体对象，object3D ,group ,或者mesh对象)
            // //以下代码在多段路径时可重复执行
            // var matrix = new THREE.Matrix4()  //创建一个4维矩阵
            // matrix.lookAt(obj.position.clone() , obj.position.clone() ,targetPos) //设置朝向
            // matrix.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0 , offsetAngle , 0 )))
            // var toRot = new THREE.Quaternion().setFromRotationMatrix(matrix)  //计算出需要进行旋转的四元数值
            // tempobj.translateOnAxis(toRot,50);




            // if(obj.doorState=="close"){
            //     tempobj.translateOnAxis(new THREE.Vector3(0, 0, 1),-obj.geometry.parameters.depth);
            // }else{
            //     tempobj.translateOnAxis(new THREE.Vector3(0, 0, 1),obj.geometry.parameters.depth);
            // }
        }

    }
    //开关左门
    openLeftDoor(_obj, func) {
        this.openCloseDoor(_obj, -_obj.geometry.parameters.width / 2, 0, 0, "left");
    }
    //开关右门
    openRightDoor(_obj, func) {
        this.openCloseDoor(_obj, _obj.geometry.parameters.width / 2, 0, 0, "right");
    }
    //开关机柜门
    openCabinetDoor(_obj, func) {
        this.openCloseDoor(_obj, _obj.geometry.parameters.width / 2, 0, _obj.geometry.parameters.depth / 2, "right");
    }
    //拉出放回设备
    openEquipmentDoor(_obj, func) {
        this.openCloseDoor(_obj, 0, 0, _obj.geometry.parameters.depth / 2, "outin");
    }

    /**
     * @Description 鼠标移动
     * @date 2021-01-24
     * @param {any} event
     * @returns {any}
     */
    onDocumentMouseMove(event) {
        let _this = this;
        var currentElement = null;
        const { offsetX, offsetY } = event

        this.mouseClick.x = (offsetX / this.domElement.offsetWidth) * 2 - 1;
        this.mouseClick.y = -(offsetY / this.domElement.offsetHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseClick, this.camera);
        var intersects = this.raycaster.intersectObjects(this.dataSet.filter(item => item instanceof THREE.Object3D));
        if (intersects.length > 0) {
            let SELECTED = intersects[0].object;
            // console.log(SELECTED)
            if (SELECTED.name.toString().indexOf("equipment") != -1 || SELECTED.name.toString().indexOf("spriteAlarm") != -1) {
                currentElement = SELECTED;
            }


            // /* 机柜高亮 */
            // if (SELECTED.name.toString().includes('cabinet')) {
            if (intersects && isClickModel('cabinet', SELECTED)) {
                // console.log('intersects', intersects)
                this.outlinePass.selectedObjects = [SELECTED.parent]
                // console.log('SELECTED', SELECTED)
                // console.log(this.mouseClick.x, this.mouseClick.y)
                // console.log(_this.lastEvent.pageX, _this.lastEvent.pageY)
                this.vueModel.currentMesh.left = (_this.lastEvent.pageX);
                this.vueModel.currentMesh.top = (_this.lastEvent.pageY - 15);
                this.vueModel.currentMesh.name = SELECTED.parent.userData.name
                this.vueModel.currentMesh.show = true

                this.scene.updateMatrixWorld(true)
            } else {
                this.outlinePass.selectedObjects = []
                this.vueModel.currentMesh.show = true
            }
        }
        if (this.lastElement != currentElement) {
            clearTimeout(this.tipTimer);
            if (currentElement) {
                this.tipTimer = setTimeout(() => {
                    // console.log(currentElement)
                    let tipInfo = "";
                    if (currentElement.name.toString().indexOf("equipment") != -1) {
                        tipInfo = currentElement.userData.tipInfo;
                        _this.tooltip.style.background = _this.tooltipBG;
                        _this.tooltip.querySelector("span").style.borderTop = "10px solid " + _this.tooltipBG;
                    }
                    if (currentElement.name.toString().indexOf("spriteAlarm") != -1) {
                        // console.log(currentElement)
                        if (currentElement.userData.alarmInfo.length > 0) {
                            let levelArr = [];
                            for (let i = 0; i < currentElement.userData.alarmInfo.length; i++) {
                                levelArr.push(currentElement.userData.alarmInfo[i].level);
                                tipInfo += currentElement.userData.alarmInfo[i].name + currentElement.userData.alarmInfo[i].alarmInfo + "；"
                            }
                            let max = Math.max(...levelArr);
                            _this.tooltip.style.background = _this.alarmColor["level" + max];
                            _this.tooltip.querySelector("span").style.borderTop = "10px solid " + _this.alarmColor["level" + max];
                        }
                    }
                    let tiplen = tipInfo.length;
                    _this.tooltip.querySelector("#tipdiv").innerHTML = tipInfo
                    _this.tooltip.style.width = tiplen * 15 + "px";
                    _this.tooltip.style.display = 'block';
                    _this.tooltip.style.left = (_this.lastEvent.pageX - _this.tooltip.clientWidth / 2) + 'px';
                    _this.tooltip.style.top = (_this.lastEvent.pageY - _this.tooltip.clientHeight - 15) + 'px';
                }, 1000);
            }
        }
        //设置上一次的网元为当前网元
        this.lastElement = currentElement;
        //如果当前鼠标下没有网元，隐藏tooltip
        if (currentElement == null) {
            _this.tooltip.style.display = 'none';
        }
        //设置每次移动时鼠标的事件对象
        this.lastEvent = event;
    }

    /**
     * @Description 进度通知
     * @date 2021-01-24
     * @param {any} xhr
     * @returns {any}
     */


    onProgress(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            // console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };

    /**
     * @Description 报错通知
     * @date 2021-01-24
     * @param {any} xhr
     * @returns {any}
     */


    onError(xhr) { }


}