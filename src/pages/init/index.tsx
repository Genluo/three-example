import { createElement, useEffect } from 'react';

function getCanvas(id: string) {
  const domElement = document.querySelector<HTMLCanvasElement>(id);
  if (domElement) {
    const iCanvas = domElement.getContext('webgl2');
    return iCanvas;
  }
  return null;
}

function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vshader: string,
  fshader: string,
) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

function initShaders(
  gl: WebGL2RenderingContext,
  vshader: string,
  fshader: string,
) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }
  gl.useProgram(program);
  return true;
}

export default () => {
  useEffect(() => {
    const instance = getCanvas('#ICanvas');
    if (!instance) return;
    instance.clearColor(1.0, 1.0, 0.0, 1.0);
    instance.clear(instance.COLOR_BUFFER_BIT);

    // 顶点着色器
    const vertexShader = `
      attribute vec4 a_position;
      void main () {
          // gl_Position为内置变量，表示当前点的位置
          gl_Position = a_position;
          // gl_Position为内置变量，表示当前点的大小，为浮点类型，如果赋值是整数类型会报错
          gl_PointSize = 10.0;
      }  
      `;
    // 片元着色器
    const fragmentShader = `
      // 设置浮点数精度
      precision mediump float;
      void main () {
          // vec4是表示四维向量，这里用来表示RGBA的值[0~1]，均为浮点数，如为整数则会报错
          gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
      }
      `;
      const program = createProgram(instance, vertexShader, fragmentShader);
      if (!program) return;
      instance.useProgram(program);
      // 获取shader中a_position的地址
      const a_position = instance.getAttribLocation(program, "a_position");
      // 往a_position这个地址中传值
      instance.vertexAttrib3f(a_position, 0.0, 0.0, 0.0);
      // 开始绘制，绘制类型是gl.POINTS绘制点，0表示第一个点的索引，1表示共绘制几个点
      instance.drawArrays(instance.POINTS, 0, 1);
  }, []);
  return <canvas id="ICanvas" width="100px" height="100px"></canvas>;
};
