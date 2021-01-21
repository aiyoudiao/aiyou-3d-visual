import * as THREE from 'three'
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Object3D, PerspectiveCamera, Vector3, WebGLRenderer, } from 'three'


export default class ThreeHandle {

    BASE_PATH: string
    scene: Screen | any
    camera: PerspectiveCamera
    renderer: WebGLRenderer
    domElement: HTMLDivElement | HTMLElement

    constructor(ThreeSet) {
        const {
            props, dataSet, sourcePath = './static/three.js/'
        } = ThreeSet


        this.BASE_PATH = sourcePath
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
        throw new Error('Method not implemented.')
    }

    /**
     * @Description 初始化数据
     * @date 2021-01-21
     * @returns {any}
     */


    initData() {
        throw new Error('Method not implemented.')
    }

    /**
     * @Description 初始化事件
     * @date 2021-01-21
     * @returns {any}
     */


    initEvent() {
        throw new Error('Method not implemented.')
    }
}