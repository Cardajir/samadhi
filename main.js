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
      u_bg: { type: "v3", value: rgb(5, 4, 10) }, // A very dark blue, almost black
      u_bgMain: { type: "v3", value: rgb(0, 0, 0) }, // To create darker areas
      u_color1: { type: "v3", value: rgb(8, 8, 20) }, // Dark blue for the haze
      u_color2: { type: "v3", value: rgb(15, 15, 30) }, // A slightly lighter blue for variety in the haze.
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

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
  const smoother = ScrollSmoother.create({
    wrapper: ".smooth-wrapper",
    content: ".page_wrap",
    smooth: 0,
    effects: true
  });
  ScrollTrigger.refresh();

  // Logo scroll animation
  window.addEventListener('scroll', handleScroll);
  // Initial check in case page is loaded scrolled
  handleScroll();

  // Team CMS items animation on scroll
  const teamList = document.querySelector('.team_cms_list');
  if (teamList) {
    const teamItems = teamList.querySelectorAll('.team_cms_item');
    gsap.set(teamItems, { x: 100, opacity: 0 });

    gsap.to(teamItems, {
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: teamList,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }

  // SplitText: header & idea animace až po načtení fontů
  function splitTextAndAnimate() {
    const headerWords = new SplitText(".good_idea_header", { type: "words" }).words;
    const ideaWords = new SplitText(".good_idea", { type: "words" }).words;

    // Počáteční stav
    gsap.set(headerWords, { y: 100, opacity: 0 });
    gsap.set(ideaWords, { y: 100, opacity: 0 });
    gsap.set(".section_header_underline", { y: 100, opacity: 0 });
    gsap.set(".good_idea_para", { opacity: 0, filter: "blur(10px)" });

    // Scroll-triggerovaná timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section_wrap.gi",
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    // 1. Animace headeru
    tl.to(headerWords, {
      y: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
      stagger: 0.1
    });

    // 2. Animace good_idea
    tl.to(ideaWords, {
      y: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
      stagger: 0.1
    }, "+=0.05");

    // 3. Underline animace
    tl.to(".section_header_underline", {
      y: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out"
    }, "+=0.05");

    // 4. good_idea_para (blur → ostré, opacity)
    tl.to(".good_idea_para", {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.35,
      ease: "power2.out"
    }, "+=0.05");
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(splitTextAndAnimate);
  } else {
    window.addEventListener('load', splitTextAndAnimate);
  }

  // Vybere všechny .project_card a vytvoří animaci pro každou zvlášť
  document.querySelectorAll(".project_card").forEach((card) => {
    // Výchozí stav pomocí GSAP
    gsap.set(card, { y: 100, opacity: 0 });

    // Animace při 10 % viditelnosti
    gsap.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%", // top karty dosáhne 85 % viewportu = 15 % viditelnosti
        toggleActions: "play none none none"
      }
    });
  });

  // Animace pro .grid_breakout_contain - fade in from bottom 100px
  document.querySelectorAll(".grid_breakout_contain").forEach((el) => {
    gsap.set(el, { y: 100, opacity: 0 });
    const parentWrap = el.closest('.grid_breakout_wrap');
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
      scrollTrigger: {
        trigger: parentWrap || el,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  // Animace pro .grid_breakout_wrap.u-column-custom (fade in zleva)
  document.querySelectorAll(".grid_breakout_wrap.u-column-custom:not(.is-reversed)").forEach((el) => {
    gsap.set(el, { x: -100, opacity: 0 });
    const parentWrap = el.closest('.grid_breakout_wrap');
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
      scrollTrigger: {
        trigger: parentWrap || el,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  // Animace pro .grid_breakout_wrap.u-column-custom.is-reversed (fade in zprava)
  document.querySelectorAll(".grid_breakout_wrap.u-column-custom.is-reversed").forEach((el) => {
    gsap.set(el, { x: 100, opacity: 0 });
    const parentWrap = el.closest('.grid_breakout_wrap');
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
      scrollTrigger: {
        trigger: parentWrap || el,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
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














