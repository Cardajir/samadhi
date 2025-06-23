import * as THREE from "https://cdn.skypack.dev/three@0.122.0";
import vertexShader from "http://127.0.0.1:5500/vertexShader.js";
import fragmentShader from "http://127.0.0.1:5500/fragmentShader.js";

console.log("Hello World");

const renderer = new THREE.WebGLRenderer();
const canvasContainer = document.querySelector('.page_canvas');
if (canvasContainer) {
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight, false);
  canvasContainer.appendChild(renderer.domElement);
} else {
  console.error('No .page_canvas element found!');
}

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  -innerWidth / 2,
  innerWidth / 2,
  innerHeight / 2,
  -innerHeight / 2,
  -100,
  100
);
camera.position.z = 5;

const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 100, 100);
const material = new THREE.ShaderMaterial({
  uniforms: {
    u_time: { value: 0.0 },
    u_randomisePosition: { value: new THREE.Vector2(1, 2) },
  },
  vertexShader,
  fragmentShader,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function onWindowResize() {
  if (!canvasContainer) return;
  const width = canvasContainer.clientWidth;
  const height = canvasContainer.clientHeight;

  renderer.setSize(width, height, false);

  camera.left = -width / 2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;
  camera.updateProjectionMatrix();

  mesh.geometry = new THREE.PlaneGeometry(width, height, 100, 100);
}

window.addEventListener('resize', onWindowResize);

let animationFrameId;
function animate(time) {
  animationFrameId = requestAnimationFrame(animate);
  material.uniforms.u_time.value = time * 0.001;
  renderer.render(scene, camera);
}

try {
  animate();
} catch (error) {
  console.error('Animation error:', error);
  cancelAnimationFrame(animationFrameId);
}

function cleanup() {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', onWindowResize);
  renderer.dispose();
  geometry.dispose();
  material.dispose();
}

// Function to handle scroll
function handleScroll() {
  const logo = document.querySelector('.nav_2_logo_svg-text');
  if (!logo) return;
  const trigger = window.innerHeight * 0.15; // 15% of viewport height
  if (window.scrollY > trigger) {
    // Animate out (e.g., fade and move up)
    gsap.to(logo, { y: -100, opacity: 0, duration: 0.5, ease: "power2.out" });
  } else {
    // Animate back in
    gsap.to(logo, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
  }
}

// Register scroll event once DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  // GSAP smooth scrolling
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  ScrollSmoother.create({
    wrapper: ".smooth-wrapper",
    content: ".page_wrap",
    smooth: 0, // seconds to "catch up"
    effects: true
  });

  // Logo scroll animation
  window.addEventListener('scroll', handleScroll);
  // Initial check in case page is loaded scrolled
  handleScroll();
});

window.addEventListener('unload', cleanup);


