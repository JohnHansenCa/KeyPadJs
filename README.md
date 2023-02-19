# KeyPadJs #
 A Typescript project providing a runtime configurable keypad that is primarily targeted for calculator-style applications (a full calculator project is being developed). 

[Demo](https://johnhansenca.github.io/KeyPadJs/)

- Provides popup displays that can be styled as dropdown lists or additional keypads. Droplists can cascade, that is dropdown lists can contain drop-down lists.
    - uses [Popper.js](https://popper.js.org/docs/v2/) to position popups and handle boundary conditions.
- Provides "show" button functionality. For example, providing a choice between trigonometric function buttons or statistical function buttons.
- Does not impose any CSS styles, although [KeyPadCss](https://github.com/JohnHansenCa/KeyPadCss) is used in some of the demos.
- Uses the [HTML element 'data' attribute](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) for configuration.
- Uses only a thin veneer of javascript wrapping native CSS and HTML functionality.

There are 3 primary ways to configure a keypad using KeyPadUI.
1. Using Html/CSS markup.
2. A mixture of Html/CSS markup and javascript(under construction).
3. Exclusively with Javascript(under construction).

## Current Limitations ##
- Employs happy path coding. 
- No unit tests- coming soon.
- Only HTML markup configuration is operational.

## Major Functionality ##
### Data Attributes ###
See the demo [index.html file](https://github.com/JohnHansenCa/KeyPadJs/blob/main/index.html) for an example usage of the attributes.

- data-kp = "key"
    = Makes a button or div into a key.  Values of the keys when clicked can be acquired by the default key Listener.  See the [CalculatorDemo](https://github.com/JohnHansenCa/KeyPadJs/blob/main/tscript/demo/calculatorDemo.ts) for example usage.
    ```
    <button data-kp="key">sin()</button>
    ```
- data-kp = "popup-key"
    - Makes a button or div into a popup key.  The next div will automatically be the popup content. Popup keys can be nested as shown by the CalculatorDemo 'units' popup key.
    ```
    <!-- note: that id attributes are optional -->
    <button id="lengthbtn" data-kp="popup-key">length</button>
          <div id="length-popup-container" style="display:none">
            <button data-kp="key">m</button>
            <button data-kp="key">ft</button>
            <button data-kp="key">inch</button>
            <button data-kp="key">km</button>
          </div>
    ```
- data-kp = "show-only-key"
    - Makes the target element visible while closing sibling elements. See the CalculorDemo 'fx' key popup container's buttons 'trig' and 'math' for examples of 'show-only-key's.
- data-kp = 'display'
    - Associates a "display" element with a javascript 'Display' object providing several convenience/syntactical sugar methods and properties.
- data-kp-placement = 'right'
    - Used with a popup key providing placement information for the popup. This is an optional attribute with the default being 'right'.  See [popper.js placement](https://popper.js.org/) a demo and [popper constructors/options](https://popper.js.org/docs/v2/constructors/) for accepted values.