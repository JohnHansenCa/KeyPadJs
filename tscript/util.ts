import { iKpKeyInfo} from "./definitions";
import { Kind, dataAttribute, KpDataAttribute } from "./kp.js";
import { Container } from "./container.js";

/**
 * kpUtil is a singleton class containing utility methods.  Access this methods via
 * {@link kp.Util}
 */
class kpUtil{
    static Instance = new kpUtil();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor(){}
    setClasses(element: HTMLElement, classes:string[]=[]){
        /* TODO: error checking on parameters */
        classes.forEach(cls =>{
            element.classList.add(cls);
        });
    }
    addDefaultKeyInfo({label, value="", id="", classes=[],  kind=Kind.None, target=null}:iKpKeyInfo):iKpKeyInfo{
        return{label:label, value:value, id:id, classes:classes, kind:kind, target:target};
    }
    // addDefaultKeyInfoToChild(info:iKpKeyInfo):iKpKeyInfo{
    //     if(this.isValidObject(info.child)){
    //         return this.addDefaultKeyInfo(info.child);
    //     }
    //     else{
    //         return {label:"", value:"", classes:[], kind:kpKind.None, target:null};
    //     }
    // }
    isValidObject(obj: unknown){
        return (obj != undefined && obj != null);
    }
    addDefaultKeyInfoArray(infoArray:iKpKeyInfo[]):iKpKeyInfo[]{
        const returnArray = [];
        infoArray.forEach(item =>{
            returnArray.push(this.addDefaultKeyInfo(item));
        })
        return returnArray;
    }
    /** Returns the element width including margins as string in the format 'Npx' where N is a number
     * indicating the width. */
    getElementWidth(element: HTMLElement, multiplier = 1):string{
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const margin = Number(style.marginLeft.replace("px",""))*2;
        return ((rect.width + margin)*multiplier).toString()+"px";
    }
    isElmentDiv(element:HTMLElement):boolean{
        return element.nodeName === "DIV";
    }
    /** Returns an empty string, "", if not found. */
    getKpAttribute(element: HTMLElement, attr:KpDataAttribute):string{
        const attrValue =element.getAttribute(attr);
        if(attrValue == null)
            return "";
        else return attrValue;
    }
    getTarget(element:HTMLElement):HTMLElement{
        const attr = Util.getKpAttribute(element, "data-kp-target");
        if(attr === "")return null;
        const target = document.getElementById(attr);
        return target;
    }
    getChildContainer(element:HTMLElement):HTMLElement{
        let containerElement = null;
        Array.from(element.children).forEach(e =>{
            const attr = e.getAttribute(dataAttribute.KP);
            if(attr != null && attr.match("container")!= null) containerElement = e;
        });
        // if no element found with container atttribute, then return the first div element
        if(containerElement == null){
            Array.from(element.children).forEach(e =>{
                const attr = e.getAttribute(dataAttribute.KP);
                if(attr == null && this.isElmentDiv(element)) containerElement = e;
            });  
        }
        return containerElement;
    }
    createChildContainerElement(element:HTMLElement):HTMLElement{
        const container = document.createElement("div");
        element.appendChild(container);
        return container;
    }
    // createContainer(element:HTMLElement):Container{
    //     return getContainer(element);
    // }
    addKpAttributeIfRequired(e:HTMLElement, kind:Kind):void{
        const attr = e.getAttribute(dataAttribute.KP);
        if(attr != null)return;
        e.setAttribute(dataAttribute.KP, kind.name);
    }
    setGridColumns(e: HTMLElement, n =1):void{
        e.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    }
    /**
     * Returns true if the element has a 'data-kp' attribute with the value specified by kind:{@link Kind},
     * otherwise returns false;
     * @param element 
     * @param kind 
     * @returns 
     */
    isKind(element:HTMLElement, kind: Kind):boolean{
        const attr = element.getAttribute(dataAttribute.KP);
        if(attr == null)return false;
        if(attr === kind.name)return true;
        return false;
    }
}
/**
 * kpUtil is a singleton class containing utility methods.  Access this methods via
 * {@link kp.Util}
 */
class kpCss{
    static readonly Instance = new kpCss();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor(){}
    /**  "kp-green" */
    readonly GREEN = "kp-green";
    /**  "kp-red" */
    readonly RED = "kp-red";
    /**  "kp-blue" */
    readonly BLUE = "kp-blue";
    /**  "kp-yellow" */
    readonly YELLOW = "kp-yellow";
    /**  "kp-orange" */
    readonly ORANGE = "kp-orange";
    readonly KPKEY = "kp-key"; 
    readonly KPKEYSTYLE = "kp-key-style"; 
    private _defaultKeyClasses = [this.KPKEY, this.KPKEYSTYLE, "kp-color"]
    /**
     * The default classes assigned to a key.
     */
    get defaultKeyClasses():string[]{
        return this._defaultKeyClasses;
    }
      
}
/** Contains a number of utility methods */
const Util = kpUtil.Instance;
const Css = kpCss.Instance;
export {kpUtil, Util, Css}
