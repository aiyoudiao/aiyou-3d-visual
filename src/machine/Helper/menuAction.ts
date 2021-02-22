import { BoxHelper, CircleBufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, TextureLoader, Vector3 } from "three";
import { addBox, addLine, addLinePath, addNurbs, addSprite, addTemPlane, dynamicPath, stopDynamicPath } from "./action";
import { BASE_PATH, cabinetSpaceList, camera, dataSet, makeWaterList, orbitControls, scene } from "./initThree"
import { addIdentification, delSenceObject, makeDynamicTextSprite, setMaterialColor } from "./util";


let beforeServerDevice

/**
 * 页面中菜单的行为：
 * "场景复位"
 * "管道流速管理"
 * "温度监控"
 * "机柜利用率"
 * "空间利用率"
 * "空调风向"
 * "烟雾监测"
 * "漏水监测"
 * "防盗监测"
 * "供电电缆"
 * "告警巡航"
 * "报警管理"
 * "机柜加标识"
 */

/**
 * 场景复位
 */
export const senceReset = () => {
    camera.position.set(0, 1000, 1600)
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt(new Vector3(0, 0, 0));
    orbitControls.reset()
    orbitControls.update()
}

/**
 * "机柜利用率"
 * @param show 
 */
export const showCabinetUsage = (show) => {
    var vcolor = [0xf8aba6, 0xfaa755, 0x78a355, 0x45b97c, 0x7fb80e, 0xd93a49];
    dataSet.forEach((_obj, index) => {
        if (_obj.userData.devtype != null || typeof (_obj.userData.devtype) != 'undefined') {
            switch (_obj.userData.devtype) {
                case 'emptyCabinet': {
                    var color = vcolor[Math.floor(Math.random() * 6)];
                    for (var i = 0; i < _obj.children.length; i++) {
                        var mesh = _obj.children[i];

                        /**
                         * 解决 机柜开关门之后再查看机柜利用率时，不会渲染透明的机柜的问题
                         */
                        if (!(mesh instanceof Mesh)) {
                            mesh = mesh.children[0]
                        }

                        /**
                         * NOTE: 逻辑说明
                         * 1. 缓存机柜原来的材质，替换机柜原来的材质，统统都设置透明度为0.6。
                         * 2. 同时记录渲染层级。
                         * 3. 如果要查看机柜利用率，就直接使用透明材质将机柜原本的材质替换掉
                         * 4. 如果要还原机柜原始模样，就将缓存的材质数据返回回去。
                         */
                        if (show) {
                            mesh.userData.usagematerial = [];
                            var vNewMaterialList = [];
                            for (var m = 0; m < mesh.material.length; m++) {
                                //,shininess: 100
                                vNewMaterialList[m] = new MeshPhongMaterial({ color: color, opacity: 0.6, transparent: true, wireframe: false });
                                mesh.userData.usagematerial[m] = mesh.material[m].clone();
                            }
                            mesh.userData.renderOrder = mesh.renderOrder

                            mesh.material = vNewMaterialList;

                            /**
                             * 解决 渲染后光照导致的盒子颜色渐变的问题
                             */
                            mesh.renderOrder = 100;
                        } else {
                            /**
                             * 解决 渲染后光照导致的盒子颜色渐变的问题
                             */
                            mesh.renderOrder = mesh.userData.renderOrder
                            mesh.userData.renderOrder = undefined

                            mesh.material = mesh.userData.usagematerial;
                            mesh.userData.usagematerial = [];
                        }
                    }
                } break;
            }
        }
    })
}

/**
 * "空间利用率"
 * @param show 
 */
