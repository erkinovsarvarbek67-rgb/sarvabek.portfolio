import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeHeroCanvasProps {
  theme?: 'dark' | 'light';
}

export const ThreeHeroCanvas: React.FC<ThreeHeroCanvasProps> = ({ theme = 'dark' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showClouds, setShowClouds] = useState(true);
  const [showCityLights, setShowCityLights] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [infoToast, setInfoToast] = useState<string | null>(null);

  // Mutable controls ref for 60fps render loop
  const controlsRef = useRef({
    showClouds: true,
    showCityLights: true,
    autoRotate: true,
    isWireframe: false,
    targetRotationY: -0.6,
    targetRotationX: 0.32,
    currentRotationY: -0.6,
    currentRotationX: 0.32,
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    dragVelocityX: 0,
    dragVelocityY: 0,
    zoomDistance: 4.4,
    targetZoomDistance: 4.4,
    focusOnUzbekistan: false,
  });

  useEffect(() => {
    controlsRef.current.showClouds = showClouds;
    controlsRef.current.showCityLights = showCityLights;
    controlsRef.current.autoRotate = autoRotate;
    controlsRef.current.isWireframe = isWireframe;
  }, [showClouds, showCityLights, autoRotate, isWireframe]);

  // Handler to smoothly animate Earth to center Uzbekistan
  const handleFocusUzbekistan = () => {
    // In equirectangular projection, longitude 69.2°E, latitude 41.3°N
    // Rotation Y needed to face camera (Z-axis):
    const targetY = -((69.2 * Math.PI) / 180) - Math.PI / 2;
    const targetX = 0.38;

    controlsRef.current.targetRotationY = targetY;
    controlsRef.current.targetRotationX = targetX;
    controlsRef.current.dragVelocityX = 0;
    controlsRef.current.dragVelocityY = 0;
    controlsRef.current.focusOnUzbekistan = true;
    controlsRef.current.targetZoomDistance = 3.9;

    setInfoToast('🎯 O‘zbekiston (Toshkent / Namangan: 41.3°N, 69.2°E) markazda!');
    setTimeout(() => {
      setInfoToast(null);
      controlsRef.current.focusOnUzbekistan = false;
    }, 3200);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 520;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, controlsRef.current.zoomDistance);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // ==========================================
    // LIGHTING RIG: Sun + Cosmic Atmosphere
    // ==========================================
    // Sun Directional Light (Warm sunlight creating authentic day/night terminator)
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.4);
    sunLight.position.set(5.5, 2.5, 4.5);
    scene.add(sunLight);

    // Blue atmospheric rim light from opposite side
    const backRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    backRimLight.position.set(-5, -2, -3.5);
    scene.add(backRimLight);

    // Ambient Space Illumination (prevents dark side from being 100% black)
    const ambientLight = new THREE.AmbientLight(0x0c192e, 0.9);
    scene.add(ambientLight);

    // Master Planet Group with Earth's natural 23.4° axial tilt
    const planetGroup = new THREE.Group();
    planetGroup.rotation.z = (23.4 * Math.PI) / 180;
    scene.add(planetGroup);

    // ==========================================
    // 1. HIGH-FIDELITY PROCEDURAL EARTH TEXTURE (2048x1024)
    // ==========================================
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 2048;
    earthCanvas.height = 1024;
    const eCtx = earthCanvas.getContext('2d')!;

    // 1.1 Ocean Gradient (Abyssal Navy to Marine Blue)
    const oceanGrad = eCtx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#020712');
    oceanGrad.addColorStop(0.18, '#061a38');
    oceanGrad.addColorStop(0.5, '#0a2a54');
    oceanGrad.addColorStop(0.82, '#061a38');
    oceanGrad.addColorStop(1, '#020712');
    eCtx.fillStyle = oceanGrad;
    eCtx.fillRect(0, 0, 2048, 1024);

    // Ocean depth textures
    eCtx.fillStyle = 'rgba(14, 165, 233, 0.05)';
    for (let i = 0; i < 60; i++) {
      eCtx.beginPath();
      eCtx.ellipse(
        Math.random() * 2048,
        Math.random() * 1024,
        120 + Math.random() * 160,
        40 + Math.random() * 80,
        Math.random() * Math.PI,
        0,
        Math.PI * 2
      );
      eCtx.fill();
    }

    // Latitude & Longitude Navigational Grid
    eCtx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    eCtx.lineWidth = 1;
    for (let x = 0; x < 2048; x += 128) {
      eCtx.beginPath();
      eCtx.moveTo(x, 0);
      eCtx.lineTo(x, 1024);
      eCtx.stroke();
    }
    for (let y = 0; y < 1024; y += 85) {
      eCtx.beginPath();
      eCtx.moveTo(0, y);
      eCtx.lineTo(2048, y);
      eCtx.stroke();
    }

    // Helper to draw realistic landmass with shallow shelf, terrain body, and biome tints
    const drawLandmass = (
      points: [number, number][],
      shelfColor: string,
      baseTerrainColor: string,
      biomes?: { x: number; y: number; r: number; color: string }[]
    ) => {
      // 1. Cyan/Turquoise Coastal Shelf
      eCtx.shadowColor = shelfColor;
      eCtx.shadowBlur = 10;
      eCtx.fillStyle = shelfColor;
      eCtx.beginPath();
      points.forEach(([px, py], i) => {
        if (i === 0) eCtx.moveTo(px, py);
        else eCtx.lineTo(px, py);
      });
      eCtx.closePath();
      eCtx.fill();
      eCtx.shadowBlur = 0;

      // 2. Base Landmass Body
      eCtx.fillStyle = baseTerrainColor;
      eCtx.fill();

      // 3. Biome Shading (Deserts, Steppes, Mountain ridges)
      if (biomes) {
        biomes.forEach((b) => {
          const rad = eCtx.createRadialGradient(b.x, b.y, 10, b.x, b.y, b.r);
          rad.addColorStop(0, b.color);
          rad.addColorStop(1, 'rgba(0,0,0,0)');
          eCtx.fillStyle = rad;
          eCtx.fill();
        });
      }

      // 4. Shoreline outline
      eCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      eCtx.lineWidth = 1.2;
      eCtx.stroke();
    };

    // 1. Eurasia (Europe, Russia, Central Asia, East Asia, Middle East)
    drawLandmass(
      [
        [980, 180],
        [1060, 150],
        [1220, 140],
        [1440, 160],
        [1680, 190],
        [1820, 240],
        [1880, 360],
        [1780, 480],
        [1640, 530],
        [1540, 480],
        [1418, 420], // Central Asia / Uzbekistan gateway
        [1360, 520], // Indian subcontinent
        [1240, 480], // Arabian Peninsula
        [1140, 420], // Mediterranean Levant
        [990, 340],  // Iberian Peninsula / Western Europe
        [960, 230],  // Scandinavia
      ],
      '#0d9488',
      '#1b4332',
      [
        { x: 1420, y: 360, r: 160, color: '#c49b63' }, // Central Asia golden steppes / Karakum & Kyzylkum
        { x: 1220, y: 440, r: 120, color: '#d49b55' }, // Arabian desert
        { x: 1540, y: 380, r: 140, color: '#57534e' }, // Himalayas / Tibetan plateau mountain range
      ]
    );

    // 2. Africa & Madagascar
    drawLandmass(
      [
        [1010, 430],
        [1190, 430],
        [1260, 520],
        [1280, 710],
        [1160, 830],
        [1040, 710],
        [960, 520],
        [980, 440],
      ],
      '#0f766e',
      '#2d6a4f',
      [
        { x: 1110, y: 500, r: 170, color: '#d97706' }, // Great Sahara Desert
        { x: 1120, y: 640, r: 110, color: '#143d1a' }, // Congo Rainforest Basin
      ]
    );

    // Madagascar
    drawLandmass(
      [
        [1300, 680],
        [1325, 690],
        [1315, 750],
        [1290, 740],
      ],
      '#0d9488',
      '#2d6a4f'
    );

    // 3. North America
    drawLandmass(
      [
        [240, 140],
        [460, 150],
        [640, 220],
        [700, 340],
        [580, 420],
        [430, 520], // Florida & Gulf
        [320, 460], // Mexico
        [220, 280], // Pacific Northwest
      ],
      '#0d9488',
      '#1b4332',
      [
        { x: 380, y: 380, r: 140, color: '#b48a52' }, // American Southwest
        { x: 300, y: 240, r: 120, color: '#57534e' }, // Rocky Mountains
      ]
    );

    // 4. South America
    drawLandmass(
      [
        [520, 530],
        [700, 560],
        [760, 680],
        [680, 920],
        [560, 900],
        [480, 680],
      ],
      '#0f766e',
      '#143d1a', // Amazonian Rainforest
      [
        { x: 500, y: 720, r: 110, color: '#475569' }, // Andes Mountain Cordillera
      ]
    );

    // 5. Australia & New Zealand
    drawLandmass(
      [
        [1580, 660],
        [1780, 640],
        [1840, 780],
        [1700, 840],
        [1560, 760],
      ],
      '#0d9488',
      '#2d6a4f',
      [
        { x: 1700, y: 740, r: 120, color: '#b45309' }, // Red Australian Outback
      ]
    );

    // 6. Greenland & Polar Ice Sheets
    drawLandmass(
      [
        [750, 100],
        [880, 120],
        [850, 220],
        [760, 210],
      ],
      '#bae6fd',
      '#f8fafc'
    );

    // Arctic & Antarctic Glacial Ice Shelves
    eCtx.fillStyle = '#f8fafc';
    eCtx.fillRect(0, 0, 2048, 55);
    eCtx.fillRect(0, 965, 2048, 59);

    // Ice fissures
    eCtx.strokeStyle = '#bae6fd';
    eCtx.lineWidth = 1;
    for (let i = 0; i < 2048; i += 65) {
      eCtx.beginPath();
      eCtx.moveTo(i, 55);
      eCtx.lineTo(i + 25, 30);
      eCtx.stroke();

      eCtx.beginPath();
      eCtx.moveTo(i, 965);
      eCtx.lineTo(i - 20, 990);
      eCtx.stroke();
    }

    // 7. Uzbekistan Beacon & Geographical Highlight (41.3°N, 69.2°E)
    // Formula for Equirectangular (2048x1024):
    // x = ((69.2 + 180) / 360) * 2048 ≈ 1418
    // y = ((90 - 41.3) / 180) * 1024 ≈ 277
    const uzX = 1418;
    const uzY = 277;

    // Glowing Radar Waves centered on Uzbekistan
    eCtx.strokeStyle = '#22d3ee';
    eCtx.lineWidth = 2.5;
    eCtx.beginPath();
    eCtx.arc(uzX, uzY, 22, 0, Math.PI * 2);
    eCtx.stroke();

    eCtx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
    eCtx.lineWidth = 1.5;
    eCtx.beginPath();
    eCtx.arc(uzX, uzY, 40, 0, Math.PI * 2);
    eCtx.stroke();

    // Core Uzbekistan Neon Pin
    eCtx.fillStyle = '#38bdf8';
    eCtx.beginPath();
    eCtx.arc(uzX, uzY, 8, 0, Math.PI * 2);
    eCtx.fill();

    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.generateMipmaps = true;

    // ==========================================
    // 1.2 PROCEDURAL NIGHT CITY LIGHTS MAP (1024x512)
    // ==========================================
    const nightCanvas = document.createElement('canvas');
    nightCanvas.width = 1024;
    nightCanvas.height = 512;
    const nCtx = nightCanvas.getContext('2d')!;

    nCtx.fillStyle = '#000000';
    nCtx.fillRect(0, 0, 1024, 512);

    // Realistic Urban Light Clusters
    const cityCenters: [number, number, number, number][] = [
      [709, 138, 25, 12], // Tashkent / Uzbekistan Central Asian cluster
      [560, 140, 65, 30], // Europe
      [220, 170, 75, 35], // North America East Coast
      [780, 220, 70, 30], // India subcontinent
      [870, 160, 85, 35], // East Asia / China
      [910, 165, 50, 18], // Japan
      [610, 210, 35, 20], // Middle East (Dubai / Riyadh)
      [310, 350, 40, 25], // South America
      [860, 380, 30, 20], // Australia coastal cities
    ];

    cityCenters.forEach(([cx, cy, count, spread]) => {
      for (let i = 0; i < count; i++) {
        const lx = cx + (Math.random() - 0.5) * spread * 2;
        const ly = cy + (Math.random() - 0.5) * spread * 2;
        const radius = Math.random() * 1.8 + 0.6;
        const alpha = Math.random() * 0.7 + 0.3;

        nCtx.fillStyle = Math.random() > 0.3 ? `rgba(255, 198, 88, ${alpha})` : `rgba(255, 235, 160, ${alpha})`;
        nCtx.beginPath();
        nCtx.arc(lx, ly, radius, 0, Math.PI * 2);
        nCtx.fill();
      }
    });

    const nightTexture = new THREE.CanvasTexture(nightCanvas);
    nightTexture.colorSpace = THREE.SRGBColorSpace;

    // ==========================================
    // 1.3 BASE EARTH SPHERE MESH
    // ==========================================
    const earthRadius = 1.32;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.38,
      metalness: 0.1,
      emissiveMap: nightTexture,
      emissive: new THREE.Color(0xffc107),
      emissiveIntensity: 0.95,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    planetGroup.add(earthMesh);

    // ==========================================
    // 2. PROCEDURAL HIGH-FIDELITY CLOUDS LAYER (1024x512)
    // ==========================================
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cCtx = cloudCanvas.getContext('2d')!;

    cCtx.clearRect(0, 0, 1024, 512);

    // Swirling atmospheric clouds
    cCtx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    for (let i = 0; i < 95; i++) {
      const cx = Math.random() * 1024;
      const cy = 60 + Math.random() * 400;
      const rx = 40 + Math.random() * 110;
      const ry = 15 + Math.random() * 40;
      const rot = (Math.random() - 0.5) * 0.6;

      cCtx.beginPath();
      cCtx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
      cCtx.fill();
    }

    // Cyclonic vortices
    const drawCyclone = (x: number, y: number, radius: number) => {
      cCtx.strokeStyle = 'rgba(255, 255, 255, 0.52)';
      cCtx.lineWidth = 3.5;
      for (let a = 0; a < Math.PI * 4; a += 0.2) {
        const r = (a / (Math.PI * 4)) * radius;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (a === 0) cCtx.beginPath();
        cCtx.lineTo(px, py);
      }
      cCtx.stroke();
    };

    drawCyclone(280, 160, 42); // North Atlantic cyclone
    drawCyclone(720, 360, 48); // Southern Ocean vortex
    drawCyclone(850, 180, 38); // Pacific typhoon

    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    cloudTexture.colorSpace = THREE.SRGBColorSpace;

    const cloudRadius = earthRadius + 0.022;
    const cloudGeo = new THREE.SphereGeometry(cloudRadius, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.58,
      roughness: 0.9,
      blending: THREE.NormalBlending,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    planetGroup.add(cloudMesh);

    // ==========================================
    // 3. ATMOSPHERIC RAYLEIGH SCATTERING GLOW
    // ==========================================
    const atmoRadius = earthRadius + 0.07;
    const atmoGeo = new THREE.SphereGeometry(atmoRadius, 48, 48);

    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float intensity = pow(0.66 - dot(vNormal, viewDir), 2.2);
          vec3 atmosphereColor = vec3(0.22, 0.72, 1.0);
          gl_FragColor = vec4(atmosphereColor, intensity * 0.85);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    planetGroup.add(atmoMesh);

    // ==========================================
    // 4. 3D UZBEKISTAN BEACON PIN & RADAR
    // ==========================================
    const lat = 41.3;
    const lon = 69.2;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const beaconPos = new THREE.Vector3(
      -earthRadius * Math.sin(phi) * Math.cos(theta),
      earthRadius * Math.cos(phi),
      earthRadius * Math.sin(phi) * Math.sin(theta)
    );

    const beaconGroup = new THREE.Group();
    beaconGroup.position.copy(beaconPos);
    beaconGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beaconPos.clone().normalize());
    planetGroup.add(beaconGroup);

    // Vertical holographic laser beam
    const beamGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.42, 12);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.9,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 0.21;
    beaconGroup.add(beamMesh);

    // Beacon Top Glowing Gem
    const gemGeo = new THREE.OctahedronGeometry(0.038, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.y = 0.42;
    beaconGroup.add(gemMesh);

    // Surface radar pulse ring
    const ringGeo = new THREE.RingGeometry(0.018, 0.07, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.01;
    beaconGroup.add(ringMesh);

    // Orbiting Satellite
    const satOrbitGroup = new THREE.Group();
    satOrbitGroup.rotation.x = Math.PI / 3.8;
    planetGroup.add(satOrbitGroup);

    const satOrbitRingGeo = new THREE.TorusGeometry(1.85, 0.007, 12, 80);
    const satOrbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.24,
    });
    const satOrbitRing = new THREE.Mesh(satOrbitRingGeo, satOrbitRingMat);
    satOrbitRing.rotation.x = Math.PI / 2;
    satOrbitGroup.add(satOrbitRing);

    const satGeo = new THREE.BoxGeometry(0.05, 0.025, 0.05);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 1.5,
    });
    const satMesh = new THREE.Mesh(satGeo, satMat);
    satOrbitGroup.add(satMesh);

    // ==========================================
    // 5. DEEP COSMIC STARFIELD
    // ==========================================
    const starCount = 550;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const radius = 18 + Math.random() * 25;
      const u = Math.random();
      const v = Math.random();
      const stheta = u * 2.0 * Math.PI;
      const sphi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(radius);
      const sinPhi = Math.sin(sphi);

      starPositions[i * 3] = r * sinPhi * Math.cos(stheta) * 6;
      starPositions[i * 3 + 1] = r * sinPhi * Math.sin(stheta) * 6;
      starPositions[i * 3 + 2] = r * Math.cos(sphi) * 6;
      starSizes[i] = Math.random() * 1.4 + 0.6;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.07,
      transparent: true,
      opacity: 0.7,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ==========================================
    // 6. INTERACTIVE MOUSE & TOUCH ORBIT CONTROLS
    // ==========================================
    const handleMouseDown = (e: MouseEvent) => {
      controlsRef.current.isDragging = true;
      controlsRef.current.focusOnUzbekistan = false;
      controlsRef.current.previousMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!controlsRef.current.isDragging) return;

      const deltaX = e.clientX - controlsRef.current.previousMousePosition.x;
      const deltaY = e.clientY - controlsRef.current.previousMousePosition.y;

      controlsRef.current.targetRotationY += deltaX * 0.005;
      controlsRef.current.targetRotationX = Math.max(
        -Math.PI / 2.3,
        Math.min(Math.PI / 2.3, controlsRef.current.targetRotationX + deltaY * 0.005)
      );

      controlsRef.current.dragVelocityX = deltaX * 0.002;
      controlsRef.current.dragVelocityY = deltaY * 0.002;

      controlsRef.current.previousMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseUp = () => {
      controlsRef.current.isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        controlsRef.current.isDragging = true;
        controlsRef.current.focusOnUzbekistan = false;
        controlsRef.current.previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!controlsRef.current.isDragging || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - controlsRef.current.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - controlsRef.current.previousMousePosition.y;

      controlsRef.current.targetRotationY += deltaX * 0.006;
      controlsRef.current.targetRotationX = Math.max(
        -Math.PI / 2.3,
        Math.min(Math.PI / 2.3, controlsRef.current.targetRotationX + deltaY * 0.006)
      );

      controlsRef.current.previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      controlsRef.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      controlsRef.current.targetZoomDistance = THREE.MathUtils.clamp(
        controlsRef.current.targetZoomDistance + e.deltaY * 0.003,
        3.0,
        5.8
      );
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // ==========================================
    // 7. ANIMATION TICK & RENDER LOOP
    // ==========================================
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const ctrl = controlsRef.current;

      // Update toggles & wireframe
      cloudMesh.visible = ctrl.showClouds;
      earthMat.emissiveIntensity = ctrl.showCityLights ? 0.95 : 0.0;
      earthMat.wireframe = ctrl.isWireframe;

      // Smooth auto-rotation when user is not dragging
      if (ctrl.autoRotate && !ctrl.isDragging && !ctrl.focusOnUzbekistan) {
        ctrl.targetRotationY += delta * 0.12;
      }

      // Inertial deceleration
      if (!ctrl.isDragging && Math.abs(ctrl.dragVelocityX) > 0.0001) {
        ctrl.targetRotationY += ctrl.dragVelocityX;
        ctrl.dragVelocityX *= 0.92;
      }
      if (!ctrl.isDragging && Math.abs(ctrl.dragVelocityY) > 0.0001) {
        ctrl.targetRotationX = Math.max(
          -Math.PI / 2.3,
          Math.min(Math.PI / 2.3, ctrl.targetRotationX + ctrl.dragVelocityY)
        );
        ctrl.dragVelocityY *= 0.92;
      }

      // Smooth damping
      const dampFactor = ctrl.focusOnUzbekistan ? 5.0 : 8.0;
      ctrl.currentRotationY = THREE.MathUtils.damp(
        ctrl.currentRotationY,
        ctrl.targetRotationY,
        dampFactor,
        delta
      );
      ctrl.currentRotationX = THREE.MathUtils.damp(
        ctrl.currentRotationX,
        ctrl.targetRotationX,
        dampFactor,
        delta
      );

      planetGroup.rotation.y = ctrl.currentRotationY;
      planetGroup.rotation.x = ctrl.currentRotationX;

      // Dynamic Cloud Drift (clouds drift faster than planet surface)
      cloudMesh.rotation.y = elapsed * 0.028;

      // Pulse Beacon on Uzbekistan
      const beaconPulse = Math.sin(elapsed * 4) * 0.5 + 0.5;
      ringMesh.scale.setScalar(1 + beaconPulse * 1.6);
      ringMat.opacity = 0.85 - beaconPulse * 0.6;
      gemMesh.rotation.y = elapsed * 2.8;
      gemMesh.rotation.x = elapsed * 1.4;

      // Orbiting Satellite
      const satAngle = elapsed * 0.7;
      satMesh.position.set(
        Math.cos(satAngle) * 1.85,
        0,
        Math.sin(satAngle) * 1.85
      );
      satMesh.rotation.y = satAngle + Math.PI / 2;

      // Camera smooth zoom
      ctrl.zoomDistance = THREE.MathUtils.damp(
        ctrl.zoomDistance,
        ctrl.targetZoomDistance,
        6,
        delta
      );
      camera.position.z = ctrl.zoomDistance;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      // Clean disposals
      earthGeo.dispose();
      earthTexture.dispose();
      nightTexture.dispose();
      earthMat.dispose();

      cloudGeo.dispose();
      cloudTexture.dispose();
      cloudMat.dispose();

      atmoGeo.dispose();
      atmoMat.dispose();

      beamGeo.dispose();
      beamMat.dispose();
      gemGeo.dispose();
      gemMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();

      satOrbitRingGeo.dispose();
      satOrbitRingMat.dispose();
      satGeo.dispose();
      satMat.dispose();

      starGeo.dispose();
      starMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        data-testid="three-earth-viewport"
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
        title="3D Dunyo Planetasi: Sichqoncha bilan ushlab aylantiring, g'ildirak bilan yaqinlashtiring!"
      />

      {/* Floating Interactive Toast */}
      {infoToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-[#080d1e]/95 border border-cyan-500/50 text-cyan-300 text-xs font-mono shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 text-center">
          {infoToast}
        </div>
      )}

      {/* Top Left Indicators: Realistic 3D Earth & Uzbekistan Beacon */}
      <div className="absolute top-3 left-4 z-20 pointer-events-none flex flex-col gap-1.5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/65 border border-cyan-500/30 text-xs font-mono text-cyan-300 backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold">3D Realistik Dunyo Planetasi</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>O‘zbekiston (41.3°N, 69.2°E) • Toshkent</span>
        </div>
      </div>

      {/* Top Right Drag & Zoom Instruction */}
      <div className="absolute top-3 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <span>🖱️ 360° Aylantirish & Zoom</span>
      </div>

      {/* Floating Bottom Control Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        {/* Toggle Pill */}
        <button
          onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
          className="text-[11px] font-mono tracking-wider px-3.5 py-1 mb-1.5 rounded-full bg-slate-900/85 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md"
          aria-label="3D Planeta sozlamalari"
        >
          <span>{isControlsCollapsed ? '▴ Planeta Sozlamalari' : '▾ Yashirish'}</span>
        </button>

        {!isControlsCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl bg-[#090d20]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md">
            {/* Focus on Uzbekistan Button */}
            <button
              onClick={handleFocusUzbekistan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md transition-all active:scale-95"
              title="O‘zbekistonni to‘g‘ri markazga olib kelish"
            >
              <span>🎯 O‘zbekistonga Qaratish</span>
            </button>

            {/* Toggle Clouds */}
            <button
              onClick={() => {
                setShowClouds(!showClouds);
                setInfoToast(showClouds ? '☁️ Bulutlar qatlami yashirildi' : '☁️ Bulutlar qatlami yoqildi');
                setTimeout(() => setInfoToast(null), 1800);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                showClouds
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <span>☁️ Bulutlar</span>
            </button>

            {/* Toggle City Lights */}
            <button
              onClick={() => {
                setShowCityLights(!showCityLights);
                setInfoToast(showCityLights ? '💡 Tungi chiroqlar o‘chirildi' : '💡 Tungi shahar chiroqlari yoqildi');
                setTimeout(() => setInfoToast(null), 1800);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                showCityLights
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <span>💡 Chiroqlar</span>
            </button>

            {/* Toggle Auto Rotation */}
            <button
              onClick={() => {
                setAutoRotate(!autoRotate);
                setInfoToast(autoRotate ? '⏸️ Avto-aylanish to‘xtatildi' : '▶️ Avto-aylanish davom etmoqda');
                setTimeout(() => setInfoToast(null), 1800);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                autoRotate
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <span>{autoRotate ? '⏸️ Pauza' : '▶️ Aylanish'}</span>
            </button>

            {/* Wireframe toggle */}
            <button
              onClick={() => setIsWireframe(!isWireframe)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all border-l border-white/10 pl-2.5 ${
                isWireframe
                  ? 'text-cyan-400 font-bold bg-cyan-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wireframe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
