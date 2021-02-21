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




export let cabinet = {
    show: true,
    name: "cabinet",
    uuid: "",
    objType: "emptyCabinet",
    devtype: 'emptyCabinet',
    transparent: false,
    size: { width: 90, depth: 70, height: getHeightByUnum(42) + 4, thick: 2 },
    x: -700,
    y: getHeightByUnum(21),
    z: -270,
    rotation: [{ direction: "y", degree: 0.5 * Math.PI }],
    style: {
        skin: {
            skin_up: { imgurl: "rack_top.jpg" },
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
    ],
};
//复制机柜
const cabinets = [];
for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 7; j++) {
        let obj = JSON.parse(JSON.stringify(cabinet));
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

export default {
    "objects": [
        // 地板
        {
            show: true,
            uuid: "",
            name: "floor",
            objType: "floor",
            devtype: 'floor',
            width: 2000,
            depth: 1600,
            height: 10,
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
            depth: 20,
            length: 100,
            height: 240,
            userData: {
                devtype: 'wall',
            }
            ,
            wallData: [
                {
                    //wall5
                    uuid: "",
                    name: "wall5",
                    depth: 20,
                    height: 240,
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
                        x: -990,
                        y: 120,
                        z: -800,
                    },
                    endDot: {
                        x: -990,
                        y: 120,
                        z: 800,
                    },
                    childrens: [
                        {
                            op: "-",
                            show: true,
                            uuid: "",
                            name: "windowHole",
                            objType: "windowHole",
                            depth: 20,
                            height: 160,
                            startDot: {
                                x: -990,
                                y: 130,
                                z: -750,
                            },
                            endDot: {
                                x: -990,
                                y: 130,
                                z: 750,
                            },
                        },
                        {
                            show: true,
                            uuid: "",
                            name: "windowGlasses",
                            objType: "glasses",
                            depth: 5,
                            height: 160,
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
                                x: 240,
                                y: 50,
                                z: 0,
                            },
                            endDot: {
                                x: 240 + 1500,
                                y: 50 + 160,
                                z: 0,
                            },
                        },
                        {
                            show: true,
                            uuid: "",
                            name: "windowGlasses",
                            objType: "glasses",
                            depth: 5,
                            height: 160,
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
                                x: -240,
                                y: 50,
                                z: 0,
                            },
                            endDot: {
                                x: -(240 + 1500),
                                y: 50 + 160,
                                z: 0,
                            },
                        },
                    ],
                },
                {
                    //wall6
                    uuid: "",
                    name: "wall6",
                    depth: 20,
                    height: 240,
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
                        x: 990,
                        y: 120,
                        z: -800,
                    },
                    endDot: {
                        x: 990,
                        y: 120,
                        z: 800,
                    },
                    childrens: [
                        {
                            op: "-",
                            show: true,
                            uuid: "",
                            name: "windowHole",
                            objType: "windowHole",
                            depth: 20,
                            height: 160,
                            startDot: {
                                x: 990,
                                y: 130,
                                z: -750,
                            },
                            endDot: {
                                x: 990,
                                y: 130,
                                z: 750,
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
            depth: 20,
            width: 100, //根据实际的宽度来的
            height: 240,
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
                        x: -770,
                        y: 120,
                        z: 550,
                    },
                    endDot: {
                        x: 770,
                        y: 120,
                        z: 550,
                    },
                    childrens: [
                        {
                            op: "-",
                            show: true,
                            uuid: "",
                            name: "doorhole",
                            objType: "doorhole",
                            depth: 20,
                            height: 220,
                            startDot: {
                                x: 190,
                                y: 110,
                                z: 550,
                            },
                            endDot: {
                                x: 410,
                                y: 110,
                                z: 550,
                            },
                        },
                        {
                            op: "-",
                            show: true,
                            uuid: "",
                            name: "windowHole",
                            objType: "windowHole",
                            depth: 20,
                            height: 160,
                            startDot: {
                                x: -450,
                                y: 130,
                                z: 550
                            },
                            endDot: {
                                x: 50,
                                y: 130,
                                z: 550
                            },
                        },
                        {
                            show: true,
                            name: "windowCaseBottom",
                            uuid: "",
                            objType: "cube",
                            depth: 30,
                            height: 10,
                            startDot: {
                                x: -450,
                                y: 50,
                                z: 550
                            },
                            endDot: {
                                x: 50,
                                y: 50,
                                z: 550
                            },
                            skinColor: 0xc0dee0,
                        },
                        {
                            show: true,
                            uuid: "",
                            name: "doorCaseRight",
                            objType: "cube",
                            depth: 24,
                            height: 220,
                            startDot: {
                                x: 405,
                                y: 110,
                                z: 550
                            },
                            endDot: {
                                x: 410,
                                y: 110,
                                z: 550
                            },
                            skinColor: 0xc0dee0,
                        },
                        {
                            show: true,
                            name: "doorCaseLeft",
                            uuid: "",
                            objType: "cube",
                            depth: 24,
                            height: 220,
                            startDot: {
                                x: 190,
                                y: 110,
                                z: 550
                            },
                            endDot: {
                                x: 195,
                                y: 110,
                                z: 550
                            },
                            skinColor: 0xc0dee0,
                        },
                        {
                            show: true,
                            name: "doorCaseTop",
                            uuid: "",
                            objType: "cube",
                            depth: 24,
                            height: 5,
                            startDot: {
                                x: 190,
                                y: 220,
                                z: 550
                            },
                            endDot: {
                                x: 410,
                                y: 220,
                                z: 550
                            },
                            skinColor: 0xc0dee0,
                        },
                        {
                            show: true,
                            name: "doorCaseBottom",
                            uuid: "",
                            objType: "cube",
                            depth: 24,
                            height: 5,
                            startDot: {
                                x: 195,
                                y: 5,
                                z: 550
                            },
                            endDot: {
                                x: 405,
                                y: 5,
                                z: 550
                            },
                            skinColor: 0x5f7071,
                        },
                        {
                            show: true,
                            name: "doorControl",
                            uuid: "",
                            objType: "cube",
                            depth: 10,
                            height: 40,
                            startDot: {
                                x: 160,
                                y: 140,
                                z: 560,
                            },
                            endDot: {
                                x: 180,
                                y: 140,
                                z: 560,
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
                            depth: 4,
                            height: 210,
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
                                x: 195,
                                y: 112,
                                z: 550,
                            },
                            endDot: {
                                x: 300,
                                y: 112,
                                z: 550,
                            },
                        },
                        {
                            show: true,
                            name: "doorRight",
                            uuid: "",
                            objType: "cube",
                            depth: 4,
                            height: 210,
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
                                x: 300,
                                y: 112,
                                z: 550,
                            },
                            endDot: {
                                x: 405,
                                y: 112,
                                z: 550,
                            },
                        },
                        {
                            show: true,
                            uuid: "",
                            name: "windowGlasses",
                            objType: "glasses",
                            depth: 5,
                            height: 160,
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
                                x: -450,
                                y: 130,
                                z: 550,
                            },
                            endDot: {
                                x: 50,
                                y: 130,
                                z: 550,
                            },
                        },
                    ],
                },
                {
                    //后面墙
                    uuid: "",
                    name: "wall2",
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
                        x: -770,
                        y: 120,
                        z: -450,
                    },
                    endDot: {
                        x: 770,
                        y: 120,
                        z: -450,
                    },
                    childrens: [
                        {
                            show: true,
                            uuid: "",
                            name: "windowMessage",
                            objType: "cube",
                            depth: 2,
                            height: 150,
                            skinColor: 0xffffff,
                            skin: {
                                skin_fore: {
                                    imgurl: "message.jpg",
                                },
                            },
                            startDot: {
                                x: 450,
                                y: 150,
                                z: -440,
                            },
                            endDot: {
                                x: 530,
                                y: 150,
                                z: -440,
                            },
                        },
                    ],
                },
                {
                    //左面墙
                    uuid: "",
                    name: "wall3",
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
                        x: -760,
                        y: 120,
                        z: -460,
                    },
                    endDot: {
                        x: -760,
                        y: 120,
                        z: 1020 - 460,
                    },
                },
                {
                    //右面墙
                    uuid: "",
                    name: "wall4",
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
                        x: 760,
                        y: 120,
                        z: -460,
                    },
                    endDot: {
                        x: 760,
                        y: 120,
                        z: 1020 - 460,
                    },
                    childrens: [
                        {
                            show: true,
                            uuid: "",
                            name: "windowTV",
                            objType: "cube",
                            depth: 10,
                            height: 150,
                            skinColor: 0x111111,
                            skin: {
                                skin_left: {
                                    imgurl: "tv.jpg",
                                },
                            },
                            startDot: {
                                x: 750,
                                y: 130,
                                z: -220,
                            },
                            endDot: {
                                x: 750,
                                y: 130,
                                z: 320,
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