// obj sizes are written 10x!
const body = document.body
const bind_keys = ["Space", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", ]
body.addEventListener("keydown", event => {
    if (bind_keys.includes(event.code) === true){
        event.preventDefault()
    }
});
const displayCurrent = document.getElementById("game");
const display_3d = document.getElementById("game_field_3d");
const display_2d = document.getElementById("game_field_2d");
const Height = displayCurrent.clientHeight;
const Width = displayCurrent.clientWidth;

const world = new CANNON.World();
world.gravity.set(0, 0, -9.82);

const ground_data = []

const renderer = new THREE.WebGLRenderer({ antialias: false, canvas: display_3d });
renderer.setSize(Width, Height, false);
renderer.setClearColor(0xdddddd, 1);
renderer.setPixelRatio(0.5);

display_3d.width = Width / 2;
display_3d.height = Height / 2;
display_3d.style.width = "800px";
display_3d.style.height = "600px";
display_2d.width = Width;
display_2d.height = Height;


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, Width / Height);
camera.position.y = -1.7;
camera.position.z = 1.5;
camera.rotation.x = Math.PI / 32 * 11;

scene.add(camera);

const ground_material = new CANNON.Material("ground_material");
const wall_material = new CANNON.Material("wall_material");
const slope_material = new CANNON.Material("slope_material");
const hole_material = new CANNON.Material("hole_material");

const groundGeometry = new THREE.BoxGeometry(2, 1, 2);
groundGeometry.rotateX(Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xbc611e });
const ground_1 = new THREE.Mesh(groundGeometry, groundMaterial);
const ground_Shape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.5));
const ground_1_position = new CANNON.Vec3(0, 0, 0);
const ground_1_Body = new CANNON.Body({ mass: 0, shape: ground_Shape, position: ground_1_position, material: ground_material});
world.addBody(ground_1_Body);
scene.add(ground_1);

const ground_2 = new THREE.Mesh(groundGeometry, groundMaterial);
const ground_2_position = new CANNON.Vec3(0, 2, 0.5);
const ground_2_Body = new CANNON.Body({ mass: 0, shape: ground_Shape, position: ground_2_position, material: wall_material });
world.addBody(ground_2_Body);
scene.add(ground_2);

const slopeGeometry = new THREE.BoxGeometry(2, 0.2, 2);
slopeGeometry.rotateX(Math.PI / 2);
const slopeMaterial = new THREE.MeshStandardMaterial({ color: 0x00bfff });
const slope_1 = new THREE.Mesh(slopeGeometry, slopeMaterial);
const slope_Shape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.1));
const slope_1_position = new CANNON.Vec3(1.75, 0, 0.15);
const slope_1_Body = new CANNON.Body({ mass: 0, shape: slope_Shape, position: slope_1_position, material: slope_material});
slope_1_Body.quaternion.setFromEuler(0, Math.PI / 16, 0);
world.addBody(slope_1_Body);
scene.add(slope_1);

const slope_2 = new THREE.Mesh(slopeGeometry, slopeMaterial);
const slope_2_position = new CANNON.Vec3(-1.75, 0, 0.15);
const slope_2_Body = new CANNON.Body({ mass: 0, shape: slope_Shape, position: slope_2_position, material: slope_material});
slope_2_Body.quaternion.setFromEuler(0, Math.PI / 16 * -1, 0);
world.addBody(slope_2_Body);
scene.add(slope_2);

const hole_get_Shape = new CANNON.Box(new CANNON.Vec3(1, 0.25, 0.25));
const hole_1_position = new CANNON.Vec3(0, -1.25, -0.25);
const hole_1_Body = new CANNON.Body({ mass: 0, shape: hole_get_Shape, position: hole_1_position, material: hole_material });
hole_1_Body.tag = "hole_get"
world.addBody(hole_1_Body);

const hole_lost_Shape = new CANNON.Box(new CANNON.Vec3(0.1, 1, 0.1));
const hole_2_position = new CANNON.Vec3(2.75, 0, 0.1);
const hole_2_Body = new CANNON.Body({ mass: 0, shape: hole_lost_Shape, position: hole_2_position, material: hole_material });
hole_2_Body.tag = "hole_lost"
world.addBody(hole_2_Body);

