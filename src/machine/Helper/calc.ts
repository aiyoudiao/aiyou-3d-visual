/**
 * 模型之间和运算相关的操作
 */

// import ThreeBSP from './threebsp'
import { CSG } from 'three-csg-ts'
import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)
// const ThreeBSP = require('../Lib/three-bsp')(THREE)
import { addObject } from './core'

/**
 * 处理旋转操作
 * @param rotation 
 * @param cubeObj 
 */
export function handleRotaion(rotation: { direction: string | number }[], cubeObj: THREE.Object3D) {
    if (![null, undefined].includes(rotation)) {
        type itemType =
            { direction: string; degree: number } | { direction: 'arb'; degree: [x: number, y: number, z: number, angle: number] /* x,y,z是向量0,1,0  angle表示y轴旋转 */ }
        const rotationAction = {
            x: (item: itemType, cube: { rotateX: (arg0: number) => void }) => {
                cube.rotateX(item.degree as number)
            },
            y: (item: itemType, cube: { rotateY: (arg0: number) => void }) => {
                cube.rotateY(item.degree as number)
            },
            z: (item: itemType, cube: { rotateZ: (arg0: number) => void }) => {
                cube.rotateZ(item.degree as number)
            },
            arb: (item: itemType, cube: { rotateOnAxis: (arg0: THREE.Vector3, arg1: any) => void }) => {
                cube.rotateOnAxis(
                    new THREE.Vector3(...(item.degree as Array<number>).slice(0, 3)),
                    item.degree[3]
                )
            }
        }
        rotation.forEach((rotationItem: { direction: string | number }) => {
            const action = rotationAction[rotationItem.direction]
            action(rotationItem, cubeObj)
        })
    }
}

/**
 * 合并模型，模型之间的 交集 并集 操作
 * @param mergeOp 
 * @param firstObj 
 * @param secondObj 
 * @param commonSkin 
 */
export function mergeModel(mergeOp: any, firstObj: any, secondObj: THREE.Mesh<THREE.BoxGeometry, any[]>, commonSkin?: any): any {
    firstObj.updateMatrix()
    secondObj.updateMatrix()

    const firstObjBSP = CSG.fromMesh(firstObj)
    const secondObjBSP = CSG.fromMesh(secondObj)

    let resultObjBSP = null;
    switch (mergeOp) {
        case '-': {
            resultObjBSP = firstObjBSP.subtract(secondObjBSP)
        } break;
        case '+': {
            // const subMesh = new THREE.Mesh(secondObj as any)
            secondObj.updateMatrix();
            firstObj.geometry.merge(secondObj.geometry, secondObj.matrix)
            firstObj.updateMatrix()
            return firstObj
        }
        case '&': {
            resultObjBSP = firstObjBSP.intersect(secondObjBSP)
        } break;
        default: {
            addObject(secondObj)
            return firstObj
        }
    }

    const result: any = CSG.toMesh(resultObjBSP, firstObj.matrix) // resultObjBSP.toMesh(cubeMaterialArray)
    result.material.shading = THREE.FlatShading
    result.geometry.computeFaceNormals()
    result.geometry.computeVertexNormals()
    result.uuid = firstObj.uuid + mergeOp + secondObj.uuid
    result.name = firstObj.name + mergeOp + secondObj.name
    result.material.needsUpdate = true
    result.geometry.bufferNeedUpdate = true
    result.geometry.uvsNeedUpdate = true
    result.material = firstObj.material

    firstObj.material

    /**
     * 循环处理 整合后的模型的面
     * 最终的结果的所有面 与 firstObj模型的所有面 和 secondObj模型的所有面的三维 x y z 进行比较
     * 如果有相同的就设置 最终结果的那一面的 颜色 以及 materialIndex
     */


    const [resultFaces, firstObjFace, secondObjFace] = [result.geometry.faces, firstObj.geometry.faces, secondObj.geometry.faces]
    resultFaces.forEach((resultFaceItem: { vertexNormals: any[]; color: { setHex: (arg0: any) => void }; materialIndex: number }, resultFaceIndex: any) => {
        let faceset = false

        firstObjFace.forEach((firstFaceItem: any, firstFaceIndex: any) => {
            // const {} = resultFaceItem.vertexNormals[0]
            /* resultFaceItem.vertexNormals == firstFaceItem.vertexNormals*/
            
            const faceset = resultFaceItem.vertexNormals.every((subItem: { x: any; y: any; z: any }, subIndex: string | number) => {
                return subItem.x === firstFaceItem.vertexNormals[subIndex].x &&
                    subItem.y === firstFaceItem.vertexNormals[subIndex].y &&
                    subItem.z === firstFaceItem.vertexNormals[subIndex].z
            })

            if (faceset) {
                resultFaceItem.color.setHex(commonSkin)
                resultFaceItem.materialIndex = firstFaceItem.materialIndex
            }
        })

        if (faceset === false) {
            secondObjFace.forEach((secondFaceItem, secondFaceIndex) => {
                // const {} = resultFaceItem.vertexNormals[0]
                /* resultFaceItem.vertexNormals == secondFaceItem.vertexNormals*/
                const faceset = resultFaceItem.vertexNormals.every((subItem: { x: number; y: number; z: number }, subIndex: string | number) => {
                    return subItem.x === secondFaceItem.vertexNormals[subIndex].x &&
                        subItem.y === secondFaceItem.vertexNormals[subIndex].y &&
                        subItem.z === secondFaceItem.vertexNormals[subIndex].z
                })

                if (faceset) {
                    resultFaceItem.color.setHex(commonSkin)
                    resultFaceItem.materialIndex = secondFaceItem.materialIndex
                }
            })
        }

        if (faceset === false) {
            resultFaceItem.color.setHex(commonSkin)
        }
    })

    result.castShadow = true
    result.receiveShadow = true

    return result
}