export const showcabinetSpace = (show) => {
    if (show) {
        // cabinetSpaceList.length = 0
        var vcolor = [0xf8aba6, 0xfaa755, 0x78a355, 0x45b97c, 0x7fb80e, 0xd93a49];
        dataSet.forEach((_obj, index) => {
            if (_obj.userData.devtype != null || typeof (_obj.userData.devtype) != 'undefined') {
                switch (_obj.userData.devtype) {
                    case 'emptyCabinet': {
                        var color = vcolor[Math.floor(Math.random() * 6)];
                        var box = new BoxHelper(_obj, color);
                        box.renderOrder = 100;
                        scene.add(box);
                        cabinetSpaceList.push(box);

                        var vrandomi = Math.floor(Math.random() * 6);
                        var vPosition = _obj.position.clone();
                        vPosition.add(_obj.children[0].position);
                        var vw = 70, vh = 66, vl = 200;
                        /**
                         * 这里可以根据 U位来计算机柜占用率的高度
                         */
                        // var vMinx = 5;
                        // var vMaxx = 200;
                        // var random = Math.random()
                        // var vrandomh = (Math.random() * (vMaxx - vMinx + 1) + vMinx);
                        const { cabinetRate, cabinetTotalU, uBitLength } = _obj.userData
                        const vrandomh = cabinetTotalU * cabinetRate * uBitLength

                        // var vrandomh = 20
                        var vinfo = {
                            name: 'vtname',
                            transparent: false,
                            opacity: 0.8,
                            blending: false,
                            wireframe: false,
                            tween: 2500,
                            color: vcolor[vrandomi],
                            size: { l: vh - 0.5, w: vw - 0.5, h: vrandomh },
                            position: { x: vPosition.x, y: 1, z: vPosition.z },
                            rotation: { x: 0.0, y: 0.0, z: 0.0 },
                        };

                        var cabinetBox = addBox(vinfo);
                        cabinetSpaceList.push(cabinetBox);
                    }
                    case 'equipment': {
                        _obj.visible = false;
                        break;
                    }
                }
            }
        });
    } else {
        for (var i = 0; i < cabinetSpaceList.length; i++) {
            scene.remove(cabinetSpaceList[i]);
        }
        dataSet.forEach((_obj, index) => {
            if (_obj.userData.devtype != null || typeof (_obj.userData.devtype) != 'undefined') {
                switch (_obj.userData.devtype) {
                    case 'emptyCabinet':
                    case 'equipment': {
                        _obj.visible = true;
                        break;
                    }
                }
            }
        });
    }
}

/**
 * "管道流速管理"
 */
export const showConnection = (show, serverDeviceList) => {
    var vlinename = 'line0001';
    var vtxtflag = 'netLivedata';
    if (show) {
        var vinfo = {
            name: vlinename,
            type: 'beeline',
            imgurl: BASE_PATH + 'UV_Grid_Sm.jpg',
            radiu: 1.0,
            speed: 300,
            scene: true,
            visible: true,
            /**
             * 管道流速是通过一系列点来实现的
             */
            path: [
                {
                    x: -150,
                    y: 145,
                    z: -430
                },
                {
                    x: -100,
                    y: 145,
                    z: -430
                },
                {
                    x: -100,
                    y: 210,
                    z: -430
                },
                {
                    x: -130,
                    y: 210,
                    z: -430
                },
                {
                    x: -130,
                    y: 240,
                    z: -430
                },
                {
                    x: -130,
                    y: 240,
                    z: 250
                },
                {
                    x: 70,
                    y: 240,
                    z: 250
                },
                {
                    x: 70,
                    y: 240,
                    z: 20
                },
                {
                    x: 70,
                    y: 210,
                    z: 20
                },
                {
                    x: 100,
                    y: 210,
                    z: 20
                },
                {
                    x: 100,
                    y: 160,
                    z: 20
                },
            ]
        };
        addLinePath(vinfo);

        var vparam = {
            name: vtxtflag,
            position: { x: 10, y: 50, z: -10 },
            size: { x: 256, y: 128, z: 60 },
            color: { r: 244, g: 120, b: 32, a: 0.4 },
            imgurl: '',// BASE_PATH + 'textmark.jpg',
            rows: [
                {
                    name: 'item1',
                    fontface: 'Arial',
                    fontsize: 20,
                    borderThickness: 32,
                    textColor: { r: 255, g: 255, b: 255, a: 1.0 },
                    text: '当前网络流量',
                    size: { x: 20, y: 20 },
                    position: { x: 10, y: 30, z: 0 },
                },
                {
                    name: 'item2',
                    fontface: 'Arial',
                    fontsize: 60,
                    borderThickness: 14,
                    textColor: { r: 255, g: 255, b: 255, a: 1.0 },
                    text: '170.8',
                    size: { x: 20, y: 20 },
                    position: { x: 10, y: 80, z: 0 },
                },
                {
                    name: 'item3',
                    fontface: 'Arial',
                    fontsize: 24,
                    borderThickness: 14,
                    textColor: { r: 255, g: 255, b: 255, a: 1.0 },
                    text: 'Mb/s',
                    size: { x: 20, y: 20 },
                    position: { x: 190, y: 90, z: 0 },
                },
            ]
        };
        var vparam2 = {
            name: vtxtflag,
            position: { x: -110, y: 240, z: 0 },
            size: { x: 256, y: 128, z: 60 },
            color: { r: 34, g: 76, b: 143, a: 0.8 },
            imgurl: '',
            rows: [
                {
                    name: 'item1',
                    fontface: 'Arial',
                    fontsize: 20,
                    borderThickness: 32,
                    textColor: { r: 255, g: 255, b: 255, a: 1.0 },
                    text: '当前上行带宽',
                    size: { x: 20, y: 20 },
                    position: { x: 10, y: 30, z: 0 },
                },
                {
                    name: 'item2',
                    fontface: 'Arial',
                    fontsize: 60,
                    borderThickness: 14,
                    textColor: { r: 255, g: 255, b: 255, a: 1.0 },
                    text: '345.8',
                    size: { x: 20, y: 20 },
                    position: { x: 10, y: 80, z: 0 },
                },
                {
                    name: 'item3',
                    fontface: 'Arial',
                    fontsize: 24,
                    borderThickness: 14,
                    textColor: { r: 255, g: 255, b: 255, a: 1.0 },
                    text: 'Mb/s',
                    size: { x: 20, y: 20 },
                    position: { x: 190, y: 90, z: 0 },
                },
            ]
        };

        const aIndex = Math.floor(Math.random() * serverDeviceList.length)
        const bIndex = Math.floor(Math.random() * serverDeviceList.length)

        makeDynamicTextSprite(serverDeviceList[aIndex], vparam2);
        makeDynamicTextSprite(serverDeviceList[bIndex], vparam);
        // makeDynamicTextSprite("equipment_card_23", vparam2);
        // makeDynamicTextSprite("equipment_card_52", vparam);
    } else {
        delSenceObject(vtxtflag, true);
        delSenceObject(vlinename, false);
    }
}

