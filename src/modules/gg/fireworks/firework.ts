import { Point } from "../../../drawing/point.js";
import { FireworkOptions } from "./firework-options.js";
import { FireworkParticle } from "./firework-particle.js";

/**
 * Represents a firework
 */
export class Firework
{
    //Username firing the firework
    private _username: string;
    public get username(): string { return this._username; };

    //Message of the user with the firework
    private _message: string;
    public get message(): string { return this._message; };
    
    //Position of the firework
    private _origin: Point;
    public get origin(): Point { return this._origin; };

    //Particles contituing the firework
    private _particles: FireworkParticle[];
    public get particles(): FireworkParticle[] { return this._particles; };

    //HSL hue of the firework (0 - 360)
    private _color: number;
    public get color(): number { return this._color; };
    
    /**
     * Constructor
     * @param {FireworkOptions} options Options of the firework 
     */
    constructor(options: FireworkOptions)
    {
        this._username = options.username;
        this._message = options.message;
        this._origin = options.origin;
        this._particles = [];
        this._color = Math.random() * 360;

        for(let i = 0; i < Math.floor(Math.random() * 50) + 50; ++i)
            this.particles.push(new FireworkParticle());
    }

    /**
     * Updates the state of the firework from elapsed time
     * @param {number} elapsedTime Elpased time from the last update (miliseconds)
     */
    update(elapsedTime: number)
    {
        for(let i = 0; i < this.particles.length; ++i)
        {
            const particle = this.particles[i];

            particle.update(elapsedTime);

            if(particle.distance > particle.maxDistance * 0.90)
            {
                this.particles.splice(i, 1);    
                --i;
            }
        }
    }
}