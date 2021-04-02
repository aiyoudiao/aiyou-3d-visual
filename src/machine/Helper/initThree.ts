/**
 * 初始化3D
 */

import * as THREE from 'three'
import { TWEEN, updatePath } from './action'

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'


// import { RenderPass, EffectComposer, OutlinePass, ShaderPass } from "../Lib/three-outlinepass"
// import ThreeBSP from './threebsp'
// const ThreeBSP = require('three-js-csg')(THREE)
import { CSG } from 'three-csg-ts'
import Vue from 'vue'

import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { isClickModel, findTopObj } from './util'
import { checkForCompatibility } from './core'

import { Object3D, PerspectiveCamera, Vector3, WebGLRenderer, } from 'three'
import { onDocumentMouseDown, onDocumentMouseMove } from './events'

export let BASE_PATH: string
export let dataSet: Array<any> = []
export let cabinetSpaceList: Array<any> = []
export let vLinePathMaterialList: Array<any> = []
export let nurbsmaterialList: Array<any> = []
export let makeWaterList: Array<any> = []
export let eventList: { dbclick: Array<any> }
let cabinet: Array<any> = []
let sprite: Array<any> = []
let equipment: Array<any> = []
export let outlinePass: any


export let scene: THREE.Scene
export let camera: PerspectiveCamera
let stats: Stats
export let renderer: WebGLRenderer
let compose: any
export let orbitControls: OrbitControls
export let raycaster: THREE.Raycaster
let clock: THREE.Clock


export let vueModel: Vue | any
export let domElement: HTMLDivElement | HTMLElement
export let alarmColor = {
    level1: "#00c5ff",
    level2: "#b0f604",
    level3: "#fcff00",
    level4: "#ff8d00",
    level5: "#ff0000"
}
let progressSuccess = 0

export let mouseClick: THREE.Vector2

let tooltip: any = null
let lastElement: any = null
let tipTimer: any = null
let tooltipBG = '#ACDEFE'
let lastEvent: any = null

// 编辑机房 
// TODO 使用平移控制器和拖拽控制，实现机房的编辑操纵
export let transformControls: TransformControls
export let dragControls: DragControls

export const ops = {
    proportionValue: 1
}

interface Window {
    __webpack_public_path__: any
}

export default function initThree(props: { domID, dataSet, eventList, sourcePath, vueModel, proportionValue?: number }) {

    // 画布的容器DOM
    domElement = document.getElementById(props.domID)
    // 资源根路径
    BASE_PATH = props.sourcePath || `/static/three.js/images/` 
    // 数据集
    dataSet = props.dataSet
    // 事件列表
    eventList = props.eventList
    // 鼠标点击的位置
    mouseClick = new THREE.Vector2()
    // 定位目标的射线对象
    raycaster = new THREE.Raycaster()
    // 定时器对象
    clock = new THREE.Clock();
    // vue 页面实例
    vueModel = props.vueModel

    // 初始化一些额外配置
    ops.proportionValue = props.proportionValue || ops.proportionValue


    if (checkForCompatibility(domElement)) {
        init()
    } else {
        /**
         * TODO：处理兼容性问题
         */
    }

    return {
        scene,
        camera,
        orbitControls,
        raycaster,

    }
}


function init() {
    initStats()
    initScene()
    initCamera()
    initRenderer()
    initResize()
    initLight()
    initHelpTool()
    initData()
    initControl()
    render()
    initEvent()
}

function initScene() {
    scene = new THREE.Scene()
    scene.name = 'mainScene'
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(BASE_PATH + 'back2.jpg')
    scene.background = texture
}

function initStats() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '0px';
    domElement.append(stats.domElement);
}

