import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ==============================
// SCENE
// ==============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x9aa5a3);

scene.fog = new THREE.Fog(
    0x9aa5a3,
    20,
    110
);


// ==============================
// CAMERA
// ==============================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(0, 2, 8);


// ==============================
// RENDERER
// ==============================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);


// ==============================
// LIGHTING
// ==============================

const ambientLight = new THREE.HemisphereLight(
    0xb8c4c2,
    0x30352f,
    2
);

scene.add(ambientLight);


const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(
    30,
    50,
    20
);

sun.castShadow = true;

scene.add(sun);


// ==============================
// GROUND
// ==============================

const groundGeometry = new THREE.PlaneGeometry(
    300,
    300,
    40,
    40
);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x354238,
    roughness: 1
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// ==============================
// ROCKS
// ==============================

function createRock(x, z, scale = 1) {

    const geometry = new THREE.DodecahedronGeometry(
        1,
        0
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x4d514d,
        roughness: 1
    });

    const rock = new THREE.Mesh(
        geometry,
        material
    );

    rock.position.set(
        x,
        0.5 * scale,
        z
    );

    rock.scale.set(
        scale,
        scale * 0.7,
        scale
    );

    rock.rotation.y = Math.random() * Math.PI;

    rock.castShadow = true;
    rock.receiveShadow = true;

    scene.add(rock);
}


// ==============================
// TREES
// ==============================

function createTree(x, z, scale = 1) {

    const tree = new THREE.Group();


    // Trunk

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.25,
            0.4,
            3,
            8
        );

    const trunkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x49372a
        });

    const trunk = new THREE.Mesh(
        trunkGeometry,
        trunkMaterial
    );

    trunk.position.y = 1.5;

    trunk.castShadow = true;

    tree.add(trunk);


    // Leaves

    const leavesGeometry =
        new THREE.ConeGeometry(
            2,
            4,
            8
        );

    const leavesMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x263b2b
        });

    const leaves = new THREE.Mesh(
        leavesGeometry,
        leavesMaterial
    );

    leaves.position.y = 4;

    leaves.castShadow = true;

    tree.add(leaves);


    tree.position.set(x, 0, z);

    tree.scale.setScalar(scale);

    scene.add(tree);
}


// ==============================
// WORLD GENERATION
// ==============================

for (let i = 0; i < 100; i++) {

    const x =
        (Math.random() - 0.5) * 180;

    const z =
        (Math.random() - 0.5) * 180;


    // Keep the starting area clear

    if (
        Math.abs(x) < 12 &&
        Math.abs(z) < 12
    ) {
        continue;
    }

    createTree(
        x,
        z,
        0.7 + Math.random() * 0.7
    );
}


for (let i = 0; i < 35; i++) {

    const x =
        (Math.random() - 0.5) * 150;

    const z =
        (Math.random() - 0.5) * 150;

    createRock(
        x,
        z,
        0.4 + Math.random() * 1
    );
}


// ==============================
// CAMP
// ==============================

function createCamp() {

    // Fire pit

    const fireGeometry =
        new THREE.CylinderGeometry(
            1.2,
            1.2,
            0.25,
            12
        );

    const fireMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x252525
        });

    const firePit = new THREE.Mesh(
        fireGeometry,
        fireMaterial
    );

    firePit.position.y = 0.12;

    firePit.castShadow = true;

    scene.add(firePit);


    // Fire

    const flameGeometry =
        new THREE.SphereGeometry(
            0.5,
            8,
            8
        );

    const flameMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xff9d32
        });

    const flame = new THREE.Mesh(
        flameGeometry,
        flameMaterial
    );

    flame.position.y = 0.8;

    flame.scale.y = 1.5;

    scene.add(flame);


    // Fire light

    const fireLight =
        new THREE.PointLight(
            0xff8c42,
            5,
            15
        );

    fireLight.position.set(
        0,
        1,
        0
    );

    scene.add(fireLight);


    // Logs

    for (let i = 0; i < 3; i++) {

        const logGeometry =
            new THREE.CylinderGeometry(
                0.15,
                0.15,
                2.5,
                8
            );

        const logMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x5a3b27
            });

        const log = new THREE.Mesh(
            logGeometry,
            logMaterial
        );

        log.position.y = 0.3;

        log.rotation.z = Math.PI / 2;

        log.rotation.y =
            i * Math.PI / 3;

        log.castShadow = true;

        scene.add(log);
    }
}

createCamp();


// ==============================
// PLAYER
// ==============================

const player = {
    position: new THREE.Vector3(0, 2, 8),

    velocity: new THREE.Vector3(),

    speed: 6,

    yaw: 0,
    pitch: 0
};


// ==============================
// CONTROLS
// ==============================

const keys = {};

document.addEventListener(
    "keydown",
    event => {
        keys[event.code] = true;
    }
);

document.addEventListener(
    "keyup",
    event => {
        keys[event.code] = false;
    }
);


// ==============================
// MOUSE LOOK
// ==============================

document.addEventListener(
    "mousemove",
    event => {

        if (
            document.pointerLockElement !==
            renderer.domElement
        ) {
            return;
        }

        player.yaw -=
            event.movementX * 0.002;

        player.pitch -=
            event.movementY * 0.002;

        player.pitch = Math.max(
            -Math.PI / 2 + 0.1,
            Math.min(
                Math.PI / 2 - 0.1,
                player.pitch
            )
        );
    }
);


// ==============================
// START GAME
// ==============================

const startScreen =
    document.getElementById("start-screen");

startScreen.addEventListener(
    "click",
    () => {

        renderer.domElement.requestPointerLock();

        startScreen.style.display = "none";
    }
);


// ==============================
// MOVEMENT
// ==============================

const clock = new THREE.Clock();

function updatePlayer(delta) {

    const direction =
        new THREE.Vector3();

    if (keys["KeyW"])
        direction.z -= 1;

    if (keys["KeyS"])
        direction.z += 1;

    if (keys["KeyA"])
        direction.x -= 1;

    if (keys["KeyD"])
        direction.x += 1;


    if (direction.length() > 0) {

        direction.normalize();

        direction.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            player.yaw
        );

        player.position.x +=
            direction.x *
            player.speed *
            delta;

        player.position.z +=
            direction.z *
            player.speed *
            delta;
    }


    // Keep player above ground

    player.position.y = 2;


    camera.position.copy(
        player.position
    );

    camera.rotation.order = "YXZ";

    camera.rotation.y =
        player.yaw;

    camera.rotation.x =
        player.pitch;
}


// ==============================
// ANIMATION
// ==============================

function animate() {

    requestAnimationFrame(animate);

    const delta =
        Math.min(clock.getDelta(), 0.05);

    updatePlayer(delta);

    renderer.render(
        scene,
        camera
    );
}

animate();


// ==============================
// RESIZE
// ==============================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
