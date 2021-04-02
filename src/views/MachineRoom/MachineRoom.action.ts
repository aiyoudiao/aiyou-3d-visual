/**
 * 行为处理的js文件
 */
import {
  senceReset,
  showCabinetUsage,
  showcabinetSpace,
  showConnection,
  showTemperature,
  showAir,
  showSmoke,
  showWater,
  showSecurity,
  showPower,
  showPerson,
  showAlarm,
  showFlag,
  editMachineRoom,
} from "@/machine/Helper/menuAction";
import genarateOps, { genarateCabinet, getHeightByUnum } from "./MachineRoom.conf";

import { MenuItem } from './MachineRoom.interface'

/**
 * 生成一个菜单列表
 * @param partMenu 自己添加的部分菜单，非必填
 * @param filter 菜单项的过滤器， 非必填
 * @returns 
 */
export function genarateMenuList(partMenu: Array<string> = [], filter = (r: MenuItem) => r) {
  const menus = [
    "场景复位",
    "管道流速管理",
    "温度监控",
    "机柜利用率",
    "空间利用率",
    "空调风向",
    "烟雾监测",
    "漏水监测",
    "防盗监测",
    "供电电缆",
    "告警巡航",
    "报警管理",
    "机柜加标识",
    "编辑模式",
    "查询模式",
    "编辑机房",
    ...partMenu
  ];

  const menuList = menus
    .map((item) => {
      return {
        label: item,
        content: [],
        size: "mini",
        disabled: false,
        type: "el-checkbox",
      } as MenuItem;
    })
    .map((item) => {
      // if (["场景复位"].includes(item.label)) {
      //   item.type = "el-checkbox-button";
      // }

      return filter(item);
    });

  return menuList;
}

/**
 * 处理菜单项的行为(需要绑定页面实例)，handleMenuItemAction.call(this, item)
 * @param item 菜单项的option
 */
export function handleMenuItemAction(item: MenuItem) {
  switch (item.label) {
    case "场景复位":
      {
        senceReset();
        item.content.pop();
      }
      break;
    case "管道流速管理":
      {
        const show = item.content.length > 0;
        showConnection(show, this.serverDeviceList);
      }
      break;
    case "温度监控":
      {
        const show = item.content.length > 0;
        showTemperature(show);
      }
      break;
    case "机柜利用率":
      {
        const show = item.content.length > 0;
        showCabinetUsage(show);
      }
      break;
    case "空间利用率":
      {
        const show = item.content.length > 0;
        showcabinetSpace(show);
      }
      break;
    case "空调风向":
      {
        const show = item.content.length > 0;
        showAir(show);
      }
      break;
    case "烟雾监测":
      {
        const show = item.content.length > 0;
        showSmoke(show);
      }
      break;
    case "漏水监测":
      {
        const show = item.content.length > 0;
        showWater(show);
      }
      break;
    case "防盗监测":
      {
        const show = item.content.length > 0;
        showSecurity(show);
      }
      break;
    case "供电电缆":
      {
        const show = item.content.length > 0;
        showPower(show);
      }
      break;
    case "告警巡航":
      {
        const show = item.content.length > 0;
        showPerson(show);
      }
      break;
    case "报警管理":
      {
        const show = item.content.length > 0;
        showAlarm(show, this.serverDeviceList);
      }
      break;
    case "机柜加标识":
      {
        const show = item.content.length > 0;
        showFlag(show, this.cabinetList);
      }
      break;
    case "编辑模式":
      {
        this.edited = !this.edited;
      }
      break;
    case "查询模式":
      {
        this.drawerSearch = !this.drawerSearch;
      }
      break;
    case "编辑机房":
      {
        this.editMachineRoom = !this.editMachineRoom;
        // 编辑机房所需的一些系列操作
        const show = item.content.length > 0;
        editMachineRoom(show, this.cabinetList)
      }
      break;
    default:
      {
      }
      break;
  }
}

/**
 * 动态生成机柜的配置数据(过滤操作)
 * @param data 
 * @param proportionValue 
 * @returns 
 */
