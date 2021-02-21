import { BoxHelper, Mesh, MeshPhongMaterial, Vector3 } from "three";
import { addBox } from "./action";
import { cabinetSpaceList, camera, dataSet, orbitControls, scene } from "./initThree"

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
                        const { cabinetRate, cabinetTotalU, uBitLength} = _obj.userData
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

