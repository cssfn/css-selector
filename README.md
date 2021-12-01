# css-selector - Parses & Manipulates `.css>.selector`

A lib for parsing, transforming, calculating specificity, and more.

## Preview

```js
import { parseSelectors, flatMapSelectors, selectorsToString } from '@cssfn/css-selector'

const selectors = parseSelectors("div>.gallery img[data-msg='you & me'], *>:is(div, .container:nth-child(2n+3)).wrapper");

console.log(selectors.length); // result: 2

console.log(selectors); // result:
/*
// selectors:
[
    // first selector:
    [
        ["", "div"], ">", [".", "gallery"], " ", ["", "img"], ["[", null, ["data-msg", "=", "you & me"]],
    ],
    
    // second selector:
    [
        ["*"], ">",
        [":", "is", [ // nested selectors:
            // nested first selector:
            [
                ["", "div"],
            ],
            
            // nested second selector:
            [
                [".", "container"], [":", "nth-child", "2n+3"],
            ],
        ]],
        [".", "wrapper"],
    ],
]
*/

const replacement = parseSelectors(".awesome>.yeah")[0];

const mutated = flatMapSelectors(selectors, (selector) => {
    const [
        /*
            selector types:
            '&'  = parent         selector
            '*'  = universal      selector
            '['  = attribute      selector
            ''   = element        selector
            '#'  = ID             selector
            '.'  = class          selector
            ':'  = pseudo class   selector
            '::' = pseudo element selector
        */
        selectorType,
        
        /*
            selector name:
            string = the name of [element, ID, class, pseudo class, pseudo element] selector
        */
        selectorName,
        
        /*
            selector parameter(s):
            string       = the parameter of pseudo class selector, eg: nth-child(2n+3) => '2n+3'
            array        = [name, operator, value, options] of attribute selector, eg: [data-msg*="you & me" i] => ['data-msg', '*=', 'you & me', 'i']
            SelectorList = nested selector(s) of pseudo class [:is(...), :where(...), :not(...)]
        */
        selectorParams,
    ] = selector;
    
    if ((selectorType === '' /* element selector */) && (selectorName === 'div')) {
        return replacement;
    } // if
    
    // leave everything else unchanged:
    return selector;
});

console.log(mutated); // result:
/*
// selectors:
[
    // first selector:
    [
        [".", "awesome"], ">", [".", "yeah"], ">", [".", "gallery"], " ", ["", "img"], ["[", null, ["data-msg", "=", "you & me"]],
    ],
    
    // second selector:
    [
        ["*"], ">",
        [":", "is", [ // nested selectors:
            // nested first selector:
            [
                [".", "awesome"], ">", [".", "yeah"],
            ],
            
            // nested second selector:
            [
                [".", "container"], [":", "nth-child", "2n+3"],
            ],
        ]],
        [".", "wrapper"],
    ],
]
*/

const rendered = selectorsToString(mutated);
console.log(rendered); // result:
/*
".awesome>.yeah>.gallery img[data-msg=\"you & me\"], *>:is(.awesome>.yeah, .container:nth-child(2n+3)).wrapper"
*/
```

## Features

* Recognized selectors:
  * parent selector `&`.
  * universal selector `*`.
  * attribute selector `[some="value" S]`.
  * element selector `div`.
  * ID selector `#id`.
  * class selector `.my-class`.
  * pseudo class selector `:enabled`.
  * pseudo element selector `::before`.
* Recognized combinators:
  * descendant combinator ` `.
  * child combinator `>`.
  * sibling combinator `~`.
  * next sibling combinator `+`.
* Recognized strings:
  * unquoted string `hello world`.
  * single quoted string `'i\'m cool'`.
  * double quoted string `"that's \"right\""`.
* Recognized nested selectors (up to infinite) inside `:is()`, `:not()`, `:where()`, `:has()`.

## Installation

Using npm:
```
npm i @cssfn/css-selector
```

## Support Us

If you feel our lib is useful for your projects,  
please make a donation to avoid our project from extinction.

We always maintain our projects as long as we're still alive.

[[Make a donation](https://ko-fi.com/heymarco)]
