export type OnMessageCallback = (event: MessageEvent) => void;
export type OnOpenCallback = (event: Event) => void;
export type OnErrorCallback = (event: Event) => void;

interface EventType {
    message(callback: OnMessageCallback): void;
    open(callback: OnOpenCallback): void;
    error(callback: OnErrorCallback): void;
}

interface NotificationType {
    message(event: MessageEvent): void;
    open(event: Event): void;
    error(event: Event): void;
}

/**
 * Class responsible for Server sent events
 */
export class ServerEvents
{
    //Source of the events
    private _eventSource: EventSource | null;

    //Listeners on received messages
    private _listeners: Map<string, CallableFunction[]>;

    /**
     * Constructor
     */
    public constructor()
    {
        this._eventSource = null;

        this._listeners = new Map<string, CallableFunction[]>();
    }

    /**
     * Adds a listener on message sended from the server
     * @param { OnMessageCallback } callback 
     */
    public onMessage(callback: OnMessageCallback)
    {
        this.addListener("message", callback);
    }

    /**
     * Adds a listener on the opening of the connection with the server
     * @param { OnOpenCallback } callback 
     */
    public onOpen(callback: OnOpenCallback)
    {
        this.addListener("open", callback);
    }    

    /**
     * Adds a listener on errors occured during the connection with the server
     * @param { OnErrorCallback } callback 
     */
    public onError(callback: OnErrorCallback)
    {
        this.addListener("error", callback);
    }

    /**
     * Adds a listener on the given type of event
     * @param { string } type Type of the event to listen
     * @param callback Callback to... call
     */
    private addListener<T extends keyof EventType>(type: T, callback: Parameters<EventType[T]>[0])
    {
        if(this._listeners.has(type) === false)
            this._listeners.set(type, []);

        const listeners = this._listeners.get(type);;

        listeners?.push(callback);
    }

    /**
     * Starts listening events on the given URI
     * @param uri URI to connect to
     */
    public listenOn(uri: string)
    {
        if(this._eventSource)
            this._eventSource.close();

        this._eventSource = new EventSource(uri);

        this._eventSource.onopen = (event) => { this.notify("open", event); };
        this._eventSource.onerror = (event) => { this.notify("error", event); };
        this._eventSource.onmessage = (event) => { this.notify("message", event); };
    }

    /**
     * Notifies listeners on event reception
     * @param { string } type Type of event listeners to notfify
     * @param { Event | MessageEvent } event Event received from the server 
     */
    private notify<T extends keyof NotificationType>(type: T, event: Parameters<NotificationType[T]>[0])
    {        
        this._listeners.get(type)?.forEach((callback) => {
            callback(event);
        });
    }
}