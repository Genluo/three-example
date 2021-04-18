import { Component } from 'react';
import State from 'stats.js';
import * as THREE from 'three';

export default abstract class Three extends Component {
  public state: State;
  public abstract scene: THREE.Scene;
  public abstract camera: THREE.Camera;
  public abstract renderer: THREE.WebGLRenderer;

  constructor(props: any) {
    super(props);
    this.state = new State();
    this.state.showPanel(1);
  }

  componentDidMount() {
    document.getElementById('WebGL-output')?.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div>
        <div id="WebGL-output"></div>
        <div id="state-output"></div>
      </div>
    )
  }
}