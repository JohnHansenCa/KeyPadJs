import { Kind } from "./kp.js";
import { Container } from "./container.js";
/**
 * @deprecated
 */
type kpKeyHandler = (key: iKpValue)=> void;
/** Handler invoked by key click action */
type KeyListener = (value:string, element:HTMLElement)=> void;
/** iKeyInfo interface provides necessary information to create a KeyPad HTML
 * element and associated KP object.
 * Note: In the case of Popup key 2 HTML elements will be created, the popup key and the content container.
 */
interface iKpKeyInfo{
    /** The key label. Will also be the value returned for the key if value is not set.
     * This field is ignored when creating a container.
    */
        label?: string;
        /** The value returned for the key.  If not set the label value will be returned. */
        value?: string;
        /** The id for the element. An unique id will be automatically created if not set. */
        id?: string;
        /** CSS classes for the key. By default several class will automatically set even if this is not set. */
        classes?: string[];
        /** Determines if created key should be a {@link Key} or a {@link kpDropDownKey}. 
         * The default is {@link Key} */
        kind?:Kind;
        /** used for a show key to indicate which container to make visible(show). */
        target?:Container;
        /** used to describe child  */
        child?: iKpKeyInfo
}

/**
 * An inteface that describes all kp objects such as kpKey, kpContainer, kpDisplay, etc.
 */
interface iKp{
    get element(): kpHTMLElement;
    setClasses(classes:Array<string>):iKp;
    /** Returns a {@link Kind} instance which identifies 
     * this kp object such as {@link Key}, {@link Container} etc*/
    get kpKind(): Kind;
}
interface iKpValue{
    get value(): string;
}
interface kpHTMLElement extends HTMLElement{
    /** kpObject property provides a reference to the associated {@link iKp} object. */
    kpObject: iKp;
}
/**
 * TODO: fix comment and members
 */
interface displayControl{
    displayItem: any;
    displayValue: any;
 }
export {iKpValue, iKp, iKpKeyInfo, kpHTMLElement, kpKeyHandler, KeyListener, displayControl}