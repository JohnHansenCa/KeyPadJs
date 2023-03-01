// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as Popper from "https://unpkg.com/@popperjs/core@2.11.6/dist/esm/popper.js"
// import * as Mathjs from "./mathjs"
//import { Container } from "./container.js"
import {iKpValue, iKp, iKpKeyInfo, kpHTMLElement, KeyListener} from "./definitions.js"
import { Display } from "./display.js"
 import { Key } from "./key.js"
import { Util } from "./util.js"

/**
 * HtmlElement data attributes supported by {@link kp}.
 */
const dataAttribute= Object.freeze({
    KP:"data-kp",
    VALUE:"data-kp-value",
    LABEL:"data-kp-label",
    KPDISPLAY:"data-kp-display",
    TARGET: "data-kp-target",
    PLACEMENT: "data-kp-placement"
})
type KpDataAttribute =
    "data-kp"|
    "data-kp-value"|
    "data-kp-label"|
    "data-kp-display"|
    "data-kp-target" |
    "data-kp-placement"|
    "data-kp-select";

/** Identifies the kind of kp such as {@link Key}, {@link Container} etc*/
class Kind {
    
    /** string 'key' */
    static readonly KEY ="key";
    /** string 'display' */
    static readonly DISPLAY = "display";
    /** string 'grid-container' */
    static readonly GRID_CONTAINER = "grid-container";
    /** string 'flex-container' */
    static readonly FLEX_CONTAINER = "flex-container";
    /** string 'list-container' */
    static readonly LIST_CONTAINER = "list-container";
    // TODO: is this required?
    /** string 'dropdown-key'*/
    static readonly DROPDOWN_KEY = "dropdown-key";
    // TODO: is this required?
    /** string 'item-key' */
    static readonly ITEM = "item-key";
    /** string 'show-key' */
    static readonly SHOW = "show-key";
    /** string 'popup-key' */
    static readonly POPUP = "popup-key";
    /** string 'none' */
    static readonly NONE = "none";

    /** Identifies the kp object as {@link Key} */
    static readonly Key = new Kind(Kind.KEY);
    /** Identifies the kp object as {@link Display} */
    static readonly Display= new Kind(Kind.DISPLAY);
    /** Identifies the kp object as {@link Container} */
    static readonly Container = new Kind(Kind.GRID_CONTAINER);
    /**  Identifies the kp object as 'item' {@link Key}  */
    static  Item = new Kind(Kind.ITEM);
    /** Identifies the kp object as 'show' */
    static readonly Show = new Kind(Kind.SHOW);
     /** Identifies the kp object as 'Popup' */
    static readonly Popup = new Kind(Kind.POPUP);
    /** Identifies the kp object as none */
    static readonly None = new Kind(Kind.NONE);
    /**returns true if the parameter kpObject is a 'container' */
    // static isContainer(kpObject:iKp):boolean{
    //     return kpObject.kpKind == Kind.Container;
    // }
    private _name:string;
  
    private constructor(name:string) {
      this._name = name;
    }
    get name():string{
        return this._name;
    }
    toString() {
      return this._name;
    }
  }
  class DefaultListner{
    private static _key:KeyListener;
    private static _keyClick: EventListener;
    static get key():KeyListener{
        return DefaultListner._key;
    }
    static set key(keyListner){
        DefaultListner._key =keyListner;
    }
  }
//   /**
//  * Gets the {@link Display} instance for the given element. 
//  * If there no instance then an instance will be created.
//  * Returns null if there is a problem.
//  * TODO: fix returning of null and generating error messages
//  * @param elementId 
//  * @returns 
//  */
// function getDisplay(elementId: string):Display{
//     return Display.getInstance(elementId);
// }
// function getContainer(elementId: string):Container;      //Overloaded signature
// function getContainer(element: HTMLElement):Container;   //Overloaded signature
// /**
//  * Creates or retrieves a @see kpuiContainer
//  * @param elementId 
//  * @returns 
//  */
// function getContainer(e:never):Container{
//     return Container.getInstance(e);
// }
// function getKey(elementId: string):iKp;       //Overloaded signature
// function getKey(element: Element):iKp;        //Overloaded signature  
// function getKey(e: never):iKp{
//     //return Key.getInstance(e); 
//     return null;
//     }
let _countId = 0;
/**
 * Returns a unique ID by adding a number to the string startOfId. For example
 * create an id with the name "key" +{\\\}
 * @param startOfId 
 * @returns 
 */