/**
 * 合并模型，模型之间的 交集 并集 操作
 * @param mergeOp 
 * @param firstObj 
 * @param secondObj 
 * @param commonSkin 
 */
export function mergeModel2(mergeOp: any, firstObj: any, secondObj: THREE.Mesh<THREE.BoxGeometry, any[]>, commonSkin?: any): any {



    firstObj.updateMatrix()
    secondObj.updateMatrix()

    const firstObjBSP = new ThreeBSP(firstObj)
    const secondObjBSP = new ThreeBSP(secondObj)

    let resultObjBSP = null;
    switch (mergeOp) {
        case '-': {
            resultObjBSP = firstObjBSP.subtract(secondObjBSP)
        } break;
        case '+': {
            // const subMesh = new THREE.Mesh(secondObj as any)
            secondObj.updateMatrix();
            firstObj.geometry.merge(secondObj.geometry, secondObj.matrix)
            firstObj.updateMatrix()
            return firstObj
        }
        case '&': {
            resultObjBSP = firstObjBSP.intersect(secondObjBSP)
        } break;
        default: {
            addObject(secondObj)
            return firstObj
        }
    }
    var cubeMaterialArray = [];
    for (var i = 0; i < 1; i++) {
        cubeMaterialArray.push(new THREE.MeshLambertMaterial({
            //map: _this.createSkin(128, 128, { imgurl: '../datacenterdemo/res2/'+(i%11)+'.jpg' }),
            vertexColors: true
        }));
    }
    var cubeMaterials = cubeMaterialArray;

    var result = resultObjBSP.toMesh(cubeMaterials);
    result.material.shading = THREE.FlatShading;
    result.geometry.computeFaceNormals();
    result.geometry.computeVertexNormals();
    result.uuid = firstObj.uuid + mergeOp + secondObj.uuid;
    result.name = firstObj.name + mergeOp + secondObj.name;
    result.material.needsUpdate = true;
    result.geometry.buffersNeedUpdate = true;
    result.geometry.uvsNeedUpdate = true;

    /**
     * 循环处理 整合后的模型的面
     * 最终的结果的所有面 与 firstObj模型的所有面 和 secondObj模型的所有面的三维 x y z 进行比较
     * 如果有相同的就设置 最终结果的那一面的 颜色 以及 materialIndex
     */


    const [resultFaces, firstObjFace, secondObjFace] = [result.geometry.faces, firstObj.geometry.faces, secondObj.geometry.faces]
    resultFaces.forEach((resultFaceItem: { vertexNormals: any[]; color: { setHex: (arg0: any) => void }; materialIndex: number }, resultFaceIndex: any) => {
        let faceset = false

        firstObjFace.forEach((firstFaceItem: any, firstFaceIndex: any) => {
            // const {} = resultFaceItem.vertexNormals[0]
            /* resultFaceItem.vertexNormals == firstFaceItem.vertexNormals*/
            
            const faceset = resultFaceItem.vertexNormals.every((subItem: { x: any; y: any; z: any }, subIndex: string | number) => {
                return subItem.x === firstFaceItem.vertexNormals[subIndex].x &&
                    subItem.y === firstFaceItem.vertexNormals[subIndex].y &&
                    subItem.z === firstFaceItem.vertexNormals[subIndex].z
            })

            if (faceset) {
                resultFaceItem.color.setHex(commonSkin)
                resultFaceItem.materialIndex = firstFaceItem.materialIndex
            }
        })

        if (faceset === false) {
            secondObjFace.forEach((secondFaceItem, secondFaceIndex) => {
                // const {} = resultFaceItem.vertexNormals[0]
                /* resultFaceItem.vertexNormals == secondFaceItem.vertexNormals*/
                const faceset = resultFaceItem.vertexNormals.every((subItem: { x: number; y: number; z: number }, subIndex: string | number) => {
                    return subItem.x === secondFaceItem.vertexNormals[subIndex].x &&
                        subItem.y === secondFaceItem.vertexNormals[subIndex].y &&
                        subItem.z === secondFaceItem.vertexNormals[subIndex].z
                })

                if (faceset) {
                    resultFaceItem.color.setHex(commonSkin)
                    resultFaceItem.materialIndex = secondFaceItem.materialIndex
                }
            })
        }

        if (faceset === false) {
            resultFaceItem.color.setHex(commonSkin)
        }
    })

    result.castShadow = true
    result.receiveShadow = true

    return result
}
