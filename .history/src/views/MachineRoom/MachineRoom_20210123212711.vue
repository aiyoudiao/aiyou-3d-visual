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
      机房3D可视化系统
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
  </div>
</template>

<script>
import ThreeHandle from './ThreeHandle.ts'
import {ThreeData} from './threeData'



export default {
  name: 'MachineRoom',
  data() {
    return {
    }
  },
  methods: {

  },
  watch: {

  },
  mounted() {

    new ThreeHandle({
      props: {
        domID: "three-app-dom"
      }, 
      dataSet: {}, 
      sourcePath: undefined,
      dataJson: {
        alarmColor: {}
      },
      ...ThreeData

    })

    ThreeData

  }
}
</script>

<style lang="scss" scoped>
body {
  margin: 0;
  overflow: hidden;
  background: rgb(1, 3, 28);
}

</style>