function createUniqueId(startOfId:string):string{
    let loopCount = 0;
    while(loopCount < 1000){
        const newId = startOfId + _countId.toString();
        const e=document.getElementById(newId);
        if (e === null)return newId;
        loopCount = loopCount + 1;
        _countId = _countId + 1;
    }
    throw new Error('static kpui.CreateUnigyueId failed after 1000 numbers. WTF!');
}
//let body =document.getElementsByTagName('body')[0] as HTMLElement;
//body.style.visibility = "hidden";

//const resultDiv:HTMLElement;
//let mathResultDiv:HTMLElement;
//type eventHandlerType = (event: Event)=> void;
const buttonEventHandler:EventListener= function(event:Event){
    const element:HTMLElement = event.target as HTMLElement;
    // if(resultDiv != null)
    //     resultDiv.innerText = resultDiv.innerText + element.innerText;
    // TODO: change to element.kpObject.getElementValue(element)
    if(DefaultListner.key != null)DefaultListner.key(element.innerText, element);
}
/** An array that contains a list of the currenlty open popup containers. */
let popupContainers:HTMLElement[] = [];
let popperInstance;
const popupEventHandler:(event:Event)=>void = function(event:Event){
    let element:HTMLElement = event.target as HTMLElement;
    if(element.nodeName=== "SPAN")element = element.parentElement; // occurs when span inside key element
   
    let puContainer:HTMLElement;
    const targetStr = Util.getKpAttribute(element, dataAttribute.TARGET)
    if(targetStr == "") puContainer = element.nextElementSibling as HTMLElement;// todo: this is too simple, need to check
    else puContainer =  document.getElementById(targetStr) as HTMLElement;
    const isSomeParentPopup =parentPopupKey(element) != null;
    if(popupContainers.includes(puContainer)){
        if(popupContainers[0] == puContainer){
            closeAllPopups();
        }
        else {
            closeSomePopups(puContainer);
        }
    }
    else if(parentPopupKey(element) != null){
        let _placement = Util.getKpAttribute(element, dataAttribute.PLACEMENT);
        if(_placement === "")_placement = 'right';
        const boundary= document.getElementById("calculator-container");
        Popper.createPopper(element, puContainer, {
            placement: _placement,
            modifiers: [{
                name: 'preventOverflow',
                options:{boundary: boundary}}],
          });
         //TODO: close peer popup containers if open 
         // TODO: create util.popupContainer(popupelement) and util.peerPopupContainer(puContainer);
         // TODO: add unit tests for this-
        closePeerContainers(puContainer);
        //puContainer.classList.remove("kp-hide");
        puContainer.style.display = "";
        //window.dispatchEvent(new Event('resize'));
        popupContainers.push(puContainer);
    }
    else{
        if(!isSomeParentPopup && popupContainers != null)closeAllPopups();
        if(targetStr != ""){
            let _placement = Util.getKpAttribute(element, dataAttribute.PLACEMENT);
            if(_placement === "")_placement = 'right';
            const boundary= document.getElementById("calculator-container");
            //if(popperInstance != null) popperInstance.destroy();
            popperInstance = Popper.createPopper(element, puContainer, {
                placement: _placement,
                modifiers: [{
                    name: 'preventOverflow',
                    options:{boundary: boundary}}],
            });
        }
        puContainer.style.display = "";
        if(targetStr == "")
             window.dispatchEvent(new Event('resize'));
        popupContainers.push(puContainer);
    }
    event.stopPropagation();
}
const showOnlyEventHandler:EventListener = function(event:Event){
    const element = event.target as HTMLElement;
    // const attr = Util.getKpAttribute(element, "data-kp-target");
    // if(attr === "")return;
    // const target = document.getElementById(attr);
    const target = Util.getTarget(element);
    if(target == null)return;
    showOnly(target);
    event.stopPropagation();
}
function showOnly(target:HTMLElement){
    const parent = target.parentElement;
     Array.from(parent.children).forEach(element=> {
        if(element != target){
            (element as HTMLElement).style.display = "none";
 //           element.classList.remove(selectCssClass);
        }
        
    });
    target.style.display = "";
//    target.classList.add(selectCssClass);
}
const closeAllPopupsHandler = function(event: Event){
    closeAllPopups();
    event.stopPropagation;
}
const closeAllPopups = function(){
    popupContainers.forEach(e=>hidePopup(e));
    popupContainers = [];
}
function closeSomePopups(puContainer:HTMLElement){
    hidePopup(puContainer);
    let topVisible = popupContainers.pop();
    while (popupContainers.length>0 && topVisible != puContainer)
    {
        topVisible = popupContainers.pop();
        hidePopup(topVisible);
    }
}
/** Closes 1 peer container if open */
function closePeerContainers(element:HTMLElement){
    let openContainer = null;
    Array.from(element.parentElement.children).forEach(element =>{
        popupContainers.forEach( container =>{
            // there should only be 1 openContainer
            if(container === element) openContainer = element;
        })
    })
    if (openContainer != null) closeSomePopups(openContainer);
}
function hidePopup(e:HTMLElement){
    if(e != null)
        e.style.display = "none";
       // e.classList.add("kp-hide");
}
function parentPopupKey(e:HTMLElement):HTMLElement{
    let parentDiv = e.parentElement;
    let _parentPopupKey = null;
    while(parentDiv != null){
        _parentPopupKey = parentDiv.previousElementSibling;
        if(_parentPopupKey != null){
            const s = _parentPopupKey.getAttribute("data-kp");
            if(s == 'popup-key'){
                break;
            }
        }
        parentDiv = parentDiv.parentElement;
    }
    return _parentPopupKey;
}
let selectCssClass = "";
addEventListener('DOMContentLoaded', (event) => {
    const body = document.getElementsByTagName("body")[0];
    selectCssClass = Util.getKpAttribute(body, "data-kp-select");
    //let body = document.getElementsByTagName("body")[0];
    //body.style.visibility = "hidden";
    //resultDiv = document.getElementById("resultDiv");
    //let keyColl:HTMLCollectionOf<Element> = document.getElementsByClassName("kp-key");
    const keys:HTMLElement[] = Array.from(document.querySelectorAll("[data-kp]")) as HTMLElement[];
    keys.forEach(element=>{
        if(element.getAttribute("data-kp") === "popup-key"){
            element.addEventListener("click",popupEventHandler);
            //let d = window.getComputedStyle(element.nextElementSibling, null).display;
            //(element as any).kpDisplayStyle = d;
           // (element.nextElementSibling as HTMLElement).style.display = "none";
        }
        // else if(element.getAttribute("data-kp") === "key"){
        //     element.addEventListener("click", buttonEventHandler);
        // }
    });
    keys.forEach(element=>{
       
       if(element.getAttribute("data-kp") === "key"){
            element.addEventListener("click", buttonEventHandler);
        }
    });
    keys.forEach(element=>{
        if(element.getAttribute("data-kp") === "popup-key"){
            let _placement = Util.getKpAttribute(element, dataAttribute.PLACEMENT);
            if(_placement === "")_placement = 'right';
            const boundary= document.getElementById("calculator-container");
            const targetStr = Util.getKpAttribute(element, dataAttribute.TARGET);
            let target:HTMLElement;
            if(targetStr == "") {
                target = element.nextElementSibling as HTMLElement;
            }
            else {
                target = document.getElementById(targetStr) as HTMLElement;
            }
        
            Popper.createPopper(element, target, {
                placement: _placement,
                modifiers: [{
                    name: 'preventOverflow',
                    options:{boundary: boundary}}],
              });
        }
    });
    keys.forEach(element=>{
       
        if(element.getAttribute("data-kp") === "show-only-key"){
             element.addEventListener("click", showOnlyEventHandler);
             const target = Util.getTarget(element);
             if (target!=null && target.style.display === ""   ){ 
                showOnly(target);
             }
         }
     });
    //mathResultDiv = document.getElementById("mathResultDiv");
    document.addEventListener("click", closeAllPopupsHandler);
    
 //resultDiv.addEventListener('DOMSubtreeModified', calculate);
//body.style.visibility = "visible";
});


console.log("hi");

  export { Kind, dataAttribute, createUniqueId, DefaultListner, KpDataAttribute};
 export {iKpValue, iKp, iKpKeyInfo, kpHTMLElement, kpKeyHandler, displayControl, KeyListener} from "./definitions.js";
 export {Display} from "./display.js";
 export {Container} from "./container.js"
export {Key} from "./key.js";
