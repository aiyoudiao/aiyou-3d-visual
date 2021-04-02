/**
 * 配置相关及配置处理的js文件
 */

const uUnit = 6
/**
 * U 位操作
 * 1. 根据 U数 获取实际高度
 * 2. 根据 实际高度 获取 U数
 * 3. 根据 起始U位 获取当前的y轴位置
 * 4. 根据当前的y轴位置 获取起始 U位
 * 5. 根据起始U位和结束U位 来获取 U数
 * 6. 根据起始U位和结束U位 来计算实际高度
 */

export function getHeightByUnum(num, uUnitLength) {
    if (uUnitLength) {
        return num * uUnitLength
    }
    return num * uUnit
}

function calcUnumByHeight(height) {
    if (height % uUnit) {
        console.warn('当前高度不是单位U的整数倍，请注意调整');
    }

    return height / uUnit
}

function getYaxisByStartU(startU) {
    return getHeightByUnum(startU)
}

function getUunitByYaxis(yaxis) {
    return getHeightByUnum(yaxis)
}

function getUuintByStartAndEnd(startU, endU) {
    return endU - startU
}

function getHeightByStratUunitAndEndUunit(startU, endU) {
    const uNum = getUuintByStartAndEnd(startU, endU)
    return getHeightByUnum(uNum)
}




// 生成一个机柜
export function genarateCabinet(proportionValue) {

    /**
     * 机房等比例扩充
     */

    const proportion = proportionValue || 3.0

    function getValueByProportion(value, customProportion) {
        if (customProportion) {
            return value * customProportion
        }

        return value * proportion
    }


    return {
        show: true,
        name: "cabinet",
        uuid: "",
        objType: "emptyCabinet",
        devtype: 'emptyCabinet',
        transparent: false,
        size: { width: 90, depth: 70, height: getHeightByUnum(42) + 4, thick: 2 },
        x: getValueByProportion(-700),
        y: getHeightByUnum(21),
        z: getValueByProportion(-300),
        rotation: [{ direction: "y", degree: 0.5 * Math.PI }],
        style: {
            skin: {
                skin_up: {
                    imgurl: "rack_top.jpg"
                },
                skin_down: { imgurl: "rack_top.jpg" },
                // skin_fore: { imgurl: "rack.jpg" },
                skin_fore: { imgurl: "rack_back.jpg" },
                skin_behind: { imgurl: "rack_back.jpg" },
                skin_left: { imgurl: "rack_back.jpg" },
                skin_right: { imgurl: "rack_back.jpg" },
            },
        },
        doors: {
            doorType: "lr",
            doorname: ["cabinet_door"],
            skins: [
                {
                    skin_fore: {
                        imgurl: "rack_right_door.jpg",
                    },
                    skin_behind: {
                        imgurl: "rack_left_door.jpg",
                    },

                    skin_up: {
                        skinColor: 0x555555,
                    },
                    skin_down: {
                        skinColor: 0x555555,
                    },
                    skin_left: {
                        skinColor: 0x555555,
                    },
                    skin_right: {
                        skinColor: 0x555555,
                    },
                },


            ]
        },
        userData: {
            name: "",
            devtype: 'emptyCabinet',
            alarmInfo: [],
        },
        childrens: [
            {
                show: true,
                uuid: "",
                name: "equipment_server1",
                objType: "cube",
                devtype: 'equipment',
                depth: 65,
                width: 65,
                height: getHeightByUnum(2),
                y: getHeightByUnum(1),
                style: {
                    skin: {
                        skin_up: {
                            imgurl: "rack_inside.png",
                        },
                        skin_down: {
                            imgurl: "rack_inside.png",
                        },
                        skin_fore: {
                            imgurl: "server1.jpg",
                        },
                        skin_behind: {
                            imgurl: "rack_inside.png",
                        },
                        skin_left: {
                            imgurl: "rack_inside.png",
                        },
                        skin_right: {
                            imgurl: "rack_inside.png",
                        },
                    },
                },
                userData: {
                    devid: "01",
                    pointid: "0101",
                    isalarm: false,
                    tipInfo: "设备1信息***",
                    alarmInfo: "",
                    devtype: 'equipment',
                },
            }
        ]
    }
};

