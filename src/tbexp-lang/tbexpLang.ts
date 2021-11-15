import * as monaco from "monaco-editor-core";
import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const richLanguageConfiguration: IRichLanguageConfiguration = {
    // If we want to support code folding, brackets ... ( [], (), {}....), we can override some properties here
    // check the doc
     wordPattern:
    /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],

  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],

  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

export const monarchLanguage = <ILanguage>{
    defaultToken: '',
    tokenPostfix: '.tbexp',
    ignoreCase: false,

    brackets: [
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '{', close: '}', token: 'delimiter.brackets' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
    ],

    variable: /\$[a-zA-Z]\w*/,

    attribute: /\.[a-zA-Z]\w*/,

    tokenizer: {
        expression: [
            [
                /[a-zA-Z_]\w*/,
                {
                    cases: {
                        '@Function': {
                            token: 'function.tbexp',
                        },
                        '@default': 'identifier.tbexp',
                    },
                },
            ],

            ['@variable', 'variable.tbexp'],
            ['@attribute', 'attribute.tbexp'],

            // brackets
            [/[{}]/, 'delimiter.bracket.tbexp'],
            [/[\[\]]/, 'delimiter.array.tbexp'],
            [/[()]/, 'delimiter.parenthesis.tbexp'],

            // strings
            [/"/, 'string.tbexp', '@DoubleQuoteString'],
            [/'/, 'string.tbexp', '@SingleQuoteString'],

            // delimiters
            [/[\+\-\*\%\&\|\^\~\!\=\<\>\/\.]/, 'delimiter.tbexp'],

            // numbers
            [/\d*\d+[eE]([\-+]?\d+)?/, 'number.float.tbexp'],
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float.tbexp'],
            [/0[xX][0-9a-fA-F']*[0-9a-fA-F]/, 'number.hex.tbexp'],
            [/0[0-7']*[0-7]/, 'number.octal.tbexp'],
            [/0[bB][0-1']*[0-1]/, 'number.binary.tbexp'],
            [/\d[\d']*/, 'number.tbexp'],
            [/\d/, 'number.tbexp'],
        ],

        Whitespace: [[/[\t\r\n]+/, '']],

        DoubleQuoteString: [
            [/[^\\"]+/, 'string.tbexp'],
            [/@escapes/, 'string.escape.tbexp'],
            [/\\./, 'string.escape.invalid.tbexp'],
            [/"/, 'string.tbexp', '@pop'],
        ],

        SingleQuoteString: [
            [/[^\\']+/, 'string.tbexp'],
            [/@escapes/, 'string.escape.tbexp'],
            [/\\./, 'string.escape.invalid.tbexp'],
            [/'/, 'string.tbexp', '@pop'],
        ],
    },

    PreDefinedVariables: ['$CURRENT_OBJECT', '$CURRENT_USER'],

    Function: [
        'DATE',
        'DATEVALUE',
        'DAY',
        'DAYS',
        'DAYS360',
        'EDATE',
        'EOMONTH',
        'HOUR',
        'MINUTE',
        'ISOWEEKNUM',
        'MONTH',
        'NOW',
        'SECOND',
        'TIME',
        'TIMEVALUE',
        'TODAY',
        'WEEKDAY',
        'YEAR',
        'WEEKNUM',
        'AND',
        'IF',
        'NOT',
        'OR',
        'SWITCH',
        'ABS',
        'CEILING',
        'CEILINGMATH',
        'EXP',
        'FLOOR',
        'FLOORMATH',
        'LOG',
        'LOG10',
        'MAX',
        'MIN',
        'MOD',
        'ROUND',
        'ROUNDDOWN',
        'ROUNDUP',
        'SQRT',
        'AVERAGE',
        'SUM',
        'COUNT',
        'COUNTA',
        'POWER',
        'CONCATENATE',
        'EXACT',
        'FIND',
        'LEFT',
        'LEN',
        'LOWER',
        'MID',
        'NUMBERVALUE',
        'PROPER',
        'REPT',
        'RIGHT',
        'SEARCH',
        'SPLIT',
        'SUBSTITUTE',
        'TRIM',
        'UPPER',
        'ISBLANK',
        'INCLUDES',
    ],

    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // Set defaultToken to invalid to see what you do not tokenize yet
    // defaultToken: 'invalid',
    // keywords: [
    //     'COMPLETE', 'ADD',
    // ],
    // typeKeywords: ['TODO'],
    // escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // // The main tokenizer for our languages
    // tokenizer: {
    //     root: [
    //         // identifiers and keywords
    //         [/[a-zA-Z_$][\w$]*/, {
    //             cases: {
    //                 '@keywords': { token: 'keyword' },
    //                 '@typeKeywords': { token: 'type' },
    //                 '@default': 'identifier'
    //             }
    //         }],
    //         // whitespace
    //         { include: '@whitespace' },
    //         // strings for todos
    //         [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
    //         [/"/, 'string', '@string'],
    //     ],
    //     whitespace: [
	// 		[/[ \t\r\n]+/, ''],
	// 	],
    //     string: [
    //         [/[^\\"]+/, 'string'],
    //         [/@escapes/, 'string.escape'],
    //         [/\\./, 'string.escape.invalid'],
    //         [/"/, 'string', '@pop']
    //     ]
    // },
}