const hole_3_position = new CANNON.Vec3(-2.75, 0, 0.1);
const hole_3_Body = new CANNON.Body({ mass: 0, shape: hole_lost_Shape, position: hole_3_position, material: hole_material });
hole_3_Body.tag = "hole_lost"
world.addBody(hole_3_Body);

const barrierGeometry1 = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
barrierGeometry1.rotateX(Math.PI / 2);
const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0xafafb0, metalness: 0.85, roughness: 0.2 });
const barrier_1 = new THREE.Mesh(barrierGeometry1, barrierMaterial);
const barrier_Shape1 = new CANNON.Cylinder(0.02, 0.02, 2, 8);
const barrier_1_position = new CANNON.Vec3(0.8, 0, 0.625);
const barrier_1_Body = new CANNON.Body({ mass: 0, shape: barrier_Shape1, position: barrier_1_position, material: ground_material});
barrier_1_Body.quaternion.setFromEuler(Math.PI / 2, Math.PI / 16 * -1, 0);
world.addBody(barrier_1_Body);
scene.add(barrier_1);

const barrier_2 = new THREE.Mesh(barrierGeometry1, barrierMaterial);
const barrier_2_position = new CANNON.Vec3(-0.8, 0, 0.625);
const barrier_2_Body = new CANNON.Body({ mass: 0, shape: barrier_Shape1, position: barrier_2_position, material: ground_material});
barrier_2_Body.quaternion.setFromEuler(Math.PI / 2, Math.PI / 16, 0);
world.addBody(barrier_2_Body);
scene.add(barrier_2);

const barrierGeometry2 = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
barrierGeometry2.rotateX(Math.PI / 2);
const barrier_3 = new THREE.Mesh(barrierGeometry2, barrierMaterial);
const barrier_Shape2 = new CANNON.Cylinder(0.02, 0.02, 1.4, 8);
const barrier_3_position = new CANNON.Vec3(0.8, 0.5, 0.85);
const barrier_3_Body = new CANNON.Body({ mass: 0, shape: barrier_Shape2, position: barrier_3_position, material: ground_material});
barrier_3_Body.quaternion.setFromEuler(Math.PI / 2, 0, 0);
world.addBody(barrier_3_Body);
scene.add(barrier_3);

const barrier_4 = new THREE.Mesh(barrierGeometry2, barrierMaterial);
const barrier_4_position = new CANNON.Vec3(-0.8, 0.5, 0.85);
const barrier_4_Body = new CANNON.Body({ mass: 0, shape: barrier_Shape2, position: barrier_4_position, material: ground_material});
barrier_4_Body.quaternion.setFromEuler(Math.PI / 2, 0, 0);
world.addBody(barrier_4_Body);
scene.add(barrier_4);



const move_groundGeometry = new THREE.BoxGeometry(2, 0.3, 2);
move_groundGeometry.rotateX(Math.PI / 2);
const move_groundMaterial = new THREE.MeshStandardMaterial({ color: 0xa05366 });
const move_ground_1 = new THREE.Mesh(move_groundGeometry, move_groundMaterial);
const move_ground_Shape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.15));
const move_ground_position = new CANNON.Vec3(0, 1.25, 0.55);
const move_ground_Body = new CANNON.Body({ mass: 5, shape: move_ground_Shape, position: move_ground_position, type: CANNON.Body.KINEMATIC, material: move_groundMaterial });
world.addBody(move_ground_Body);
scene.add(move_ground_1);

const light_1 = new THREE.PointLight(0xffffff, 2, 20, 1.0);
light_1.position.set(0, 0, 5);
scene.add(light_1);


const ambientLight = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambientLight)

const medal_Material = new CANNON.Material("medal_Material")

