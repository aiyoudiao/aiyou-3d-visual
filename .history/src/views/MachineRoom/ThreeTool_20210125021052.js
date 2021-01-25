// export const generateTextMarker () {
//     // TODO 封装绘制文本的方法
// }

export function isClickModel(name, object) {
    if (object.name.includes(name)) {
        return object
    } else if (object.parent) {
        return isClickModel(name, object.parent)
    }

    return null
}

export function findTopObj (name, object) {
    if (object.name.includes(name) && object.parent.name !== 'mainScene') {
        return object
    } else if (object.parent) {
        return findTopObj(name, object.parent)
    }

    return null
}