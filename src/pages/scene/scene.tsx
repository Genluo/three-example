import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Base from '@/component/base/index';

function useThree() {
  useEffect(() => {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    scene.add(camera);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(1000, 1000);
    renderer.shadowMapEnabled = true;

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById('WebGL-output')?.appendChild(renderer.domElement);

    // call the render function
    var step = 0;

    render();

    var controls = new (function (this: any) {
      this.rotationSpeed = 0.02;
      this.numberOfObjects = scene.children.length;

      this.removeCube = function () {
        var allChildren = scene.children;
        var lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject);
          this.numberOfObjects = scene.children.length;
        }
      };

      this.changeLockAt = function () {
        camera.position.x = -100;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);
      };

      this.addCube = function () {
        var cubeSize = Math.ceil(Math.random() * 3);
        var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        var cubeMaterial = new THREE.MeshLambertMaterial({
          color: Math.random() * 0xffffff,
        });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = 'cube-' + scene.children.length;

        // position the cube randomly in the scene

        cube.position.x =
          -30 + Math.round(Math.random() * planeGeometry.parameters.width);
        cube.position.y = Math.round(Math.random() * 5);
        cube.position.z =
          -20 + Math.round(Math.random() * planeGeometry.parameters.height);

        // add the cube to the scene
        scene.add(cube);
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
      };

      this.outputObjects = function () {
        console.log(scene.children);
      };
    } as any)();

    function render() {
      // rotate the cubes around its axes
      scene.traverse(function (e) {
        if (e instanceof THREE.Mesh && e != plane) {
          e.rotation.x += controls.rotationSpeed;
          e.rotation.y += controls.rotationSpeed;
          e.rotation.z += controls.rotationSpeed;
        }
      });

      // render using requestAnimationFrame
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    addGui();

    function addGui() {
      dat.GUI.domElement = document.getElementById('WebGL-gui');
      var gui = new dat.GUI();

      gui.add(controls, 'rotationSpeed', 0, 0.5);
      gui.add(controls, 'addCube');
      gui.add(controls, 'removeCube');
      gui.add(controls, 'outputObjects');
      gui.add(controls, 'numberOfObjects').listen();
      gui.add(controls, 'changeLockAt');
    }
  }, []);
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
    cube.name='cube';

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
    spotLight.position.set(-50, 100, 50);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
    this.renderer.shadowMapEnabled = true;

    // request animate
    this.renderCanvas();
  }

  renderCanvas = () => {
    const plane = this.scene.getObjectByName('plane');
    this.scene.traverse(function (e) {
      if (e instanceof THREE.Mesh && e !== plane) {
        e.rotation.y += 0.1;
      }
    });

    // render using requestAnimationFrame
    requestAnimationFrame(this.renderCanvas);
    this.renderer.render(this.scene, this.camera);
  };
}
