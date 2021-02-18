import TWEEN from '@tweenjs/tween.js'
import { createSpriteText, createLightBeam, createGroup } from '../Helper/core';

let normalSceneGroup, normalSceneGroupAnimate

export default async function normalSceneGroupFn(refresh?: boolean) {

    if (normalSceneGroup && normalSceneGroupAnimate && !refresh) {
        return { normalSceneGroup, normalSceneGroupAnimate }
    }

    const { sprite: spriteText1 } = await createSpriteText("#label1", {
        position: { x: -65, y: 23 },
    });

    const { sprite: spriteText2 } = await createSpriteText("#label2", {
        position: { x: 36, y: 23 },
    });

    
    const beam = createLightBeam(100, 56, 2, "red", {
        scale: { z: 10 },
        rotation: { x: Math.PI / 2 },
        position: { x: -13, y: 3.9, z: -28 },
    });

    // const beam2 = createLightBeam(100, 56, 2, "green", {
    //     scale: { z: 30 },
    //     rotation: { x: Math.PI / 2 },
    //     position: { x: -145, y: 23.9, z: -30 }
    // });
    normalSceneGroup = createGroup(
        spriteText1,
        spriteText2,
        beam,
        // beam2
    );

    const tween1 = new TWEEN.Tween(beam.material[1])
        .to({ opacity: 0 }, 1000)
        .onComplete(() => {
            tween2.start();
        });
    const tween2 = new TWEEN.Tween(beam.material[1])
        .to({ opacity: 1 }, 1000)
        .onComplete(() => {
            tween1.start();
        });
    tween1.start();
    normalSceneGroupAnimate = function () {
        TWEEN.update();
    };
    return { normalSceneGroup, normalSceneGroupAnimate }
}