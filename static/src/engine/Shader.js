import * as core from "./core.js";
import * as vertexBuffer from "./vertexBuffer.js";

export default class Shader {
    constructor() {
        this.mProgram = null; // The compiled glsl program
        this.mVertexPositionRef = null; // The reference to the aVertexPosition in the shader
        this.mPixelColorRef = null; // Pixel color uniform in fragment shader
    }

    async init(vertexShaderURL, fragmentShaderURL) {
        // ---------------------------------------- //
        // Initialization of the Program            //
        // ---------------------------------------- //
        try{
            const gl = core.getGL();
    
            // Create an OpenGL Program
            this.mProgram = gl.createProgram();
    
            // Load and compile vertex and fragment shaders
            const shaders = await Promise.all([
                loadAndCompileShader(vertexShaderURL, gl.VERTEX_SHADER),
                loadAndCompileShader(fragmentShaderURL, gl.FRAGMENT_SHADER)
            ])
    
            if (shaders.some(shader => !shader)) {
                throw new Error("Failed to compile the shaders.");
            }
    
            // Link shader into the program
            shaders.forEach(shader => gl.attachShader(this.mProgram, shader));
            gl.linkProgram(this.mProgram);
    
            // Check for linking errors
            if (!gl.getProgramParameter(this.mProgram, gl.LINK_STATUS)) {
                const info = gl.getProgramInfoLog(this.mProgram);
                throw new Error(`Error linking shader. Info log: ${info}`);
            }
    
            // Gets the reference to the attribute defined in the vertex shader
            this.mVertexPositionRef = gl.getAttribLocation(this.mProgram, "aVertexPosition");

            // Gets the reference to the uniform variable defined in the fragment shader
            this.mPixelColorRef = gl.getUniformLocation(this.mProgram, "uPixelColor");
        }
        catch(error) {
            console.log(error);
        }
    }

    activate(pixelColor) {
        const gl = core.getGL();
    
        // Identify the compiled shader to use
        gl.useProgram(this.mProgram);
    
        // Bind vertex buffer to the attribute defined in the vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.getGLVertexBuffer())
    
        // Instruct how to handle the data stored in the active vertex buffer
        gl.vertexAttribPointer(
            this.mVertexPositionRef,   // The reference of the attribute defined inthe vertex shader
            3,                         // Each vertex is an array of three floating-point numbers (x, y, z)
            gl.FLOAT,                  // Data type is float
            false,                     // False: do not normalize values passed
            0,                         // stride: number of bytes to skip in between vertices
            0                          // Offset to the first element
        );
    
        // Enable the vertex shader attribute
        gl.enableVertexAttribArray(this.mVertexPositionRef);

        // Load the color for the uniform variable defined in the fragment shader
        gl.uniform4fv(this.mPixelColorRef, pixelColor);
    }
}

// ---------------------------------------- //
// Private Utility functions                //
// ---------------------------------------- //

async function getShaderSource(shaderURL) {
    // Reads shader source file using the Fetch API
    // and returns the text contained in it
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