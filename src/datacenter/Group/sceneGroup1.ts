
import { createClone, createFace, createTube, createText, createGroup, createImportModel, createTextCanvas } from "../Helper/core";
import { BASE_PATH } from "../Helper/util";

let sceneGroup1, sceneGroup1Animate

export default async function sceneGroup1Fn (refresh?: boolean)  {

    if (sceneGroup1 && sceneGroup1Animate && !refresh) {
        return { sceneGroup1, sceneGroup1Animate }
    }

    // const { earth, machine } = genarateGroupCommmon()
    // const earth1 = createClone(earth, { position: { x: 15, y: -1 } });
    // const machine1 = createClone(machine, {
    //     position: { x: -15 },
    // });
    // const machine2 = createClone(machine, {
    //     rotation: { x: Math.PI / 2 },
    //     position: { x: -15, y: -1, z: 15 },
    // });
    // const machine3 = createClone(machine, {
    //     rotation: { x: Math.PI / 2 },
    //     position: { x: 15, y: -1, z: 15 },
    // });

    const computerList = []

    const computer1 = await createImportModel(
        BASE_PATH + "/model/com/computer.gltf",
        {
            scale: { x: 150, y: 150, z: 150 },
            position: { x: -20, y: -6, z: -15 },
        }
    );

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const computerObj = createClone(computer1, {
                position: { x: -20 + i * 15, y: -6, z: -15 + j * 20 },
            });
            computerList.push(computerObj)
        }
    }

    const face = createFace(100, 56, 2, {
    // const face = createFace(50, 60, 4, {
        rotation: { x: Math.PI / 2 },
        position: { x: -65, y: -6.1, z: -30 },
    });

    let tubeTextureList = []
    let tubeMeshList = []
    for (let i = 0; i < 3; i++) {
        const { texture: tubeTexture1, mesh: tube1 } = await createTube(
            [-20, -5, -20 + i * 20],
            [-20 + 15 * 2, -5, -20 + i * 20]
        );
        tubeTextureList.push(tubeTexture1)
        tubeMeshList.push(tube1)
    }

    const text = await createText(
        "张江数据中心",
        "rgb(216, 120, 133)",
        {
            position: { y: 6, z: 25 },
        }
    );
    sceneGroup1 = createGroup(
        // machine,
        // machine1,
        // earth,
        // earth1,
        // machine2,
        // machine3,
        face,
        ...computerList,
        ...tubeMeshList,
        // tube2,
        // tube3,
        // tube4,
        // tube5,
        text
    );
    sceneGroup1.position.x = -60;

    sceneGroup1Animate = function () {
        tubeTextureList.forEach((tubeTexture, i) => {
            tubeTexture.offset.x -= (0.022 + i * 0.002)
        })
    };

    return { sceneGroup1, sceneGroup1Animate }
}