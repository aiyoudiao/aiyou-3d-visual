import * as THREE from 'three'
import { mouseClick, domElement, raycaster, camera, scene, outlinePass, vueModel, alarmColor, orbitControls, eventList } from './initThree'
import { isClickModel, findTopObj } from './util'

let lastElement: any = null

let tooltip: HTMLDivElement | HTMLElement
let tooltipBackground: string = '#ACDEFE'
let tooltipBG = '#ACDEFE'
let lastEvent: any = null

let clickTimer: any = undefined
let tipTimer: any = undefined
let dbclick = 0

/**
 * 事件：鼠标右键按下
 * @param event 
 */
export function onDocumentMouseDown(event) {
    // console.log('event', event)
    dbclick++;
    if (clickTimer) {
        clearTimeout(clickTimer)
    }
    clickTimer = setTimeout(() => {

        if (dbclick === 2) {
            customDBClick(event)
        } else if (dbclick === 1) {
            // _this.customClick(event, _this)
        } else {
            /**
             * 3连击以上，就跳转到指定位置
             */
            flyTo(event)
            // alert('操作太频繁，慢一点，没有三连击')
        }
        dbclick = 0
    }, 300);
    event.preventDefault();
}

/**
 * 自定义双击
 * @param event 
 * @param _this 
 */
function customDBClick(event) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    mouseClick.x = (event.offsetX / domElement.offsetWidth) * 2 - 1;
    mouseClick.y = -(event.offsetY / domElement.offsetHeight) * 2 + 1;
    raycaster.setFromCamera(mouseClick, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    // var intersects = raycaster.intersectObjects(dataSet.filter(item => item instanceof THREE.Object3D));

    if (intersects.length > 0 && isClickModel('door', intersects[0].object)) {
        orbitControls.enabled = false;
        let SELECTED = intersects[0].object;
        // NOTE console.log(SELECTED)
        // console.log(SELECTED)
        if (eventList != null && eventList.dbclick != null && eventList.dbclick.length > 0) {
            eventList.dbclick.forEach(function (_obj, index) {
                if ("string" == typeof (_obj.obj_name)) {
                    if (_obj.obj_name == SELECTED.name) {
                        // _obj.obj_event(SELECTED, _this);
                    }
                } else if (_obj.findObject != null || 'function' == typeof (_obj.findObject)) {
                    if (_obj.findObject(SELECTED.name)) {
                        // _obj.obj_event(SELECTED, _this);
                    }
                }
            })
        }
        orbitControls.enabled = true;
    }
}

/**
 * 跳到点击的地方去
 * @param event 
 */
