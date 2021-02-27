/**
 * 一些核心的方法
 */

import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL'
import { handleRotaion, mergeModel } from './calc'
import { dataSet, scene, BASE_PATH ,mouseClick, domElement, raycaster, camera, outlinePass, vueModel, alarmColor, orbitControls, eventList } from './initThree'
import { isClickModel, findTopObj, isExists } from './util'

/**
 * 检查兼容性
 */
export function checkForCompatibility(domElement?: HTMLElement) {
    if (!WEBGL.isWebGLAvailable()) {
        const warning = WEBGL.getWebGLErrorMessage();
        domElement = domElement || document.body
        domElement.appendChild(warning);
        console.warn('浏览出现了兼容性问题！', warning)
        return false
    }

    return true
}

/**
 * 将立方体添加到什么容器中
 * @param cube 
 * @param key 
 */
export function addObject(cube: any, key?: string): any {

    switch (key) {
        case 'object': {
            dataSet.push(cube)
        } break;
        case 'scene': {
            scene.add(cube)
        } break;
        default: {
            dataSet.push(cube)
            scene.add(cube)
        } break;
    }
}


/**
 * 删除对象
 * @param _objname 
 * @param _deltype 
 */
export function delObject(_objname, _deltype) {
    for (var i = 0; i < dataSet.length; i++) {
        var _obj = dataSet[i];
        if (isExists(_obj.name)) {
            if (_obj.name == _objname) {
                scene.remove(_obj);
                dataSet.splice(i, 1);
                i--;
                if (false == _deltype)
                    return true;
            }
        }
    }
    return false;
}

/**
 * 绘制立方体
 */

export function generateCube (item) {

    /**
     * 这里的 width、height、depth  类似于几何体中的 长 高 宽
     */
    const { width = 1000, height = 10, depth = width /* x、y、z 轴上的长度*/ } = item
    const { x = 0, y = 0, z = 0 } = item
    const { skinColor = 0x98750f } = item.style || {}
    const cubeGeometry = new THREE.BoxGeometry(width, height, depth)

    /**
     * 六面着色，每两面颜色一致（后续会在这方面做扩展）
     */


    cubeGeometry.faces.forEach((face, index, faces) => {
        // face.color.setHex(skinColor)
        var hex = skinColor || Math.random() * 0x531844;
        if (index % 2 === 0) {
            face.color.setHex(hex)
            faces[index + 1].color.setHex(hex)
        }
    })

    const default_obj = {
        vertexColors: THREE.FaceColors
    }
    /* 上、下、前、后、左、右 */
    let [skin_up_obj, skin_down_obj, skin_fore_obj, skin_behind_obj, skin_left_obj, skin_right_obj] = Array(6).fill(default_obj)


    let skin_opacity = 1
    const { skin } = item.style || undefined

    /**
     * 根据皮肤属性来生成六个面的皮肤
     */


    if (skin) {
        skin_opacity = isExists(skin.opacity) ?  skin.opacity: skin_opacity

        let {
            skin_right = '',
            skin_left = '',
            skin_up = '',
            skin_down = '',
            skin_fore = '',
            skin_behind = '',
            skinColor = ''
        } = skin

        const middleData = new Array(skin_right, skin_left, skin_up, skin_down, skin_fore, skin_behind)
        // middleData.forEach((tempItem, index) => {
        //     if (isExists(tempItem)) {
        //         middleData[index] = tempItem.skinColor || 0xcccccc
        //     } else {
        //         middleData[index] = skinColor || 0xcccccc
        //     }
        // })

        // console.log('middleData', middleData)
        const [skin_right_handle_end, skin_left_handle_end, skin_up_handle_end, skin_down_handle_end, skin_fore_handle_end, skin_behind_handle_end] = middleData

        skin_right_obj = generateSkinOption(depth, height, skin_right, cubeGeometry, skin_right_handle_end, 0)
        skin_left_obj = generateSkinOption(depth, height, skin_left, cubeGeometry, skin_left_handle_end, 2)
        skin_up_obj = generateSkinOption(width, depth, skin_up, cubeGeometry, skin_up_handle_end, 4)
        skin_down_obj = generateSkinOption(width, depth, skin_down, cubeGeometry, skin_down_handle_end, 6)
        skin_fore_obj = generateSkinOption(width, height, skin_fore, cubeGeometry, skin_fore_handle_end, 8)
        skin_behind_obj = generateSkinOption(width, height, skin_behind, cubeGeometry, skin_behind_handle_end, 10)
    }

    /**
     * 生成六个面的皮肤材质
     * 结合六个面的几何立方来生成一个完整的立方体
     */


    const cubeMaterialArray = []
    /* 顺序是 右 左 上 下 前 后 */
    new Array(skin_right_obj, skin_left_obj, skin_up_obj, skin_down_obj, skin_fore_obj, skin_behind_obj).forEach(tempItem => {
        cubeMaterialArray.push(new THREE.MeshLambertMaterial(tempItem))
    })

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterialArray)
    cube.castShadow = true
    cube.receiveShadow = true
    cube.uuid = item.uuid
    cube.name = item.name
    cube.position.set(x, y, z)

    /**
    * 进行立方体的旋转操作
    */


    handleRotaion(item.rotation, cube)
    return cube
}

