<template>
  <div class="machine-room">
    <div
      style="
        z-index: 2;
        text-align: center;
        font-size: 16px;
        color: #00ffff;
        top: 4px;
        position: absolute;
        width: 100%;
        background: rgba(255, 0, 0, 0);
      "
    >
      3D数据中心
    </div>
    <div style="z-index: 1; position: absolute; width: 100%">
      <img
        :src="require('@/assets/picture/line2.png')"
        alt=""
        style="width: 100%; height: 28px"
      />
    </div>
    <div id="label" style="visibility: hidden">
      <div style="position: relative">
        <div
          style="
            position: absolute;
            top: -50px;
            left: 20px;
            width: 100px;
            color: #03b5b3;
          "
        ></div>
        <div style="position: absolute; top: -30px; left: 0px">
          <img :src="require('@/assets/picture/青色弹窗.png')" alt="" />
        </div>
      </div>
    </div>
    <div id="label3" style="visibility: hidden">
      <div style="position: relative">
        <div
          style="
            position: absolute;
            top: -120px;
            left: 55px;
            width: 100px;
            color: #ffffff;
          "
        ></div>
        <div style="position: absolute; top: -100px; left: 0px">
          <img :src="require('@/assets/picture/白色弹窗.png')" alt="" />
        </div>
      </div>
    </div>
    <div id="three-app-dom"></div>

    <!-- 精灵文字模板 -->
    <div class="panel" id="label1">
      <div
        class="panel-heading"
      >
        张江数据中心
      </div>
      <div
        class="panel-body"
      >
        <p>总机房数：10</p>
        <p>总机柜数：240</p>
        <p>总服务器设备数：1789</p>
      </div>
    </div>
    <div class="panel" id="label2">
      <div
        class="panel-heading"
       
      >
        漕河泾数据中心
      </div>
      <div
        class="panel-body"
      >
       <p>总机房数：11</p>
        <p>总机柜数：270</p>
        <p>总服务器设备数：1389</p>
      </div>
    </div>

    <!-- 着色器 -->
    <script type="x-shader/x-vertex" id="vertexshader">
      varying vec2 vUv;
      void main() {
      	vUv = uv;
      	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    </script>
    <script type="x-shader/x-fragment" id="fragmentshader">
      uniform sampler2D baseTexture;
      uniform sampler2D bloomTexture;
      varying vec2 vUv;
      vec4 getTexture( sampler2D texelToLinearTexture ) {
      	return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) );
      }
      void main() {
      	gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) );
      }
    </script>
  </div>
</template>

<script>
import initDataCenter from "@/datacenter/initDataCenter";

export default {
  name: "DataCenter",
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {
    initDataCenter();
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  font-size: 18px;
  line-height: 1.42857143;
}

body {
  margin: 0;
  font-family: "tencent";
  margin: 0;
  overflow: hidden;
  background: rgb(1, 3, 28);
}

.panel {
  border: 0;
  width: 270px;
  text-indent: 20px;

  margin-bottom: 20px;
  background-color: #fff;
  /* border: 1px solid transparent; */
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.panel-heading {
  background-color: rgb(169, 255, 143);
  color: white;
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.panel-body {
  background-color: rgb(134, 217, 250);
  color: white;
  padding: 15px;
}

@font-face {
  font-family: "Microsoft YaHei";
  src: url("~@/assets/font/msyhbd.ttf");
}
</style>
