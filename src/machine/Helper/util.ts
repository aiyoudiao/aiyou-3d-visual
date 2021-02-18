/**
 * 辅助函数
 */

import * as THREE from "three"

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
export function findTopObj (name, object) {
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
 * 向下查找，找到最下层的该名称对象，找不到就返回`null`
 * 和 Mesh.getObjectByName方法很像
 * @param name 
 * @param mesh 
 */
export function findMeshByName (name, mesh)  {
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
export function generateUUID () {
    return (Math.random() * Math.random() * Math.random()).toString().slice(1)
}