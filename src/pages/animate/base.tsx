import {createElement} from 'react';
import * as THREE from 'three';
import Base from '@/component/base/index';

export class Component extends Base {
  scene = new THREE.Scene();
  renderer = new THREE.WebGL1Renderer({
    antialias: true,
  })
  camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000)

  constructor(props: any) {
    super(props);
    this.init();
  }

  init = () => {
  }

  renderCanvas = () => {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderCanvas);
  }
}