function initCamera() {
    const { proportionValue } = ops

    camera = new THREE.PerspectiveCamera(45, domElement.offsetWidth / domElement.offsetHeight, 1, 15000 * proportionValue)
    camera.name = 'mainCamera';
    camera.position.set(0, 1000 * proportionValue, 1600 * proportionValue)
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    scene.add(camera)
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        // logarithmicDepthBuffer: true,
        alpha: true,
        antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(domElement.offsetWidth, domElement.offsetHeight)
    domElement.appendChild(renderer.domElement)

    /**
     * 设置渲染器渲染时的背景颜色
     * 开启渲染器的阴影贴图，开启阴影计算
     */
    renderer.setClearColor(0x1b7ace, 1.0);
    // renderer.shadowMap.enabled = true; //阴影

    /**
     * 以下是带包裹层的特效渲染器
     */
    compose = new EffectComposer(renderer);
    const selectedObjects = []
    const renderPass = new RenderPass(scene, camera);
    outlinePass = new OutlinePass(new THREE.Vector2(domElement.offsetWidth, domElement.offsetHeight), scene, camera);
    outlinePass.renderToScreen = true;
    outlinePass.selectedObjects = selectedObjects;

    const params = {
        edgeStrength: 5,
        edgeGlow: 3,
        edgeThickness: 3,
        pulsePeriod: 2,
        usePatternTexture: false
    };
    outlinePass.edgeStrength = params.edgeStrength;
    outlinePass.edgeGlow = params.edgeGlow;
    outlinePass.edgeThickness = params.edgeThickness //光晕粗
    outlinePass.pulsePeriod = params.pulsePeriod //闪烁
    outlinePass.usePatternTexture = params.usePatternTexture //是否使用贴图
    outlinePass.visibleEdgeColor.set(0x00ff00);
    outlinePass.hiddenEdgeColor.set(0xff00ff);
    compose.addPass(renderPass);
    compose.addPass(outlinePass);
    const FxaaPass = createFxaaPass();
    compose.addPass(FxaaPass);

    function createFxaaPass() {
        let FxaaPass: any = new ShaderPass(FXAAShader);
        // FxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

        const pixelRatio = renderer.getPixelRatio();
        FxaaPass.material.uniforms["resolution"].value.x =
            1 / (window.innerWidth * pixelRatio);
        FxaaPass.material.uniforms["resolution"].value.y =
            1 / (window.innerHeight * pixelRatio);
        FxaaPass.renderToScreen = true;
        return FxaaPass;
    }
}

function initResize() {
    window.addEventListener('resize', () => {

        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(domElement.offsetWidth, domElement.offsetHeight)

        // 重置相机投影相关的参数
        camera.aspect = domElement.offsetWidth / domElement.offsetHeight
        camera.updateProjectionMatrix()
    })
}

function initLight() {
    const { proportionValue } = ops

    /**
         *  light: 方向光
         *  light1: 环境光
         *  light2: 点光源
         *  light3: 聚光灯
         */

    // const light = new THREE.DirectionalLight(0x555555, 1.0);
    // light.position.set(1000, 1000, 200);
    // scene.add(light);

    const light1 = new THREE.AmbientLight(0x555555)
    light1.position.set(0, 1200 * proportionValue, 0)
    scene.add(light1)

    /**
     * 设置点光源，同时开启光源对象的阴影计算功能
     */
    const light2 = new THREE.PointLight(0xeeeeee)
    // light2.shadow.camera.near = 1
    // light2.shadow.camera.far = 5000
    light2.position.set(0, 1200 * proportionValue, 0)
    // light2.castShadow = true
    scene.add(light2)


    // const light3 = new THREE.SpotLight(0x555555)
    // light3.shadow.camera.near = 1
    // light3.shadow.camera.far = 5000
    // light3.position.set(0, 800, 0)
    // light3.castShadow = true
    // scene.add(light3)

}

function initHelpTool() {

    //点光源辅助线
    // const plightHelper = new THREE.PointLightHelper(light2, 500); // 50 is helper size
    // scene.add(plightHelper);

    // // 网格辅助线
    // var helpGrid = new THREE.GridHelper(1600, 50);
    // scene.add(helpGrid);

    //坐标轴辅助线
    var axesHelper = new THREE.AxesHelper(1800); // 500 is size
    scene.add(axesHelper);

    // // 向量辅助线
    // var directionV3 = new THREE.Vector3(1, 0, 1);
    // var originV3 = new THREE.Vector3(0, 200, 0);
    // var arrowHelper = new THREE.ArrowHelper(directionV3, originV3, 100, 0xff0000, 20, 10); // 100 is length, 20 and 10 are head length and width
    // scene.add(arrowHelper);

    //// 对象辅助线
    // $.each(objects, function (index, _obj) {
    //     if (_obj.type != "PerspectiveCamera") {      
    //         var bboxHelper = new THREE.BoundingBoxHelper(_obj, 0x999999);
    //         scene.add(bboxHelper);
    //     }
    // });

    // 相机辅助线
    // var cameraHelper = new THREE.CameraHelper(camera);
    // scene.add(cameraHelper);
}

