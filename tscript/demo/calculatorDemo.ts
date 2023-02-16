import * as Mathjs from "./mathjs"
import * as kp from "../kp.js";
interface baseUnit{
    dimensions: [];
    key: string;
}
interface special {
    /** Gives access to built-in unit definitions. */
    Unit: {
        /** returns an object giving all the base units as properities in upper case strings, eg LENGTH, MASS, etc */
        BASE_UNITS: Record<string, baseUnit> ;
        /**  returns an object giving all the units as properities in mostly lower case strings, eg A, ampere, amperes, m, m2, meter, etc */
        UNITS: Record<string, Mathjs.UnitComponent>;
    }
}
/**
 * TODO: fix @see comment below
 * The function below will become the {@link kp.DefaultListner.key} 
 * Everytime a {@link Key} is clicked this function will be executed.
 * @param key 
 */
let _keyHandler:kp.KeyListener = function(keyValue:string, e:HTMLElement):void{
    let _current = kp.Display.getInstance("key-bucket");
    if(_current != null) // TODO: get rid of statement when empty is added to Display
    {
        let char = keyValue;
        if(char === "\b" || char == "⌫")
        _current.displayText(_current.text.slice(0, -1));
        else if (char === "␡")
        _current.clear();
        else
            _current.displayText(_current.text + char);
    }
}
//https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types
declare var math:Mathjs.MathJsStatic & special; 
let key_bucket = kp.Display.getInstance("key-bucket");
let calcDisplay = kp.Display.getInstance("calc-display")  ;
let statusDisplay = kp.Display.getInstance("calc-status");
function calculate(e:any){
    let _evaluateText = key_bucket.text.replaceAll("×","*").replaceAll("÷","/");
    //let result = math.evaluate(_evaluateText);
    //calcDisplay.displayText( result);
    
    if(_evaluateText == ""){
        calcDisplay.displayText("0");
        statusDisplay.displayText("status:okay");
    }
    else{
        try{
            let result = math.evaluate(_evaluateText).toString();
            calcDisplay.displayText(result);
            
            statusDisplay.displayText("status:okay");
        }
        catch(err){
            if(!calcDisplay.isEmpty)
                statusDisplay.displayText(err.message);
            else
                throw err;
        }
    }
 }
kp.DefaultListner.key = _keyHandler;
//key_bucket.element.addEventListener('DOMSubtreeModified', calculate);
const observer = new MutationObserver((mutationlist, observ)=>{ calculate(observ)});
observer.observe (key_bucket.element, { attributes: false, childList: true, subtree:false } );
//
// var myElement = document.createElement("div");
// myElement.innerText = "hello world";
// var observer2 = new MutationObserver(function(mutations) {
//          console.log("It's in the DOM!");
//          observer2.disconnect();
    
//  });
//  let body = document.getElementsByTagName('body')[0];

 
//  observer2.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
//  body.append(myElement);