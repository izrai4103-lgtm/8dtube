"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Background3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let width = host.clientWidth || window.innerWidth;
    let height = host.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 250);
    camera.position.set(0, 0, 16);

    // Bintang 3D
    const count = 1600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 22 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0x9be8ff,
        size: 0.16,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      }),
    );
    scene.add(stars);

    // Dua cincin yang membentuk angka 8 (logo 8DTUBE)
    const ringGeo = new THREE.TorusGeometry(2.5, 0.55, 14, 56);
    const ringA = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    const ringB = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0xe879f9,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    ringA.position.y = 1.9;
    ringB.position.y = -1.9;
    scene.add(ringA, ringB);

    // Inti ikosahedron
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    );
    scene.add(core);

    // Partikel warna
    const pCount = 220;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 8 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pCol = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const hues = [0x22d3ee, 0xe879f9, 0x8b5cf6, 0xf472b6];
      const c = new THREE.Color(hues[i % hues.length]);
      pCol[i * 3] = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.28,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
      }),
    );
    scene.add(particles);

    let mx = 0;
    let my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      width = host.clientWidth || window.innerWidth;
      height = host.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const t = clock.getElapsedTime();

      stars.rotation.y = t * 0.02;
      stars.rotation.x = Math.sin(t * 0.012) * 0.06;
      particles.rotation.y = -t * 0.03;
      particles.rotation.x = Math.cos(t * 0.018) * 0.1;

      ringA.rotation.z = t * 0.3;
      ringA.rotation.x = Math.PI / 2 + Math.sin(t * 0.4) * 0.12;
      ringA.position.y = 1.9 + Math.sin(t * 0.7) * 0.18;

      ringB.rotation.z = -t * 0.3;
      ringB.rotation.x = Math.PI / 2 + Math.cos(t * 0.4) * 0.12;
      ringB.position.y = -1.9 + Math.cos(t * 0.7) * 0.18;

      core.rotation.x = t * 0.35;
      core.rotation.y = t * 0.45;

      camera.position.x += (mx * 2.2 - camera.position.x) * 0.04;
      camera.position.y += (-my * 1.6 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      starGeo.dispose();
      pGeo.dispose();
      ringGeo.dispose();
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
