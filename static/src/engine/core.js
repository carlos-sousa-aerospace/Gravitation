// Type: Module
// Name: core.js
// Gravitation
// Author: Carlos Sousa
// 16-01-2022
// Description:
//    Core javascript module. Initializes the canvas element with a WebGl 2 context
//    Compiles and Links a shader Program

import * as vertexBuffer from "./vertexBuffer.js";
import Shader from "./Shader.js";

let mGL = null;
let mShader = null;

function getGL() {
  return mGL;
}

async function init(htmlCanvasID) {
  const canvas = document.getElementById(htmlCanvasID);
  mGL = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

  // Only continue if WebGL is available and working
  if (!mGL) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Init vertex buffer
  vertexBuffer.init();

  // Load and compile the shaders
  mShader = new Shader();
  await mShader.init("../static/src/shaders/vertexShader.glsl", "../static/src/shaders/fragmentShader.glsl");
}

function clearCanvas(color) {
  // Set clear color to black, fully opaque
  mGL.clearColor(color[0], color[1], color[2], color[3]);

  // Clear the color buffer with specified clear color
  mGL.clear(mGL.COLOR_BUFFER_BIT)
}

function draw(color) {
  // Activate the shader program
  mShader.activate(color);

  // Draw the geometry
  mGL.drawArrays(mGL.TRIANGLE_STRIP, 0, 4);
}

export { getGL, init, clearCanvas, draw }