// Type: Module
// Name: main.js
// Gravitation
// Author: Carlos Sousa
// 11-01-2022
// Description:
//    Main javascript module. Initializes the canvas element with a WebGl 2 context
//

import * as vertexBuffer from "./vertexBuffer.js";
import * as webGLProgram from "./program.js";

let mGL = null;

function getGL() {
  return mGL;
}

async function initWebGL(htmlCanvasID) {
  const canvas = document.getElementById(htmlCanvasID);
  mGL = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

  // Only continue if WebGL is available and working
  if (!mGL) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Set clear color to black, fully opaque
  mGL.clearColor(0.0, 0.0, 0.0, 1.0);

  // Init vertex buffer
  vertexBuffer.init();

  // Load and compile the shaders
  await webGLProgram.init("../static/src/vertexShader.glsl", "../static/src/fragmentShader.glsl");
}

function clearCanvas() {
  // Clear the color buffer with specified clear color
  mGL.clear(mGL.COLOR_BUFFER_BIT)
}

function draw() {
  // Activate the shader program
  webGLProgram.activate();

  // Draw the geometry
  mGL.drawArrays(mGL.TRIANGLE_STRIP, 0, 4);
}
  
  window.onload = function() {
    initWebGL("glCanvas")
      .then(() => {
        clearCanvas();
        draw();
      });
  }

  export { getGL }