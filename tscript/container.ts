
import { displayControl, iKp, iKpKeyInfo, kpHTMLElement, kpKeyHandler } from './definitions.js';
import { Kind, dataAttribute, createUniqueId} from './kp.js';
import { Util, Css} from './util.js';
import { Key } from './key.js';
/**
 * kpContainer class instances describe container that contains keys or
 * other containers.
 * @see kp.container() to create or retrieve a container.
 */
class Container implements iKp{
    _displayParam:displayControl[] = [];
    private _element: kpHTMLElement;
    private _kpKeys:Array<iKp> = [];
    /** set to 'grid', 'flex' or 'none'. Used to properly display a popup container.
     * Only set when parent is popupkey'
     * @deprecated- use _displayStyle
     */
    private _popupDisplay;
    /** Property is set to 'grid', 'flex' or 'none'. Used to properly display a popup container.
     * Only set when parent is popupkey otherwise undefined.'
     * @deprecated
     */
    get popupDisplay():string{
        return this._popupDisplay;
    }
    private _displayStyle:string;
    private set DisplayStyle(style:string){
        if(style != "none")
            this._displayStyle = style;
    }
    get displayStyle():string{
        return this._displayStyle;
    }
    /**
     * Stores all instances of kpuiContainer
     */
    private static _instanceMap = new Map();
    private static _defaultClasses:Array<string> = ['kpContainer'];
    private _keyHandler:kpKeyHandler ;
    private constructor(key:string, element: kpHTMLElement){
        Container._instanceMap.set(key, this);
        this._element = element;
        this._element.kpObject = this;
        const parentElement = this._element.parentElement as kpHTMLElement;
        if(Util.isValidObject(parentElement.kpObject)){
            // if(Kind.isContainer(parentElement.kpObject))
            // {
            //     this._parentContainer = parentElement.kpObject as Container;
            //     this._parentContainer._childContainers.push(this);
            // }
            if(parentElement.kpObject.kpKind == Kind.Popup){
                // this._popupContainer = this;
                // this._popupDisplay = window.getComputedStyle(this._element, null).display;
                // if(this._popupDisplay === "none") this._popupDisplay = "flex";
                // this._element.style.display = "none";
                this.fixPopupContainer(this);
            }
        }
        Util.addKpAttributeIfRequired(element, Kind.Container);
    }
    private makeChildKeys():void{
        this._element.childNodes.forEach(e =>{
            // childnodes can contain text and comments so ignore them
            if(e instanceof HTMLDivElement )
            {
                //this._kpKeys.push( getKey(e));
            }
        });
    }
    static getInstance(elementId:HTMLElement):Container;
    static getInstance(elementId:string):Container;
    static getInstance(e:unknown):Container{
        if(typeof e === "string"){
            const elementId = e;
            const instance = Container._instanceMap.get(elementId);
            if (instance != null){
                return instance;
            }
            const element = document.getElementById(elementId);
            //todo: add error if elementID is not found
            //let t = typeof(element);
            if((element != null) && (element.nodeName === "DIV")){
                const container =  new Container(elementId, element as kpHTMLElement);
                //container._element.classList.contains()
                container.makeChildKeys();
                return container;
            }
        }
        else if(e instanceof HTMLElement){
            const element = e;
            if(element.id != "")
            {
                const instance = Container._instanceMap.get(element.id);
                if (instance != null){
                    return instance;
                }
            }
            //let element = document.getElementById(elementId);
            //todo: add error if elementID is not found
            //let t = typeof(element);
            if((element != null) && (element.nodeName === "DIV")){
                if(element.id =="")element.id = createUniqueId("container");
                const container =  new Container(element.id, element as kpHTMLElement);
                //container._element.classList.contains()
                container.makeChildKeys();
                return container;
            }
        }
        return null;
    }
    
   
   /**
    * returns an array keypad keys (and containers?) that are in this container.
    * todo: verify child containers are included in kpKeys
    */
    get KpKeys():iKp[]{
        // if(this._kpKeys.length == 0){
        //     // just incase keKeys was never initialized
        //     this.makeChildKeys();
        // }
        // todo: elements may have been added so regenerate the array, maybe
        return Array.from(this._kpKeys); // create copy of array so it is immutable
    }
    public set keyHandler(fn : kpKeyHandler){
        this._keyHandler = fn;
    }
    public get keyHandler():kpKeyHandler{
        return this._keyHandler;
    }
    /**
     * Returns true if the key is a child of this container.
     * @param key 
     * @returns 
     */
    public isChild(key: iKp):boolean{
        return this._kpKeys.includes(key);
    }
    /** Identifies this object as {@link Kind.Container} */
    get kpKind(): Kind{
        return Kind.Container;
    }
    get element(): kpHTMLElement{
        return this._element;
    }
    setClasses(classes: string[]): iKp {
        Util.setClasses(this._element, classes);
        this.DisplayStyle = this.getDisplayStyle();
        return this;
    }
    private showOnly(){
        if(Util.isValidObject(this._displayStyle ))
            this._element.style.display = this._displayStyle;
        else
            this._element.style.display = "grid";
    }
    private getDisplayStyle():string{
        return window.getComputedStyle(this._element, null).display;
    }
    private hideOnly(){
        this.DisplayStyle = this.getDisplayStyle();
        this._element.style.display = "none";
    }
    get siblings():Container[]{
        return this._parentContainer.childContainers.
            filter(cont => cont != this);
    }
    /** 
     * Shows this container and hides sibling containers. 
     * */
    show():Container{
        this.showOnly();
        //let s = this.siblings;
        this.siblings.forEach(sib => {sib.hideOnly()});
        return this;
    }
    hide():Container{
        this.hideOnly();
        return this;
    }
    private _childContainers:Container[] = [];
    get childContainers():Container[]{
        return Array.from(this._childContainers);
    }
    private _parentContainer:Container ;
    /** returns the parent container. Returns null if one doesn't exist. 
     * Also see {@link Container.parentKey} */
    get parentContainer():Container{
        return this._parentContainer;
    }
    /** if defined indicates container in the chain to be hidden */
    private _popupContainer:Container;
    /** if defined indicates the container in the chain to be hidden since its
     * parent is a popup key.
    */
    get popupContainer():Container{
        return this._popupContainer;
    }
    /**
     * Returns the parent element provided it is a key, otherwise
     * null is returned.
     * Also see {@link Container.parentContainer} */
    get parentKey():Key{
        let parentElement = this._element.parentElement as kpHTMLElement;
        // if(parentElement == null) return null;
        // if(parentElement.kpObject == undefined)return null;
        // if(!(parentElement.kpObject instanceof Key))return null;
        return parentElement.kpObject as Key;
    }
    /**
     * Creates child kp object. Currently only creates a container.
     * @param childInfo 
     * @param content Optional parameter only used when creating a dropDown key
     * @param target Optional parameter only used when creating a show key. 
     * Content must be set to empty or null when this optional parameter is used.
     * @returns 
     */
    // TODO: fix to use value and remove eslint-disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // createChild({id="", label="", value="", kind=Kind.Key, classes=[], target=null, child={}}:iKpKeyInfo):iKp{
    //     let returnObject:iKp = null;
    //     //childInfo = kp.Util.addDefaultKeyInfo(childInfo);
    //     if(kind == Kind.Key){
    //         const e = document.createElement("div");
    //         Util.setClasses(e, classes);
    //         e.appendChild(document.createTextNode(label));
    //         e.id = id;
    //         this.element.appendChild(e);
    //         const key = getKey(e);
    //         this._kpKeys.push( key);
    //         returnObject = key as Key;
    //     }
    //     else if(kind == Kind.Container){
    //         const e = document.createElement("div");
    //         e.id = id;
    //         e.setAttribute(dataAttribute.KP, Kind.GRID_CONTAINER);
    //         Util.setClasses(e, classes);
    //         this._element.appendChild(e);
    //         returnObject = getContainer(e);
    //         (returnObject as Container)._popupContainer = this._popupContainer;
    //     }
    //     else if(kind == Kind.Show){
    //         const e = document.createElement("div");
    //         e.id = id;
    //         e.innerHTML = label;
    //         e.setAttribute(dataAttribute.KP, Kind.SHOW);
    //         Util.setClasses(e, classes);
    //         this._element.appendChild(e);
    //         returnObject = Key.getInstance(e, target)
    //     }
    //     else if(kind == Kind.Popup){
    //         const e = document.createElement("div");
    //         e.id = id;
    //         e.innerHTML = label;
    //         e.setAttribute(dataAttribute.KP, Kind.POPUP);
    //         Util.setClasses(e, classes);
    //         this._element.appendChild(e);
    //         const eContent = document.createElement('div');
    //         Util.setClasses(eContent, child.classes);
    //         e.appendChild(eContent);
    //         const content = getContainer(eContent);
    //         // fix container because this is not done in the constructor 
    //         // because it relies on the kpKey being created first
    //         this.fixPopupContainer(content);
    //         returnObject = Key.getInstance(e, content);
    //         // set mouseover handler
    //     }
    //     return returnObject;
    // }
    /**
     * fix container because of special requirements of a popup Container.
     * Note: this is not always done in the constructor 
     * because it relies on the kpKey being created first
     * @param content : ;
     */
    private fixPopupContainer(content:Container){
        content._popupContainer = content;
        //content._popupDisplay = this.getDisplayStyle();
        //if(content._popupDisplay === "none") content._popupDisplay = "flex";
        const style = content.getDisplayStyle();
        if(style === "none")content.DisplayStyle = 'flex';
        else content.DisplayStyle = style;
        content._element.style.display = "none";
    }
    
 
   
    
    createChildren(childInfoArray:iKpKeyInfo[]):iKp[]{
        const returnArray:iKp[]= [];
        // childInfoArray.forEach(key =>{
        //     returnArray.push(this.createChild(key));
        // })
        return returnArray;
    }
}
export{Container}