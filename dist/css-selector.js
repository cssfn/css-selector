const whitespaceList = [' ', '\n', '\r', '\t', '\f', '\v'];
const specialPseudoClassList = ['is', 'not', 'where', 'has'];
export const parseSelectors = (expression) => {
    const expressionLength = expression.length;
    let pos = 0;
    const isEof = () => {
        return (pos >= expressionLength);
    };
    const skipWhitespace = () => {
        while (!isEof() && whitespaceList.includes(expression[pos]))
            pos++;
    };
    const parseSelectorType = () => {
        const char = expression[pos];
        switch (char) {
            case '&': // ParentSelector
            case '*': // UniversalSelector
            case '[': // AttrSelector
            case '#': // IdSelector
            case '.': // ClassSelector
                pos++;
                return char;
            case ':':
                pos++;
                if (expression[pos] === ':') {
                    pos++;
                    return '::';
                } // PseudoElementSelector
                return ':'; // PseudoClassSelector
            default:
                if (isValidIdentifierChar())
                    return ''; // ElementSelector
                return null; // unknown expression => return null
        } // switch
    };
    const isValidIdentifierChar = () => {
        const char = expression[pos];
        /*
            using regex is easier, but the performance is slow
        */
        // return /[\w0-9-_]/.test(char);
        /*
            using hard coded is more complex, but the performance is about 10-12x faster
        */
        if ((char >= 'a') && (char <= 'z'))
            return true;
        if ((char >= 'A') && (char <= 'Z'))
            return true;
        if ((char >= '0') && (char <= '9'))
            return true;
        if (char === '-')
            return true;
        if (char === '_')
            return true;
        return false;
    };
    const parseIdentifierName = () => {
        const originPos = pos;
        while (!isEof() && isValidIdentifierChar())
            pos++; // move forward until invalid
        if (pos === originPos)
            return null; // pos was not moved => nothing to parse => no changes made & return null
        return expression.substring(originPos, pos);
    };
    const parseSimpleSelector = () => {
        const originPos = pos;
        const type = parseSelectorType();
        if (type === null)
            return null; // syntax error: missing type => no changes made & return null
        if ((type === '&') || (type === '*')) { // UnnamedSelector
            return [
                type,
            ];
        }
        else if (type === '[') { // AttrSelector
            const attrSelectorParams = parseAttrSelectorParams();
            if (!attrSelectorParams) {
                pos = originPos;
                return null;
            } // syntax error: missing attrSelectorParams => revert changes & return null
            return [
                type,
                null,
                attrSelectorParams,
            ];
        }
        else { // NamedSelector
            const name = parseIdentifierName();
            if (!name) {
                pos = originPos;
                return null;
            } // syntax error: missing name => revert changes & return null
            if (type !== ':') { // NonParamSelector
                return [
                    type,
                    name,
                ];
            }
            else { // PseudoClassSelector
                if (specialPseudoClassList.includes(name)) {
                    const selectorParams = parseSelectorParams();
                    if (!selectorParams) {
                        pos = originPos;
                        return null;
                    } // syntax error: missing selectorParams => revert changes & return null
                    return [
                        type,
                        name,
                        selectorParams,
                    ];
                }
                else {
                    const wildParams = parseWildParams();
                    if (wildParams === null) {
                        return [
                            type,
                            name,
                        ];
                    }
                    else {
                        return [
                            type,
                            name,
                            wildParams,
                        ];
                    } // if
                } // if
            } // if
        } // if
    };
    const parseCombinator = () => {
        const originPos = pos;
        skipWhitespace();
        const char = expression[pos];
        switch (char) {
            case '>': // ChildCombinator
            case '~': // SiblingCombinator
            case '+': // NextSiblingCombinator
                pos++;
                return char;
            default:
                if (pos > originPos) { // previously had whitespace
                    const currentPos = pos; // 1. backup
                    const test = parseSelectorType(); // 2. destructive test
                    pos = currentPos; // 3. restore
                    if (test !== null)
                        return ' '; // DescendantCombinator
                } // if
                return null; // unknown expression => return null
        } // switch
    };
    const parseSelector = () => {
        const originPos = pos;
        const selector = [];
        while (!isEof()) {
            // skipWhitespace(); // already included in `parseCombinator()`, do not `skipWhitespace()` here => causing DescendantCombinator (space) unrecognized
            if (selector.length) {
                // the next SelectorSequence must be separated by combinator:
                const combinator = parseCombinator();
                if (!combinator)
                    break; // no more next SelectorSequence
                selector.push(combinator);
            } // if
            skipWhitespace();
            const simpleSelector = parseSimpleSelector();
            if (!simpleSelector) {
                pos = originPos;
                return null;
            } // syntax error: missing simpleSelector => revert changes & return null
            selector.push(simpleSelector);
            //#region SelectorSequence
            let nextSequence;
            do {
                nextSequence = parseSimpleSelector();
                if (nextSequence)
                    selector.push(nextSequence);
            } while (nextSequence);
            //#endregion SelectorSequence
        } // while
        return selector;
    };
    const eatComma = () => {
        if (expression[pos] !== ',')
            return false;
        pos++;
        return true; // move forward & return true
    };
    const eatOpeningBracket = () => {
        if (expression[pos] !== '(')
            return false;
        pos++;
        return true; // move forward & return true
    };
    const eatClosingBracket = () => {
        if (expression[pos] !== ')')
            return false;
        pos++;
        return true; // move forward & return true
    };
    const eatClosingSquareBracket = () => {
        if (expression[pos] !== ']')
            return false;
        pos++;
        return true; // move forward & return true
    };
    const eatNonBrackets = () => {
        const originPos = pos;
        while (!isEof() && (expression[pos] !== '(') && (expression[pos] !== ')'))
            pos++; // move forward until unmatch
        if (pos === originPos)
            return false; // pos was not moved => nothing to eat => no changes made & return false
        return true;
    };
    const parseSelectors = () => {
        const originPos = pos;
        const selectors = [];
        while (!isEof()) {
            skipWhitespace();
            if (selectors.length) {
                // the next Selector must be separated by comma:
                if (!eatComma())
                    break; // no more next Selector
                skipWhitespace();
            } // if
            const selector = parseSelector();
            if (!selector) {
                pos = originPos;
                return null;
            } // syntax error: missing selector => revert changes & return null
            selectors.push(selector);
        } // while
        return selectors;
    };
    const parseWildParams = () => {
        const originPos = pos;
        if (!eatOpeningBracket())
            return null; // syntax error: missing `(` => no changes made & return null
        while (!isEof()) {
            let eaten = eatNonBrackets();
            const nestedWildParams = parseWildParams();
            if (nestedWildParams !== null) {
                eaten = true;
                eatNonBrackets();
            } // if
            if (!eaten)
                break; // nothing more to eat => break
        } // while
        if (!eatClosingBracket()) {
            pos = originPos;
            return null;
        } // syntax error: missing `)` => revert changes & return null
        return expression.substring(originPos + 1, pos - 1);
    };
    const parseSelectorParams = () => {
        const originPos = pos;
        if (!eatOpeningBracket())
            return null; // syntax error: missing `(` => no changes made & return null
        const selectors = parseSelectors();
        if (!selectors) {
            pos = originPos;
            return null;
        } // syntax error: missing selectors => revert changes & return null
        if (!eatClosingBracket()) {
            pos = originPos;
            return null;
        } // syntax error: missing `)` => revert changes & return null
        return selectors;
    };
    const parseAttrSelectorOperator = () => {
        const originPos = pos;
        const char = expression[pos];
        switch (char) {
            case '=': // ExactOperator
                pos++;
                return char;
            case '~': // SpaceSeparatedOperator
            case '|': // SubsOperator
            case '^': // BeginsWithOperator
            case '$': // EndsWithOperator
            case '*': // IncludesOperator
                pos++;
                if (expression[pos] !== '=') {
                    pos = originPos;
                    return null;
                } // syntax error: missing `=` => revert changes & return null
                pos++;
                return `${char}=`;
            default:
                return null; // unknown expression => return null
        } // switch
    };
    const parseAttrSelectorOptions = () => {
        const char = expression[pos];
        switch (char) {
            case 'i': // case-insensitively
            case 'I': // case-insensitively
            case 's': // case-sensitively
            case 'S': // case-sensitively
                pos++;
                return char;
            default:
                return null; // unknown expression => return null
        } // switch
    };
    const parseNudeString = () => {
        return parseIdentifierName();
    };
    const eatQuote = (quoteChar) => {
        if (expression[pos] !== quoteChar)
            return false;
        pos++;
        return true; // move forward & return true
    };
    const isValidStringChar = (quoteChar) => {
        const char = expression[pos];
        if (char === quoteChar) {
            return ((pos >= 1) && (expression[pos - 1] === '\\')); // looking backward escape char
        }
        else if (char === '\\') {
            return ((pos + 1) < expressionLength); // looking forward has any char
        }
        else {
            return true; // any chars other than quoteChar & backwardChar
        } // if
    };
    const parseQuoteString = (quoteChar) => {
        const originPos = pos;
        if (!eatQuote(quoteChar))
            return null; // syntax error: missing opening_quoteChar => no changes made & return null
        while (!isEof() && isValidStringChar(quoteChar))
            pos++; // move forward until invalid
        if (!eatQuote(quoteChar)) {
            pos = originPos;
            return null;
        } // syntax error: missing closing_quoteChar => revert changes & return null
        const value = expression.substring(originPos + 1, pos - 1); // excludes the opening_quoteChar & closing_quoteChar
        if (quoteChar === "'") { // single quoteChar
            return value.replaceAll(/(?<!\\)"/g, '\\"'); // escape the unescaped double quoteChar, so both single & double quoteChar are escaped
        }
        else { // double quoteChar
            return value.replaceAll(/(?<!\\)'/g, "\\'"); // escape the unescaped single quoteChar, so both single & double quoteChar are escaped
        } // if
    };
    const parseString = () => {
        return (parseQuoteString("'")
            ??
                parseQuoteString('"')
            ??
                parseNudeString());
    };
    const parseAttrSelectorParams = () => {
        const originPos = pos;
        // if (!eatOpeningSquareBracket()) return null; // already eaten by `parseSelectorType()`
        skipWhitespace();
        const name = parseIdentifierName();
        if (!name) {
            pos = originPos;
            return null;
        } // syntax error: missing name => revert changes & return null
        skipWhitespace();
        const operator = parseAttrSelectorOperator();
        if (!operator) { // name only
            if (!eatClosingSquareBracket()) {
                pos = originPos;
                return null;
            } // syntax error: missing `]` => revert changes & return null
            return [
                name,
            ];
        }
        else { // name=value
            skipWhitespace();
            const value = parseString();
            // an empty value "" -or- '' is possible
            if (value === null) {
                pos = originPos;
                return null;
            } // syntax error: missing value => revert changes & return null
            skipWhitespace();
            const options = parseAttrSelectorOptions();
            if (options) {
                skipWhitespace();
            } // if
            if (!eatClosingSquareBracket()) {
                pos = originPos;
                return null;
            } // syntax error: missing `]` => revert changes & return null
            if (!options) { // name=value without options
                return [
                    name,
                    operator,
                    value,
                ];
            }
            else { // name=value options
                return [
                    name,
                    operator,
                    value,
                    options,
                ];
            } // if
        } // if
    };
    const allSelectors = parseSelectors();
    if (!allSelectors)
        return null; // syntax error: no recognized selector(s)
    if (!isEof())
        return null; // syntax error: not all expression are valid selector
    return allSelectors;
};
export const isWildParams = (selectorParams) => {
    return (typeof (selectorParams) === 'string');
};
export const isAttrSelectorParams = (selectorParams) => {
    return (!isWildParams(selectorParams)
        &&
            /*
                AttrSelectorParams : [ AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions ]
                SelectorList       : [ Selector...Selector ]
            */
            (typeof (selectorParams[0]) === 'string') // AttrSelectorParams : the first element (AttrSelectorName) must be a string
    );
};
export const isSelectors = (selectorParams) => {
    return (!isWildParams(selectorParams)
        &&
            /*
                AttrSelectorParams : [ AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions ]
                SelectorList       : [ Selector...Selector ]
            */
            (typeof (selectorParams[0]) !== 'string') // SelectorList : the first element (Selector) must be a NON-string or undefined
    );
};
const selectorParamsToString = (selectorParams) => {
    if ((selectorParams === null) || (selectorParams === undefined))
        return '';
    if (isWildParams(selectorParams)) {
        return `(${selectorParams})`;
    }
    else if (isAttrSelectorParams(selectorParams)) {
        const [name, operator, value, options,] = selectorParams;
        if (options) {
            return `[${name}${operator}"${value}" ${options}]`;
        }
        else if (value !== undefined) { // an empty value "" -or- '' is possible
            return `[${name}${operator}"${value}"]`;
        }
        else {
            return `[${name}]`;
        } // if
    }
    else { // if (isSelectors(selectorParams)) {
        return `(${selectorParams
            .map((selector) => selectorToString(selector))
            .join(', ')})`;
    } // if
};
export const isCombinator = (selectorEntry) => {
    return (typeof (selectorEntry) === 'string');
};
export const isSimpleSelector = (selectorEntry) => {
    return (typeof (selectorEntry) !== 'string');
};
export const selectorToString = (selector) => {
    return (selector
        .map((selectorEntry) => {
        if (isCombinator(selectorEntry))
            return selectorEntry;
        const [selectorType, selectorName, selectorParams,] = selectorEntry; // isSimpleSelector(selectorEntry)
        if (selectorType === '[') { // AttrSelector
            return selectorParamsToString(selectorParams);
        }
        else {
            return `${selectorType}${selectorName ?? ''}${selectorParamsToString(selectorParams)}`;
        } // if
    })
        .join(''));
};
export const selectorsToString = (selectors) => {
    return (selectors
        .map(selectorToString)
        .join(', '));
};
export const isSelector = (test) => {
    /*
        SimpleSelector : [ SelectorType, SelectorName, SelectorParams ]
        Selector       : [ SimpleSelector...(SimpleSelector|Combinator)... ]
    */
    return (typeof (test[0]) !== 'string'); // Selector : the first element (SimpleSelector) must be a NON-string, the Combinator is guaranteed NEVER be the first element
};
/**
 * Creates a new `SelectorList` populated with the results of calling a provided `callbackFn` on every `SimpleSelector` in the `selectors`.
 * The nested `SimpleSelector` (if any) will also be passed to `callbackFn`.
 * The `Combinator` and its nested (if any) will not be passed to `callbackFn`.
 * @param selectors The input `SelectorList`.
 * @param callbackFn A function that is called for every `SimpleSelector` in the `selectors`.
 * Each time `callbackFn` executes, the returned value is added to the output `SelectorList`.
 * @returns The output `SelectorList`.
 */
export const flatMapSelectors = (selectors, callbackFn) => {
    return (selectors
        .map((selector) => // mutates a `Selector` to another `Selector`
     selector
        .flatMap((selectorEntry) => {
        if (isCombinator(selectorEntry))
            return [selectorEntry];
        let replacement = callbackFn(selectorEntry); // isSimpleSelector(selectorEntry)
        if (replacement === selectorEntry) { // if has not been replaced by `callbackFn` (same by reference)
            const [, // skip: selectorType,
            , // skip: selectorName,
            selectorParams,] = selectorEntry; // isSimpleSelector(selectorEntry)
            if (selectorParams && isSelectors(selectorParams)) {
                const oldSelectors = selectorParams;
                const newSelectors = flatMapSelectors(oldSelectors, callbackFn); // recursively map the `oldSelectors`
                replacement = [
                    ...selectorEntry.slice(0, 2),
                    newSelectors // replace the `oldSelectors` to `newSelectors`
                ]; // don't worry TypeScript! I know what I'm doing
            } // if
        } // if
        return isSelector(replacement) ? replacement /* as Selector */ : [replacement] /* [as SimpleSelector] as Selector */;
    })));
};
