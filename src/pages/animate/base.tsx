import {createElement} from 'react';
import * as THREE from 'three';
import Base from '@/component/base/index';
import { Projector } from 'three/examples/jsm/renderers/Projector';

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
    this.addMouse();
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

  addMouse = () => {
    const project = new Projector();
    document.addEventListener('click', (event) => {
      const dom = this.renderer.domElement.getBoundingClientRect();
      const { left, top } = dom;
      // 基于屏幕上的点击位置会创建一个THREE.Vecor3向量
      var vector = new THREE.Vector3(( (event.clientX - left) / window.innerWidth ) * 2 - 1, -( (event.clientY + top) / window.innerHeight ) * 2 + 1, 0.5);

      // 使用vector.unproject方法将屏幕上的点击位置转换成Three.js场景中的坐标。换句话说，就是将屏幕坐标转换成三维场景中的坐标。
      vector = vector.unproject(this.camera);

      // 然后，创建THREE.Raycaster。使用THREE.Raycaster可以向场景中发射光线,从摄像机的位置（camera.position）向场景中鼠标的点击位置发射光线。
      var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

      // 使用raycaster.intersectObjects方法来判断指定的对象中哪些被该光线照射到了
      var intersects = raycaster.intersectObjects([this.cube]);

      console.log(intersects);

      if (intersects.length > 0) {
        this.cube.material.transparent = true;
        this.cube.material.opacity = 0.5;
      } else {
        this.cube.material.transparent = true;
        this.cube.material.opacity = 1; 
      }
    }, false);

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
