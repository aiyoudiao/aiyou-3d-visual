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
    <div id="three-app-dom">
      <div v-cloak="" id="tan" style="width:300px;height:400px;" ref="tan" :style="{left:currentMesh.left + 'px',top:currentMesh.top + 'px'}"
        v-show="bool">
        <div style="position:relative;">
          <div style="position: absolute;left: 0px;top: 0px;">
            <img :src="require('@/assets/picture/2.png')" alt="" style="width:300px;height:400px;opacity: 1.0;">
          </div>
          <div style="position:absolute;left:25px;top:40px;font-size:16px">{{ currentMesh.name }}</div>
          <div style="position:absolute;left:290px;top:25px">
            xx 编号
          </div>
          <div style="position:absolute;left:330px;top:40px">
            xx ℃</div>
          <div style="position:absolute;left:170px;top:50px">xx(吨)</div>
          <div style="position:absolute;left:80px;top:85px;font-size:60px;color:#00ffff;vertical-align:middle">
            <!-- <img :src="currentMesh.iconpath" alt="" style="width:60px;"> -->
          </div>
          <div style="position:absolute;left:155px;top:80px;font-size:60px;color:#00ffff;vertical-align:middle">
            xx </div>
          <div
            style="position:absolute;left:70px;top:170px;padding:8px 25px;border-radius:30px;border:1px solid #00ffff;">
            xx m</div>
          <div style="position:absolute;left:225px;top:170px;padding:8px 25px;">xx m</div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import ThreeHandle from './ThreeHandle.ts'
import {ThreeData} from './threeData'



export default {
  name: 'MachineRoom',
  data() {
    return {
      bool: false,
      currentMesh: {
        name: '机房管理员',
        left: 0,
        top: 0,
      }
    }
  },
  methods: {

  },
  watch: {

  },
  mounted() {

    const vueModel = this
    console.log('mounted@vueModel', vueModel)
    new ThreeHandle({
      props: {
        domID: "three-app-dom"
      }, 
      dataSet: ThreeData.objects, 
      eventList: ThreeData.events,
      sourcePath: undefined,
      dataJson: {
        alarmColor: {},
        ...ThreeData
      },
      vueModel: vueModel, 
    })

  }
}
</script>

<style lang="scss" scoped>
body {
  margin: 0;
  overflow: hidden;
  background: rgb(1, 3, 28);
}

.machine-room {
  width: 100%;
  height: 100%;
}

#three-app-dom {
  width: 100%;
  height: 100%;
}

  #tan {
      position: absolute;
      color: #fff;
      z-index: 102;
      font-size: 16px;
    }

    #tan0 {
      position: absolute;
      color: #fff;
      background: rgba(2, 4, 27, 0.8);
      padding: 20px;
      border-radius: 5px;
      border: 1px solid #00aeef;
      z-index: 102;
      width: 180px;
      font-size: 16px;
    }

    #tan0>div {
      padding: 5px;
    }

    #left {
      position: absolute;
      z-index: 200;
      width: 150px;
      background: rgba(255, 255, 255, 1.0);
      padding: 15px;
      height: 100%;
    }

    [v-cloak] {
      display: none;
    }

</style>
