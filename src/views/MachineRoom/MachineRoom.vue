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
            <el-tab-pane
              label="设备服务器信息"
              :disabled="!currentServerDevice.show"
            >
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

import PanelBox from "./components/PanelBox";
import { getCabinetAndDevice } from "@/api/cabinet3d";
import ops, { cabinet, getHeightByUnum } from "./project";

export default {
  name: "MachineRoom",
  components: {
    "panel-box": PanelBox,
  },
  data() {
    return {
      machineRoomId: 1,
      timer: undefined,

      currentMesh: {
        show: false,
        left: 0,
        top: 0,
      },

      cabinetColumn: {
        机号: "name",
        // 所属数据中心: "dataCenter",
        // 所属机房: "RoomId",
        // 所属机架: "RackName",
        // 机柜利用率: "utilization",
      },

      currentCabnet: {
        show: false,
        // name: "机房管理员",
        // dataCenter: "腾讯数据中心",
        // RoomId: "机房001",
        // RackName: "机架001",
        // utilization: "50%",
      },

      serverDeviceColumn: {
        // 设备名: "deviceName",
        // 设备管理ip: "deviceManagerIP",
        // 设备状态: "deviceState",
        // 设备厂商: "deviceManufacturer",
        // 设备型号: "deviceType",
        // 设备数据中心归属: "dataCenter",
        // 所属机房: "RoomId",
        // 所属机架: "RackName",
        // 开始U位: "startU",
        // 结束U位: "endU",
      },

      currentServerDevice: {
        show: false,
        // deviceName: "设备-001",
        // deviceManagerIP: "127.0.0.1",
        // deviceState: "正常",
        // deviceManufacturer: "思科",
        // deviceType: "型号-001",
        // dataCenter: "腾讯数据中心",
        // RoomId: "机房001",
        // RackName: "机架001",
        // startU: "10U",
        // endU: "15U",
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
  methods: {
    async init() {
      const vueModel = this;
      console.log("mounted@vueModel", vueModel);

      console.log("ops.objects", ops.objects);

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

    async requestCabinetAndDevice() {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(async () => {
        const result = await getCabinetAndDevice(this.machineRoomId);
        const { code, data, message } = result;

        this.handleRequestTitle(data);
        this.handleRequestList(data);
        this.init();
      }, 500);
    },

    handleRequestTitle (result) {
      const { cabinets, serverDeviceList } = result
      const { title: cabinetTitle } = cabinets
      const { title: serverDeviceTitle } = serverDeviceList

      

      const cabinetColumn = cabinetTitle.reduce((prev, item) => {
        prev[item.label] = item.name
        return prev
      }, {})

      const serverDeviceColumn = serverDeviceTitle.reduce((prev, item) => {
        prev[item.label] = item.name
        return prev
      }, {})

      this.$set(this, 'cabinetColumn', {
        机号: "name",
        ...cabinetColumn
      })
      this.$set(this, 'serverDeviceColumn', {
        ...serverDeviceColumn
      })

    },

    handleRequestList(result) {
      console.log("result", result);
      const { cabinets, serverDeviceList } = result;
      const data = [];
      cabinets.list.forEach((item) => {
        const {
          cabinetID: cID,
          cabinetRate,
          cabinetTotalU,
          uBitLength,
          cabinetName,
          dataCenterName,
          machineRoomName,
        } = item;
        const obj = {
          cabinetID: cID,
          cabinetRate,
          cabinetTotalU,
          uBitLength,
          cabinetName,
          dataCenterName,
          machineRoomName,
          children: [],
        };
        data.push(obj);
        serverDeviceList.list.forEach((deviceItem) => {
          const {
            cabinetID,
            deviceID,
            deviceName,
            deviceIP,
            deviceState,
            deviceManufacturer,
            deviceType,
            dataCenterName,
            rankName,
            startU,
            endU,
          } = deviceItem;
          
          
          if (cabinetID === cID) {
            const temp = {
              cabinetID,
              deviceID,
              deviceName,
              deviceIP,
              deviceState,
              deviceManufacturer,
              deviceType,
              dataCenterName,
              rankName,
              startU,
              endU,
            };
            obj.children.push(temp);
          }
        });
      });

      let refectResult = this.refactCabinet(data);

      refectResult = this.sortCabinet(refectResult);

      ops.objects.push(...refectResult);
    },

    refactCabinet(data) {
      let cabinets = [];
      data.forEach((cabinetConf) => {
        const {
          cabinetID,
          cabinetRate,
          cabinetTotalU,
          uBitLength,
          cabinetName,
          dataCenterName,
          machineRoomName,
          children,
        } = cabinetConf;

        const cabinetTempObj = JSON.parse(JSON.stringify(cabinet));
        cabinets.push(cabinetTempObj);

        /**
         * 1. 处理 cabinet中size的height
         * 2. 处理 cabinet中 y
         * 3. 处理 cabinet 中的 childrens
         *    - 处理 serverDevice的 height
         *    - 处理 serverDevice的 y
         */

        const sizeHeight = getHeightByUnum(cabinetTotalU, uBitLength);
        cabinetTempObj.size.height = sizeHeight + 4;
        cabinetTempObj.y = sizeHeight / 2 - 2;
        cabinetTempObj.userData = {
          ...cabinetTempObj.userData,
          cabinetID,
          cabinetRate,
          cabinetTotalU,
          uBitLength,
          cabinetName,
          dataCenterName,
          machineRoomName,
        };

        const serverdeviceTempObj = cabinetTempObj.childrens.pop();

        children.forEach((device) => {
          const temp = JSON.parse(JSON.stringify(serverdeviceTempObj));
          const {
            cabinetID,
            deviceID,
            deviceName,
            deviceIP,
            deviceState,
            deviceManufacturer,
            deviceType,
            dataCenterName,
            rankName,
            startU,
            endU,
          } = device;

          temp.height = getHeightByUnum(endU - startU, uBitLength);
          temp.y = getHeightByUnum(startU, uBitLength);
          cabinetTempObj.childrens.push(temp);
          temp.userData = {
            ...temp.userData,
            cabinetID,
            deviceID,
            deviceName,
            deviceIP,
            deviceState,
            deviceManufacturer,
            deviceType,
            dataCenterName,
            rankName,
            startU,
            endU,
          };
        });
      });

      return cabinets;
    },

    sortCabinet(data) {
      let endI = Math.ceil(data.length / 7);
      const cabinets = [];
      for (let i = 0; i < endI; i++) {
        let endJ = 7;
        if (data.length - i * 7 < endJ) {
          endJ = data.length - i * 7;
        }

        for (let j = 0; j < endJ; j++) {
          let obj = data[i * 7 + j];
          obj.name = "cabinet" + (i + 1) + "_" + (j + 1);
          obj.userData.name = "JG-" + (i + 1) + "-" + (j + 1);
          for (let k = 0; k < obj.childrens.length; k++) {
            obj.childrens[k].userData.devid =
              obj.childrens[k].userData.devid + i + j;
            obj.childrens[k].userData.pointid =
              obj.childrens[k].userData.pointid + i + j;
          }
          obj.y = obj.y;
          obj.x = obj.x + 385 * i;
          obj.z = obj.z + 105 * j;
          // if(i==2&&j==5){
          //     obj.doors.rotation=[{ direction: 'y', degree: 0.5*Math.PI}];
          // }

          // obj.rotation=[{ direction: 'y', degree: 1*Math.PI}];
          cabinets.push(obj);
        }
      }

      return cabinets;
    },
  },
  watch: {},
  async mounted() {
  },

  async created() {
    await this.requestCabinetAndDevice();
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
