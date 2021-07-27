import { useEffect, createElement } from 'react';

function getCanvas(id: string) {
  const domElement = document.querySelector<HTMLCanvasElement>(id);
  if (domElement) {
    const iCanvas = domElement.getContext('webgl2');
    if (!iCanvas) return null;
    iCanvas.viewport(0, 0, iCanvas.canvas.width, iCanvas.canvas.height);
    return iCanvas;
  }
  return null;
}

function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
  // Create shader object
  const shader = gl.createShader(type);
  if (shader == null) {
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    const error = gl.getShaderInfoLog(shader);
    console.log(`Failed to compile shader: ${error}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vshader: string, fshader: string) {
  // Create shader object
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    const error = gl.getProgramInfoLog(program);
    console.log(`Failed to link program: ${error}`);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

function initShaders(gl: WebGL2RenderingContext, vshader: string, fshader: string) {
  const program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('创建program失败');
    return false;
  }
  gl.useProgram(program);
  return program;
}

export default () => {
  useEffect(() => {
    const instance = getCanvas('#ICanvas');
    if (!instance) return;
    instance.clearColor(1.0, 1.0, 0.0, 1.0);
    instance.clear(instance.COLOR_BUFFER_BIT);

    // 顶点着色器
    const vertexShader = `#version 300 es

    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 a_position;
    
    // all shaders have a main function
    void main() {
    
      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = a_position;
    }`;

    // 片元着色器
    const fragmentShader = `#version 300 es

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;
    
    // we need to declare an output for the fragment shader
    out vec4 outColor;
    
    void main() {
      // Just set the output to a constant redish-purple
      outColor = vec4(1, 0, 0.5, 1);
    }`;
    const program = initShaders(instance, vertexShader, fragmentShader);
    // 获取shader中a_position的地址
    const a_position = instance.getAttribLocation(program, 'a_position');

    // 传递第一个参数
    const positionBuffer = instance.createBuffer();
    instance.bindBuffer(instance.ARRAY_BUFFER, positionBuffer);
    const position = [
      -0.7, 0,
      0, 0.7,
      0.7, 0,
    ];
    instance.bufferData(instance.ARRAY_BUFFER, new Float32Array(position), instance.STATIC_DRAW);


    const vao = instance.createVertexArray();
    instance.bindVertexArray(vao);
    instance.enableVertexAttribArray(a_position);
    instance.vertexAttribPointer(a_position, 2, instance.FLOAT, false, 0, 0);


    instance.bindVertexArray(vao);
    // 开始绘制，绘制类型是gl.POINTS绘制点，0表示第一个点的索引，1表示共绘制几个点
    instance.drawArrays(instance.TRIANGLES, 0, 3);
  }, []);
  return <canvas id="ICanvas" style={{ width: '100vw', height: '100vw' }} />;
};
