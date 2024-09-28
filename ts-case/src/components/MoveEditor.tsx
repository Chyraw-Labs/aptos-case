// import * as monaco from 'monaco-editor'

// // 1. Define custom language
// monaco.languages.register({ id: 'customLang' })

// // 2. Define custom tokens and colors
// monaco.languages.setMonarchTokensProvider('customLang', {
//   tokenizer: {
//     root: [
//       [/\[error.*/, 'custom-error'],
//       [/\[notice.*/, 'custom-notice'],
//       [/\[info.*/, 'custom-info'],
//       [/\b(if|else|for|while)\b/, 'custom-control-flow'],
//       [/\b\d+\b/, 'custom-number'],
//       [/".*?"/, 'custom-string'],
//     ],
//   },
// })

// // 3. Define custom theme
// monaco.editor.defineTheme('customTheme', {
//   base: 'vs-dark',
//   inherit: true,
//   rules: [
//     { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
//     { token: 'custom-notice', foreground: 'FFA500' },
//     { token: 'custom-info', foreground: '808080' },
//     { token: 'custom-control-flow', foreground: 'C586C0', fontStyle: 'italic' },
//     { token: 'custom-number', foreground: 'B5CEA8' },
//     { token: 'custom-string', foreground: 'CE9178' },
//   ],
//   colors: {
//     'editor.background': '#1E1E1E',
//   },
// })

// // 4. Configure custom completion
// monaco.languages.registerCompletionItemProvider('customLang', {
//   provideCompletionItems: () => {
//     const suggestions = [
//       {
//         label: 'ifstatement',
//         kind: monaco.languages.CompletionItemKind.Snippet,
//         insertText: 'if (${1:condition}) {\n\t$0\n}',
//         insertTextRules:
//           monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
//         documentation: 'If statement',
//       },
//       {
//         label: 'forloop',
//         kind: monaco.languages.CompletionItemKind.Snippet,
//         insertText:
//           'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t$0\n}',
//         insertTextRules:
//           monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
//         documentation: 'For loop',
//       },
//     ]
//     return { suggestions: suggestions }
//   },
// })

// // 5. Update your Editor component
// ;<Editor
//   height="100%"
//   defaultLanguage="customLang"
//   defaultValue={code}
//   theme="customTheme"
//   onMount={(editor, monaco) => {
//     handleEditorDidMount(editor, monaco)
//     // Additional setup if needed
//   }}
//   onChange={handleEditorChange}
//   options={{
//     minimap: { enabled: false },
//     fontSize: 14,
//     // Add more options as needed
//   }}
// />
export {}