// //复制机柜
// const cabinets = [];
// for (var i = 0; i < 3; i++) {
//     for (var j = 0; j < 7; j++) {
//         let obj = JSON.parse(JSON.stringify(cabinet));
//         obj.name = "cabinet" + (i + 1) + "_" + (j + 1);
//         obj.userData.name = "JG-" + (i + 1) + "-" + (j + 1);
//         for (let k = 0; k < obj.childrens.length; k++) {
//             obj.childrens[k].userData.devid =
//                 obj.childrens[k].userData.devid + i + j;
//             obj.childrens[k].userData.pointid =
//                 obj.childrens[k].userData.pointid + i + j;
//         }
//         obj.y = obj.y;
//         obj.x = obj.x + 400 * i;
//         obj.z = obj.z + 105 * j;
//         // if(i==2&&j==5){
//         //     obj.doors.rotation=[{ direction: 'y', degree: 0.5*Math.PI}];
//         // }

//         // obj.rotation=[{ direction: 'y', degree: 1*Math.PI}];
//         cabinets.push(obj);
//     }
// }

export default function (proportionValue, transitionValue) {

    /**
     * 机房等比例扩充
     */

    const proportion = proportionValue || 3.0

    function getValueByProportion(value, customProportion) {
        if (customProportion) {
            return value * customProportion
        }

        return value * proportion
    }


    /**
     * 单个区域的机房位置偏移
     */
    const transition = transitionValue || 1000
    function getPositionByTransition(value, value2) {
        if (value2) {
            return value + value2 + transition
        }

        return value + transition
    }



    return {
        "objects": [
            // 地板
            {
                show: true,
                uuid: "",
                name: "floor",
                objType: "floor",
                devtype: 'floor',
                itCanBeRemove: true, // 是否可拆除
                desc: '地板', // 描述
                width: getValueByProportion(2000),
                depth: getValueByProportion(1600),
                height: getValueByProportion(10, 1.0),
                rotation: [{ direction: "x", degree: 0 }], //旋转 表示x方向0度  arb表示任意参数值[x,y,z,angle]
                x: 0,
                y: 0,
                z: 0,
                style: {
                    skinColor: 0x8ac9e2,
                    skin: {
                        skin_up: {
                            skinColor: 0x98750f,
                            imgurl: "floor2.jpg",
                            // imgurl: "water.jpg",
                            repeatx: true,
                            repeaty: true,
                            width: 128,
                            height: 128,
                        },
                        skin_down: {
                            skinColor: 0x8ac9e2,
                        },
                        skin_fore: {
                            skinColor: 0x8ac9e2,
                        },
                    },
                },
                userData: {
                    devtype: 'floor',
                }
            },
            //墙体
            {
                show: true,
                uuid: "",
                name: "wall",
                objType: "wall",
                devtype: "wall",
                itCanBeRemove: true, // 是否可拆除
                desc: '墙体', // 描述
                depth: getValueByProportion(20),
                length: getValueByProportion(100),
                height: getValueByProportion(240, 1.0),
                userData: {
                    devtype: 'wall',
                }
                ,
                wallData: [
                    {
                        //wall5
                        uuid: "",
                        name: "wall5",
                        itCanBeRemove: true, // 是否可拆除
                        desc: '左边带玻璃的墙', // 描述
                        depth: getValueByProportion(20),
                        height: getValueByProportion(240, 1.0),
                        skin: {
                            skin_up: {
                                skinColor: 0xdddddd,
                            },
                            skin_down: {
                                skinColor: 0xdddddd,
                            },
                            skin_fore: {
                                skinColor: 0xdeeeee,
                            },
                            skin_behind: {
                                skinColor: 0xb0cee0,
                            },
                            skin_left: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                            skin_right: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                        },
                        startDot: {
                            x: getValueByProportion(-990),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(-800),
                        },
                        endDot: {
                            x: getValueByProportion(-990),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(800),
                        },
                        childrens: [
                            {
                                op: "-",
                                show: true,
                                uuid: "",
                                name: "windowHole",
                                objType: "windowHole",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '左边墙体的挖的洞', // 描述
                                depth: getValueByProportion(20),
                                height: getValueByProportion(160, 1.0),
                                startDot: {
                                    x: getValueByProportion(-990),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(-750),
                                },
                                endDot: {
                                    x: getValueByProportion(-990),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(750),
                                },
                            },
                            {
                                show: true,
                                uuid: "",
                                name: "windowGlasses",
                                objType: "glasses",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '左边墙体的玻璃', // 描述
                                depth: getValueByProportion(5),
                                height: getValueByProportion(160, 1.0),
                                skin: {
                                    skin_fore: {
                                        imgurl: "glass.png",
                                        transparent: true,
                                        opacity: 0.25,
                                        repeatx: true,
                                        repeaty: true,
                                    },
                                    skin_behind: {
                                        imgurl: "glass.png",
                                        transparent: true,
                                        opacity: 0.25,
                                        repeatx: true,
                                        repeaty: true,
                                    },
                                },
                                rotation: [{ direction: "y", degree: 0.5 * Math.PI }],
                                startDot: {
                                    x: getValueByProportion(240),
                                    y: getValueByProportion(50, 1.0),
                                    z: getValueByProportion(0),
                                },
                                endDot: {
                                    x: getValueByProportion(240 + 1500),
                                    y: getValueByProportion(50 + 160, 1.0),
                                    z: getValueByProportion(0),
                                },
                            },
                        ],
                    },
                    {
                        //wall6
                        uuid: "",
                        name: "wall6",
                        itCanBeRemove: true, // 是否可拆除
                        desc: '右边带玻璃的墙', // 描述
                        depth: getValueByProportion(20),
                        height: getValueByProportion(240, 1.0),
                        skin: {
                            skin_up: {
                                skinColor: 0xdddddd,
                            },
                            skin_down: {
                                skinColor: 0xdddddd,
                            },
                            skin_fore: {
                                skinColor: 0xdeeeee,
                            },
                            skin_behind: {
                                skinColor: 0xb0cee0,
                            },
                            skin_left: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                            skin_right: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                        },
                        startDot: {
                            x: getValueByProportion(990),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(-800),
                        },
                        endDot: {
                            x: getValueByProportion(990),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(800),
                        },
                        childrens: [
                            {
                                op: "-",
                                show: true,
                                uuid: "",
                                name: "windowHole",
                                objType: "windowHole",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '右边墙体的挖的洞', // 描述
                                depth: getValueByProportion(20),
                                height: getValueByProportion(160, 1.0),
                                startDot: {
                                    x: getValueByProportion(990),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(-750),
                                },
                                endDot: {
                                    x: getValueByProportion(990),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(750),
                                },
                            },

                            {
                                show: true,
                                uuid: "",
                                name: "windowGlasses",
                                objType: "glasses",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '右边边墙体的玻璃', // 描述
                                depth: getValueByProportion(5),
                                height: getValueByProportion(160, 1.0),
                                skin: {
                                    skin_fore: {
                                        imgurl: "glass.png",
                                        transparent: true,
                                        opacity: 0.25,
                                        repeatx: true,
                                        repeaty: true,
                                    },
                                    skin_behind: {
                                        imgurl: "glass.png",
                                        transparent: true,
                                        opacity: 0.25,
                                        repeatx: true,
                                        repeaty: true,
                                    },
                                },
                                rotation: [{ direction: "y", degree: 0.5 * Math.PI }],
                                startDot: {
                                    x: getValueByProportion(-240),
                                    y: getValueByProportion(50, 1.0),
                                    z: getValueByProportion(0),
                                },
                                endDot: {
                                    x: getValueByProportion(-(240 + 1500)),
                                    y: getValueByProportion(50 + 160, 1.0),
                                    z: getValueByProportion(0),
                                },
                            },
                        ],
                    },
                ],
                style: {
                    skinColor: 0x8ac9e2,
                },
            },
            //墙体
            {
                show: true,
                uuid: "",
                name: "wall",
                objType: "wall",
                devtype: 'wall',
                itCanBeRemove: true, // 是否可拆除
                desc: '墙体', // 描述
                depth: getValueByProportion(20),
                width: getValueByProportion(100), //根据实际的宽度来的
                height: getValueByProportion(240, 1.0),
                style: {
                    skinColor: 0xb0cee0,
                },
                userData: {
                    devtype: 'wall',
                },
                wallData: [
                    {
                        //前面墙
                        uuid: "",
                        name: "wall1",
                        itCanBeRemove: true, // 是否可拆除
                        desc: '内部的墙体 - 前面墙', // 描述
                        skin: {
                            skin_behind: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                            skin_fore: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                        },
                        startDot: {
                            x: getValueByProportion(-770),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(550),
                        },
                        endDot: {
                            x: getValueByProportion(770),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(550),
                        },
                        childrens: [
                            {
                                op: "-",
                                show: true,
                                uuid: "",
                                name: "doorhole",
                                objType: "doorhole",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 门洞', // 描述
                                depth: getValueByProportion(20),
                                height: getValueByProportion(220, 1.0),
                                startDot: {
                                    x: getValueByProportion(190, 1.0),
                                    y: getValueByProportion(110, 1.0),
                                    z: getValueByProportion(550),
                                },
                                endDot: {
                                    x: getValueByProportion(410, 1.0),
                                    y: getValueByProportion(110, 1.0),
                                    z: getValueByProportion(550),
                                },
                            },
                            {
                                op: "-",
                                show: true,
                                uuid: "",
                                name: "windowHole",
                                objType: "windowHole",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 展窗的洞', // 描述
                                depth: getValueByProportion(20),
                                height: getValueByProportion(160, 1.0),
                                startDot: {
                                    x: getValueByProportion(-450),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(550)
                                },
                                endDot: {
                                    x: getValueByProportion(50),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(550)
                                },
                            },
                            // {
                            //     show: true,
                            //     name: "windowCaseBottom",
                            //     itCanBeRemove: true, // 是否可拆除
                            //     desc: '内部的墙体 - 前面墙 - 下方的门框', // 描述
                            //     uuid: "",
                            //     objType: "cube",
                            //     depth: 20,
                            //     height: 10,
                            //     startDot: {
                            //         x: -450,
                            //         y: 50,
                            //         z: 550
                            //     },
                            //     endDot: {
                            //         x: 50,
                            //         y: 50,
                            //         z: 550
                            //     },
                            //     skinColor: 0xffffff,
                            // },
                            {
                                show: true,
                                uuid: "",
                                name: "doorCaseRight",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 右边的门框', // 描述
                                objType: "cube",
                                depth: getValueByProportion(24),
                                height: getValueByProportion(220, 1.0),
                                startDot: {
                                    x: getValueByProportion(405, 1.0),
                                    y: getValueByProportion(110, 1.0),
                                    z: getValueByProportion(550)
                                },
                                endDot: {
                                    x: getValueByProportion(410, 1.0),
                                    y: getValueByProportion(110, 1.0),
                                    z: getValueByProportion(550)
                                },
                                skinColor: 0xffffff,
                            },
                            {
                                show: true,
                                name: "doorCaseLeft",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 左边的门框', // 描述
                                uuid: "",
                                objType: "cube",
                                depth: getValueByProportion(24),
                                height: getValueByProportion(220, 1.0),
                                startDot: {
                                    x: getValueByProportion(190, 1.0),
                                    y: getValueByProportion(110, 1.0),
                                    z: getValueByProportion(550)
                                },
                                endDot: {
                                    x: getValueByProportion(195, 1.0),
                                    y: getValueByProportion(110, 1.0),
                                    z: getValueByProportion(550)
                                },
                                skinColor: 0xffffff,
                            },
                            {
                                show: true,
                                name: "doorCaseTop",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 上面的门框', // 描述
                                uuid: "",
                                objType: "cube",
                                depth: getValueByProportion(24),
                                height: getValueByProportion(5, 1.0),
                                startDot: {
                                    x: getValueByProportion(190, 1.0),
                                    y: getValueByProportion(220, 1.0),
                                    z: getValueByProportion(550)
                                },
                                endDot: {
                                    x: getValueByProportion(410, 1.0),
                                    y: getValueByProportion(220, 1.0),
                                    z: getValueByProportion(550)
                                },
                                skinColor: 0xffffff,
                            },
                            {
                                show: true,
                                name: "doorCaseBottom",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 下面的门框', // 描述
                                uuid: "",
                                objType: "cube",
                                depth: getValueByProportion(24),
                                height: getValueByProportion(5, 1.0),
                                startDot: {
                                    x: getValueByProportion(195, 1.0),
                                    y: getValueByProportion(5, 1.0),
                                    z: getValueByProportion(550)
                                },
                                endDot: {
                                    x: getValueByProportion(405, 1.0),
                                    y: getValueByProportion(5, 1.0),
                                    z: getValueByProportion(550)
                                },
                                skinColor: 0xffffff,
                            },

                            {
                                show: true,
                                name: "doorControl",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 门旁边的控制器', // 描述
                                uuid: "",
                                objType: "cube",
                                depth: getValueByProportion(10),
                                height: getValueByProportion(40, 1.0),
                                startDot: {
                                    x: getValueByProportion(160),
                                    y: getValueByProportion(140, 1.0),
                                    z: getValueByProportion(560),
                                },
                                endDot: {
                                    x: getValueByProportion(180),
                                    y: getValueByProportion(140, 1.0),
                                    z: getValueByProportion(560),
                                },
                                skinColor: 0x333333,
                                skin: {
                                    skin_fore: {
                                        skinColor: 0x333333,
                                        width: 20,
                                        height: 40,
                                        imgurl: "doorControl.jpg",
                                    },
                                },
                            },
                            {
                                show: true,
                                name: "doorLeft",
                                uuid: "",
                                objType: "cube",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 左边的门', // 描述
                                depth: getValueByProportion(4),
                                height: getValueByProportion(210, 1.0),
                                skinColor: 0x51443e,
                                skin: {
                                    skin_fore: {
                                        imgurl: "door_left.png",
                                        transparent: true,
                                    },
                                    skin_behind: {
                                        imgurl: "door_right.png",
                                        transparent: true,
                                    },
                                },
                                startDot: {
                                    x: getValueByProportion(195, 1.0),
                                    y: getValueByProportion(112, 1.0),
                                    z: getValueByProportion(550),
                                },
                                endDot: {
                                    x: getValueByProportion(300, 1.0),
                                    y: getValueByProportion(112, 1.0),
                                    z: getValueByProportion(550),
                                },
                            },
                            {
                                show: true,
                                name: "doorRight",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 右边的门', // 描述
                                uuid: "",
                                objType: "cube",
                                depth: getValueByProportion(4),
                                height: getValueByProportion(210, 1.0),
                                skinColor: 0x51443e,
                                skin: {
                                    skin_fore: {
                                        imgurl: "door_right.png",
                                        opacity: 1,
                                        transparent: true,
                                    },
                                    skin_behind: {
                                        imgurl: "door_left.png",
                                        opacity: 1,
                                        transparent: true,
                                    },
                                },
                                startDot: {
                                    x: getValueByProportion(300, 1.0),
                                    y: getValueByProportion(112, 1.0),
                                    z: getValueByProportion(550),
                                },
                                endDot: {
                                    x: getValueByProportion(405, 1.0),
                                    y: getValueByProportion(112, 1.0),
                                    z: getValueByProportion(550),
                                },
                            },
                            {
                                show: true,
                                uuid: "",
                                name: "windowGlasses",
                                objType: "glasses",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 前面墙 - 墙上的玻璃', // 描述
                                depth: getValueByProportion(5),
                                height: getValueByProportion(160, 1.0),
                                skin: {
                                    skin_fore: {
                                        imgurl: "glass.png",
                                        transparent: true,
                                        opacity: 0.25,
                                        repeatx: true,
                                        repeaty: true,
                                    },
                                    skin_behind: {
                                        imgurl: "glass.png",
                                        transparent: true,
                                        opacity: 0.25,
                                        repeatx: true,
                                        repeaty: true,
                                    },
                                },
                                startDot: {
                                    x: getValueByProportion(-450),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(550),
                                },
                                endDot: {
                                    x: getValueByProportion(50),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(550),
                                },
                            },
                        ],
                    },
                    {
                        //后面墙
                        uuid: "",
                        name: "wall2",
                        itCanBeRemove: true, // 是否可拆除
                        desc: '内部的墙体 - 后面墙', // 描述
                        skin: {
                            skin_fore: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                            skin_behind: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                        },
                        startDot: {
                            x: getValueByProportion(-770),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(-450),
                        },
                        endDot: {
                            x: getValueByProportion(770),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(-450),
                        },
                        childrens: [
                            {
                                show: true,
                                uuid: "",
                                name: "windowMessage",
                                objType: "cube",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 后面墙 - 墙上的海报', // 描述
                                depth: getValueByProportion(2),
                                height: getValueByProportion(150, 1.0),
                                skinColor: 0xffffff,
                                skin: {
                                    skin_fore: {
                                        imgurl: "message.jpg",
                                    },
                                },
                                startDot: {
                                    x: getValueByProportion(450, 1.0),
                                    y: getValueByProportion(150, 1.0),
                                    z: getValueByProportion(-440),
                                },
                                endDot: {
                                    x: getValueByProportion(530, 1.0),
                                    y: getValueByProportion(150, 1.0),
                                    z: getValueByProportion(-440),
                                },
                            },
                        ],
                    },
                    {
                        //左面墙
                        uuid: "",
                        name: "wall3",
                        itCanBeRemove: true, // 是否可拆除
                        desc: '内部的墙体 - 左面墙', // 描述
                        skin: {
                            skin_right: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                            skin_left: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                        },
                        startDot: {
                            x: getValueByProportion(-760),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(-460),
                        },
                        endDot: {
                            x: getValueByProportion(-760),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(1020 - 460),
                        },
                    },
                    {
                        //右面墙
                        uuid: "",
                        name: "wall4",
                        itCanBeRemove: true, // 是否可拆除
                        desc: '内部的墙体 - 右面墙', // 描述
                        skin: {
                            skin_left: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                            skin_right: {
                                skinColor: 0xb0cee0,
                                imgurl: "wall2.jpg",
                                repeatx: true,
                                repeaty: true,
                                width: 128,
                                height: 128,
                            },
                        },
                        startDot: {
                            x: getValueByProportion(760),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(-460),
                        },
                        endDot: {
                            x: getValueByProportion(760),
                            y: getValueByProportion(120, 1.0),
                            z: getValueByProportion(1020 - 460),
                        },
                        childrens: [
                            {
                                show: true,
                                uuid: "",
                                name: "windowTV",
                                itCanBeRemove: true, // 是否可拆除
                                desc: '内部的墙体 - 右面墙 - 电视机', // 描述
                                objType: "cube",
                                depth: getValueByProportion(10),
                                height: getValueByProportion(150, 1.0),
                                skinColor: 0x111111,
                                skin: {
                                    skin_left: {
                                        imgurl: "tv.jpg",
                                    },
                                },
                                startDot: {
                                    x: getValueByProportion(750),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(-220, 1.0),
                                },
                                endDot: {
                                    x: getValueByProportion(750),
                                    y: getValueByProportion(130, 1.0),
                                    z: getValueByProportion(320, 1.0),
                                },
                            },
                        ],
                    },
                ],
            },

            // 机柜集合
            // ...cabinets,
        ],
        "camera": {
            "position": {
                "x": 9.679360888145338,
                "y": 2.768495057671754,
                "z": -79.6000208540898
            }
        }
    }
}


