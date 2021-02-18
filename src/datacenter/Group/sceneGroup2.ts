import { createClone, createFace, createGroup, createImportModel, createMachine, createText, createTube } from "../Helper/core";
import { BASE_PATH } from "../Helper/util";
import genarateGroupCommmon from "./groupCommon";

let sceneGroup2, sceneGroup2Animate

export default async function sceneGroup2Fn(refresh?: boolean) {


    if (sceneGroup2 && sceneGroup2Animate && !refresh) {
        return { sceneGroup2, sceneGroup2Animate }
    }

    const { earth, machine } = genarateGroupCommmon();
    const earth1 = createClone(earth, {
        position: { x: 0, z: -10, y: -1.1 },
    });
    const machine1 = createClone(machine, {
        position: { x: 0, y: -5, z: 10 },
    });
    const machine2 = createMachine(BASE_PATH + "/img/electronics.png", {
        position: { x: 26, y: -5 },
    });
    const machine3 = createClone(machine2, {
        position: { x: 45, y: -5 },
    });
    const computer1 = await createImportModel(
        BASE_PATH + "/model/com/computer.gltf",
        {
            scale: { x: 150, y: 150, z: 150 },
            position: { x: 71, y: -6, z: 15 },
        }
    );
    const computer2 = createClone(computer1, {
        position: { z: -5 },
    });
    const { texture: tubeTexture1, mesh: tube1 } = await createTube(
        [0, -5, 10],
        [15, -5, 0],
        [56, -5, 0],
        [71, -5, 10]
    );
    const { texture: tubeTexture2, mesh: tube2 } = await createTube(
        [0, -5, -10],
        [15, -5, 0],
        [56, -5, 0],
        [71, -5, -10]
    );
    const face = createFace(100, 56, 2, {
        rotation: { x: Math.PI / 2 },
        position: { x: -13, y: -6.1, z: -28 },
    });
    const text = await createText(
        "漕河泾数据中心",
        "rgb(216, 120, 133)",
        {
            position: { x: 39, y: -3, z: 22 },
        }
    );
    sceneGroup2 = createGroup(
        earth1,
        machine1,
        machine2,
        machine3,
        tube1,
        tube2,
        computer1,
        computer2,
        face,
        text
    );

    sceneGroup2Animate = function () {
        tubeTexture1.offset.x -= 0.022;
        tubeTexture2.offset.x -= 0.02;
    };

    return { sceneGroup2, sceneGroup2Animate }
}