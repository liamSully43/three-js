import * as three from 'three';

const scene = new three.Scene();

// === Lighting ===
const ambientLight = new three.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new three.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

// === Camera ===
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new three.OrthographicCamera(
    cameraWidth / -2, // left
    cameraWidth / 2, // right
    cameraHeight / 2, // top
    cameraHeight / -2, // bottom
    0, // near plane
    1000 // far plane
);

camera.position.set(200, 200, 200);
camera.lookAt(0, 10, 0);

// === Renderer ===
const renderer = new three.WebGL1Renderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

// === Create Car ===
// wheels
function createWheels() {
    const geometry = new three.BoxBufferGeometry(12, 12, 33);
    const material = new three.MeshLambertMaterial({ color: 0x333333 });
    const wheel = new three.Mesh(geometry, material);
    return wheel;
  }

  function createCar() {
    const car = new three.Group();
    
    const backWheel = createWheels();
    backWheel.position.y = 6;
    backWheel.position.x = -18;
    car.add(backWheel);
    
    const frontWheel = createWheels();
    frontWheel.position.y = 6;  
    frontWheel.position.x = 18;
    car.add(frontWheel);
  
    const main = new three.Mesh(
      new three.BoxBufferGeometry(60, 15, 30),
      new three.MeshLambertMaterial({ color: 0x78b14b })
    );
    main.position.y = 12;
    car.add(main);

    const carFrontTexture = getCarFrontTexture();
    const carBackTexture = getCarFrontTexture();
    const carRightTexture = getCarSideTexture();
    const carLeftTexture = getCarSideTexture();

    carLeftTexture.center = new three.Vector2(0.5, 0.5);
    carLeftTexture.rotation = Math.PI;
    carLeftTexture.flipY = false;
  
    const cabin = new three.Mesh(
      new three.BoxBufferGeometry(33, 12, 24),
      [
        new three.MeshLambertMaterial({map: carFrontTexture}),
        new three.MeshLambertMaterial({map: carBackTexture}),
        new three.MeshLambertMaterial({ color: 0xffffff }), // top
        new three.MeshLambertMaterial({ color: 0xffffff }), // bottom
        new three.MeshLambertMaterial({ map: carRightTexture }),
        new three.MeshLambertMaterial({ map: carLeftTexture }),
      ]
    );
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);
  
    return car;
  }
  
  const car = createCar();
  scene.add(car);
  
  renderer.render(scene, camera);

  function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new three.CanvasTexture(canvas);
  }

  function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new three.CanvasTexture(canvas);
  }