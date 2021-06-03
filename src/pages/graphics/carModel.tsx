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

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    this.scene.add(ambientLight);
    
    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 200, -30);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
    this.renderModel();
    this.renderCanvas();
    new OrbitControls(this.camera, this.renderer.domElement);
  }

  renderPlane() {
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(600, 400, 1, 10);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -30;
    plane.position.z = 0;

    // add the plane to the scene
    this.scene.add(plane);
  }

  renderModel = () => {
    console.log('执行');

    const loader = new GLTFLoader();
    loader.load('http://localhost:8000/models/car/scene.gltf', (gltf) => {
      gltf.scene.scale.set(20, 20, 20);
      this.scene.add(gltf.scene);
    })


    let mtlLoader = new MTLLoader();
    let objLoader = new OBJLoader();
  }

  renderCanvas = () => {
    this.scene.traverse((e) => {
      if (e instanceof THREE.Group) {
        // e.rotateY(0.01);
      }
    });
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderCanvas);
  }
}