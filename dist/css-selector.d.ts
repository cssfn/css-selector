import type { OptionalOrFalse, SingleOrArray, SingleOrDeepArray } from '@cssfn/types';
export declare type ParentSelectorToken = '&';
export declare type UniversalSelectorToken = '*';
export declare type UnnamedSelectorToken = ParentSelectorToken | UniversalSelectorToken;
export declare type AttrSelectorToken = '[';
export declare type ElementSelectorToken = '';
export declare type IdSelectorToken = '#';
export declare type ClassSelectorToken = '.';
export declare type PseudoClassSelectorToken = ':';
export declare type PseudoElementSelectorToken = '::';
export declare type NamedSelectorToken = ElementSelectorToken | IdSelectorToken | ClassSelectorToken | PseudoClassSelectorToken | PseudoElementSelectorToken;
export declare type SelectorToken = UnnamedSelectorToken | AttrSelectorToken | NamedSelectorToken;
export declare type SelectorName = string & {};
export declare type AttrSelectorName = string & {};
export declare type AttrSelectorOperator = '=' | '~=' | '|=' | '^=' | '$=' | '*=';
export declare type AttrSelectorValue = string & {};
export declare type AttrSelectorOptions = 'i' | 'I' | 's' | 'S';
export declare type AttrSelectorParams = readonly [AttrSelectorName] | readonly [AttrSelectorName, AttrSelectorOperator, AttrSelectorValue] | readonly [AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions];
export declare type WildParams = string & {};
export declare type SelectorParams = AttrSelectorParams | SelectorList | WildParams;
export declare type PseudoClassSelectorParams = Exclude<SelectorParams, AttrSelectorParams>;
export declare type ParentSelector = readonly [ParentSelectorToken];
export declare type UniversalSelector = readonly [UniversalSelectorToken];
export declare type UnnamedSelector = ParentSelector | UniversalSelector;
export declare type AttrSelector = readonly [AttrSelectorToken, null, AttrSelectorParams];
export declare type ElementSelector = readonly [ElementSelectorToken, SelectorName];
export declare type IdSelector = readonly [IdSelectorToken, SelectorName];
export declare type ClassSelector = readonly [ClassSelectorToken, SelectorName];
export declare type PseudoClassSelector = readonly [PseudoClassSelectorToken, SelectorName] | readonly [PseudoClassSelectorToken, SelectorName, PseudoClassSelectorParams];
export declare type PseudoElementSelector = readonly [PseudoElementSelectorToken, SelectorName];
export declare type NamedSelector = ElementSelector | IdSelector | ClassSelector | PseudoClassSelector | PseudoElementSelector;
export declare type SimpleSelector = UnnamedSelector | AttrSelector | NamedSelector;
export declare type DescendantCombinator = ' ';
export declare type ChildCombinator = '>';
export declare type SiblingCombinator = '~';
export declare type NextSiblingCombinator = '+';
export declare type Combinator = DescendantCombinator | ChildCombinator | SiblingCombinator | NextSiblingCombinator;
export declare type SelectorEntry = SimpleSelector | Combinator;
export declare type Selector = OptionalOrFalse<SelectorEntry>[];
export declare type SelectorList = OptionalOrFalse<Selector>[];
export declare type PureSelector = SelectorEntry[];
export declare type PureSelectorList = Selector[];
export declare const parseSelectors: (expressions: SingleOrDeepArray<OptionalOrFalse<string>>) => SelectorList | null;
export declare const isWildParams: (selectorParams: SelectorParams) => selectorParams is WildParams;
export declare const isAttrSelectorParams: (selectorParams: SelectorParams) => selectorParams is AttrSelectorParams;
export declare const isSelectors: (selectorParams: SelectorParams) => selectorParams is SelectorList;
export declare const parentSelector: () => ParentSelector;
export declare const universalSelector: () => UniversalSelector;
export declare const attrSelector: (name: AttrSelectorName, operator?: AttrSelectorOperator | undefined, value?: AttrSelectorValue | undefined, options?: AttrSelectorOptions | undefined) => AttrSelector;
export declare const elementSelector: (elmName: SelectorName) => ElementSelector;
export declare const idSelector: (id: SelectorName) => IdSelector;
export declare const classSelector: (className: SelectorName) => ClassSelector;
export declare const pseudoClassSelector: (className: SelectorName, params?: PseudoClassSelectorParams | undefined) => PseudoClassSelector;
export declare const pseudoElementSelector: (elmName: SelectorName) => PseudoElementSelector;
export declare const createParentSelector: () => ParentSelector, createUniversalSelector: () => UniversalSelector, createAttrSelector: (name: AttrSelectorName, operator?: AttrSelectorOperator | undefined, value?: AttrSelectorValue | undefined, options?: AttrSelectorOptions | undefined) => AttrSelector, createElementSelector: (elmName: SelectorName) => ElementSelector, createIdSelector: (id: SelectorName) => IdSelector, createClassSelector: (className: SelectorName) => ClassSelector, createPseudoClassSelector: (className: SelectorName, params?: PseudoClassSelectorParams | undefined) => PseudoClassSelector, createPseudoElementSelector: (elmName: SelectorName) => PseudoElementSelector;
export declare const isSimpleSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is SimpleSelector;
export declare const isParentSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is ParentSelector;
export declare const isUniversalSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is UniversalSelector;
export declare const isAttrSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is AttrSelector;
export declare const isElementSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is ElementSelector;
export declare const isIdSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is IdSelector;
export declare const isClassSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is ClassSelector;
export declare const isPseudoClassSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is PseudoClassSelector;
export declare const isClassOrPseudoClassSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is ClassSelector | PseudoClassSelector;
export declare const isPseudoElementSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is PseudoElementSelector;
export declare const isElementOrPseudoElementSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is ElementSelector | PseudoElementSelector;
export declare const isNotParentSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotUniversalSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotAttrSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotElementSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotIdSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotClassSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotPseudoClassSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotClassOrPseudoClassSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotPseudoElementSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isNotElementOrPseudoElementSelector: (selectorEntry: OptionalOrFalse<SelectorEntry>) => boolean;
export declare const isAttrSelectorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, attrName: SingleOrArray<string>) => boolean;
export declare const isElementSelectorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, elmName: SingleOrArray<string>) => boolean;
export declare const isIdSelectorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, id: SingleOrArray<string>) => boolean;
export declare const isClassSelectorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, className: SingleOrArray<string>) => boolean;
export declare const isPseudoClassSelectorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, className: SingleOrArray<string>) => boolean;
export declare const isClassOrPseudoClassSelectorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, className: SingleOrArray<string>) => boolean;
export declare const isPseudoElementSelectorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, elmName: SingleOrArray<string>) => boolean;
export declare const isElementOrPseudoElementSelectorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, elmName: SingleOrArray<string>) => boolean;
export declare const combinator: (combinator: Combinator) => Combinator;
export declare const createCombinator: (combinator: Combinator) => Combinator;
export declare const isCombinator: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is Combinator;
export declare const isCombinatorOf: (selectorEntry: OptionalOrFalse<SelectorEntry>, combinator: SingleOrArray<Combinator>) => boolean;
export declare const selector: <TSelector extends Selector = Selector>(...selectorEntries: TSelector) => TSelector;
export declare const pureSelector: <TPureSelector extends PureSelector = PureSelector>(...selectorEntries: TPureSelector) => TPureSelector;
export declare const selectorList: <TSelectorList extends SelectorList = SelectorList>(...selectors: TSelectorList) => TSelectorList;
export declare const pureSelectorList: <TPureSelectorList extends PureSelectorList = PureSelectorList>(...selectors: TPureSelectorList) => TPureSelectorList;
export declare const createSelector: <TSelector extends Selector = Selector>(...selectorEntries: TSelector) => TSelector, createPureSelector: <TPureSelector extends PureSelector = PureSelector>(...selectorEntries: TPureSelector) => TPureSelector, createSelectorList: <TSelectorList extends SelectorList = SelectorList>(...selectors: TSelectorList) => TSelectorList, createPureSelectorList: <TPureSelectorList extends PureSelectorList = PureSelectorList>(...selectors: TPureSelectorList) => TPureSelectorList;
export declare const isNotEmptySelectorEntry: (selectorEntry: OptionalOrFalse<SelectorEntry>) => selectorEntry is SelectorEntry;
export declare const isSelector: (test: OptionalOrFalse<SimpleSelector | Selector>) => test is Selector;
export declare const isNotEmptySelector: (selector: OptionalOrFalse<Selector>) => selector is PureSelector;
export declare const isNotEmptySelectors: (selectors: OptionalOrFalse<SelectorList>) => selectors is PureSelectorList;
export declare const countSelectorEntries: (selector: OptionalOrFalse<Selector>) => number;
export declare const countSelectors: (selectors: OptionalOrFalse<SelectorList>) => number;
export declare const selectorParamsToString: (selectorParams: OptionalOrFalse<SelectorParams>) => string;
export declare const selectorToString: (selector: Selector) => string;
export declare const selectorsToString: (selectors: SelectorList) => string;
export declare type MapSelectorsCallback = (selector: SimpleSelector) => OptionalOrFalse<SimpleSelector | Selector>;
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
export { flatMapSelectors as mutateSelectors };
export interface GroupSelectorOptions {
    selectorName?: SelectorName | ('is' | 'not' | 'has' | 'where');
    cancelGroupIfSingular?: boolean;
}
export declare const groupSelectors: (selectors: OptionalOrFalse<SelectorList>, options?: GroupSelectorOptions) => PureSelectorList & {
    0: Selector;
};
export declare const groupSelector: (selector: OptionalOrFalse<Selector>, options?: GroupSelectorOptions) => PureSelectorList & {
    0: Selector;
};
export interface UngroupSelectorOptions {
    selectorName?: SelectorName[] & ('is' | 'not' | 'has' | 'where')[];
}
export declare const ungroupSelector: (selector: OptionalOrFalse<Selector>, options?: UngroupSelectorOptions) => PureSelectorList;
export declare const ungroupSelectors: (selectors: OptionalOrFalse<SelectorList>, options?: UngroupSelectorOptions) => PureSelectorList;
export declare type Specificity = [number, number, number];
export declare const calculateSpecificity: (selector: Selector) => Specificity;
