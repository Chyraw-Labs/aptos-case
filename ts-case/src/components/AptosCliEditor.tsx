/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { EditorProps, OnMount, OnChange } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useMoveEditor } from './MoveEditorProvider'
import {
  CLI_APTOS,
  CLI_APTOS_ACCOUNT_H,
  CLI_APTOS_ACCOUNT_HELP,
  CLI_APTOS_HELP,
  CLI_APTOS_INIT_H,
  CLI_APTOS_INIT_HELP,
  CLI_APTOS_MOVE,
  CLI_APTOS_MOVE_H,
  CLI_APTOS_MOVE_HELP,
  CLI_APTOS_MOVE_TEST,
  CLI_APTOS_MOVE_TEST_H,
  CLI_APTOS_MOVE_TEST_HELP,
  TASK_APTOS_MOVE_INIT_NAME_HI_APTOS,
  TASK_APTOS_INIT_NETWORK_TESTNET,
  TASK_APTOS_ACCOUNT_FUND_WITH_FAUCET_ACCOUNT_DEFAULT,
} from '@/code-case/aptos-cli'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
})

interface AptosCliEditorProps extends Partial<EditorProps> {
  initialCode: string
  onCodeChange: (code: string) => void
}

enum Command {
  Aptos = 'aptos',
  AptosHelp = 'aptos help',
  // aptos move
  AptosMove = 'aptos move',
  AptosMoveHelp = 'aptos move --help',
  AptosMoveH = 'aptos move -h',
  AptosMoveTest = 'aptos move test',
  AptosMoveTestH = 'aptos move test -h',
  AptosMoveTestHelp = 'aptos move test --help',
  AptosMoveInit = 'aptos move init',
  AptosMoveInitH = 'aptos move init -h',
  AptosMoveInitHelp = 'aptos move init --help',
  AptosV = 'aptos -v',

  AptosAccount = 'aptos account',
  AptosAccountH = 'aptos account -h',
  AptosAccountHelp = 'aptos account --help',
  Node = 'node',
  Move = 'move',
  Help = 'help',
  TaskAptosMoveInitNameHiAptos = 'aptos move init --name hi_aptos',
  TaskAptosInitNetworkTestnet = 'aptos init --network testnet',
  TaskAptosAccountFundWithFaucetAccountDefault = 'aptos account fund-with-faucet --account default',
}

const commandResponses: Record<Command, string> = {
  [Command.Aptos]: CLI_APTOS,
  [Command.AptosHelp]: CLI_APTOS_HELP,
  // aptos move
  [Command.AptosMove]: CLI_APTOS_MOVE,
  [Command.AptosMoveH]: CLI_APTOS_MOVE_H,
  [Command.AptosMoveHelp]: CLI_APTOS_MOVE_HELP,
  [Command.AptosMoveTest]: CLI_APTOS_MOVE_TEST,
  [Command.AptosMoveTestH]: CLI_APTOS_MOVE_TEST_H,
  [Command.AptosMoveTestHelp]: CLI_APTOS_MOVE_TEST_HELP,
  [Command.AptosMoveInit]: CLI_APTOS,
  [Command.AptosMoveInitH]: CLI_APTOS_INIT_H,
  [Command.AptosMoveInitHelp]: CLI_APTOS_INIT_HELP,
  [Command.AptosV]: 'Aptos 命令行演示 UI 工具',
  [Command.AptosAccount]: CLI_APTOS_ACCOUNT_H,
  [Command.AptosAccountH]: CLI_APTOS_ACCOUNT_H,
  [Command.AptosAccountHelp]: CLI_APTOS_ACCOUNT_HELP,
  [Command.Node]: 'node 未定义',
  [Command.Move]: '请使用: aptos move <子命令>',
  [Command.Help]: '输入 aptos 命令，使用 aptos 命令 UI 工具',
  // task
  [Command.TaskAptosMoveInitNameHiAptos]: TASK_APTOS_MOVE_INIT_NAME_HI_APTOS,
  [Command.TaskAptosInitNetworkTestnet]: TASK_APTOS_INIT_NETWORK_TESTNET,
  [Command.TaskAptosAccountFundWithFaucetAccountDefault]:
    TASK_APTOS_ACCOUNT_FUND_WITH_FAUCET_ACCOUNT_DEFAULT,
}

const aptosCommands = [
  'aptos',
  'publish',
  'compile',
  'test',
  'help',
  'version',
  'node',
  'move',
  'init',
  'config',
  'account',
  'fund-with-faucet',
]

// 格式化用户输入的命令
function normalizeCommand(cmd: string): string {
  return cmd.toLowerCase().replace(/\s+/g, ' ').trim()
}

