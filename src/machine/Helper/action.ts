/**
 * 通用的一些行为
 */

import * as THREE from "three";
import * as TWEENClass from '@tweenjs/tween.js'
import { addObject, getTarget } from "./core";
import { camera, domElement, mouseClick, orbitControls, outlinePass, scene, vueModel } from "./initThree";
import { findTopObj, isClickModel, isExists } from "./util";

export const TWEEN = TWEENClass

let lastElement: any = null

let tooltip: HTMLDivElement | HTMLElement
let tooltipBackground: string = '#ACDEFE'
let tooltipBG = '#ACDEFE'
let lastEvent: any = null
let tipTimer: any = undefined

function openCloseDoor(obj, x, y, z, info) {
    var doorstate = "close";
    var tempobj = null;
    if (isExists(obj.doorState)) {
        doorstate = obj.doorState;
        tempobj = obj.parent;
    } else {
        // console.log("add parent");
        var objparent = obj.parent;
        tempobj = new THREE.Object3D();
        tempobj.position.set(obj.position.x + x, obj.position.y + y, obj.position.z + z);
        obj.position.set(-x, -y, -z);
        tempobj.add(obj);
        objparent.add(tempobj);
    }

    obj.doorState = (doorstate == "close" ? "open" : "close");


    if (info == "left" || info == "right") {
        new TWEEN.Tween(tempobj.rotation).to({
            y: (doorstate == "close" ? 0.25 * 2 * Math.PI : 0 * 2 * Math.PI)
        }, 1000).start();
    } else if (info == "outin") {
        //沿点击的法向量移动
        // var intersects = this.raycaster.intersectObjects([obj]);
        // if (intersects.length > 0) {
        //     // 射线位置赋值给移动网格模型
        //     tempobj.position.copy(intersects[0].point);
        //     // 沿着法线方向平移移动的网格模型
        //     var normal = intersects[0].face.normal;// 当前位置曲面法线
        //     tempobj.translateOnAxis(normal,50); //平移50
        // }

        var targetPos = new THREE.Vector3(1, 0, 0);
        // var euler = new THREE.Euler( 1, 0,0);
        // var matrix = new THREE.Matrix4();  //创建一个4维矩阵
        // matrix.lookAt(obj.position.clone() , obj.position.clone() , targetPos) //设置朝向
        // matrix.multiply(new THREE.Matrix4().makeRotationFromEuler(euler))
        // var toRot = new THREE.Quaternion().setFromRotationMatrix(matrix) 
        // tempobj.translateOnAxis(toRot,50);
        if (obj.doorState == "close") {
            tempobj.translateOnAxis(targetPos, -obj.geometry.parameters.depth + 20);
        } else {
            tempobj.translateOnAxis(targetPos, obj.geometry.parameters.depth - 20);
        }

        //使用四元素朝某个角度移动
        // var targetPos = new THREE.Vector3(0,0,1)   //目标位置点
        // var offsetAngle = Math.PI/2  //目标移动时的朝向偏移
        // // var obj =  你的三维模型(或者其他物体对象，object3D ,group ,或者mesh对象)
        // //以下代码在多段路径时可重复执行
        // var matrix = new THREE.Matrix4()  //创建一个4维矩阵
        // matrix.lookAt(obj.position.clone() , obj.position.clone() ,targetPos) //设置朝向
        // matrix.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0 , offsetAngle , 0 )))
        // var toRot = new THREE.Quaternion().setFromRotationMatrix(matrix)  //计算出需要进行旋转的四元数值
        // tempobj.translateOnAxis(toRot,50);




        // if(obj.doorState=="close"){
        //     tempobj.translateOnAxis(new THREE.Vector3(0, 0, 1),-obj.geometry.parameters.depth);
        // }else{
        //     tempobj.translateOnAxis(new THREE.Vector3(0, 0, 1),obj.geometry.parameters.depth);
        // }
    }

}
//开关左门
function openLeftDoor(_obj, func) {
    openCloseDoor(_obj, -_obj.geometry.parameters.width / 2, 0, 0, "left");
}
//开关右门
function openRightDoor(_obj, func) {
    openCloseDoor(_obj, _obj.geometry.parameters.width / 2, 0, 0, "right");
}
//开关机柜门
export function openCabinetDoor(_obj, func) {
    // console.log('开关机柜门', _obj, func)
    func()
    openCloseDoor(_obj, _obj.geometry.parameters.width / 2, 0, _obj.geometry.parameters.depth / 2, "right");
}
//拉出放回设备
export function openEquipmentDoor(_obj, func) {
    openCloseDoor(_obj, 0, 0, _obj.geometry.parameters.depth / 2, "outin");
}

