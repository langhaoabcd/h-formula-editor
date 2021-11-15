import * as monacoEditor from 'monaco-editor-core';

export const theme: monacoEditor.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: false,
  rules: [
    { token: 'number.tbexp', foreground: '008800' },
    { token: 'number.float.tbexp', foreground: '008800' },
    { token: 'string.tbexp', foreground: '10239e' },
    { token: 'string.escape.tbexp', foreground: '10239e' },
    { token: 'string.escape.invalid.tbexp', foreground: '10239e' },
    { token: 'delimiter.parenthesis.tbexp', foreground: 'd4b106' },
    { token: 'delimiter.tbexp', foreground: '87e8de' },
    { token: 'function.tbexp', foreground: 'ad2102' },
    { token: 'variable.tbexp', foreground: 'cf1322' },
    { token: 'variable.predefined.tbexp', foreground: 'cf1322' },
    { token: 'attribute.tbexp', foreground: 'ffbb96' },
  ],
  colors: {
    'editorCursor.foreground': '#8B0000',
  },
};
