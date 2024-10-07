import { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { EditorProps, OnMount, OnChange } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { NFT, TYPE } from '@/code-case/move'
import { useMoveEditor } from './MoveEditorProvider'

export const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
})

interface MoveEditorProps extends Partial<EditorProps> {
  initialCode: string
  onCodeChange: (code: string) => void
}

interface CodeSnippet {
  label: string
  insertText: string
  documentation: string
}

const moveSnippets: CodeSnippet[] = [
  // https://uutool.cn/list-ln/
  {
    label: 'case-nft',
    insertText: NFT,
    documentation: '创建 NFT',
  },
  {
    label: 'case-type',
    insertText: TYPE,
    documentation: '创建 type',
  },
  {
    label: 'module-snip',
    insertText: 'module ${1:address}::${2:moduleName} {\n\t${0}\n}',
    documentation: '模块定义',
  },
  {
    label: 'fun',
    insertText:
      'public fun ${1:name}(${2:params}) ${3:return_type} {\n\t${0}\n}',
    documentation: '函数定义',
  },
  {
    label: 'struct',
    insertText: 'struct ${1:Name} {\n\t${2:field}: ${3:type},\n\t${0}\n}',
    documentation: '结构体定义',
  },
  {
    label: 'if',
    insertText: 'if (${1:condition}) {\n\t${0}\n}',
    documentation: 'if 语句',
  },
  {
    label: 'while',
    insertText: 'while (${1:condition}) {\n\t${0}\n}',
    documentation: 'while 循环',
  },
]

const moveKeywords = [
  'module',
  'struct',
  'has',
  'public',
  'fun',
  'let',
  'mut',
  'if',
  'else',
  'while',
  'loop',
  'return',
  'move',
  'copy',
  'resource',
  'acquires',
  'use',
  'as',
  'native',
  'abort',
  'break',
  'continue',
  'const',
  'true',
  'false',
  'address',
]

const AptosCliEditor: React.FC<MoveEditorProps> = ({
  initialCode,
  onCodeChange,
  ...props
}) => {
  const { setCode } = useMoveEditor() // 使用 Context
  const [code] = useState(initialCode)
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleEditorChange: OnChange = useCallback(
    (value) => {
      if (value !== undefined) {
        onCodeChange(value)
        setCode(value)
        console.log('code: ', value)
      }
    },
    [onCodeChange, setCode]
  )

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor

    // 注册 Move 语言
    monaco.languages.register({ id: 'move' })

    // 设置 Move 语法高亮
    monaco.languages.setMonarchTokensProvider('move', {
      tokenizer: {
        root: [
          [
            /[a-z_$][\w$]*/,
            {
              cases: {
                '@moveKeywords': 'keyword',
                '@default': 'variable',
              },
            },
          ],
          [/".*?"/, 'string'],
          [/\/\/.*/, 'comment'],
          [/[0-9]+/, 'number'],
          [/0x[0-9a-fA-F]+/, 'number.hex'],
        ],
      },
      moveKeywords: moveKeywords,
    })

    // 设置 Move 代码补全
    monaco.languages.registerCompletionItemProvider('move', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        const createCompletionItem = (
          snippet: CodeSnippet
        ): Monaco.languages.CompletionItem => ({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: snippet.documentation,
          range: range,
        })

        const createKeywordItem = (
          keyword: string
        ): Monaco.languages.CompletionItem => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range,
        })

        const snippetSuggestions: Monaco.languages.CompletionItem[] =
          moveSnippets.map(createCompletionItem)

        const keywordSuggestions: Monaco.languages.CompletionItem[] =
          moveKeywords.map(createKeywordItem)

        return {
          suggestions: [...snippetSuggestions, ...keywordSuggestions],
        }
      },
    })

    editor.addCommand(monaco.KeyCode.Enter, () => {
      const selection = editor.getSelection()
      if (selection && selection.isEmpty()) {
        const lineNumber = selection.startLineNumber
        const line = editor.getModel()?.getLineContent(lineNumber) || ''
        // const indentation = line.match(/^\s*/)?.[0] || ''

        // 检查行末字符
        const lastChar = line.trim().slice(-1)
        const shouldIndent = ![';', ',', '.', '{', '}'].includes(lastChar)

        // 如果需要缩进，则添加四个空格
        const newIndentation = shouldIndent ? '\t\t' : ''

        editor.trigger('keyboard', 'type', { text: '\n' + newIndentation })
      } else {
        editor.trigger('keyboard', 'type', { text: '\n' })
      }
    })
  }, [])

  return (
    <MonacoEditor
      height="100%"
      theme="vs-dark"
      defaultLanguage="move"
      value={code}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        autoIndent: 'full',
        tabSize: 2,
        insertSpaces: true,
      }}
      {...props}
    />
  )
}

export default AptosCliEditor
