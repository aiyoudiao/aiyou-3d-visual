/**
 * 通用的一些行为
 */

import * as THREE from "three";
import { NURBSSurface } from 'three/examples/jsm/curves/NURBSSurface'
import * as TWEENClass from '@tweenjs/tween.js'
import { addObject, getTarget } from "./core";
import { camera, domElement, mouseClick, nurbsmaterialList, orbitControls, outlinePass, scene, vLinePathMaterialList, vueModel } from "./initThree";
import { findTopObj, isClickModel, isExists } from "./util";
import { AngleToRadians } from "./calc";

export const TWEEN = TWEENClass

let lastElement: any = null

let tooltip: HTMLDivElement | HTMLElement
let tooltipBackground: string = '#ACDEFE'
let tooltipBG = '#ACDEFE'
let lastEvent: any = null
let tipTimer: any = undefined

let pathTubeMesh
let dynamicPathTimer
let pathTubeStep

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

/**
 * 添加路径线
 */
export function addLinePath(projectdata) {
    var pathMesh = addTunnel(projectdata);

    vLinePathMaterialList.length = 0
    vLinePathMaterialList.push(pathMesh.material)
}

/**
 * 添加管道流速
 */
export function addTunnel(projectdata) {

    function CustomSinCurve(scale) {
        THREE.Curve.call(this);
        this.scale = (scale === undefined) ? 1 : scale;
    }

    var points = [];
    var path;

    var vPathParams = projectdata.path;
    if (vPathParams != null && vPathParams.length > 0) {
        vPathParams.forEach(_obj => {
            var point = new THREE.Vector3(0, 0, 0);
            point.x = _obj.x;
            point.y = _obj.y;
            point.z = _obj.z;
            points.push(point);
        });
    }

    if (projectdata.type == null || typeof (projectdata.type) == 'undefined' || projectdata.type == 'curve') {
        path = new THREE.CatmullRomCurve3(points);
        //path=new THREE.LineCurve3(points[0],points[1]);
    } else if (projectdata.type == 'beeline') {

        CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
        CustomSinCurve.prototype.constructor = CustomSinCurve;
        CustomSinCurve.prototype.getPoint = function (t) {
            var vsegment = points.length - 1;
            var vt = 1 / vsegment;
            let vindex = Math.floor(t / vt)
            if (1 === t) {
                console.log(t + '/' + vt + ' = ' + vindex + ' ');
                return points[vindex].clone();
            }
            //console.log(t+'/'+vt +' = '+vindex+' '+(vindex+1));

            var vector = new THREE.Vector3();
            vector.subVectors(points[vindex + 1], points[vindex]); // diff
            vector.multiplyScalar((t - (vt * vindex)) * vsegment);
            vector.add(points[vindex]);

            return vector;
        };
        path = new CustomSinCurve(10);
    }

    var geometry = new THREE.TubeGeometry(path, 750, projectdata.radiu, 8, false);
    var material;
    if ('' != projectdata.imgurl) {
        var map = new THREE.TextureLoader().load(projectdata.imgurl);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide });
    } else material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.name = projectdata.name;
    mesh.visible = projectdata.visible;
    if (projectdata.visible) addObject(mesh);

    return mesh;
}

/**
 * 添加温度监控
 */
export function addTemPlane(_objinfo) {
    var options = _objinfo;
    if (typeof options.pic == "string") {//传入的材质是图片路径，使用 textureloader加载图片作为材质
        var loader = new THREE.TextureLoader();
        // loader.setCrossOrigin(crossOrigin);
        var texture = loader.load(options.pic, function () { }, undefined, function () { });
    } else {
        var texture = new THREE.CanvasTexture(options.pic)
    }
    var MaterParam = {//材质的参数
        map: texture,
        side: THREE.DoubleSide,
        blending: THREE.NoBlending, //THREE.AdditiveBlending,
        transparent: options.transparent,
        //needsUpdate:true,
        //premultipliedAlpha: true,
        opacity: options.opacity
    }
    if (options.blending) {
        MaterParam.blending = THREE.AdditiveBlending//使用饱和度叠加渲染
    }
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width, options.height, 1, 1),
        new THREE.MeshBasicMaterial(MaterParam)
    );

    var lutColors = [];
    var vColors = [
        { r: 0, g: 0.5, b: 0.7 },
        { r: 0.6, g: 1.0, b: 0.3 },
        { r: 0.1, g: 0.9, b: 0.1 },
    ];
    for (var i = 0; i < 100; i++) {

        var color = vColors[i % 3];
        if (color == undefined) {
            console.log("ERROR: " + color);
        } else {
            lutColors[3 * i] = color.r;
            lutColors[3 * i + 1] = color.g;
            lutColors[3 * i + 2] = color.b;
        }
    }
    plane.geometry.colors = lutColors;

    plane.position.x = options.position.x;
    plane.position.y = options.position.y;
    plane.position.z = options.position.z;
    plane.rotation.x = AngleToRadians(options.rotation.x);
    plane.rotation.y = AngleToRadians(options.rotation.y);
    plane.rotation.z = AngleToRadians(options.rotation.z);
    plane.name = options.name;
    addObject(plane);
}


