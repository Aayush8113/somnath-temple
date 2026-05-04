import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("cursor");
  const cursorRing = document.getElementById("cursor-ring");
  let mouseX = 0,
    mouseY = 0;
  let ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    gsap.set(cursorRing, { x: ringX, y: ringY });
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  document
    .querySelectorAll('a, button, [role="button"], .jl-card')
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(cursor, { width: 6, height: 6, duration: 0.3 });
        gsap.to(cursorRing, { width: 60, height: 60, duration: 0.3 });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(cursor, { width: 12, height: 12, duration: 0.3 });
        gsap.to(cursorRing, { width: 36, height: 36, duration: 0.3 });
      });
    });

  const canvas = document.getElementById("cosmos-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );
  camera.position.z = 600;

  const starCount = 2200;
  const starPositions = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 2400;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2400;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1200 - 200;
    starSizes[i] = Math.random() * 1.5 + 0.3;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
  const starMat = new THREE.PointsMaterial({
    color: 0xc8d8e8,
    size: 1.2,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  const ashCount = 420;
  const ashPositions = new Float32Array(ashCount * 3);
  const ashVelocities = new Float32Array(ashCount * 3);
  for (let i = 0; i < ashCount; i++) {
    ashPositions[i * 3] = (Math.random() - 0.5) * 1200;
    ashPositions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
    ashPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    ashVelocities[i * 3] = (Math.random() - 0.5) * 0.08;
    ashVelocities[i * 3 + 1] = Math.random() * 0.06 + 0.02;
    ashVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
  }
  const ashGeo = new THREE.BufferGeometry();
  ashGeo.setAttribute("position", new THREE.BufferAttribute(ashPositions, 3));
  const ashMat = new THREE.PointsMaterial({
    color: 0xe8b84b,
    size: 2.5,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const ashParticles = new THREE.Points(ashGeo, ashMat);
  scene.add(ashParticles);

  const nebulaCount = 600;
  const nebulaPositions = new Float32Array(nebulaCount * 3);
  for (let i = 0; i < nebulaCount; i++) {
    const cluster = Math.random() > 0.5;
    const cx = cluster ? -200 : 200;
    const cy = cluster ? 100 : -80;
    nebulaPositions[i * 3] = cx + (Math.random() - 0.5) * 500;
    nebulaPositions[i * 3 + 1] = cy + (Math.random() - 0.5) * 400;
    nebulaPositions[i * 3 + 2] = (Math.random() - 0.5) * 300 - 300;
  }
  const nebulaGeo = new THREE.BufferGeometry();
  nebulaGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(nebulaPositions, 3),
  );
  const nebulaMat = new THREE.PointsMaterial({
    color: 0x0d3060,
    size: 4,
    transparent: true,
    opacity: 0.15,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  scene.add(new THREE.Points(nebulaGeo, nebulaMat));

  let scrollY = 0;
  let frame = 0;
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = frame * 0.003;

    const ap = ashGeo.attributes.position.array;
    const av = ashVelocities;
    for (let i = 0; i < ashCount; i++) {
      ap[i * 3] += av[i * 3] + Math.sin(t + i * 0.7) * 0.015;
      ap[i * 3 + 1] += av[i * 3 + 1];
      ap[i * 3 + 2] += av[i * 3 + 2];
      if (ap[i * 3 + 1] > 600) {
        ap[i * 3 + 1] = -600;
        ap[i * 3] = (Math.random() - 0.5) * 1200;
      }
    }
    ashGeo.attributes.position.needsUpdate = true;

    camera.position.x = Math.sin(t * 0.15) * 18;
    camera.position.y = Math.cos(t * 0.1) * 12 + scrollY * -0.02;
    camera.lookAt(scene.position);

    ashParticles.rotation.y = t * 0.012;
    ashParticles.rotation.x = Math.sin(t * 0.05) * 0.06;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.6,
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) lenis.scrollTo(target, { offset: -80, duration: 2.2 });
    });
  });

  lenis.on("scroll", ({ scroll }) => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      navbar.classList.toggle("scrolled", scroll > 80);
    }
  });

  const bar = document.getElementById("preloader-bar-inner");
  const preloaderLight = document.getElementById("preloader-light");
  const preloaderReveal = document.getElementById("preloader-reveal");
  const doorLeft = document.getElementById("door-left");
  const doorRight = document.getElementById("door-right");
  const preloader = document.getElementById("preloader");

  document.querySelectorAll(".door-studs").forEach((container) => {
    for (let i = 0; i < 28; i++) {
      const stud = document.createElement("div");
      stud.className = "stud";
      container.appendChild(stud);
    }
  });

  let progress = 0;

  function fillProgress() {
    const interval = setInterval(() => {
      const increment = Math.random() * 12 + 3;
      progress = Math.min(progress + increment, 100);
      if (bar) bar.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(openDoors, 300);
      }
    }, 120);
  }

  function openDoors() {
    const tl = gsap.timeline();

    tl.to(
      "#jyotirling-container",
      { opacity: 1, duration: 2, ease: "power2.inOut" },
      "+=0.5",
    ).to(
      "#divine-crack",
      {
        width: "15px",
        opacity: 0.8,
        duration: 1,
        ease: "power1.inOut",
        boxShadow: "0 0 60px 20px rgba(255, 165, 0, 0.9)",
      },
      "-=1",
    );

    tl.to(
      preloaderLight,
      { opacity: 1, duration: 1.0, ease: "power2.inOut" },
      "<",
    );
    tl.to(
      preloaderReveal,
      { opacity: 1, duration: 0.6, ease: "power2.in" },
      "-=0.3",
    );

    tl.to(
      doorLeft,
      { xPercent: -100, rotateY: -10, duration: 3.5, ease: "power3.inOut" },
      "+=0.2",
    );
    tl.to(
      doorRight,
      { xPercent: 100, rotateY: 10, duration: 3.5, ease: "power3.inOut" },
      "<",
    );
    tl.to("#divine-crack", { opacity: 0, duration: 0.5 }, "<");

    tl.to(
      "#jyotirling-container",
      { scale: 1, duration: 3.5, ease: "power3.inOut" },
      "<",
    );

    tl.to(
      preloaderLight,
      { opacity: 0.8, duration: 1.0, ease: "power2.out" },
      "-=1.5",
    );
    tl.to({}, { duration: 0.8 });

    tl.to(preloader, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        preloader.style.display = "none";
        document.body.style.overflow = "auto";
        lenis.start();
        ScrollTrigger.refresh();
        animateHeroEntrance();
      },
    });

    tl.to(
      "#smooth-wrapper",
      { 
        opacity: 1, 
        duration: 1.5, 
        ease: "power2.inOut",
        onComplete: () => ScrollTrigger.refresh()
      },
      "<",
    );
  }

  document.body.style.overflow = "hidden";
  lenis.stop();
  requestAnimationFrame(() => fillProgress());

  function animateHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 1.0, delay: 0.1 })
      .to(".hero-title", { opacity: 1, y: 0, duration: 1.2 }, "-=0.5")
      .to(".hero-title-sub", { opacity: 1, y: 0, duration: 1.0 }, "-=0.8")
      .to(
        ".hero-divider",
        { opacity: 1, width: "120px", duration: 1.0, ease: "power2.inOut" },
        "-=0.6",
      )
      .to(".hero-mantra", { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
      .to(".hero-cta-wrap", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".scroll-hint", { opacity: 1, duration: 1.0 }, "-=0.3");
  }

  lenis.on("scroll", ScrollTrigger.update);
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out",
        delay: parseFloat(el.style.transitionDelay || "0"),
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      },
    );
  });

  const galleryTrack = document.getElementById("gallery-track");
  if (galleryTrack) {
    const trackWidth = galleryTrack.scrollWidth - window.innerWidth + 128;
    gsap.to(galleryTrack, {
      x: -trackWidth,
      ease: "none",
      scrollTrigger: {
        trigger: "#gallery",
        start: "top top",
        end: () => "+=" + (trackWidth + 200),
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      },
    });
  }

  gsap.fromTo("#about .stats-grid .stat-card", 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 1.0,
      ease: "power2.out",
      scrollTrigger: { trigger: ".stats-grid", start: "top 85%", once: true },
    }
  );

  window.enterDarshan = function () {
    const gate = document.getElementById("darshan-gate");
    const viewerContainer = document.getElementById("google-360-viewer");

    gsap.to(gate, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        gate.style.display = "none";
        viewerContainer.style.display = "block";

        viewerContainer.innerHTML = `
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.735071197943!2d70.4010839!3d20.8880345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bfd3237194f27cb%3A0xc665b1cb3b4c194a!2sShree%20Somnath%20Jyotirlinga%20Temple!5e1!3m2!1sen!2sin!4v1714815124000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        `;

        gsap.fromTo(
          viewerContainer,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
        );
      },
    });

    const panoramaEl = document.getElementById("panorama-container");
    panoramaEl.addEventListener("mouseenter", () => lenis.stop());
    panoramaEl.addEventListener("mouseleave", () => lenis.start());
    panoramaEl.addEventListener("touchstart", () => lenis.stop(), {
      passive: true,
    });
    panoramaEl.addEventListener("touchend", () => lenis.start(), {
      passive: true,
    });
  };

  document.querySelectorAll(".jl-card").forEach((card) => {
    card.addEventListener("click", function () {
      document
        .querySelectorAll(".jl-card")
        .forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
    });
  });

  gsap.to(".hero-title", {
    backgroundPosition: "200% center",
    repeat: -1,
    duration: 8,
    ease: "none",
  });
  if (document.querySelector(".hero-title")) {
    document.querySelector(".hero-title").style.backgroundSize = "200% auto";
  }
});
