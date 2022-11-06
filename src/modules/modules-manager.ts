import { Module } from "./module.js";

/**
 * Responsible for loading dynamically modules and dispatch messages to them
 */
export class ModulesManager
{
    // Loaded modules
    private readonly _modules: Map<string, Module>;

    /**
     * Constructor
     */
    public constructor()
    {        
        this._modules = new Map<string, Module>();
    }

    /**
     * Dispatch message to the module with the given name
     * @param {string} moduleName Name of the module todispatch message 
     * @param {any} data Data of the message 
     */
    public dispatchMessage(moduleName: string, data: any)
    {
        this._modules.get(moduleName)?.onMessage(data);
    }

    /**
     * Loads dynamically the module with the given name
     * @param {string} moduleName Name of the module to load 
     */
    async loadModule(moduleName: string): Promise<void>
    {
        try
        {
            const ModuleClass = await import(`./${moduleName}/${moduleName}.module.js`);

            this._modules.set(moduleName, new ModuleClass.default());
        }
        catch(error)
        {
            console.error(`An error occured on loading module '${moduleName}'`);
            console.error(error);
        }
    }
}