/**
 * "温度监控"
 * @param show 
 */
export const showTemperature = (show) => {
    var vtname = 'temperature2001';
    if (show) {
        var vinfo = {
            name: vtname,
            width: 1300,
            height: 220,
            pic: BASE_PATH + 'temp1.jpg',
            transparent: true,
            opacity: 1,
            blending: false,
            color: { r: 255, g: 255, b: 255, a: 1.0 },
            position: { x: -50, y: 120, z: 500 },
            rotation: { x: 0.0, y: 0.0, z: 0.0 },
        };
        addTemPlane(vinfo);
    } else {
        delSenceObject(vtname, false);
    }
}

/**
 * "空调风向"
 * @param show 
 */
export const showAir = (show) => {
    var vlinename = 'nurbs1001';
    if (show) {
        var vinfo = {
            name: vlinename,
            type: 'nurbs',
            position: { x: -90, y: 200, z: -430 },
            size: { x: 20, y: 20 },
            color: { r: 255, g: 255, b: 255, a: 1.0 },
            imgurl: BASE_PATH + '/arrow.png',
        };
        addNurbs(vinfo);
    } else {
        delSenceObject(vlinename, false);
    }
}

/**
 * "烟雾监测"
 * @param show 
 * @param cabinetList 
 */
export const showSmoke = (show, cabinetList?) => {

    var vlinename = 'somke001';
    var vlinename2 = 'somke002';
    // const sIndex = Math.floor(Math.random() * cabinetList.length)
    // const sIndex2 = Math.floor(Math.random() * cabinetList.length)

    if (show) {
        var vinfo = {
            name: vlinename,
            type: 'nurbs',
            position: { x: -320, y: 350, z: -280, w: 3 },
            size: { x: 50, y: 300, z: 50 },
            number: 250,
            color: 0xd71345,
            imgurl: BASE_PATH + 'smoking.png',
        };
        addSprite(vinfo);

        var vinfo2 = {
            name: vlinename2,
            type: 'nurbs',
            position: { x: -690, y: 370, z: -15, w: 1.5 },
            size: { x: 150, y: 300, z: 150 },
            number: 550,
            color: 0x8DEEEE,
            imgurl: BASE_PATH + 'smoking.png',
        };
        addSprite(vinfo2);
    } else {
        delSenceObject(vlinename, true);
        delSenceObject(vlinename2, true);
    }
}

/**
 * "漏水监测"
 * @param show 
 */
