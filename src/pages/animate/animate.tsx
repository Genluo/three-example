import {createElement} from 'react';
import * as THREE from 'three';
import Base from '@/component/base/index';

export default class Component extends Base {
  scene = new THREE.Scene();
  cube!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>;
  renderer = new THREE.WebGL1Renderer({
    antialias: true,
  })
  camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000)

  constructor(props: any) {
    super(props);
    this.init();
  }

  init = () => {
    this.addCube();
    // 设计相机
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 100;
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    this.scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 100, 100);
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    // 渲染相关设置
    this.renderer.setClearColor(new THREE.Color(0xeeeeee));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderCanvas();

  }

  renderModal = () => {
  }

  addCube = () => {
    const cubeGeometry = new THREE.BoxGeometry(20,20, 20);
    const mesh = new THREE.Mesh(cubeGeometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    mesh.castShadow = true;
    this.cube = mesh;
    this.scene.add(mesh);
  }

  renderCanvas = () => {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderCanvas);
  }
}