// 获取响应
function getResponse(command: string): string {
  console.log('get response: ', command)
  const normalizedCommand = normalizeCommand(command)
  for (const [enumCommand, response] of Object.entries(commandResponses)) {
    if (normalizeCommand(enumCommand) === normalizedCommand) {
      return response
    }
  }
  return `命令没有找到: ${command}. 输入 'help' 查看可用命令.`
}
const AptosCliEditor: React.FC<AptosCliEditorProps> = ({
  initialCode,
  onCodeChange,
  ...props
}) => {
  const { setCode } = useMoveEditor()
  const [code] = useState(initialCode)
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleEditorChange: OnChange = useCallback(
    (value) => {
      if (value !== undefined) {
        const lastDollarIndex = value.lastIndexOf('$')
        if (lastDollarIndex !== -1) {
          const currentCommand = value.slice(lastDollarIndex + 1).trim()
          setCode(currentCommand)
          onCodeChange(currentCommand)
          console.log('Current command: ', currentCommand)
        } else {
          setCode(value.trim())
          onCodeChange(value.trim())
          console.log('Current command: ', value.trim())
        }
      }
    },
    [onCodeChange, setCode]
  )

  // 获取响应
  // function getResponse(command: string): string {
  //   console.log('get response: ', command)
  //   const normalizedCommand = normalizeCommand(command)

  //   for (const [enumCommand, response] of Object.entries(commandResponses)) {
  //     if (normalizeCommand(enumCommand) === normalizedCommand) {
  //       return response
  //     }
  //   }

  //   return `命令没有找到: ${command}. 输入 'help' 查看可用命令.`
  // }

  const handleEditorDidMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor

      monaco.languages.register({ id: 'aptosCli' })

      monaco.languages.setMonarchTokensProvider('aptosCli', {
        tokenizer: {
          root: [
            [/^\$/, 'prompt'],
            [new RegExp(`\\b(${aptosCommands.join('|')})\\b`), 'keyword'],
            [/[a-zA-Z]\w*/, 'identifier'],
            [/".*?"/, 'string'],
            [/\d+/, 'number'],
          ],
        },
      })

      monaco.editor.defineTheme('aptosCliTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'prompt', foreground: '00FF00' },
          { token: 'keyword', foreground: '569CD6' },
          { token: 'identifier', foreground: 'FFFFFF' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
        ],
        colors: {
          'editor.background': '#222222',
        },
      })

      monaco.editor.setTheme('aptosCliTheme')

      monaco.languages.registerCompletionItemProvider('aptosCli', {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }

          return {
            suggestions: aptosCommands.map((command) => ({
              label: command,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: command,
              range: range,
            })),
          }
        },
      })

      editor.addCommand(monaco.KeyCode.Enter, () => {
        const model = editor.getModel()
        if (!model) return

        const selection = editor.getSelection()
        if (selection && selection.isEmpty()) {
          const lineNumber = selection.startLineNumber
          const line = model.getLineContent(lineNumber)
          const trimmedLine = line.trim()

          if (trimmedLine.startsWith('$')) {
            const command = trimmedLine.slice(1).trim()
            const response = getResponse(command)

            const lastLineNumber = model.getLineCount()
            const lastLineContent = model.getLineContent(lastLineNumber)

            editor.executeEdits('', [
              {
                range: new monaco.Range(
                  lastLineNumber,
                  lastLineContent.length + 1,
                  lastLineNumber,
                  lastLineContent.length + 1
                ),
                text: '\n' + response + '\n$ ',
              },
            ])

            const newLastLineNumber = model.getLineCount()
            editor.setPosition({ lineNumber: newLastLineNumber, column: 3 })
          } else {
            editor.executeEdits('', [
              {
                range: new monaco.Range(
                  lineNumber,
                  line.length + 1,
                  lineNumber,
                  line.length + 1
                ),
                text: '\n$ ',
              },
            ])
            editor.setPosition({ lineNumber: lineNumber + 1, column: 3 })
          }
        }
      })
    },
    [getResponse]
  )

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      if (model) {
        const lineCount = model.getLineCount()
        editorRef.current.setPosition({
          lineNumber: lineCount,
          column: model.getLineMaxColumn(lineCount),
        })
        editorRef.current.focus()
      }
    }
  }, [code])

  return (
    <MonacoEditor
      height="100%"
      theme="aptosCliTheme"
      defaultLanguage="aptosCli"
      value={code}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'off',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        wordWrap: 'on',
        wrappingStrategy: 'advanced',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 10, bottom: 10 },
      }}
      {...props}
    />
  )
}

export default AptosCliEditor