export const showWater = (show) => {
    if (show) {
        makeWaterList.length = 0;
        let parameters: any = {
            URL: BASE_PATH + 'water.jpg',
            position: { x: 0, y: 10, z: 0 },
            rotation: { x: 1.5707963, y: 0, z: 0 },
            scale: { x: 30, y: 30, z: 30 }
        };
        parameters.transparent = parameters.transparent || true;
        parameters.opacity = parameters.opacity || 0.56;
        parameters.color = parameters.color || 0xB8F3F4;
        var loader = new TextureLoader();
        var texture = loader.load(parameters.URL);
        var sphereGeometry = new CircleBufferGeometry(5, 32);
        var sphereMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide, transparent: parameters.transparent, opacity: parameters.opacity, color: parameters.color });
        var sphere = new Mesh(sphereGeometry, sphereMaterial);
        sphere.renderOrder = 100;
        // sphere.material.depthTest=false;
        sphere.position.set(parameters.position.x, parameters.position.y, parameters.position.z);
        sphere.scale.set(parameters.scale.x, parameters.scale.y, parameters.scale.z);
        sphere.rotation.set(parameters.rotation.x, parameters.rotation.y, parameters.rotation.z);
        scene.add(sphere);
        makeWaterList.push(sphere);

        parameters = {
            URL: BASE_PATH + 'alert.png',
            position: { x: 0, y: 150, z: 0 },
            scale: { x: 20, y: 20, z: 20 }
        };
        loader = new TextureLoader();
        texture = loader.load(parameters.URL);
        texture.needsUpdate = true;
        var waterWarnGeometry = new PlaneGeometry(10, 20);
        var waterWarnMaterial = new MeshBasicMaterial({ map: texture, transparent: true, side: DoubleSide, depthWrite: false, depthTest: true });
        var waterWarn = new Mesh(waterWarnGeometry, waterWarnMaterial);
        waterWarn.renderOrder = 100;
        // waterWarn.material.depthTest = true;
        waterWarn.position.set(parameters.position.x, parameters.position.y, parameters.position.z);
        waterWarn.scale.set(parameters.scale.x, parameters.scale.y, parameters.scale.z);
        scene.add(waterWarn);
        makeWaterList.push(waterWarn);
    } else {
        for (var i = 0; i < makeWaterList.length; i++) {
            scene.remove(makeWaterList[i]);
            makeWaterList[i].material.dispose()
        }
    }
}

/**
 * "漏水监测"
 * @param show 
 */
export const showSecurity = (show) => {
    var vx = 5;
    var vy = 30;
    var vz = 5;
    for (var i = 0; i < 5; i++) {
        var vlinename = 'securityline01' + i;
        var vlinename2 = 'securityline21' + i;
        if (show) {
            var vlineinfo = {
                name: vlinename,
                type: '',
                position: { x: 0, y: 0, z: 1000 },
                size: { x: 20, y: 20 },
                colortype: 'gradient3',
                color: 0xff0000,
                // color: 0xff00ff,
                imgurl: BASE_PATH + 'arrow.png',
            };
            var lines = [
                {
                    x: -700,
                    y: 30 + (i * vy),
                    z: -500
                },
                {
                    x: 600,
                    y: 30 + (i * vy),
                    z: -500
                },
            ];
            addLine(vlineinfo, lines);

            var vlineinfo2 = {
                name: vlinename2,
                type: '',
                position: { x: 1000, y: 0, z: 200 },
                size: { x: 20, y: 20 },
                colortype: 'gradient3',
                color: 0xff0000,
                imgurl: BASE_PATH + 'arrow.png',
            };
            var lines2 = [
                {
                    x: -500,
                    y: 30 + (i * vy),
                    z: 350
                },
                {
                    x: -500,
                    y: 30 + (i * vy),
                    z: -600
                },
            ];
            addLine(vlineinfo2, lines2);

        } else {
            delSenceObject(vlinename, false);
            delSenceObject(vlinename2, false);
        }
    }
}

/**
 * "供电电缆"
 * @param show 
 */
