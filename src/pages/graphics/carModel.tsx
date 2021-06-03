import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';
import Base from '@/component/base/index';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader';

export default class Scene extends Base {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
  cloud!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;

  constructor(props: any) {
    super(props);
    this.renderer.shadowMap.enabled = true;
    this.scene.add(this.camera);
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(0, 0, 0);
    this.renderer.setClearColor(new THREE.Color(0xeeeeee));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    
    // add spotlight for the shadows

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    var light = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI);
    light.position.set(0, 50, 0);
    this.scene.add(light);

    this.renderModel();
    this.renderCanvas();
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    new OrbitControls(this.camera, this.renderer.domElement);
  }

  renderModel = () => {
    console.log('执行');

    const loader = new GLTFLoader();
    loader.load('http://localhost:8000/models/car/scene.gltf', (gltf) => {
      gltf.scene.scale.set(30, 30, 30);
      this.scene.add(gltf.scene);
    })
  }

  renderCanvas = () => {
    this.scene.traverse((e) => {
      if (e instanceof THREE.Group) {
        e.rotateY(-0.01);
      }
    });
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderCanvas);
  }
}
