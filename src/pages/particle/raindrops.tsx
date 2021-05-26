import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Base from '@/component/base/index';
import { SceneUtils } from '@/lib/sceneUtils';
import img from './raindrop-1.png';


export default class Scene extends Base {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
  cloud!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;

  constructor(props: any) {
    super(props);
    this.scene.add(this.camera);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
    this.renderer.autoClearColor = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.addPoints();
    this.renderCanvas();
  }

  addPoints() {
    const geom = new THREE.BoxGeometry(10, 10);
    const position = [];
    const colors = [];


    /* 使粒子在立方体范围内扩散 */
    let n = 100, n2 = n / 2;

    for(let x = -50; x < 50;x++) {
      for(let y = -50; y<50;y++) {
        let x = Math.random() * n - n2;
        let y = Math.random() * n - n2;
        let z = Math.random() * n - n2;
        position.push(x, y, z);
      } 
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
    const texture = new THREE.TextureLoader().load(img);
    console.log('texture', texture);
    const cloud = new THREE.Points(geom, new THREE.PointsMaterial({
      size: 4,
      map: texture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      color: 0x888888,
    }));

    cloud.geometry.attributes.position.needsUpdate = true;

    this.cloud = cloud;
    this.scene.add(cloud);
  }

  renderCanvas = () => {
    var positions = this.cloud.geometry.attributes.position.array as any;
    for (let i = 0; i < positions.length; i += 3) {
      const v = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
      positions[i + 1] -= 1;
      if (positions[i + 1] <= -50) {
        positions[i + 1] = 50;
      }
    }
    this.cloud.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.cloud.geometry.attributes.position.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderCanvas);
  }
}