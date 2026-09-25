'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CyberBackground({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0xfacc15, 2.5);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);
    const pointLightCore = new THREE.PointLight(0xfacc15, 3.0, 15);
    pointLightCore.position.set(0, 0, 0);
    scene.add(pointLightCore);

    const labGroup = new THREE.Group();
    scene.add(labGroup);

    const darkMetallicMat = new THREE.MeshPhongMaterial({ color: 0x111116, specular: 0xfacc15, shininess: 90 });
    const yellowAccentMat = new THREE.MeshPhongMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.45, specular: 0xffffff, shininess: 100 });
    const glowingCoreMat = new THREE.MeshBasicMaterial({ color: 0xffea00, wireframe: true });
    const wireframeHoloMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true, transparent: true, opacity: 0.35 });

    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), glowingCoreMat);
    labGroup.add(coreMesh);

    const innerCoreMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), yellowAccentMat);
    labGroup.add(innerCoreMesh);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.045, 16, 100), darkMetallicMat);
    labGroup.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.035, 16, 100), yellowAccentMat);
    labGroup.add(ring2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.025, 16, 100), wireframeHoloMat);
    labGroup.add(ring3);

    const satelliteGroup = new THREE.Group();
    labGroup.add(satelliteGroup);
    const satGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.4, 6);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const sat = new THREE.Mesh(satGeom, i % 2 === 0 ? yellowAccentMat : darkMetallicMat);
      sat.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0);
      sat.rotation.x = Math.PI / 2;
      sat.rotation.z = angle;
      satelliteGroup.add(sat);
    }

    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.8 + Math.random() * 2.2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xfacc15, size: 0.06, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    labGroup.add(particleSystem);

    let mouseX = 0, mouseY = 0, targetRotX = 0, targetRotY = 0;
    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
      targetRotY = mouseX * 0.7;
      targetRotX = -mouseY * 0.5;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      labGroup.rotation.y += (targetRotY - labGroup.rotation.y) * 0.04;
      labGroup.rotation.x += (targetRotX - labGroup.rotation.x) * 0.04;
      coreMesh.rotation.y = t * 0.45;
      coreMesh.rotation.x = t * 0.25;
      innerCoreMesh.rotation.y = -t * 0.6;
      innerCoreMesh.rotation.z = t * 0.3;
      ring1.rotation.x = Math.sin(t * 0.5) * 0.4 + Math.PI / 4;
      ring1.rotation.y = t * 0.4;
      ring2.rotation.y = Math.cos(t * 0.4) * 0.5 + Math.PI / 3;
      ring2.rotation.z = -t * 0.35;
      ring3.rotation.x = t * 0.2;
      ring3.rotation.z = t * 0.3;
      satelliteGroup.rotation.z = t * 0.25;
      labGroup.position.y = Math.sin(t * 1.5) * 0.15;
      particleSystem.rotation.y = t * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#050505]">
      {/* 1. Ambient Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[580px] pointer-events-none z-0 blur-3xl amber-glow-bg" />

      {/* 2. Interactive 3D Cyber Model Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

      {/* 3. Page Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}