export function dynamicGenarateCabinetConfs(data, proportionValue) {
  const cabinetNameList = []; // 机柜 name 列表
  const serverDeviceNameList = []; // 设备 name 列表
  const cabinets = [];

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

    const cabinetTempObj = JSON.parse(
      JSON.stringify(genarateCabinet(proportionValue))
    );
    cabinets.push(cabinetTempObj);
    cabinetTempObj.name = "cabinet" + "_" + cabinetID;
    cabinetNameList.push(cabinetTempObj.name);

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

      const imgurl = getUImageByUbit(endU - startU + 1)
      temp.style.skin.skin_fore.imgurl = imgurl // 目前只处理直观的图片
      temp.height = getHeightByUnum(endU - startU + 1, uBitLength);
      temp.y = getHeightByUnum(startU, uBitLength);
      cabinetTempObj.childrens.push(temp);

      temp.name = "equipment_server_" + deviceID;
      serverDeviceNameList.push(temp.name);

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

  this.cabinetList = cabinetNameList
  this.serverDeviceList = serverDeviceNameList

  return cabinets;

  /**
   * 根据U为来动态分配设备图片
   */

   function getUImageByUbit(uBit) {
     let imageUrl = '/equipment/equipment_front-2U1.png'
     switch (uBit) {
       case 1: {imageUrl = '/equipment/equipment_front-1U.png'} break;
       case 2: {imageUrl = '/equipment/equipment_front-2U.png'} break;
       case 3: {imageUrl = '/equipment/equipment_front-3U.png'} break;
       case 4: {imageUrl = '/equipment/equipment_front-4U.png'} break;
       case 5: {imageUrl = '/equipment/equipment_front-5U.png'} break;
       case 6: {imageUrl = '/equipment/equipment_front-6U.png'} break;
       case 7: {imageUrl = '/equipment/equipment_front-7U.png'} break;
       case 8: {imageUrl = '/equipment/equipment_front-8U.png'} break;
       default: {imageUrl = '/equipment/equipment_front-8U.png'}break;
     }

     return imageUrl
   }
}

/**
 * 处理页面中机柜的坐标位置
 * @param data 
 * @param proportionValue 
 * @returns 
 */
export function handleCabinetsPosition (data, proportionValue) {
  let num = 7 * proportionValue;
  let endI = Math.ceil(data.length / num);
  const cabinets = [];
  for (let i = 0; i < endI; i++) {
    let endJ = num;
    if (data.length - i * num < endJ) {
      endJ = data.length - i * num;
    }

    for (let j = 0; j < endJ; j++) {
      let obj = data[i * num + j];
      // obj.name = "cabinet" + (i + 1) + "_" + (j + 1);
      obj.userData.name = "JG-" + (i + 1) + "-" + (j + 1);
      for (let k = 0; k < obj.childrens.length; k++) {
        obj.childrens[k].userData.devid =
          obj.childrens[k].userData.devid + i + j;
        obj.childrens[k].userData.pointid =
          obj.childrens[k].userData.pointid + i + j;
      }
      obj.y = obj.y;
      obj.x = obj.x + 490 * i;
      obj.z = obj.z + 105 * j;
      // if(i==2&&j==5){
      //     obj.doors.rotation=[{ direction: 'y', degree: 0.5*Math.PI}];
      // }

      // obj.rotation=[{ direction: 'y', degree: 1*Math.PI}];
      cabinets.push(obj);
    }
  }

  return cabinets;
}

/**
 * 动态计算机房比例值（额外功能暂未实现，就是机房的偏移值）
 * 通过reuslt中的数据，获取机房规模的比例，以及机房分区时，每个区域的偏移值
 * @param result 
 * @returns 
 */
export function dynamicCalcMahineRoomLayoutProportionValue (result) {
  const { cabinets, serverDeviceList } = result;

  /**
   * 机房动态的成倍扩充的算法
   *
   *  默认装 21
   *  超过 21 机房面积会扩充 4 倍 ， 但排列是 2倍
   *  超过 2倍 * 3排 * 14 个 = 84 , 可以额外 多一排
   * 2倍 * 3排 * 2倍 * 7个
   *
   * 超过 84 面积会扩充 6倍， 但排列是 3 倍
   *  超过 3倍 * 3排 * 21 个 = 189，可以额外 多加二排
   *  3倍 * 3排 * 3被 * 7个
   *
   * 超过 189 面积扩充 8 倍， 排列时 4 倍
   *  超过 4倍 * 3 排 * 28 个 = 336， 可以额外 多加三排
   * 4倍 * 3排 * 4倍 * 7个
   */

  // 正常上限是 n^2 * (3 * 7)
  // 最大上限是 n^2 * (3 * 7) + [(n - 1) * n * 7]
  // 但最大上线 仅仅是刚好放完这么多机柜，可以少放一排来让机房更美观

  /**
   * 目前最大扩充上限为1701
   */
  const nList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const proportionValue = nList.find((n) => {
    const minM = n - 1;
    const maxM = n;

    const minValue = Math.pow(minM, 2) * (3 * 7);
    const maxValue = Math.pow(maxM, 2) * (3 * 7);

    return (
      cabinets.list.length > minValue && cabinets.list.length <= maxValue
    );
  });

  return {
    proportionValue,
  };
}

