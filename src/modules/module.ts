/**
 * Base class of modules
 */
export abstract class Module
{
    //Name of the module
    private readonly _name : string;
    public get name() : string {return this._name; }

    /**
     * Constructor
     * @param {string} name Name of the module 
     */
    public constructor(name: string)
    {
        this._name = name;
    }

    /**
     * On message listener
     * @param {any} data Message data
     */
    public abstract onMessage(data: any): void;
}