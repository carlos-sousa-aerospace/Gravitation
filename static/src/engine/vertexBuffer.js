// Type: Module
// Name: vertexBuffer.js
// Gravitation
// Author: Carlos Sousa
// 15-01-2022
// Description:
//    Creates a vertex buffer with the vertices of the geometry to be rendered
//

import * as core from "./core.js";

let mGLVertexBuffer = null;

function getGLVertexBuffer() {
    return mGLVertexBuffer;
}

const mVerticesOfSquare = [
     0.2, -0.5, 0.0,
     0.0,  0.1, 0.0,
     0.0, -0.4, 0.0,
    -0.2, -0.5, 0.0
];

function init() {
    const gl = core.getGL();

    // Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();

    // Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Loads the vertices to the active buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
}

export { getGLVertexBuffer, init }