class medalPhysics {
    constructor(id, world, pos_x, pos_y, pos_z) {
        this.id = id;
        this.name = `medal_${id}`;
        this.removed = false;
    
        const medalGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16);
        medalGeometry.rotateX(Math.PI / 2);
        const medalMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.85, roughness: 0.2 });
        const medal_Shape = new CANNON.Cylinder(0.1, 0.1, 0.02, 8);
        const medal_Position = new CANNON.Vec3(pos_x, pos_y, pos_z);

        this.body = new CANNON.Body({ mass: 10, shape: medal_Shape, position: medal_Position, material: medal_Material });
        this.mesh = new THREE.Mesh(medalGeometry, medalMaterial);
        this.mesh.position.set(0, 0, 0);

        world.addBody(this.body);

        this.body.addEventListener("collide", (event) => {
            if (event.body.tag === "hole_get" && this.removed === false) {
                this.destroy()
                medal_remaining += 1;
            }
            if (event.body.tag === "hole_lost" && this.removed === false) {
                this.destroy()
            }
        });
    }

    update() {
        if (this.removed === false) {
            this.mesh.position.copy(this.body.position);
            this.mesh.quaternion.copy(this.body.quaternion);
        }
    }

    destroy() {
        this.removed = true
        medalDeleteWaiting.push(this)
    }
    
}
const MedalContactMaterial = new CANNON.ContactMaterial(medal_Material, medal_Material,{ friction: 0.02, restitution: 0.06 });
world.addContactMaterial(MedalContactMaterial);
const GroundContactMaterial = new CANNON.ContactMaterial(ground_material, medal_Material,{ friction: 0.002, restitution: 0.06 });
world.addContactMaterial(GroundContactMaterial);
const WallContactMaterial = new CANNON.ContactMaterial(wall_material, medal_Material,{ friction: 0.01, restitution: 0.06 });
world.addContactMaterial(GroundContactMaterial);
const Move_GroundContactMaterial = new CANNON.ContactMaterial(move_groundMaterial, medal_Material,{ friction: 0.005, restitution: 0.06 });
world.addContactMaterial(Move_GroundContactMaterial);
const SlopeContactMaterial = new CANNON.ContactMaterial(slope_material, medal_Material,{ friction: 0.0, restitution: 0.06 });
world.addContactMaterial(SlopeContactMaterial);

const medal_vec_down = new CANNON.Vec3(0, 0, -0.02)

const medalList = []
const medalDeleteWaiting = []
let medal_i = 1;


for (let i = 1; i <= 200; i++) {
    const medal = new medalPhysics(i, world, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 1 + 3)
    scene.add(medal.mesh);
    medalList.push(medal);
    medal_i = i
}

const speed = Math.PI
const pusher_velocity = 0.2
let Time = 0
let medal_remaining = 50

function medal_add() {
    if (medal_remaining >= 1) {
        medal_remaining -= 1
        medal_i += 1
        const medal = new medalPhysics(medal_i, world, Math.random() * 2 - 1, 0.8, 2)
        scene.add(medal.mesh);
        medalList.push(medal);
        key_down = true
    };
}

const medal_context = display_2d.getContext("2d");

function text_render() {
    medal_context.clearRect(0, 0, Width, Height)
    medal_context.beginPath()
    medal_context.font = "32px system-ui";
    medal_context.fillStyle = "#000000"
    medal_context.fillText(`クレジット: ${medal_remaining}`, 10, 40)
}

function ground_update() {
    ground_1.position.copy(ground_1_Body.position);
    ground_1.quaternion.copy(ground_1_Body.quaternion);
    ground_2.position.copy(ground_2_Body.position);
    ground_2.quaternion.copy(ground_2_Body.quaternion);
    slope_1.position.copy(slope_1_Body.position);
    slope_1.quaternion.copy(slope_1_Body.quaternion);
    slope_2.position.copy(slope_2_Body.position);
    slope_2.quaternion.copy(slope_2_Body.quaternion);
    barrier_1.position.copy(barrier_1_Body.position);
    barrier_1.quaternion.copy(barrier_1_Body.quaternion);
    barrier_2.position.copy(barrier_2_Body.position);
    barrier_2.quaternion.copy(barrier_2_Body.quaternion);
    barrier_3.position.copy(barrier_3_Body.position);
    barrier_3.quaternion.copy(barrier_3_Body.quaternion);
    barrier_4.position.copy(barrier_4_Body.position);
    barrier_4.quaternion.copy(barrier_4_Body.quaternion);

    move_ground_Body.velocity.set(0, Math.sin(speed * Time / 120) * speed * pusher_velocity * -1, 0)
    move_ground_1.position.copy(move_ground_Body.position);
    move_ground_1.quaternion.copy(move_ground_Body.quaternion);
}


