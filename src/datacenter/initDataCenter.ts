import DataCenter from './DataCenter/DataCenter'
import { blackBasicMaterial, textureLoader } from './Helper/util'

import {
    initConfig, createGroup, createLayer, createClone, createImportModel, createEarth, createMachine, createComputer,
    createArcRect, createFace, createLine, createPath, createTexture, createMyTube, createTube, createText, createTextCanvas,
    createSpriteText, createLightBeam
} from "./Helper/core"

import genarateGroupCommmon from './Group/groupCommon'
import sceneGroup1Fn from './Group/sceneGroup1'
import sceneGroup2Fn from './Group/sceneGroup2'
import normalSceneGroupFn from './Group/normalSceneGroup'

import composer from './Composer/composer'
const { createComposer, darkenNonBloomed, restoreMaterial } = composer


export default function initDataCenter() {


    const datacenter = new DataCenter({
        selector: '#three-app-dom',
        ThreeOption: {
            rendererOption: {
                alpha: true,
                antialias: true
            }
        },
        lightOption: undefined
    })

    genarateGroupCommmon(true);

    (async function () {
        const { sceneGroup1, sceneGroup1Animate } = await sceneGroup1Fn(); // 新建第一个分组
        const { sceneGroup2, sceneGroup2Animate } = await sceneGroup2Fn(); // 新建第二个分组
        const { normalSceneGroup, normalSceneGroupAnimate } = await normalSceneGroupFn(); // 新建第三个分组
        datacenter.scene.add(sceneGroup1);
        datacenter.scene.add(sceneGroup2);
        datacenter.normalScene.add(normalSceneGroup);

        // 后期处理
        const { bloomComposer, finalComposer } = createComposer(datacenter);
        const label1 = document.querySelector("#label1")
        const label2 = document.querySelector("#label2")
        label1.parentElement.removeChild(label1)
        label2.parentElement.removeChild(label2)

        // 实现局部辉光的准备工作
        const bloomLayer = createLayer(1);
        const materials = {};

        // 产生局部辉光的前三步，初始状态必须先调用 bloomComposer.render()
        function readyToBloom() {
            datacenter.scene.traverse(darkenNonBloomed(bloomLayer, materials, blackBasicMaterial));
            bloomComposer.render();
            datacenter.scene.traverse(restoreMaterial(materials));
        }

        readyToBloom();
        datacenter.controls.addEventListener("change", readyToBloom);

        function animate() {
            // 管道运动，路线循环流动效果
            sceneGroup1Animate();
            sceneGroup2Animate();
            normalSceneGroupAnimate();

            // fps监控
            datacenter.stats.update();

            // gvonte.renderer.render(gvonte.scene, gvonte.camera);
            finalComposer.render();
            requestAnimationFrame(animate);
        }
        animate();
    })()

}
