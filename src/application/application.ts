import { ModulesManager } from "../modules/modules-manager.js";
import { ServerEvents } from "../server-events/server-events.js";

/**
 * Represents the application
 */
export class Application
{
    //Server-sent events manager
    private readonly _serverEvents: ServerEvents;

    //Modules manager
    private readonly _modulesManager: ModulesManager;

    /**
     * Constructor
     */
    public constructor()
    {
        this._serverEvents = new ServerEvents();
        this._modulesManager = new ModulesManager();

        this.initServerEvents();
        this.loadModules();
    }

    /**
     * Opens the connexion with the bot server
     */
    private initServerEvents()
    {
        this._serverEvents.onMessage((event: MessageEvent) => { this.dispatchMessage(event); });

        this._serverEvents.listenOn("http://localhost:5000/obs")
    }

    /**
     * Dispatches received message to modules
     * @param event Event to dispatch
     */
    private dispatchMessage(event: MessageEvent)
    {
        try
        {
            const json = JSON.parse(event.data);

            this._modulesManager.dispatchMessage(json.module, json.data)
        }
        catch (error)
        {

        }
    }

    /**
     * Loads modules dynamically from the "modules" attribut of the querystring 
     */
    private loadModules()
    {
        const searchParams = new URLSearchParams(window.location.search);
        const modulesString = searchParams.get("modules");

        if (!modulesString)
            return;

        try
        {
            const modules = JSON.parse(modulesString) as string[];

            modules.forEach((moduleName) =>
            {
                this._modulesManager.loadModule(moduleName)
            })
        }
        catch (error)
        {

        }
    }
}