/**
 * 添加空调风向
 * @param {*} objinfo 
 */
export function addNurbs(objinfo) {
    nurbsmaterialList.length = 0

    var nsControlPoints = [];
    var vx = 0, vy = 0, vz = 0;
    var vstepx = 300, vstepy = 40, vstepz = 50;
    for (var i = 0; i < 3; i++) {
        var v1 = [
            new THREE.Vector4(vx + (i * vstepx), vy - 5 * vstepy, vz + 3.5 * vstepz, 1),
            new THREE.Vector4(vx + (i * vstepx), vy - 2.8 * vstepy, vz + 2.0 * vstepz, 1),
            new THREE.Vector4(vx + (i * vstepx), vy - 2.5 * vstepy, vz + 0.0 * vstepz, 1),
            new THREE.Vector4(vx + (i * vstepx), vy - 0 * vstepy, vz - 0.9 * vstepz, 1)
        ];
        nsControlPoints.push(v1);
    }

    var degree1 = 2;
    var degree2 = 3;
    var knots1 = [0, 0, 0, 1, 1, 1];
    var knots2 = [0, 0, 0, 0, 1, 1, 1, 1];
    var nurbsSurface = new NURBSSurface(degree1, degree2, knots1, knots2, nsControlPoints);

    var map = new THREE.TextureLoader().load(objinfo.imgurl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    map.repeat.set(8, 6);
    map.needsUpdate = true;

    // function getSurfacePoint(u, v) {
    // 	return nurbsSurface.getPoint(u, v);
    // }
    function getSurfacePoint(u, v, target) {
        return nurbsSurface.getPoint(u, v, target);
    }

    var geometry = new THREE.ParametricBufferGeometry(getSurfacePoint, 20, 20);

    //
    geometry.computeVertexNormals();
    geometry.normalizeNormals();
    var lutColors = [];
    var vColors = [
        { r: 0, g: 0.5, b: 0.7 },
        { r: 0.6, g: 1.0, b: 0.3 },
        { r: 0.1, g: 0.9, b: 0.1 },
    ];
    for (var i = 0; i < geometry.attributes.normal.array.length; i++) {

        var color = vColors[i % 3];
        if (color == undefined) {
            console.log("ERROR: " + color);
        } else {
            lutColors[3 * i] = color.r;
            lutColors[3 * i + 1] = color.g;
            lutColors[3 * i + 2] = color.b;
        }
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lutColors), 3));
    //

    var material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide, opacity: 0.8, transparent: true, vertexColors: true });
    var object = new THREE.Mesh(geometry, material);
    object.position.set(objinfo.position.x, objinfo.position.y, objinfo.position.z);
    object.rotation.y = 55;
    object.name = objinfo.name;
    //object.rotateY(90);
    object.scale.multiplyScalar(1);
    nurbsmaterialList.push(material);
    addObject(object);
}

/**
 * 更新路径线
 */
export function updatePath() {

    // 遍历所有路径线
    if (vLinePathMaterialList.length) {
        vLinePathMaterialList.forEach(vLinePathMaterial => {
            vLinePathMaterial.map.offset.x += 0.002;
        })
    }

    // 遍历所有空调风
    if (nurbsmaterialList.length) {
        nurbsmaterialList.forEach(nurbsmaterial => {
            nurbsmaterial.map.offset.y -= 0.012;
        })
    }

    /**
     * 是否进行巡航导航
     */
    if (isExists(pathTubeMesh)) {
        var vscale = 1.0;
        var v1 = 20;
        var offset = 10;
        var splineCamera = camera;
        var vpathTubeGeometry = pathTubeMesh.geometry;
        var t = (dynamicPathTimer % 1);

        var binormal = new THREE.Vector3();
        var normal = new THREE.Vector3();

        var pos = vpathTubeGeometry.parameters.path.getPointAt(t);
        pos.y += v1;
        pos.multiplyScalar(vscale);

        splineCamera.position.copy(pos);

        // using arclength for stablization in look ahead
        var vty = (t + 30 / vpathTubeGeometry.parameters.path.getLength()) % 1;
        var lookAt = vpathTubeGeometry.parameters.path.getPointAt(vty).multiplyScalar(vscale);
        lookAt.y += v1;

        splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
        splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

        dynamicPathTimer += pathTubeStep;
        if (dynamicPathTimer > 1.0) dynamicPathTimer = 0.0;
    }
}

