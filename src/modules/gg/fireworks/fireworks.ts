import { Firework } from "./firework.js";
import { FireworkOptions } from "./firework-options.js";
import { FireworkParticle } from "./firework-particle.js";

/**
 * Manages fireworks
 */
export class Fireworks
{
    // Currently displayed fireworks
    private readonly _fireworks: Firework[];

    // Returns the amount of displayed fireworks
    public get length(): number { return this._fireworks.length }

    /**
     * Constructor
     */
    public constructor()
    {
        this._fireworks = [];
    }

    /**
     * Displays a new firework
     * @param {FireworkOptions} fireworkOptions Options of the firework 
     */
    public addFirework(fireworkOptions: FireworkOptions)
    {
        this._fireworks.push(new Firework(fireworkOptions));
    }

    /**
     * Updates state of the displayed fireworks from elapsed time
     * @param {HTMLCanvasElement} canvas Canvas to use to draw fireworks 
     * @param {number} elapsedTime Elapsed time from last update (miliseconds) 
     */
    public update(canvas: HTMLCanvasElement, elapsedTime: number)
    {
        for (let i = 0; i < this._fireworks.length; ++i)
        {
            const firework = this._fireworks[i];

            firework.update(elapsedTime);

            if (firework.particles.length === 0)
            {
                this._fireworks.splice(i, 1);
                --i;
            }
            else
                this.drawFirework(canvas, firework);
        }
    }

    /**
     * Draws a firework
     * @param { HTMLCanvasElement } canvas Canvas to use to draw the firework 
     * @param { Firework } firework Firework to draw 
     */
    private drawFirework(canvas: HTMLCanvasElement, firework: Firework)
    {
        const ctx = canvas.getContext("2d");

        if (!ctx)
            return;

        ctx.save();

        ctx.translate(firework.origin.x, firework.origin.y);

        const alpha = firework.particles[0].distance === 0 ? 1 : (firework.particles[0].maxDistance * 0.9 - firework.particles[0].distance) / firework.particles[0].distance;
        
        this.drawText(firework.username, firework.color, alpha, 40, ctx);

        ctx.translate(0, 30)
        this.drawText(firework.message, firework.color, alpha, 25, ctx);
        ctx.translate(0, -30)

        firework.particles.forEach((particle) =>
        {
            this.drawParticule(particle, firework.color, alpha, ctx);
        })

        ctx.restore();
    }

    /**
     * Draws a text on the canvas
     * @param { string } text Test to draw
     * @param { number } color HSL Hue of the text (0-360)
     * @param { number } alpha Alpha of the text (0.0 - 1.0)
     * @param { number } size Size of the font to use
     * @param { CanvasRenderingContext2D } ctx Canvas rendering context to use
     */
    private drawText(text: string, color: number, alpha: number, size: number, ctx: CanvasRenderingContext2D)
    {
        ctx.font = `${size}px sans-serif`;
        let textBounding = ctx.measureText(text);
        ctx.fillStyle = `hsla(${color} 70% 70% / ${alpha})`;
        ctx.fillText(text, -textBounding.width / 2, 0);
    }

    /**
     * Draws of firework particle
     * @param { FireworkParticle } particle Particle to draw
     * @param { number } color HSL Hue of the text (0-360)
     * @param { number } alpha Alpha of the text (0.0 - 1.0)
     * @param { CanvasRenderingContext2D } ctx Canvas rendering context to use
     */
    private drawParticule(particle: FireworkParticle, color: number, alpha: number, ctx: CanvasRenderingContext2D)
    {
        ctx.save();

        ctx.lineWidth = 3 + Math.floor(Math.random() * 5);

        ctx.rotate(particle.direction);

        ctx.beginPath();

        const lineLength = particle.speed * 250;
        const x1 = particle.distance - lineLength / 2
        const x2 = particle.distance + lineLength / 2
        ctx.moveTo(x1, 0);
        ctx.lineTo(x2, 0);

        const gradient = ctx.createLinearGradient(x1, 0, x2, 0);
        gradient.addColorStop(0, `hsla(${color} 70% 70% / 0)`);
        gradient.addColorStop(0.5, `hsla(${color} 70% 70% / ${alpha})`);
        gradient.addColorStop(1, `hsla(${color} 70% 70% / 0)`);
        ctx.strokeStyle = gradient;
        ctx.stroke();

        ctx.restore();
    }
}