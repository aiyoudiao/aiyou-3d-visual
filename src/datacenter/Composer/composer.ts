import DataCenter from '../DataCenter/DataCenter'
import { Vector2, ShaderMaterial, SpriteMaterial} from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass'
import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass'

import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'


// 后期处理，效果合成器
function createComposer(datacenter: DataCenter) {
    const renderPass = new RenderPass(datacenter.scene, datacenter.camera);
    const renderNormalPass = new RenderPass(datacenter.normalScene, datacenter.camera);
  
    // 产生辉光，但是不渲染到屏幕上
    const bloomComposer = new EffectComposer(datacenter.renderer);
    bloomComposer.renderToScreen = false;
    const bloomPass = createUnrealBloomPass();
    bloomComposer.addPass(renderPass);
    bloomComposer.addPass(bloomPass);
  
    // 利用 MaskPass 最终渲染到屏幕上
    const finalComposer = new EffectComposer(datacenter.renderer);
    finalComposer.renderTarget1.stencilBuffer = true;
    finalComposer.renderTarget2.stencilBuffer = true; // 两个都设置为true
    renderPass.clear = false;
    renderNormalPass.clear = false; //非常重要，否则 renderNormalPass 会清除掉上一个 RenderPass —— renderPass 的颜色
    finalComposer.addPass(renderPass);
    finalComposer.addPass(renderNormalPass);
  
    const clearMaskPass = new ClearMaskPass();
    const maskPass1 = new MaskPass(datacenter.scene, datacenter.camera);
    const shaderPass = createShaderPass(bloomComposer);
    const FxaaPass = createFxaaPass(datacenter);
    finalComposer.addPass(maskPass1);
    finalComposer.addPass(shaderPass);
    finalComposer.addPass(FxaaPass);
    finalComposer.addPass(clearMaskPass);
  
    const maskPass2 = new MaskPass(datacenter.normalScene, datacenter.camera);
    finalComposer.addPass(maskPass2);
    finalComposer.addPass(clearMaskPass);
  
    const effectCopy = new ShaderPass(CopyShader);
    finalComposer.addPass(effectCopy);
    return { bloomComposer, finalComposer };
  }
  // UnrealBloomPass，辉光效果
  function createUnrealBloomPass() {
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    const params = {
      exposure: 1,
      bloomThreshold: 0.2,
      bloomStrength: 0.5, //5
      bloomRadius: 0,
    };
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    return bloomPass;
  }
  // ShaderPass，自定义着色器pass
  function createShaderPass(bloomComposer) {
    const shaderMaterial = new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,
      defines: {},
    });
    const shaderPass = new ShaderPass(shaderMaterial, "baseTexture");
    shaderPass.needsSwap = true;
    return shaderPass;
  }
  // 抗锯齿，fxaa、smaa、ssaa都可以抗锯齿，抗锯齿效果依次减弱
  function createFxaaPass(datacenter: DataCenter) {
    let FxaaPass: any = new ShaderPass(FXAAShader);
    const pixelRatio = datacenter.renderer.getPixelRatio();
    FxaaPass.material.uniforms["resolution"].value.x =
      1 / (window.innerWidth * pixelRatio);
    FxaaPass.material.uniforms["resolution"].value.y =
      1 / (window.innerHeight * pixelRatio);
    FxaaPass.renderToScreen = true;
    return FxaaPass;
  }
  
  // 将场景中除了辉光物体外的物体材质转成黑色
  function darkenNonBloomed(bloomLayer, materials, blackBasicMaterial) {
    return (obj) => {
      if (
        (obj.isMesh || obj.isSprite) &&
        bloomLayer.test(obj.layers) === false
      ) {
        if (obj.isSprite) {
          materials[obj.uuid] = obj.material;
          obj.material = new SpriteMaterial({
            color: "#000",
          });
        } else {
          materials[obj.uuid] = obj.material;
          obj.material = blackBasicMaterial;
        }
      }
    }
  }
  // 将场景中材质转成黑色的物体还原
  function restoreMaterial(materials) {
    return (obj) => {
      if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
      }
    }
  }

  export default { createComposer, darkenNonBloomed, restoreMaterial }