const key_commands = {}
let key_down = false

function keyStatus_get() {
    addEventListener("keydown", (event) => {
        key_commands[event.code] = true
    });
    addEventListener("keyup", (event) => {
        key_commands[event.code] = false
    });
}

let swipe_beginX = 0
let swipe_beginY = 0
let swipe_amountX = 0
let swipe_amountY = 0
let swipe_X = 0
let swipe_Y = 0

function swipe_event() {
    display_2d.addEventListener("touchstart", (event) => {
        event.preventDefault()
        swipe_beginX = event.touches[0].clientX
        swipe_beginY = event.touches[0].clientY
    });

    display_2d.addEventListener("touchmove", (event) => {
        event.preventDefault()
        swipe_amountX += Math.abs(swipe_beginX - event.touches[0].clientX)
        swipe_amountY += Math.abs(swipe_beginY - event.touches[0].clientY)
        swipe_X = swipe_beginX - event.touches[0].clientX
        swipe_Y = swipe_beginY - event.touches[0].clientY
        swipe_beginX = event.touches[0].clientX
        swipe_beginY = event.touches[0].clientY
    });

    display_2d.addEventListener("touchend", (event) => { 
        event.preventDefault()
        if (swipe_amountX <= 32 && swipe_amountY <= 32) {
            medal_add()
        }
        swipe_amountX = 0
        swipe_amountY = 0
        swipe_X = 0
        swipe_Y = 0
    });
}

function medal_put_event() {
    if (key_down === false && key_commands["Space"] === true) {
        medal_add()
    }
    display_2d.addEventListener("mousedown", (event) => {
        if (key_down === false) {
            medal_add()
        }
    });


    if (key_commands["Space"] === false) {
        key_down = false
    }
    display_2d.addEventListener("mouseup", (event) => {
        if (key_down === true) {
            key_down = false
        }
    });
}

let camera_rotateX = camera.rotation.x / Math.PI * 64
let camera_rotateY = camera.rotation.y / Math.PI * 64
let camera_X_rotated = false
let camera_Y_rotated = false

function camera_rotate() {
    if (key_commands["ArrowUp"] && camera_rotateX < 32 && camera_X_rotated === false) {
        camera_rotateX += 1
        camera_X_rotated = true
    }
    if (key_commands["ArrowDown"] && camera_rotateX > -32 && camera_X_rotated === false) {
        camera_rotateX -= 1
        camera_X_rotated = true
    }
    if (key_commands["ArrowRight"] && camera_rotateY > -32 && camera_Y_rotated === false) {
        camera_rotateY += -1
        camera_Z_rotated = true
    }
    if (key_commands["ArrowLeft"] && camera_rotateY < 32 && camera_Y_rotated === false) {
        camera_rotateY += 1
        camera_Y_rotated = true
    }
    if (swipe_amountX > 32 || swipe_amountY > 32) {
        camera_rotateX += swipe_Y / 320 * 16
        camera_rotateY += swipe_X / 320 * 16
    }
    camera.rotation.x += (Math.PI / 64 * camera_rotateX - camera.rotation.x) / 16
    camera.rotation.y += (Math.PI / 64 * camera_rotateY - camera.rotation.y) / 16
}

function render() {
    requestAnimationFrame(render);
    Time += 1
    camera_X_rotated = false
    camera_Y_rotated = false
    keyStatus_get()
    swipe_event()
    camera_rotate()
    medal_put_event()

    world.step(1 / 120);
    
    ground_update()
    
    medalList.forEach((medal) => {
        medal.body.velocity.vadd(medal_vec_down, medal.body.velocity);
        medal.update();
    })

    renderer.render(scene, camera);
    text_render()

    while (medalDeleteWaiting.length > 0) {
        const medalDeleting = medalDeleteWaiting.pop()
        world.removeBody(medalDeleting.body)
        scene.remove(medalDeleting.mesh)
        medalDeleting.mesh.geometry.dispose()
        medalDeleting.mesh.material.dispose()
    }

}
render();
