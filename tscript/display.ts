// import { kp, dataAttribute} from "./kp.js";

import {iKpValue, iKp, iKpKeyInfo, kpHTMLElement, displayControl, kpKeyHandler} from "./definitions.js"
import { dataAttribute, Kind } from "./kp.js";
import { Util } from "./util.js";


/** 
 * DisplayConfig instance represents a keypad UI display control.
 * To create an instance add the attribute 'data-kp="display"' to an HTML element.
 * @classdesc
 */
class Display implements iKp {
    private _element: kpHTMLElement;
   
    private static _instanceMap:Map<string, Display> = new Map();
    private static _emptyDisplay:Display;
    /** static constructor */
    static{
        const emptyElement = document.createElement("div") as HTMLElement;
        emptyElement.id = "empty"
        Display._emptyDisplay = new Display(emptyElement as kpHTMLElement);
        
    }
    /** private constructor. Use the factory function {@link getInstance} to get a new Display instance. */
    private constructor(element: kpHTMLElement){
        this._element = element;
        this._element.kpObject = this;
        Display._instanceMap.set(element.id, this);
    }
    /**
     * 'getInstance' is a factory function used to create a new Display instance. 
     * If the Display instance already exists it will be returned.
     * Returns {@link empty} if not found. 
     * Returns null the elmentId refers to another type of data-kp.
     * @param elementId 
     * @returns 
     */
    static getInstance(elementId:string):Display{
        const instance = Display._instanceMap.get(elementId);
        if (instance != null){
            return instance;
        }
        const element = document.getElementById(elementId);
        if(!Util.isKind(element, Kind.Display))  return null;
        //todo: add error if elementID is not found
        
        if(element != null)
            return new Display(element as kpHTMLElement);
        return Display._emptyDisplay;
    }
   
    /**
     * Returns an array of all kpDisplay instances.
     */
    static get displays():Display[]{
        //let v = kpDisplay._instanceMap.values();
        return Array.from(Display._instanceMap.values());
    }
    get element():kpHTMLElement{
        return this._element;
    }
    
    /**
     * returns the name/id of the display element. 
     */
    get id():string{
        return this._element.id;
    }
    /**
     * 
     * @param text 
     * @returns 
     */
    displayText(text:string):Display{
        if(Util.isValidObject(text))
            this._element.innerText = text;
        return this;
    }
    addText(text:string):Display{
        this._element.textContent = this._element.textContent + text;
        return this;
    }
    clear():Display{
        this._element.innerText = "";
        return this;
    }
    get text(): string{
        return this._element.innerText;
    }
    set text(displayText:string){
        this._element.innerText = displayText;
    }
    get kpKind(): Kind {
        return Kind.Display;
    }
    setClasses(classes: string[]): iKp {
        Util.setClasses(this._element, classes);
        return this;
    }
    get isEmpty(): boolean{
        return (this == Display._emptyDisplay)
    }
    /** Returns an 'empty' Display instance. */
    get empty():Display{
        return Display._emptyDisplay;
    }

}
export {Display, displayControl}