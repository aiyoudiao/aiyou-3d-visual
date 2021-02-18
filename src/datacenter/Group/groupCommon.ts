import { createEarth, createMachine } from "../Helper/core";
import { BASE_PATH } from "../Helper/util";

let groupCommon

export default function genarateGroupCommmon (refresh?: boolean) {

    if (groupCommon && !refresh) {
        return groupCommon
    }

    const earth = createEarth({ position: { x: -15, y: -1 } });
    // 这里注意路径的填写：打包后是 main.js 和 assets 文件夹在同一目录下，所以引用时要用 './' 
    // 这里用 '../' 也可以的原因是，ThreeJS内部加载路径时用了寻址的方法
    const machine = createMachine(BASE_PATH + "/img/move.png", {
        position: { x: 15, z: -20, y: -5 },
    });

    groupCommon = { earth, machine }
    return groupCommon
}