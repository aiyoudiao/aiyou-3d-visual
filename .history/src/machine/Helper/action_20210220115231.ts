/**
 * 通用的一些行为
 */

import * as THREE from "three";
import { getTarget } from "./core";
import { camera, domElement, mouseClick, orbitControls, outlinePass, scene, vueModel } from "./initThree";
import { findTopObj, isClickModel, isExists } from "./util";


let lastElement: any = null

let tooltip: HTMLDivElement | HTMLElement
let tooltipBackground: string = '#ACDEFE'
let tooltipBG = '#ACDEFE'
let lastEvent: any = null
let tipTimer: any = undefined

function openCloseDoor(obj, x, y, z, info) {
    // console.log(obj)
    var doorstate = "close";
    var tempobj = null;
    if (obj.doorState != null && typeof (obj.doorState) != 'undefined') {
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
        let sign = info == "left" ? 1 : -1;
        if (obj.doorState == "close") {
            tempobj.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.5 * sign * Math.PI);
        } else {
            tempobj.rotateOnAxis(new THREE.Vector3(0, 1, 0), -0.5 * sign * Math.PI);
        }
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
        if (selectedCabinetDoor.doorState === 'open') {
            openCabinetDoor(selectedCabinetDoor, () => { })
        }
        selectedCabinetDoor.openDoor = selectedCabinetDoor.openDoor ? selectedCabinetDoor.openDoor : 0
        selectedCabinetDoor.openDoor++

        openCabinetDoor(selectedCabinetDoor, () => {
            console.log('跳转成功')
        })
    }

    /**
     * 让当前相机的位置指向选中的对象
     * 然后再慢慢微调相机的 x轴和y轴距离
     * 最终达到正好看到机柜的位置
     */
    camera.position.copy(SELECTED.position)
    camera.position.y = camera.position.y + 60
    camera.position.x = camera.position.x + 340

    /**
     * 让当前控制器的目标指向选中的对象
     */
    orbitControls.target.copy(SELECTED.position)
    orbitControls.update()

}
