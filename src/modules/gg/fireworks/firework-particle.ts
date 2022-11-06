/**
 * Represents a firework particle
 */
export class FireworkParticle
{
    // Distance from the center of the firework
    private _distance: number;
    public get distance(): number { return this._distance; };
    public set distance(value: number) { this._distance = value; }
        
    // Direction of the particle (0 - 2xPI)
    private _direction: number;
    public get direction(): number { return this._direction; };
    public set direction(value: number) { this._direction = value; }
    
    // Speed of the particle
    private _speed: number;
    public get speed(): number { return this._speed; };
    public set speed(value: number) { this._speed = value; }
    
    //Max distance that can be covered by the particle
    private _maxDistance: number;
    public get maxDistance(): number { return this._maxDistance; };
    
    /**
     * Constructor
     */
    constructor()
    {
        this._direction = Math.random() * Math.PI * 2;
        this._speed = Math.random() * 0.2 + 0.1;
        this._distance = 0;
        this._maxDistance = this.speed * 1000;
    }

    /**
     * Updates the position of the particle from elapsed time and speed
     * @param { number } elapsedTime Elapsed time from the last update (miliseconds) 
     */
    update(elapsedTime: number)
    {
        const coef = (Math.cos(Math.PI*(this.distance / this.maxDistance)) + 1) / 2;
        const realSpeed = this.speed * coef;

        this.distance += realSpeed * elapsedTime;
    }
}