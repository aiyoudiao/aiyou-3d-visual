/**
 * 辅助函数
 */

import * as THREE from "three"
import { addObject, delObject } from "./core"
import { BASE_PATH, dataSet, scene } from "./initThree"
let timers = {
}

/**
 * 判断该对象是否存在
 * @param obj 
 */
export function isExists(obj) {
    return ![undefined, null].includes(obj)
}

/**
 * 向上查找，是否点中了指定名称的对象，找不到就返回`null`
 * @param name 
 * @param object 
 */
export function isClickModel(name, object) {
    if (object.name.includes(name)) {
        return object
    } else if (object.parent) {
        return isClickModel(name, object.parent)
    }

    return null
}

/**
 * 向上查找，找到最上层的该名称对象，找不到就返回`null`
 * @param name 
 * @param object 
 */
export function findTopObj(name, object) {
    if (
        object.name.includes(name) &&
        object.parent.name === 'mainScene' &&
        object.userData &&
        object.userData.name &&
        object.userData.name.includes('JG')
    ) {
        return object
    } else if (object.parent) {
        return findTopObj(name, object.parent)
    }

    return null
}

/**
 * 根据对象名称查询指定对象
 * @param name 
 */
export function findObject(name) {
    const obj = dataSet.find(obj => obj.name === name)
    return obj
}

/**
 * 向下查找，找到最下层的该名称对象，找不到就返回`null`
 * 和 Mesh.getObjectByName方法很像
 * @param name 
 * @param mesh 
 */
export function findMeshByName(name, mesh) {
    if (mesh instanceof THREE.Mesh) {
        // if (mesh.name === SELECTED.name + '&&' + 'cabinet_door') {
        if (mesh.name === name) {
            return mesh
        }
    }

    if (![undefined, null].includes(mesh) && mesh.children && mesh.children.length > 0) {
        for (const subMesh of mesh.children) {
            const result = findMeshByName(subMesh, name)
            if (result) {
                return result
            }
        }
    }
    return null
}

/**
 * 生成一个UUID
 */
export function generateUUID() {
    return (Math.random() * Math.random() * Math.random()).toString().slice(1)
}

/**
 * 绘制动态文本精灵图
 * @param _objname 
 * @param parameters 
 */
export function makeDynamicTextSprite(_objname, parameters) {
    /* 			var _this = p3DObj;
                var canvas = _this.vcanvas;
                var context2 = _this.vcontext;
    
                context2.clearRact(0, 0, canvas.width, canvas.height);
                context2.fillText(_objname + '%', 256, 22);
    
                context.save(); // save 和 restore 可以保证样式属性 只运用于该字段canvas元素
                context.strokeStyle = '#fff'; // 设置描边样式
                context.font = '80px Arial';
    
                // 描绘字体，并且指定位置
                context.fillText(_objname+'%', 256, 22);
                // context.strokeText(_objname + '%', 256, 22);
                context.stroke(); // 执行绘制
                context.restore(); */

    var vobjx = 0;
    var vobjy = 0;
    var vobjz = 0;
    var _fobj = findObject(_objname);
    if (_fobj != undefined && _fobj != null) {
        vobjx = _fobj.position.x;
        vobjy = _fobj.position.y;
        vobjz = _fobj.position.z;
    };

    if (parameters === undefined || parameters === null) parameters = {};
    var vname = parameters.hasOwnProperty("name") ? parameters["name"] : "mark";
    var vbkColor = parameters.hasOwnProperty("color") ? parameters["color"] : { r: 255, g: 255, b: 255, a: 1.0 };
    var imgurl = parameters.hasOwnProperty("imgurl") ? parameters["imgurl"] : BASE_PATH + "floor2.jpg";
    var x = parameters.hasOwnProperty("position") ? parameters["position"].x : 10;
    var y = parameters.hasOwnProperty("position") ? parameters["position"].y : 80;
    var z = parameters.hasOwnProperty("position") ? parameters["position"].z : 0;
    var vWidth = parameters.hasOwnProperty("size") ? parameters["size"].x : 128;
    var vheight = parameters.hasOwnProperty("size") ? parameters["size"].y : 64;
    var vscale = parameters.hasOwnProperty("size") ? parameters["size"].z : 18;

    var canvas = document.createElement('canvas');
    canvas.width = vWidth;
    canvas.height = vheight;
    var context = canvas.getContext('2d');

    var clockImage = new Image();
    if (imgurl != undefined && imgurl != null && imgurl != '') {
        clockImage.src = imgurl;	//'res/floor2.jpg';
        clockImage.onload = function () {
            context.drawImage(clockImage, 0, 0, vWidth, vheight);
        };
    } else {
        context.fillStyle = "rgba(" + vbkColor.r + ", " + vbkColor.g + ", " + vbkColor.b + ", " + vbkColor.a + " )";
        context.fillRect(0, 0, vWidth, vheight);
    }

    if (parameters.rows != null && parameters.rows.length > 0) {
        parameters.rows.forEach((_obj, index) => {
            var fontsize = _obj.fontsize;
            var fontface = _obj.fontface;
            var borderThickness = _obj.borderThickness;
            var message = _obj.text;
            var textColor = _obj.textColor;
            var vix = _obj.position.x;
            var viy = _obj.position.y;
            var viz = _obj.position.z;
            context.textAlign = 'left';
            context.textBaseline = 'middle';
            context.font = "bold " + fontsize + "px " + fontface;
            context.lineWidth = borderThickness;
            context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
            context.fillText(message, vix, viy);
        });
    }

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.x = vobjx + x;
    sprite.position.y = vobjy + y;
    sprite.position.z = vobjz + z;
    sprite.name = parameters.name;
    sprite.scale.set(1.0 * vscale, vheight / vWidth * vscale, 1.0);
    addObject(sprite);

    const vcanvas = canvas;
    const vspriteMaterial = spriteMaterial;

    clearInterval(timers[_objname]);
    timers[_objname] = setInterval(function () {
        makeItemValue("", 'item2', parameters, vcanvas, vspriteMaterial);
    }, 1000);

    return null;
};

