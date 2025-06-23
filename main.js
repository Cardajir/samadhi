import * as THREE from "https://cdn.skypack.dev/three@v0.122.0";
import sNoise from "https://cdn.jsdelivr.net/gh/Cardajir/samadhi/snoise.js";
import vertexShader from "https://cdn.jsdelivr.net/gh/Cardajir/samadhi/vertexShader.js";
import fragmentShader from "https://cdn.jsdelivr.net/gh/Cardajir/samadhi/fragmentShader.js";

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgb(r, g, b) {
  return new THREE.Vector3(r, g, b);
}
document.addEventListener("DOMContentLoaded", function (e) {
  const renderer = new THREE.WebGLRenderer();
  const pageCanvasDiv = document.querySelector('.page_canvas');
  function getCanvasSize() {
    if (pageCanvasDiv) {
      return [pageCanvasDiv.clientWidth, pageCanvasDiv.clientHeight];
    } else {
      return [window.innerWidth, window.innerHeight];
    }
  }
  let [canvasWidth, canvasHeight] = getCanvasSize();
  renderer.setSize(canvasWidth, canvasHeight);
  if (pageCanvasDiv) {
    pageCanvasDiv.appendChild(renderer.domElement);
  } else {
    console.warn('No .page_canvas div found! Rendering to body.');
    document.body.appendChild(renderer.domElement);
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -canvasWidth / 2,
    canvasWidth / 2,
    canvasHeight / 2,
    -canvasHeight / 2,
    -100,
    100
  );

  camera.position.z = 5;

  var randomisePosition = new THREE.Vector2(1, 2);

  let geometry = new THREE.PlaneGeometry(
    canvasWidth,
    canvasHeight,
    100,
    100
  );
  let material = new THREE.ShaderMaterial({
    uniforms: {
      // Adjusted colors to match BG.jpg
      u_bg: { type: "v3", value: rgb(10, 10, 20) }, // Darker blue/black
      u_bgMain: { type: "v3", value: rgb(30, 30, 60) }, // Slightly lighter dark blue
      u_color1: { type: "v3", value: rgb(0, 0, 10) }, // Even darker
      u_color2: { type: "v3", value: rgb(50, 50, 90) }, // Muted dark blue
      u_time: { type: "f", value: 30 },
      u_randomisePosition: { type: "v2", value: randomisePosition },
      u_colorShift: { type: "f", value: 0 },
      u_noiseSeed: { type: "f", value: 0 },
    },
    fragmentShader: sNoise + fragmentShader,
    vertexShader: sNoise + vertexShader,
  });

  let mesh = new THREE.Mesh(geometry, material);
  mesh.scale.multiplyScalar(2);
  mesh.rotationX = 0.0;
  mesh.rotationY = 0.0;
  mesh.rotationZ = 0.0;
  scene.add(mesh);

  renderer.render(scene, camera);
  let t = 0;
  let j = 0;
  let colorShift = 0;
  let noiseSeed = 0;
  const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mesh.material.uniforms.u_randomisePosition.value = new THREE.Vector2(
      j,
      Math.sin(j)
    );
    mesh.material.uniforms.u_time.value = t;
    mesh.material.uniforms.u_colorShift.value = colorShift;
    mesh.material.uniforms.u_noiseSeed.value = noiseSeed;

    j = j + 0.02;
    t = t + 0.05;
    colorShift += 0.01;
    noiseSeed += 0.008;
  };
  animate();

  function resizeCanvasToDiv() {
    let [newWidth, newHeight] = getCanvasSize();
    renderer.setSize(newWidth, newHeight);
    camera.left = -newWidth / 2;
    camera.right = newWidth / 2;
    camera.top = newHeight / 2;
    camera.bottom = -newHeight / 2;
    camera.updateProjectionMatrix();
    // Replace geometry with new size
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(newWidth, newHeight, 100, 100);
  }

  // Listen for window resize and also poll for div size changes
  window.addEventListener("resize", resizeCanvasToDiv);
  // Optional: Poll for div size changes (for dynamic layouts)
  let lastDivSize = [canvasWidth, canvasHeight];
  setInterval(() => {
    let [w, h] = getCanvasSize();
    if (w !== lastDivSize[0] || h !== lastDivSize[1]) {
      lastDivSize = [w, h];
      resizeCanvasToDiv();
    }
  }, 300);
});

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
