/**
 * 生成皮肤配置
 * @param width 
 * @param height 
 * @param skin_obj 
 * @param cubeGeometry 
 * @param cubeColor 
 * @param cubeFaceNumber 
 */
function generateSkinOption(width: any, height: any, skin_obj: any, cubeGeometry: THREE.BoxGeometry, cubeColor: any, cubeFaceNumber: number): any {
    /**
     * 为 null、undefined
     * 类型为 数组，不为 object
     */
    if (!isExists(skin_obj)) {
        return {
            vertexColors: THREE.FaceColors
        }
    }


    const { imgurl, transparent, blending, skinColor } = skin_obj
    if (isExists(imgurl)) {
        const textureMap = generateImgageTexture(width, height, skin_obj)
        const materialModel = {
            color: cubeColor,
            map: textureMap,
            opacity: skin_obj.opacity || 1,
        } as any

        if (transparent) {
            materialModel.transparent = transparent
        }

        /* NOTE THREE.AdditiveBlending 这种渲染方式 会让物体呈现半透明状态*/
        if (blending) {
            materialModel.blending = THREE.AdditiveBlending//使用饱和度叠加渲染
        }


        return materialModel
    }

    if (isExists(skinColor)) {
        cubeGeometry.faces[cubeFaceNumber].color.setHex(skinColor)
        cubeGeometry.faces[cubeFaceNumber + 1].color.setHex(skinColor)
        return {
            vertexColors: THREE.FaceColors
        }
    } 
}

/**
 * 生成图片纹理
 * @param width 
 * @param height 
 * @param skin_obj 
 */
function generateImgageTexture(width: any, height: any, skin_obj: any): any {

    let [imgWidth, imgHeight] = [128, 128]

    imgWidth = skin_obj.width || imgWidth
    imgHeight = skin_obj.height || imgHeight

    const { imgurl, repeatx = false, repeaty = false } = skin_obj
    const texture = new THREE.TextureLoader().load(BASE_PATH + imgurl)
    let repeat = false
    if (repeatx) {
        texture.wrapS = THREE.RepeatWrapping
        repeat = true
    }
    if (repeaty) {
        texture.wrapT = THREE.RepeatWrapping
        repeat = true
    }
    if (repeat) {
        texture.repeat.set(width / imgWidth, height / imgWidth)
    }

    // console.log('width / imgWidth, height / imgWidth', width / imgWidth, height / imgWidth)

    return texture
}

/**
 * 生成精灵图
 */
function generateSprite () {
    // TODO
}

/**
 * 挖洞，往墙上挂东西
 * @param wallChilrenObj 
 */
