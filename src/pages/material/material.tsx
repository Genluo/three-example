import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Base from '@/component/base/index';
import { SceneUtils } from '@/lib/sceneUtils';

class Controller {
  material!: THREE.Material;
  scene!: THREE.Scene;
  cube!: THREE.Mesh<THREE.BoxGeometry, any>;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.cube = this.scene.getObjectByName('cube') as any;
  }

  /**
   * MeshBasicMaterial是一种非常简单的材质，这种材质不考虑场景中光照的影响。
   * 使用这种材质的网格会被渲染成简单的平面多边形，而且也可以显示几何体的线框。
   */
  changeMeshBasicMaterial = () => {
    const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000 });
    this.cube.material = cubeMaterial;
    this.cube.updateMatrix()
  }
   /**
   * 这是一种考虑光照影响的材质，用于创建暗淡的，不发光的物体
   */
  changeMeshLambertMaterial = () => {
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x000});
    this.cube.material = cubeMaterial;
    this.cube.updateMatrix();
  }

  /**
   * 使用这种材质的物体，其外观不是由光照或某个材质属性决定的，而是由物体到摄像机
   * 的距离决定的。可以将这种材质与其他材质结合使用，从而很容易地创建出逐渐消失的效果
   */
  changeDepthMaterial = () => {
    const cubeMaterial = new THREE.MeshDepthMaterial({
      wireframe: false,
    });
    this.cube.material = cubeMaterial;
    this.cube.updateMatrix();
  }

  /**
   * 这里主要演示联合材质创建的效果
   */
  changeUnionMaterial = () => {
    const cubeMaterial = new THREE.MeshDepthMaterial();
    const colorMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      blending: THREE.MultiplyBlending,
    });
    const unionMaterial = (SceneUtils.createMultiMaterialObject as any)(cubeMaterial, [colorMaterial, cubeMaterial]);
    unionMaterial.children[1].scale.set(0.99, 0.99, 0.99);
    this.cube.material = unionMaterial;
    this.cube.updateMatrix();
  }
}

export default class Scene extends Base {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);

  constructor(props: any) {
    super(props);
    this.scene.add(this.camera);
    // setting scene

    // setting camera
    this.camera.position.set(50, 50, 50);
    this.camera.lookAt(0, 0, 0);

    // setting renderer
    this.renderer.setClearColor(new THREE.Color(0xeeeeee));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.name = 'plane';

    // add the plane to the scene
    this.scene.add(plane);


    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    

    cube.castShadow = true;
    cube.name = 'cube';

    // position the cube
    cube.position.x = 0;
    cube.position.y = 10;
    cube.position.z = 0;
    this.scene.add(cube);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    this.scene.add(ambientLight);


    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-50, 50, 50);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
    this.renderer.shadowMapEnabled = true;
    this.renderCanvas();
    this.renderGui();
  }

 

  renderGui = () => {
    const controller = new Controller(this.scene);
    dat.GUI.domElement = document.getElementById('WebGL-gui');
    var gui = new dat.GUI();
    gui.add(controller, 'changeMeshBasicMaterial');
    gui.add(controller, 'changeMeshLambertMaterial');
    gui.add(controller, 'changeDepthMaterial');
    gui.add(controller, 'changeUnionMaterial');
  }

  renderCanvas = () => {
    const plane = this.scene.getObjectByName('plane');
    const cube = this.scene.getObjectByName('cube3');

    this.scene.traverse(function (e) {
      if (e instanceof THREE.Mesh && e !== plane) {
        e.rotation.x += 0.1;
        e.rotation.y += 0.1;
        e.rotation.z += 0.1;
      }

      if (e === cube) {
        cube.position.x -= 1;
        cube.position.z -= 1;
      }
    });


    // render using requestAnimationFrame
    requestAnimationFrame(this.renderCanvas);
    this.renderer.render(this.scene, this.camera);
  };
}
