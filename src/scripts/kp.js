//@ts-ignore
import * as Popper from "https://unpkg.com/@popperjs/core@2.11.6/dist/esm/popper.js";
/**
 * HtmlElement data attributes supported by {@link kp}.
 */
const dataAttribute = Object.freeze({
    KP: "data-kp",
    VALUE: "data-kp-value",
    LABEL: "data-kp-label",
    KPDISPLAY: "data-kp-display",
    KPTARGET: "data-kp-target"
});
/** Identifies the kind of kp such as {@link Key}, {@link Container} etc*/
class Kind {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    toString() {
        return this._name;
    }
}
/** string 'key' */
Kind.KEY = "key";
/** string 'display' */
Kind.DISPLAY = "display";
/** string 'grid-container' */
Kind.GRID_CONTAINER = "grid-container";
/** string 'flex-container' */
Kind.FLEX_CONTAINER = "flex-container";
/** string 'list-container' */
Kind.LIST_CONTAINER = "list-container";
// TODO: is this required?
/** string 'dropdown-key'*/
Kind.DROPDOWN_KEY = "dropdown-key";
// TODO: is this required?
/** string 'item-key' */
Kind.ITEM = "item-key";
/** string 'show-key' */
Kind.SHOW = "show-key";
/** string 'popup-key' */
Kind.POPUP = "popup-key";
/** string 'none' */
Kind.NONE = "none";
/** Identifies the kp object as {@link Key} */
Kind.Key = new Kind(Kind.KEY);
/** Identifies the kp object as {@link Display} */
Kind.Display = new Kind(Kind.DISPLAY);
/** Identifies the kp object as {@link Container} */
Kind.Container = new Kind(Kind.GRID_CONTAINER);
/**  Identifies the kp object as 'item' {@link Key}  */
Kind.Item = new Kind(Kind.ITEM);
/** Identifies the kp object as 'show' */
Kind.Show = new Kind(Kind.SHOW);
/** Identifies the kp object as 'Popup' */
Kind.Popup = new Kind(Kind.POPUP);
/** Identifies the kp object as none */
Kind.None = new Kind(Kind.NONE);
class DefaultListner {
    static get key() {
        return DefaultListner._key;
    }
    static set key(keyListner) {
        DefaultListner._key = keyListner;
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
function createUniqueId(startOfId) {
    let loopCount = 0;
    while (loopCount < 1000) {
        const newId = startOfId + _countId.toString();
        const e = document.getElementById(newId);
        if (e === null)
            return newId;
        loopCount = loopCount + 1;
        _countId = _countId + 1;
    }
    throw new Error('static kpui.CreateUnigyueId failed after 1000 numbers. WTF!');
}
//let body =document.getElementsByTagName('body')[0] as HTMLElement;
//body.style.visibility = "hidden";
let resultDiv;
let mathResultDiv;
//type eventHandlerType = (event: Event)=> void;
let buttonEventHandler = function (event) {
    let element = event.target;
    // if(resultDiv != null)
    //     resultDiv.innerText = resultDiv.innerText + element.innerText;
    // TODO: change to element.kpObject.getElementValue(element)
    if (DefaultListner.key != null)
        DefaultListner.key(element.innerText, element);
};
let popupContainers = [];
let popupEventHandler = function (event) {
    let element = event.target;
    let puContainer = element.nextElementSibling; // todo: this is too simple, need to check
    let isSomeParentPopup = parentPopupKey(element) != null;
    if (popupContainers.includes(puContainer)) {
        if (popupContainers[0] == puContainer) {
            closeAllPopups();
        }
        else {
            closeSomePopups(puContainer);
        }
    }
    else if (parentPopupKey(element) != null) {
        Popper.createPopper(element, puContainer, {
            placement: 'right',
        });
        puContainer.classList.remove("kp-hide");
        popupContainers.push(puContainer);
    }
    else {
        if (!isSomeParentPopup && popupContainers != null)
            closeAllPopups();
        puContainer.classList.remove("kp-hide");
        popupContainers.push(puContainer);
    }
    event.stopPropagation();
};
let closeAllPopupsHandler = function (event) {
    closeAllPopups();
    event.stopPropagation;
};
let closeAllPopups = function () {
    popupContainers.forEach(e => hidePopup(e));
    popupContainers = [];
};
function closeSomePopups(puContainer) {
    hidePopup(puContainer);
    let topVisible = popupContainers.pop();
    while (popupContainers.length > 0 && topVisible != puContainer) {
        topVisible = popupContainers.pop();
        hidePopup(topVisible);
    }
}
function hidePopup(e) {
    if (e != null)
        e.classList.add("kp-hide");
}
function parentPopupKey(e) {
    let parentDiv = e.parentElement;
    let _parentPopupKey = null;
    while (parentDiv != null) {
        _parentPopupKey = parentDiv.previousElementSibling;
        if (_parentPopupKey != null) {
            let s = _parentPopupKey.getAttribute("data-kp");
            if (s == 'popup-key') {
                break;
            }
        }
        parentDiv = parentDiv.parentElement;
    }
    return _parentPopupKey;
}
addEventListener('DOMContentLoaded', (event) => {
    //let body = document.getElementsByTagName("body")[0];
    //body.style.visibility = "hidden";
    resultDiv = document.getElementById("resultDiv");
    //let keyColl:HTMLCollectionOf<Element> = document.getElementsByClassName("kp-key");
    let keys = Array.from(document.querySelectorAll("[data-kp]"));
    keys.forEach(element => {
        if (element.getAttribute("data-kp") === "popup-key") {
            element.addEventListener("click", popupEventHandler);
            //let d = window.getComputedStyle(element.nextElementSibling, null).display;
            //(element as any).kpDisplayStyle = d;
            // (element.nextElementSibling as HTMLElement).style.display = "none";
        }
        // else if(element.getAttribute("data-kp") === "key"){
        //     element.addEventListener("click", buttonEventHandler);
        // }
    });
    keys.forEach(element => {
        if (element.getAttribute("data-kp") === "key") {
            element.addEventListener("click", buttonEventHandler);
        }
    });
    keys.forEach(element => {
        if (element.getAttribute("data-kp") === "popup-key") {
            Popper.createPopper(element, element.nextElementSibling, {
                placement: 'right',
            });
        }
    });
    mathResultDiv = document.getElementById("mathResultDiv");
    document.addEventListener("click", closeAllPopupsHandler);
    //resultDiv.addEventListener('DOMSubtreeModified', calculate);
    //body.style.visibility = "visible";
});
console.log("hi");
export { Kind, dataAttribute, createUniqueId, DefaultListner };
export { Display } from "./display.js";
export { Container } from "./container.js";
export { Key } from "./key.js";
//# sourceMappingURL=kp.js.map