# KeyPadJs
 A Typescript project providing a runtime configurable keypad that is primarily targeted for calculator-style applications (a full calculator project is being developed). 

- Provides popup displays that can be styled as dropdown lists or additional keypads. Droplists can cascade, that is dropdown lists can contain drop-down lists.
-- uses [Popper.js](https://popper.js.org/docs/v2/) to position popups and handle boundary conditions.
- Provides "show" button functionality. For example, providing a choice between trigonometric function buttons or statistical function buttons.
- Does not impose any CSS styles, although [KeyPadCss](https://github.com/JohnHansenCa/KeyPadCss) is used in some of the demos.
- Uses the [HTML element 'data' attribute](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) for configuration.
- Uses only a thin veneer of javascript wrapping native CSS and HTML functionality.

There are 3 primary ways to configure a keypad using KeyPadUI.
1. Using Html/CSS markup with a small amount of javascript.
2. A mixture of Html/CSS markup and javascript(under construction).
3. Exclusively with Javascript(under construction).


