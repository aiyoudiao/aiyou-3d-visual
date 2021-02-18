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
      机房3D可视化
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
      <div
        v-cloak=""
        id="tan"
        style="width: 300px; height: 400px"
        ref="tan"
        :style="{ left: currentMesh.left + 'px', top: currentMesh.top + 'px' }"
        v-show="currentMesh.show"
      >
        <div style="position: relative">
          <el-tabs type="border-card">
            <el-tab-pane label="机柜信息" :disabled="!currentCabnet.show">
              <panel-box :dataSet="cabinetMesh"></panel-box>
            </el-tab-pane>
            <el-tab-pane label="设备服务器信息" :disabled="!currentServerDevice.show">
              <panel-box :dataSet="serverDeviceMesh"></panel-box>
            </el-tab-pane>
          </el-tabs>

          <!-- <div style="position:absolute;left:155px;top:80px;font-size:60px;color:#00ffff;vertical-align:middle;text-align: center;">
            xx </div>
          <div
            style="position:absolute;left:70px;top:170px;padding:8px 25px;border-radius:30px;border:1px solid #00ffff;">
            xx m</div>
          <div style="position:absolute;left:225px;top:170px;padding:8px 25px;">xx m</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import ThreeHandle from "./ThreeHandle.ts";
// import { ThreeData } from "./threeData";

import initThree from "@//machine/Helper/initThree";
import MachineRoom from "@/machine/MachineRoom/MachineRoom.ts";
import ops from "./project";

import PanelBox from "./components/PanelBox";

export default {
  name: "MachineRoom",
  components: {
    "panel-box": PanelBox,
  },
  data() {
    return {
      currentMesh: {
        show: false,
        left: 0,
        top: 0,
      },

      cabinetColumn: {
        机号: "name",
        所属数据中心: "dataCenter",
        所属机房: "RoomId",
        所属机架: "RackName",
        机柜利用率: "utilization",
      },

      currentCabnet: {
        show: false,
        name: "机房管理员",
        dataCenter: "腾讯数据中心",
        RoomId: "机房001",
        RackName: "机架001",
        utilization: "50%",
      },

      serverDeviceColumn: {
        设备名: "deviceName",
        设备管理ip: "deviceManagerIP",
        设备状态: "deviceState",
        设备厂商: "deviceManufacturer",
        设备型号: "deviceType",
        设备数据中心归属: "dataCenter",
        所属机房: "RoomId",
        所属机架: "RackName",
        开始U位: "startU",
        结束U位: "endU",
      },

      currentServerDevice: {
        show: false,
        deviceName: "设备-001",
        deviceManagerIP: "127.0.0.1",
        deviceState: "正常",
        deviceManufacturer: "思科",
        deviceType: "型号-001",
        dataCenter: "腾讯数据中心",
        RoomId: "机房001",
        RackName: "机架001",
        startU: "10U",
        endU: "15U",
      },
    };
  },
  computed: {
    cabinetMesh() {
      const meshData = JSON.parse(JSON.stringify(this.currentCabnet));
      delete meshData.show;

      const cabinetColumn = JSON.parse(JSON.stringify(this.cabinetColumn));
      const keys = Object.keys(cabinetColumn);
      const values = Object.values(cabinetColumn);

      return values.map((key, index) => {
        let result;

        if (index === 0) {
          result = {
            vip: true,
            label: keys[index],
            content: meshData[key],
            style: {},
          };
        } else {
          result = {
            vip: false,
            label: keys[index],
            content: meshData[key],
            style: {},
          };
        }

        return result;
      });
    },
    serverDeviceMesh() {
      const meshData = JSON.parse(JSON.stringify(this.currentServerDevice));
      delete meshData.show;

      const serverDeviceColumn = JSON.parse(
        JSON.stringify(this.serverDeviceColumn)
      );
      const keys = Object.keys(serverDeviceColumn);
      const values = Object.values(serverDeviceColumn);

      return values.map((key, index) => {
        let result;

        if (index === 0) {
          result = {
            vip: true,
            label: keys[index],
            content: meshData[key],
            style: {},
          };
        } else {
          result = {
            vip: false,
            label: keys[index],
            content: meshData[key],
            style: {},
          };
        }

        return result;
      });
    },
  },
  methods: {},
  watch: {},
  mounted() {
    const vueModel = this;
    console.log("mounted@vueModel", vueModel);

    initThree({
      domID: "three-app-dom",
      dataSet: [],
      eventList: [],
      sourcePath: undefined,
      vueModel: vueModel,
    });

    new MachineRoom(
      {
        cabinetCfgs: [],
        name: "机房2021",
        items: [...ops.objects],
      },
      null
    );
  },
};
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

#tan0 > div {
  padding: 5px;
}

#left {
  position: absolute;
  z-index: 200;
  width: 150px;
  background: rgba(255, 255, 255, 1);
  padding: 15px;
  height: 100%;
}

[v-cloak] {
  display: none;
}
</style>