function flyTo(event) {

    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    mouseClick.x = (event.offsetX / domElement.offsetWidth) * 2 - 1;
    mouseClick.y = -(event.offsetY / domElement.offsetHeight) * 2 + 1;
    raycaster.setFromCamera(mouseClick, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {

        let SELECTED = intersects[0].object as any;


        // /* 跳到这个机柜处 */
        if (intersects && isClickModel('cabinet', SELECTED)) {
            SELECTED = findTopObj('cabinet', SELECTED)

            const findCabinetDoor = (mesh) => {
                if (mesh instanceof THREE.Mesh) {
                    if (mesh.name === SELECTED.name + '&&' + 'cabinet_door') {
                        return mesh
                    }
                }

                if (![undefined, null].includes(mesh) && mesh.children && mesh.children.length > 0) {
                    for (const subMesh of mesh.children) {
                        const result = findCabinetDoor(subMesh)
                        if (result) {
                            return result
                        }
                    }
                }
                return undefined
            }
            const selectedCabinetDoor = scene.getObjectByName(SELECTED.name + '&&' + 'cabinet_door') as any //findCabinetDoor(SELECTED)

            console.log(`scene.getObjectByName(SELECTED.name + '&&' + 'cabinet_door')`, scene.getObjectByName(SELECTED.name + '&&' + 'cabinet_door'))



            console.log('doorObj', selectedCabinetDoor)

            // debugger
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

            /**
             * 让当前相机的位置指向选中的对象
             * 然后再慢慢微调相机的 x轴和y轴距离
             * 最终达到正好看到机柜的位置
             */
            camera.position.copy(SELECTED.position)
            camera.position.y = camera.position.y + 60
            // camera.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), 100)

            console.log(' camera.position.y * 3', camera.position.y * 3)
            camera.position.x = camera.position.x + 340

            console.log('camera.position.x + 400', camera.position.x + 400)

            // camera.position.z = camera.position.z + 50
            // console.log('camera.position.z + 50', camera.position.z + 50)
            console.log('camera.rotation', camera.rotation)


            // camera.position.x = camera.position.x * 2
            /**
             * 让当前控制器的目标指向选中的对象
             */
            orbitControls.target.copy(SELECTED.position)
            orbitControls.update()

        }
    }
}

/**
 * 事件：鼠标悬浮
 */
export function onDocumentMouseMove(event) {
    var currentElement = null;
    const { offsetX, offsetY } = event

    mouseClick.x = (offsetX / domElement.offsetWidth) * 2 - 1;
    mouseClick.y = -(offsetY / domElement.offsetHeight) * 2 + 1;
    raycaster.setFromCamera(mouseClick, camera);
    // var intersects = raycaster.intersectObjects(dataSet.filter(item => item instanceof THREE.Object3D));
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {

        let SELECTED = intersects[0].object;
        if (SELECTED.name.toString().indexOf("equipment") != -1 || SELECTED.name.toString().indexOf("spriteAlarm") != -1) {
            currentElement = SELECTED;
        }


        // /* 机柜高亮 */
        // if (SELECTED.name.toString().includes('cabinet')) {
        if (intersects && isClickModel('cabinet', SELECTED)) {
            // console.log('intersects', intersects)
            SELECTED = findTopObj('cabinet', SELECTED)
            outlinePass.selectedObjects = [SELECTED]
            console.log('SELECTED', SELECTED)
            // console.log(mouseClick.x, mouseClick.y)
            // console.log(lastEvent.pageX, lastEvent.pageY)
            vueModel.currentMesh.left = (lastEvent.pageX + 10);
            vueModel.currentMesh.top = (lastEvent.pageY + 10);
            vueModel.currentMesh.name = SELECTED.userData.name
            vueModel.currentMesh.show = true

            // scene.updateMatrixWorld(true)
        } else {
            vueModel.currentMesh.show = false
            outlinePass.selectedObjects = []
        }
    }
/*     if (lastElement != currentElement) {
        clearTimeout(tipTimer);
        if (currentElement) {
            tipTimer = setTimeout(() => {
                // console.log(currentElement)
                let tipInfo = "";
                if (currentElement.name.toString().indexOf("equipment") != -1) {
                    tipInfo = currentElement.userData.tipInfo;
                    tooltip.style.background = tooltipBG;
                    tooltip.querySelector("span").style.borderTop = "10px solid " + tooltipBG;
                }
                if (currentElement.name.toString().indexOf("spriteAlarm") != -1) {
                    // console.log(currentElement)
                    if (currentElement.userData.alarmInfo.length > 0) {
                        let levelArr = [];
                        for (let i = 0; i < currentElement.userData.alarmInfo.length; i++) {
                            levelArr.push(currentElement.userData.alarmInfo[i].level);
                            tipInfo += currentElement.userData.alarmInfo[i].name + currentElement.userData.alarmInfo[i].alarmInfo + "；"
                        }
                        let max = Math.max(...levelArr);
                        tooltip.style.background = alarmColor["level" + max];
                        tooltip.querySelector("span").style.borderTop = "10px solid " + alarmColor["level" + max];
                    }
                }
                let tiplen = tipInfo.length;
                tooltip.querySelector("#tipdiv").innerHTML = tipInfo
                tooltip.style.width = tiplen * 15 + "px";
                tooltip.style.display = 'block';
                tooltip.style.left = (lastEvent.pageX - tooltip.clientWidth / 2) + 'px';
                tooltip.style.top = (lastEvent.pageY - tooltip.clientHeight - 15) + 'px';
            }, 1000);
        }
    } */
    //设置上一次的网元为当前网元
    lastElement = currentElement;
/*     //如果当前鼠标下没有网元，隐藏tooltip
    if (currentElement == null) {
        tooltip.style.display = 'none';
    } */
    //设置每次移动时鼠标的事件对象
    lastEvent = event;
}


function openCloseDoor(obj, x, y, z, info) {
    console.log(obj)
    var doorstate = "close";
    var tempobj = null;
    if (obj.doorState != null && typeof (obj.doorState) != 'undefined') {
        doorstate = obj.doorState;
        tempobj = obj.parent;
    } else {
        console.log("add parent");
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
function openCabinetDoor(_obj, func) {
    console.log('开关机柜门', _obj, func)
    func()
    openCloseDoor(_obj, _obj.geometry.parameters.width / 2, 0, _obj.geometry.parameters.depth / 2, "right");
}
//拉出放回设备
function openEquipmentDoor(_obj, func) {
    openCloseDoor(_obj, 0, 0, _obj.geometry.parameters.depth / 2, "outin");
}
