// 3D Avatar Logic (Geometric Version)
const container = document.getElementById('avatar-3d-container');

// Scene Setup
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x1a1a2e); // Optional: Match the gradient if needed, but keeping transparent for integration

// Camera
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0xff6b6b, 0.5);
pointLight1.position.set(-5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x4ecdc4, 0.5);
pointLight2.position.set(5, -5, -5);
scene.add(pointLight2);

// Avatar Group
const avatarGroup = new THREE.Group();
scene.add(avatarGroup);

// Materials
const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });

// --- Head ---
const headGeo = new THREE.SphereGeometry(1, 32, 32);
const head = new THREE.Mesh(headGeo, skinMaterial);
head.position.set(0, 1.5, 0);
avatarGroup.add(head);

// --- Eyes ---
const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
leftEye.position.set(-0.3, 1.6, 0.8);
avatarGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
rightEye.position.set(0.3, 1.6, 0.8);
avatarGroup.add(rightEye);

// --- Pupils ---
const pupilGeo = new THREE.SphereGeometry(0.08, 16, 16);
const leftPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
leftPupil.position.set(-0.3, 1.6, 0.95);
avatarGroup.add(leftPupil);

const rightPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
rightPupil.position.set(0.3, 1.6, 0.95);
avatarGroup.add(rightPupil);

// --- Nose ---
const noseGeo = new THREE.SphereGeometry(0.15, 16, 16);
const nose = new THREE.Mesh(noseGeo, skinMaterial);
nose.position.set(0, 1.3, 0.9);
avatarGroup.add(nose);

// --- Body ---
const bodyGeo = new THREE.CylinderGeometry(0.8, 0.6, 2, 32);
const body = new THREE.Mesh(bodyGeo, bodyMaterial);
body.position.set(0, -0.5, 0);
avatarGroup.add(body);

// --- Arms ---
const armGeo = new THREE.CylinderGeometry(0.2, 0.15, 1.5, 16);

const leftArm = new THREE.Mesh(armGeo, skinMaterial);
leftArm.position.set(-1, 0, 0);
leftArm.rotation.z = 0.3;
avatarGroup.add(leftArm);

const rightArm = new THREE.Mesh(armGeo, skinMaterial);
rightArm.position.set(1, 0, 0);
rightArm.rotation.z = -0.3;
avatarGroup.add(rightArm);

// --- Hands ---
const handGeo = new THREE.SphereGeometry(0.25, 16, 16);

const leftHand = new THREE.Mesh(handGeo, skinMaterial);
leftHand.position.set(-1.3, -0.5, 0);
avatarGroup.add(leftHand);

const rightHand = new THREE.Mesh(handGeo, skinMaterial);
rightHand.position.set(1.3, -0.5, 0);
avatarGroup.add(rightHand);


// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Gentle floating animation
    avatarGroup.position.y = Math.sin(t * 0.5) * 0.1;
    avatarGroup.rotation.y = Math.sin(t * 0.3) * 0.1;

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    if (!container) return;

    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
}
