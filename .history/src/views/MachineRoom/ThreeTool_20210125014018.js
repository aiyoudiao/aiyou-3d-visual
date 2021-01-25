// export const generateTextMarker () {
//     // TODO 封装绘制文本的方法
// }

export function isClickModel(name, object) {
    if (object.name.includes(name) && object.userData.name.includes('JG')) {
        return object
    } else if (object.parent) {
        return isClickModel(name, object.parent)
    }

    return null
}