export const showPower = (show) => {
    var vx = 5;
    var vy = 3;
    var vz = 5;
    for (var i = 0; i < 3; i++) {
        var vlinename = 'powerline01' + i;
        var vlinename2 = 'powerline21' + i;
        if (show) {
            var vlineinfo = {
                name: vlinename,
                type: '',
                position: { x: 0, y: 0, z: -30 },
                size: { x: 20, y: 20 },
                colortype: 'gradient',
                color: 0xff00ff,
                imgurl: BASE_PATH + 'arrow.png',
            };
            var lines = [
                {
                    x: -120 + (i * vx),
                    y: 145 + (i * vy),
                    z: -180 + (i * vz)
                },
                {
                    x: -50 + (i * vx),
                    y: 145 + (i * vy),
                    z: -180 + (i * vz)
                },
                {
                    x: -50 + (i * vx),
                    y: 210 + (i * vy),
                    z: -180 + (i * vz)
                },
                {
                    x: -100 + (i * vx),
                    y: 210 + (i * vy),
                    z: -180 + (i * vz)
                },
                {
                    x: -100 + (i * vx),
                    y: 240 + (i * vy),
                    z: -180 + (i * vz)
                },
                {
                    x: -100 + (i * vx),
                    y: 240 + (i * vy),
                    z: 550 + (i * vz)
                },
                {
                    x: -500 + (i * vx),
                    y: 240 + (i * vy),
                    z: 550 + (i * vz)
                },
                {
                    x: 500 + (i * vx),
                    y: 240 + (i * vy),
                    z: 550 + (i * vz)
                },
            ];
            addLine(vlineinfo, lines);

            var vlineinfo2 = {
                name: vlinename2,
                type: '',
                position: { x: 0, y: 0, z: -30 },
                size: { x: 20, y: 20 },
                colortype: 'gradient',
                color: 0xff00ff,
                imgurl: BASE_PATH + 'arrow.png',
            };
            var lines2 = [
                {
                    x: -100 + (i * vx),
                    y: 240 + (i * vy),
                    z: 320 + (i * vz)
                },
                {
                    x: 100 + (i * vx),
                    y: 240 + (i * vy),
                    z: 320 + (i * vz)
                },
                {
                    x: 100 + (i * vx),
                    y: 240 + (i * vy),
                    z: 20 + (i * vz)
                },
                {
                    x: 100 + (i * vx),
                    y: 210 + (i * vy),
                    z: 20 + (i * vz)
                },
                {
                    x: 140 + (i * vx),
                    y: 210 + (i * vy),
                    z: 20 + (i * vz)
                },
                {
                    x: 140 + (i * vx),
                    y: 160 + (i * vy),
                    z: 20 + (i * vz)
                },
            ];
            addLine(vlineinfo2, lines2);

        } else {
            delSenceObject(vlinename, false);
            delSenceObject(vlinename2, false);
        }
    }
}

/**
 * "告警巡航"
 * @param show 
 */
export const showPerson = (show) => {
    var vname = 'dynamicPath001';
    if (show) {
        var vInfo = {
            name: vname,
            type: 'beeline',
            visible: true,
            radiu: 1.0,
            speed: 500,
            imgurl: BASE_PATH + 'roughness_map.jpg',
            scene: true,
            path: [
                {
                    x: 180,
                    y: 160,
                    z: 460
                },
                {
                    x: 180,
                    y: 160,
                    z: -380
                },

                {
                    x: -80,
                    y: 160,
                    z: -380
                },
                {
                    x: -80,
                    y: 160,
                    z: 460
                },

                {
                    x: -500,
                    y: 160,
                    z: 460
                },
                {
                    x: -500,
                    y: 160,
                    z: -380
                },
            ]
        };

        dynamicPath(vInfo);
    } else {
        stopDynamicPath();
    }
}

/**
 * "报警管理"
 * @param show 
 * @param serverDeviceList 
 */
export const showAlarm = (show, serverDeviceList) => {
    var valarmanme = 'equipment_Identification_alarm';
    var errorobj = {
        name: valarmanme,
        size: { x: 64, y: 64 },
        position: { x: 0, y: 300, z: 0 },
        imgurl: BASE_PATH + 'down.png'
    };

    const index = Math.floor(Math.random() * serverDeviceList.length)

    if (show) {
        setMaterialColor(serverDeviceList[index], 0xff0000);
        addIdentification(serverDeviceList[index], errorobj);
        beforeServerDevice = serverDeviceList[index]
    } else {
        setMaterialColor(beforeServerDevice, 0x000000);
        delSenceObject(valarmanme, false);
    }
}

export const showFlag = (show, cabinetList) => {
    var vtreeanme = 'cabinet_Identification_flag';
    var errorobj = {
        name: vtreeanme,
        size: { x: 48, y: 64 },
        position: { x: 0, y: 200, z: 0 },
        imgurl: BASE_PATH + 'marker1.png'
    };

    const index = Math.floor(Math.random() * cabinetList.length)

    if (show) {
        addIdentification(cabinetList[index], errorobj);
    } else {
        delSenceObject(vtreeanme, false);
    }

}