/**
 * 添加精灵图：烟雾监测
 * @param objinfo 
 */
export function addSprite(objinfo) {
    var particle;
    var vscale = objinfo.position.w;
    var spriteMap = new THREE.TextureLoader().load(objinfo.imgurl);
    var material = new THREE.SpriteMaterial({
        map: spriteMap,
        color: objinfo.color,
        blending: THREE.AdditiveBlending
    });
    for (var i = 0; i < objinfo.number; i++) {

        particle = new THREE.Sprite(material);
        //particle.position.set( 0, 0, 0 );
        initParticle(objinfo, particle, i * 10, vscale);
        particle.name = objinfo.name;

        addObject(particle);
    }
}

/**
 * 初始化粒子：烟雾监测
 * @param objinfo 
 * @param particle 
 * @param delay 
 * @param scale 
 */
function initParticle(objinfo, particle, delay, scale) {
    //var particle = this instanceof THREE.Sprite ? this : particle;
    //var delay = delay !== undefined ? delay : 0;
    if (particle == null || typeof (particle) == 'undefined')
        return;
    particle.position.set(objinfo.position.x, objinfo.position.y, objinfo.position.z);
    particle.scale.x = particle.scale.y = Math.random() * scale + scale * 2;

    var vMinx = objinfo.position.x;
    var vMaxx = objinfo.position.x + objinfo.size.x;
    var vMiny = objinfo.position.y;
    var vMaxy = objinfo.position.y + objinfo.size.y;
    var vMinz = objinfo.position.z;
    var vMaxz = objinfo.position.z + objinfo.size.z;

    new TWEEN.Tween(particle)
        .delay(delay)
        .to({}, 1000)
        .onComplete(function () { initParticle(objinfo, particle, delay, scale); })
        .start();

    var vy = Math.floor(Math.random() * objinfo.size.y) + vMiny;
    new TWEEN.Tween(particle.position)
        .delay(delay)
        .to({ x: (Math.random() * (vMaxx - vMinx + 1) + vMinx), y: vy, z: (Math.random() * (vMaxz - vMinz + 1) + vMinz) }, 10000)
        .start();

    new TWEEN.Tween(particle.scale)
        .delay(delay)
        .to({ x: 0.01, y: 0.01 }, 10000)
        .start();
}

/**
 * 添加红外线：防盗监测、供电线缆
 * @param objinfo 
 * @param objitems 
 */
export function addLine(objinfo, objitems) {
    var geometry3 = new THREE.Geometry();
    var colors3 = [];
    if (objitems != null && objitems.length > 0) {
        objitems.forEach((_obj, index) => {

            var point = new THREE.Vector3(0, 0, 0);
            point.x = _obj.x;
            point.y = _obj.y;
            point.z = _obj.z;
            geometry3.vertices.push(point);

            if ('gradient' == objinfo.colortype) {
                colors3[index] = new THREE.Color(objinfo.color);
                colors3[index].setHSL(index / objitems.length, 1.0, 0.5);
            }
        });
    }
    var vParams: any = { color: objinfo.color, opacity: 1, linewidth: 1 };
    if ('gradient' == objinfo.colortype) {
        geometry3.colors = colors3;
        vParams = {
            color: objinfo.color, opacity: 1, linewidth: 1, vertexColors: true
            // vertexColors: THREE.VertexColors 
        };
    }

    var material = new THREE.LineBasicMaterial(vParams);
    var line, p, scale = 1.0, d = 225;
    line = new THREE.Line(geometry3, material);
    line.scale.x = line.scale.y = line.scale.z = scale * 1.0;
    line.position.x = objinfo.position.x;
    line.position.y = objinfo.position.y;
    line.position.z = objinfo.position.z;
    line.name = objinfo.name;

    // console.log( line.name );
    addObject(line);
}



/**
 * 开始高级巡航
 * @param {*} pathdata 
 */
export function dynamicPath(pathdata) {

    pathTubeMesh = addTunnel(pathdata);
    dynamicPathTimer = 0.0;
    pathTubeStep = 1 / pathdata.speed;
}

/**
 * 结束告警巡航
 */
export function stopDynamicPath() {
    pathTubeMesh.geometry.dispose();
    pathTubeMesh.material.dispose();
    if (pathTubeMesh.visible) scene.remove(pathTubeMesh);
    pathTubeMesh = null;
    dynamicPathTimer = 0.0;
    //this.camerDefaultCtrl();
}


