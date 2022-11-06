import { drawingService } from "../../drawing/drawing-service.js";
import { Drawable } from "../../drawing/drawable.js";
import { Module } from "../module.js";
import { Fireworks } from "./fireworks/fireworks.js";
import { GGModuleMessage } from "./gg-module-message.js";

/**
 * GG frontend module
 */
export default class GGModule extends Module implements Drawable
{
    //Canvas to use for drawing fireworks
    private readonly _canvas: HTMLCanvasElement ;

    //Fireworks manager
    private readonly _fireworks: Fireworks;

    /**
     * Constructor
     */
    constructor()
    {
        super("GG");

        this._fireworks = new Fireworks();
        this._canvas = drawingService.canvas;
    }

    /**
     * Draws fireworks on the canvas
     * @param {number} elapsedTime Elapsed time from the last drawing (miliseconds)
     */
    public draw(elapsedTime: number)
    {
        this._fireworks.update(this._canvas, elapsedTime);

        if(this._fireworks.length === 0)
            drawingService.unsubscribe(this);
    }

    /**
     * When message is sended to the module
     * @param {GGModuleMessage} data Data sended with the message 
     */
    public onMessage(data: GGModuleMessage)
    {
        const x = Math.ceil(this._canvas.width * Math.random());
        const y = Math.ceil(this._canvas.height * Math.random());

        this._fireworks.addFirework({
            username: data.username,
            message: data.message,
            origin: {
                x: x,
                y: y
            }
        });

        drawingService.subscribe(this);
    }
}