export function generateHole(wallChilrenObj: { depth?: any; height?: any; width?: any; startDot?: any; endDot?: any; rotation?: any; uuid?: any; name?: any; skin?: any; objType?: any; skinColor?: any } | any): any {
    /* 物体的厚度、高度、宽度 */
    const { depth: commonDepth = 40, height: commonHeight = 100, width: commonWidth = 300 } = wallChilrenObj
    const commonSkin = 0x98750f

    let wallWidth = commonWidth
    let wallDepth = wallChilrenObj.depth || commonDepth
    const { startDot, endDot } = wallChilrenObj
    const { x: sX = 0, y: sY = 0, z: sZ = 0 } = startDot
    const { x: eX = 0, y: eY = 0, z: eZ = 0 } = endDot

    const [positionX, positionY, positionZ] = [
        (sX + eX) / 2,
        (sY + eY) / 2,
        (sZ + eZ) / 2,
    ]

    if (sZ === eZ) {
        wallWidth = Math.abs(sX - eX)
        wallDepth = wallChilrenObj.depth || commonDepth
    } else if (sX === eX) {
        wallWidth = wallChilrenObj.depth || commonDepth
        wallDepth = Math.abs(sZ - eZ)
    }

    const { height, rotation, uuid, name, skin, objType, skinColor } = wallChilrenObj
    const cubeObj = {
        width: wallWidth,
        height: height || commonHeight,
        depth: wallDepth,
        rotation,
        objType,
        x: positionX,
        y: positionY,
        z: positionZ,
        uuid,
        name,
        style: {
            skinColor: skinColor || commonSkin,
            skin
        }
    }

    let cube = generateCube(cubeObj)
    return cube
}

/**
 * 创建一个几何平面
 * @param obj 
 */
export function createPlaneGeometry(obj: { width: any; height: any; imgurl: any; y: any; transparent: any; opacity: any; rotation: any; side?: any; blending?: any; x?: any; z?: any }) {
    let texture: THREE.Texture
    let transparent = obj.transparent || false

    if (typeof obj.imgurl === 'string') {
        let imgurl = obj.imgurl
        if (!imgurl.includes("data:image/")) {
            imgurl = this.BASE_PATH + imgurl
        }

        texture = new THREE.TextureLoader().load(imgurl)
    } else {
        texture = new THREE.CanvasTexture(obj.imgurl as HTMLCanvasElement)
    }

    const materialModel = {
        map: texture,
        side: obj.side ||  THREE.FrontSide || THREE.DoubleSide,
        transparent: transparent,
        opacity: obj.opacity || 1,
    } as any

    if (obj.blending) {
        materialModel.blending = THREE.AdditiveBlending /* 使用饱和度叠加渲染 */
    }

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(obj.width, obj.height, 1, 1),
        new THREE.MeshBasicMaterial(materialModel)
    )

    plane.position.x = obj.x || 0;
    plane.position.y = obj.y || 0;
    plane.position.z = obj.z || 0;

    /**
    * 进行立方体的旋转操作
    */


    handleRotaion(obj.rotation, plane)

    return plane
}

/**
 * 获取目标对象集合
 * @param event 
 */
export function getTargets (event) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    mouseClick.x = (event.offsetX / domElement.offsetWidth) * 2 - 1;
    mouseClick.y = -(event.offsetY / domElement.offsetHeight) * 2 + 1;
    raycaster.setFromCamera(mouseClick, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    return intersects
}

/**
 * 获取目标对象
 * @param event 
 */
export function getTarget (event) {
    const intersects = getTargets(event)
    if (intersects.length > 0) {
        return intersects[0]
    }

    // console.warn('没有获取到任何目标对象', intersects)
}

export function clearHightBox (targetObj) {
    const [SELECTED] = outlinePass.selectedObjects
    if (SELECTED === targetObj) {
        outlinePass.selectedObjects = []
        return true
    }

    return false
}

/**
 * 获取一个 THREE.GROUP
 */
export function generateGroup () {
    return new THREE.Group()
}