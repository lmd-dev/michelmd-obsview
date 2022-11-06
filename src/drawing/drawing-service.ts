import { Drawable } from "./drawable.js";

/**
 * Service responsible for drawing on the application canvas
 */
class DrawingService
{
    // Is drawing enabled
    private _drawingEnabled: boolean;

    // Subscribers to drawing service
    private _subscribers: Drawable[];

    // Canvas to use to draw  
    private _canvas: HTMLCanvasElement | null;
    public get canvas(): HTMLCanvasElement 
    {
        if (this._canvas === null)
        {
            this._canvas = document.createElement("canvas");
            document.body.append(this._canvas);

            window.addEventListener("resize", () => { this.resize(); });

            this.resize();
        }

        return this._canvas;
    }

    /**
     * Constructor
     */
    public constructor()
    {
        this._drawingEnabled = false;
        this._canvas = null;
        this._subscribers = [];
    }

    /**
     * Adds a new subscriber
     * @param {Drawable} subscriber Drawable object to add to the subscribers 
     */
    public subscribe(subscriber: Drawable)
    {
        if(this._subscribers.indexOf(subscriber) !== -1)
            return;
            
        this._subscribers.push(subscriber);

        if(!this._drawingEnabled)
            this.start();
    }

    /**
     * Remove a subscriber
     * @param {Drawable} subscriber Subscriber to remove 
     */
    public unsubscribe(subscriber: Drawable)
    {
        const index = this._subscribers.indexOf(subscriber);

        if(index !== -1)
            this._subscribers.splice(index, 1);

        if(this._subscribers.length === 0)
            this.stop();
    }

    /**
     * Starts the drawing loop
     */
    private start()
    {
        this._drawingEnabled = true;

        this.draw();
    }

    /**
     * Stop the drawing loop
     */
    private stop()
    {
        this._drawingEnabled = false;
    }

    /**
     * Resizes the canvas
     */
    private resize()
    {
        if (!this._canvas)
            return;

        this._canvas.width = this._canvas.clientWidth;
        this._canvas.height = this._canvas.clientHeight;
    }

    /**
     * Asks subscribers to draw on the canvas
     * @param {number} elapsedTime Elapsed time from the last drawing (miliseconds) 
     */
    private draw(elapsedTime: number = 0)
    {
        if(!this._drawingEnabled)
            return;

        const t0 = performance.now();

        if (this._canvas)
        {
            const ctx = this._canvas.getContext("2d");
            ctx?.clearRect(0, 0, this._canvas.width, this._canvas.height);

            this._subscribers.forEach((subscriber) => { subscriber.draw(elapsedTime) });
        }

        requestAnimationFrame(() => { this.draw(performance.now() - t0) });
    }
}

export const drawingService = new DrawingService();