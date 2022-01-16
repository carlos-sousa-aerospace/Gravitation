import * as engine from "../engine/core.js";

const background = [0.0, 0.0, 0.0, 1.0];
const spaceshipColor = [0.25, 0.75, 1.0, 1.0];

class Gravitation {
    constructor(htmlCanvasID) {
        engine.init(htmlCanvasID).then(() => {
            engine.clearCanvas(background);
            engine.draw(spaceshipColor);
        });
    }
}

window.onload = function() {
    new Gravitation("glCanvas");
}