/**
 * 绘制动态文本精灵图中的动态绘制值
 * @param objname 
 * @param objitem 
 * @param objparameters 
 */
function makeItemValue(objname, objitem, objparameters, vcanvas, vspriteMaterial) {
    var canvas = vcanvas;

    if (canvas != null && typeof (canvas) != 'undefined') {
        var context = canvas.getContext('2d');

        var vWidth = canvas.width;
        var vheight = canvas.height;
        var vbkColor = objparameters.color;
        var imgurl = objparameters.imgurl;
        var clockImage = new Image();
        if (imgurl != undefined && imgurl != null && imgurl != '') {
            clockImage.src = imgurl;	//'res/floor2.jpg';
            context.clearRect(0, 0, vWidth, vheight);
            context.drawImage(clockImage, 0, 0, vWidth, vheight);
        } else {
            context.clearRect(0, 0, vWidth, vheight);
            context.fillStyle = "rgba(" + vbkColor.r + ", " + vbkColor.g + ", " + vbkColor.b + ", " + vbkColor.a + " )";
            context.fillRect(0, 0, vWidth, vheight);
        }

        var theDate = new Date();
        var msgtext = theDate.getMilliseconds().toString() + theDate.getSeconds().toString();
        if (objparameters.rows != null && objparameters.rows.length > 0) {
            objparameters.rows.forEach((_obj, index) => {
                var fontsize = _obj.fontsize;
                var fontface = _obj.fontface;
                var borderThickness = _obj.borderThickness;
                var message = _obj.text;
                if (_obj.name == objitem)
                    message = msgtext;
                var textColor = _obj.textColor;
                var vix = _obj.position.x;
                var viy = _obj.position.y;
                var viz = _obj.position.z;
                context.textAlign = 'left';
                context.textBaseline = 'middle';
                context.font = "bold " + fontsize + "px " + fontface;
                context.lineWidth = borderThickness;
                context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
                context.fillText(message, vix, viy);
            });
        }

        vspriteMaterial.map.needsUpdate = true; // 一直刷
    }
}


export function delSenceObject(_objname, _deltype) {
    delObject(_objname, _deltype);
}

/**
 * 修改材质颜色
 */
export function setMaterialColor(_objname, _color) {
    var _obj = findObject(_objname);
    if (isExists(_obj.material.emissive)) {
        _obj.material.emissive.setHex(_color);
    } else if (isExists(_obj.material.materials)) {
        if (_obj.material.materials.length > 0) {

            _obj.material.materials.forEach((obj) => {
                obj.emissive.setHex(_color);
            });
        }
    } else if (_obj.material.length > 0) {
        _obj.material.forEach((obj) => {
            obj.emissive.setHex(_color);
        });
    }
    else if (isExists(_obj.children)) {
        var vchildren = _obj.children[0];
        vchildren.material.forEach((obj) => {
            obj.emissive.setHex(_color);
        });
    }
}

//添加图片标识
export function addIdentification(_objname, _obj) {
    /*
      {
        name:'test',
        size:{x:20,y:20},
        position:{x:0,y:100,z:0},
        imgurl: '../datacenterdemo/res/connection.png'
      }
    */
    var _fobj = findObject(_objname);
    var loader = new THREE.TextureLoader();
    var texture = loader.load(_obj.imgurl, function () { }, undefined, function () { });
    var spriteMaterial = new THREE.SpriteMaterial({ map: texture});
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.renderOrder = 99
    sprite.name = _obj.name;
    sprite.position.x = _fobj.position.x + _obj.position.x;
    sprite.position.y = _fobj.position.y + _obj.position.y;
    sprite.position.z = _fobj.position.z + _obj.position.z;
    if (isExists(_obj.size)) {
        sprite.scale.set(_obj.size.x, _obj.size.y, _obj.size.z);
    } else {
        sprite.scale.set(1, 1, 1);
    }
    addObject(sprite);
}
