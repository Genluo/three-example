import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Base from '@/component/base/index';
import { SceneUtils } from '@/lib/sceneUtils';


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

    this.renderPlane();
    this.renderMerge();
    this.renderGroup();
    this.renderCanvas();
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

  renderGroup() {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), new THREE.MeshLambertMaterial({ color: 0x3E3E3E }));
    const cube = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshLambertMaterial({ color: 0x3E3E3E }));
    cube.castShadow = true;
    sphere.castShadow = true;
    const group = new THREE.Group();
    sphere.position.x = -100;
    cube.position.x = 30;
    group.add(cube);
    group.add(sphere);
    this.scene.add(group);
  }

  renderMerge() {
    const geometry = new THREE.BoxBufferGeometry();
    const createCube = (i) => {
      const x = (i % 10) * 10;
      const y = (i/10)* 10
      const cube = new THREE.BoxBufferGeometry(10,20,10);
      return cube;
    }
    for(let i = 0; i < 100; i++) {
      geometry.merge(createCube(i));
    }
    const material = new THREE.MeshBasicMaterial( { color: 0xC8C8C8} );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -10;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  renderCanvas = () => {
    this.scene.traverse((e) => {
      if (e instanceof THREE.Group) {
        e.rotateY(0.01);
      }
    });
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderCanvas);
  }
}