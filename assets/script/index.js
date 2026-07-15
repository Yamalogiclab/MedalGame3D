// obj sizes are written 10x!
const body = document.body
const bind_keys = ["Space", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", ]
body.addEventListener("keydown", event => {
    if (bind_keys.includes(event.code) === true){
        event.preventDefault()
    }
});

const display = document.getElementById("game_field_3d");
const display_2d = document.getElementById("game_field_2d");
const displayHeight = display.clientHeight;
const displayWidth = display.clientWidth;

const world = new CANNON.World();
world.gravity.set(0, 0, -9.82);

const ground_data = []

const Width = displayWidth;
const Height = displayHeight;
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas: display });
renderer.setSize(Width, Height);
renderer.setClearColor(0xdddddd, 1);
renderer.setPixelRatio(1)
display_2d.width = Width;
display_2d.height = Height;

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, Width / Height);
camera.position.y = -1.7;
camera.position.z = 1.5;
camera.rotation.x = Math.PI / 32 * 11;
scene.add(camera);

const ground_material = new CANNON.Material("ground_material")

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
const ground_2_Body = new CANNON.Body({ mass: 0, shape: ground_Shape, position: ground_2_position, material: ground_material });
world.addBody(ground_2_Body);
scene.add(ground_2);


const move_groundGeometry = new THREE.BoxGeometry(2, 0.3, 2);
move_groundGeometry.rotateX(Math.PI / 2);
const move_groundMaterial = new THREE.MeshStandardMaterial({ color: 0xa05366 });
const move_ground_1 = new THREE.Mesh(move_groundGeometry, move_groundMaterial);
const move_ground_Shape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.15));
const move_ground_position = new CANNON.Vec3(0, 1.25, 0.55);
const move_ground_Body = new CANNON.Body({ mass: 5, shape: move_ground_Shape, position: move_ground_position, type: CANNON.Body.KINEMATIC, material: ground_material });
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
    
        const medalGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16);
        medalGeometry.rotateX(Math.PI / 2);
        const medalMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.85, roughness: 0.2 });
        const medal_Shape = new CANNON.Cylinder(0.1, 0.1, 0.02, 8);
        const medal_Position = new CANNON.Vec3(pos_x, pos_y, pos_z);

        this.body = new CANNON.Body({ mass: 1, shape: medal_Shape, position: medal_Position, material: medal_Material });
        this.mesh = new THREE.Mesh(medalGeometry, medalMaterial);
        this.mesh.position.set(0, 0, 0);

        world.addBody(this.body);
    }

    update() {
        
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
    
}
const MedalContactMaterial = new CANNON.ContactMaterial(medal_Material, medal_Material,{ friction: 0.02, restitution: 0.1 });
world.addContactMaterial(MedalContactMaterial);
const GroundContactMaterial = new CANNON.ContactMaterial(ground_material, medal_Material,{ friction: 0.01, restitution: 0.0 });
world.addContactMaterial(GroundContactMaterial);

var medalList = []
var medalDeleteWaiting = []
var medal_i = 1;

for (let i = 1; i <= 100; i++) {
    const medal = new medalPhysics(i, world, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 1 + 3)
    scene.add(medal.mesh);
    medalList.push(medal);
    medal_i = i
}

const speed = Math.PI
const pusher_velocity = 0.2
let Time = 0
let medal_remaining = 30

let key_down = false

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


function render() {
    Time += 1
    addEventListener("keydown", (event) => {
        if (key_down === false && event.code === "Space") {
            medal_add()
        }
    });
    display.addEventListener("mousedown", (event) => {
        if (key_down === false) {
            medal_add()
        }
    });
    display.addEventListener("touchstart", (event) => {
        if (key_down === false) {
            medal_add()
        }
    });


    addEventListener("keyup", (event) => {
        if (key_down === true) {
            key_down = false
        }
    });
    display.addEventListener("mouseup", (event) => {
        if (key_down === true) {
            key_down = false
        }
    });
    display.addEventListener("touchend", (event) => {
        if (key_down === true) {
            key_down = false
        }
    });



    ground_1.position.copy(ground_1_Body.position);
    ground_1.quaternion.copy(ground_1_Body.quaternion);
    ground_2.position.copy(ground_2_Body.position);
    ground_2.quaternion.copy(ground_2_Body.quaternion);

    move_ground_Body.velocity.set(0, Math.sin(speed * Time / 120) * speed * pusher_velocity * -1, 0)
    move_ground_1.position.copy(move_ground_Body.position);
    move_ground_1.quaternion.copy(move_ground_Body.quaternion);
    
    medalList.forEach((medal) => {
        medal.update();
    })
    world.step(1 / 120);
    renderer.render(scene, camera);

    medal_context.clearRect(0, 0, Width, Height)
    medal_context.beginPath()
    medal_context.font = "32px system-ui";
    medal_context.fillStyle = "#000000"
    medal_context.fillText(`クレジット: ${medal_remaining}`, 10, 40)

    requestAnimationFrame(render);
}
render();
