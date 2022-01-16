import * as core from "./main.js";
import * as vertexBuffer from "./vertexBuffer.js";
let mCompiledShader = null;
let mVertexPositionRef = null;

async function getShaderSource(shaderURL) {
    try {
        const source = await fetch(shaderURL);
        
        if(!source.ok) {
            throw new Error(`HTTP Error! Status: ${source.status}`);
        }

        return await source.text();
    }
    catch(error){
        console.log(error);
        return null;
    }
}

async function loadAndCompileShader(shaderURL, shaderType) {
    try{
        const shaderSource = await getShaderSource(shaderURL);
        const gl = core.getGL();

        // Create the Shader
        const compiledShader = gl.createShader(shaderType);

        // Compile the shader
        gl.shaderSource(compiledShader, shaderSource);
        gl.compileShader(compiledShader);

        // Check for compile errors
        if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
            throw new Error(`Error compiling shader: ${gl.getShaderInfoLog(compiledShader)}`);
        }

        return compiledShader;
    }
    catch(error) {
        console.log(error);
        return null;
    }
}

async function init(vertexShaderURL, fragmentShaderURL) {
    try{
        const gl = core.getGL();

        // Create a OpenGL Program
        mCompiledShader = gl.createProgram();

        // Load and compile vertex and fragment shaders
        const shaders = await Promise.all([
            loadAndCompileShader(vertexShaderURL, gl.VERTEX_SHADER),
            loadAndCompileShader(fragmentShaderURL, gl.FRAGMENT_SHADER)
        ])

        if (shaders.some(shader => !shader)) {
            throw new Error("Failed to compile the shaders.");
        }

        // Link shader into the program
        shaders.forEach(shader => gl.attachShader(mCompiledShader, shader));
        gl.linkProgram(mCompiledShader);

        // Check for linking errors
        if (!gl.getProgramParameter(mCompiledShader, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(mCompiledShader);
            throw new Error(`Error linking shader. Info log: ${info}`);
        }

        // Gets the reference to the attribute defined in the vertex shader
        mVertexPositionRef = gl.getAttribLocation(mCompiledShader, "aVertexPosition");
    }
    catch(error) {
        console.log(error);
    }
}

function activate() {
    const gl = core.getGL();

    // Identify the compiled shader to use
    gl.useProgram(mCompiledShader);

    // Bind vertex buffer to the attribute defined in the vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.getGLVertexBuffer())

    // Instruct how to handle the data stored in the active vertex buffer
    gl.vertexAttribPointer(
        mVertexPositionRef,   // The reference of the attribute defined inthe vertex shader
        3,                    // Each vertex is an array of three floating-point numbers (x, y, z)
        gl.FLOAT,             // Data type is float
        false,                // False: do not normalize values passed
        0,                    // stride: number of bytes to skip in between vertices
        0                     // Offset to the first element
    );

    // Enable the attribute
    gl.enableVertexAttribArray(mVertexPositionRef);
}

export { init, activate }