function initControl() {

    /**
     * 1. 初始化轨迹控制器
     * 2. 初始化拖拽控制器
     */

    initOrbitControls()
    // initTransformControls()
    initDragControls()

    // 初始化轨迹控制器
    function initOrbitControls() {
        orbitControls = new OrbitControls(camera, domElement)
        // orbitControls.addEventListener('change', function () {
        //     console.log('我变了')
        // })
        orbitControls.rotateSpeed = 0.1; //角度变换速度
        orbitControls.zoomSpeed = 5; //缩放速度
        orbitControls.panSpeed = 1; //平移速度

        orbitControls.enableZoom = true; //是否允许缩放
        orbitControls.enablePan = true; //是否允许移动
        orbitControls.enableRotate = true; //是否允许旋转

        orbitControls.enableDamping = true; //是否允许缓冲效果
        orbitControls.dampingFactor = 0.1; //缓冲大小

        orbitControls.autoRotate = false; //自动旋转
        orbitControls.autoRotateSpeed = 0.1; //自动旋转速度

        orbitControls.keyPanSpeed = 5; //键盘移动速度
        orbitControls.keys = {
            LEFT: 37, //left arrow
            UP: 38, // up arrow
            RIGHT: 39, // right arrow
            BOTTOM: 40 // down arrow
        };
        orbitControls.enabled = true;


        orbitControls.update()
    }

    // !!NOTE 初始化转换控制器（转换控制器被使用后，可能会影响投影对象的使用，所以要及时销毁，每次要使用的时候，再创建新的即可）
    function initTransformControls() {
        // 支持转换功能的控制器：平移、旋转、放大缩小
        transformControls = new TransformControls(camera, domElement)
        transformControls.size = 1
        transformControls.showY = false
        scene.add(transformControls)

        transformControls.addEventListener('change', function (event) {
            // TODO 触发显示坐标的操作
        })

        transformControls.addEventListener('mouseDown', function (event) {
            //
            // dragControls.enabled = vueModel.editMachineRoom
            orbitControls.enabled = false;
        })

        transformControls.addEventListener('mouseUp', function (event) {
            // 初始化某个机柜中的设备及相关的状态
            // console.log('event', event.target.object)
            const machineRoom: any = window['machineRoom']
            const cabinet = machineRoom.cabinets.find((item) => {
                return item.cabinet === event.target.object
            })

            cabinet && cabinet.resetServerDevice()

            transformControls.detach()
            dragControls.enabled = true
            orbitControls.enabled = true;
            scene.remove(transformControls)
            transformControls.dispose()
            transformControls = null

        })

        transformControls.addEventListener('objectchange', function (event) {
            // 
        })
    }

    // 初始化拖拽控制器
    function initDragControls() {

        // 支持拖拽功能的控制器
        dragControls = new DragControls([], camera, domElement)
        dragControls.enabled = true // vueModel.editMachineRoom
        dragControls.addEventListener('dragstart', function (event) {
            // dragControls.enabled = vueModel.editMachineRoom
            if (vueModel.editMachineRoom) {
                (!transformControls) && initTransformControls();
                transformControls.attach(event.object.parent)
            }

            dragControls.enabled = false
        })

        dragControls.addEventListener('drag', function (event) {
        })
        dragControls.addEventListener('dragend', function (event) {
        })
    }

}

function render(time?) {

    // const delta = clock.getDelta();

    if (TWEEN != null && typeof (TWEEN) != 'undefined') {
        TWEEN.update(time);
    }

    updatePath()
    renderer.render(scene, camera)
    orbitControls.update()
    // stats.update(delta)
    stats.update(time)

    requestAnimationFrame(render)
}

// function render(time?) {

//     const delta = clock.getDelta();

//     if (TWEEN != null && typeof (TWEEN) != 'undefined') {
//         TWEEN.update(time);
//     }

//     updatePath()
//     if (outlinePass.selectedObjects[0]) {
//         compose.render(delta)
//     } else {
//         renderer.render(scene, camera)
//     }
//     // renderer.render(scene, camera)
//     orbitControls.update()
//     // stats.update(delta)
//     stats.update(delta)

//     requestAnimationFrame(render)
// }


function initData() {

}


function initEvent() {
    renderer.domElement.addEventListener('click', onDocumentMouseDown, false);
    renderer.domElement.addEventListener("mousemove", onDocumentMouseMove, false)
}

