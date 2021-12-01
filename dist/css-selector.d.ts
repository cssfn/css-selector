export declare type ParentSelector = '&';
export declare type UniversalSelector = '*';
export declare type UnnamedSelector = ParentSelector | UniversalSelector;
export declare type AttrSelector = '[';
export declare type ElementSelector = '';
export declare type IdSelector = '#';
export declare type ClassSelector = '.';
export declare type PseudoClassSelector = ':';
export declare type PseudoElementSelector = '::';
export declare type NamedSelector = ElementSelector | IdSelector | ClassSelector | PseudoClassSelector | PseudoElementSelector;
export declare type SelectorType = UnnamedSelector | AttrSelector | NamedSelector;
export declare type SelectorName = string & {};
export declare type AttrSelectorName = string & {};
export declare type AttrSelectorOperator = '=' | '~=' | '|=' | '^=' | '$=' | '*=';
export declare type AttrSelectorValue = string & {};
export declare type AttrSelectorOptions = 'i' | 'I' | 's' | 'S';
export declare type AttrSelectorParams = readonly [AttrSelectorName] | readonly [AttrSelectorName, AttrSelectorOperator, AttrSelectorValue] | readonly [AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions];
export declare type SelectorParams = AttrSelectorParams | SelectorList | string;
export declare type SimpleSelector = readonly [UnnamedSelector] | readonly [AttrSelector, null, AttrSelectorParams] | readonly [NamedSelector, SelectorName] | readonly [PseudoClassSelector, SelectorName, Exclude<SelectorParams, AttrSelectorParams>];
export declare type DescendantCombinator = ' ';
export declare type ChildCombinator = '>';
export declare type SiblingCombinator = '~';
export declare type NextSiblingCombinator = '+';
export declare type Combinator = DescendantCombinator | ChildCombinator | SiblingCombinator | NextSiblingCombinator;
export declare type SelectorEntry = SimpleSelector | Combinator;
export declare type Selector = SelectorEntry[];
export declare type SelectorList = Selector[];
export declare const parseSelectors: (expression: string) => SelectorList | null;
export declare const isWildParams: (selectorParams: SelectorParams) => selectorParams is string;
export declare const isAttrSelectorParams: (selectorParams: SelectorParams) => selectorParams is AttrSelectorParams;
export declare const isSelectors: (selectorParams: SelectorParams) => selectorParams is SelectorList;
export declare const isCombinator: (selectorEntry: SelectorEntry) => selectorEntry is Combinator;
export declare const isSimpleSelector: (selectorEntry: SelectorEntry) => selectorEntry is SimpleSelector;
export declare const selectorToString: (selector: Selector) => string;
export declare const selectorsToString: (selectors: SelectorList) => string;
export declare const isSelector: (test: SimpleSelector | Selector) => test is Selector;
export declare type MapSelectorsCallback = (selector: SimpleSelector) => SimpleSelector | Selector;
/**
 * Creates a new `SelectorList` populated with the results of calling a provided `callbackFn` on every `SimpleSelector` in the `selectors`.
 * The nested `SimpleSelector` (if any) will also be passed to `callbackFn`.
 * The `Combinator` and its nested (if any) will not be passed to `callbackFn`.
 * @param selectors The input `SelectorList`.
 * @param callbackFn A function that is called for every `SimpleSelector` in the `selectors`.
 * Each time `callbackFn` executes, the returned value is added to the output `SelectorList`.
 * @returns The output `SelectorList`.
 */
export declare const flatMapSelectors: (selectors: SelectorList, callbackFn: MapSelectorsCallback) => SelectorList;
