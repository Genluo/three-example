import { useEffect, createElement } from 'react';
import { getCanvas, createProgram, loadImage } from './utils';

// 顶点着色器
const vertexShader = `
  attribute vec2 a_texCoord;
  attribute vec4 a_position;
  varying vec2 v_texCoord;

  void main () {
      // gl_Position为内置变量，表示当前点的位置
      gl_Position = a_position;
      // gl_Position为内置变量，表示当前点的大小，为浮点类型，如果赋值是整数类型会报错
      gl_PointSize = 10.0;
      v_texCoord = a_texCoord;
  }  
`;

// 片元着色器
const fragmentShader = `
  // 设置浮点数精度
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;

  void main () {
      // vec4是表示四维向量，这里用来表示RGBA的值[0~1]，均为浮点数，如为整数则会报错
      gl_FragColor = texture2D(u_image, v_texCoord).rgba;
  }
`;
export default () => {
  useEffect(() => {
    const instance = getCanvas('#ICanvas');
    if (!instance) return;
    instance.clearColor(0, 0, 0.0, 0);
    instance.clear(instance.COLOR_BUFFER_BIT);
    const program = createProgram(instance, vertexShader, fragmentShader);
    if (!program) return;
    instance.useProgram(program);

    // 设置矩形的渲染
    const a_position = instance.getAttribLocation(program, 'a_position');
    instance.enableVertexAttribArray(a_position);
    const positionBuffer = instance.createBuffer();
    instance.bindBuffer(instance.ARRAY_BUFFER, positionBuffer);
    instance.bufferData(
      instance.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      instance.STATIC_DRAW,
    );

    // 创建纹理贴图
    const texcoordLocation = instance.getAttribLocation(program, 'a_texCoord');
    instance.enableVertexAttribArray(texcoordLocation);
    const texcoordBuffer = instance.createBuffer();
    instance.bindBuffer(instance.ARRAY_BUFFER, texcoordBuffer);
    instance.bufferData(
      instance.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      instance.STATIC_DRAW,
    );

    const texture = instance.createTexture();
    instance.bindTexture(instance.TEXTURE_2D, texture);

    // 设置参数，让我们可以绘制任何尺寸的图像
    instance.texParameteri(instance.TEXTURE_2D, instance.TEXTURE_WRAP_S, instance.CLAMP_TO_EDGE);
    instance.texParameteri(instance.TEXTURE_2D, instance.TEXTURE_WRAP_T, instance.CLAMP_TO_EDGE);
    instance.texParameteri(instance.TEXTURE_2D, instance.TEXTURE_MIN_FILTER, instance.NEAREST);
    instance.texParameteri(instance.TEXTURE_2D, instance.TEXTURE_MAG_FILTER, instance.NEAREST);

    loadImage('https://webglfundamentals.org/webgl/resources/leaves.jpg').then((image) => {
      // 将图像上传到纹理
      instance.texImage2D(instance.TEXTURE_2D, 0, instance.RGBA, instance.RGBA, instance.UNSIGNED_BYTE, image);

      const size = 2; // 2 components per iteration
      const type = instance.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0; // start at the beginning of the buffer
      // 矩形的渲染
      instance.vertexAttribPointer(a_position, size, type, normalize, stride, offset);
      // 图形的渲染
      instance.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

      // 开始绘制，绘制类型是instance.POINTS绘制点，0表示第一个点的索引，1表示共绘制几个点
      instance.drawArrays(instance.TRIANGLES, 0, 6);
    });
  }, []);
  return <canvas id="ICanvas" style={{ width: '100vw', height: '100vw' }} />;
};