/**
 * 跳转到指定机柜处
 * @param target 
 */
export function flyToCabinet(targetObj, openDoor) {
    let SELECTED = targetObj
    SELECTED = findTopObj('cabinet', SELECTED)


    if (openDoor) {
        const doorName = SELECTED.name + '&&' + 'cabinet_door'
        const selectedCabinetDoor = scene.getObjectByName(doorName) as any

        /**
         * 处于开门状态，那么就先关门再开门
         */
        if (selectedCabinetDoor.doorState === 'close' || !isExists(selectedCabinetDoor.doorState)) {
            openCabinetDoor(selectedCabinetDoor, () => { })
        }
    }

    /**
     * 让当前相机的位置指向选中的对象
     * 然后再慢慢微调相机的 x轴和y轴距离
     * 最终达到正好看到机柜的位置
     */

    const cameraTarget = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
    }

    const controlTarget = {
        x: orbitControls.target.x,
        y: orbitControls.target.y,
        z: orbitControls.target.z,
    }

    const elementTarget = {
        x: SELECTED.position.x,
        y: SELECTED.position.y,
        z: SELECTED.position.z,
    }

    const target = {
        x: SELECTED.position.x + 340,
        y: SELECTED.position.y + 60,
        z: SELECTED.position.z,
    }

    // camera.position.x = target.x
    // camera.position.y = target.y
    // camera.position.z = target.z

    /**
     * 让当前相机指向目标位置
     */
    new TWEEN.Tween(cameraTarget).to(target)
        .onUpdate(function (item) {
            camera.position.x = item.x
            camera.position.y = item.y
            camera.position.z = item.z
        }).start();


    /**
     * 让当前控制器的目标指向选中的对象
     */
    new TWEEN.Tween(controlTarget).to(elementTarget)
        .onUpdate(function (item) {
            orbitControls.target.x = item.x
            orbitControls.target.y = item.y
            orbitControls.target.z = item.z
            orbitControls.update()
        }).start();
    // }).easing(TWEEN.Easing.Elastic.Out).start();

}


/**
 * 添加空间利用率的盒子
 * @param {*} _objinfo 
 */
export function addBox(_objinfo) {
    var vheight = _objinfo.size.h;
    if (_objinfo.tween > 0) {
        vheight = 1;
    }
    var geometry = new THREE.BoxGeometry(_objinfo.size.w, vheight, _objinfo.size.l);
    //var geometry = new THREE.BoxGeometry( 100, 50, 50 );
    var object = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: _objinfo.color, opacity: _objinfo.opacity, transparent: _objinfo.transparent, wireframe: _objinfo.wireframe, shininess: 100 }));

    object.name = _objinfo.name;
    object.position.set(_objinfo.position.x, _objinfo.position.y, _objinfo.position.z);
    object.rotation.set(_objinfo.rotation.x, _objinfo.rotation.y, _objinfo.rotation.z);
    if (true == _objinfo.wireframe) {
        var bh = new THREE.BoxHelper(object, _objinfo.color);
        bh.name = _objinfo.name;
        bh.renderOrder = 100;
        addObject(bh);
    } else {
        object.renderOrder = 100;
        addObject(object);
    }

    // var vsize = _objinfo.size;
    // object.geometry = new THREE.BoxGeometry(vsize.w, vsize.h, vsize.l);
    // object.position.y =  vsize.h

    if (_objinfo.tween > 0) {
        var vsize = _objinfo.size;
        var vtheight = vheight;
        new TWEEN.Tween({ h: vheight }).to({
            h: vsize.h
        }, _objinfo.tween)
            .onUpdate(function (item) {
                console.log(item.h);
                //object.geometry.dispose();
                //object.children[ 1 ].geometry.dispose();
                var vtgeometry = new THREE.BoxGeometry(vsize.w, item.h, vsize.l);
                //object.children[ 0 ].geometry = new THREE.WireframeGeometry( vtgeometry );
                object.geometry = vtgeometry;
                var v1 = (item.h - vtheight) / 2.0;
                object.position.y += v1;
                vtheight = item.h;
            }).easing(TWEEN.Easing.Elastic.Out).start();
    }
    return object;
}