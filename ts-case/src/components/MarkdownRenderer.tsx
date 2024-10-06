'use client'
import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import styles from '@/styles/md.module.css'
import hljs from 'highlight.js'
import '@/styles/custom-dark-highlight.css'
import mermaid from 'mermaid'

hljs.registerLanguage('mylxxang', function (hljs) {
  return {
    keywords: {
      keyword: 'aptos move test',
      built_in: 'success error',
    },
    contains: [
      hljs.QUOTE_STRING_MODE, // 支持字符串
      hljs.COMMENT('//', '$'), // 支持单行注释
      {
        className: 'number',
        begin: '\\b\\d+\\b', // 支持数字
      },
      {
        className: 'error',
        begin: '\\[ERROR\\]', // 匹配 [ERROR]
        relevance: 10, // 提高优先级
      },
      {
        className: 'error',
        begin: '\\berror\\b', // 匹配 error
        relevance: 10, // 提高优先级
      },
      {
        className: 'pass',
        begin: '\\[PASS\\]', // 匹配 [PASS]
        relevance: 10, // 提高优先级
      },
      {
        className: 'pass',
        begin: '\\bsuccess\\b', // 匹配 success
        relevance: 10, // 提高优先级
      },
      {
        className: 'aptos',
        begin: '\\baptos\\b', // 匹配 aptos
        relevance: 10, // 提高优先级
      },
      {
        className: 'move',
        begin: '\\bmove\\b', // 匹配 move
        relevance: 10, // 提高优先级
      },
      {
        className: 'test',
        begin: '\\btest\\b', // 匹配 test
        relevance: 10, // 提高优先级
      },
      // 你可以添加更多的模式
    ],
  }
})

// Define custom language highlighting
hljs.registerLanguage('pass', () => ({
  contains: [
    {
      className: 'keyword',
      begin: /\[PASS\]/,
    },
    {
      className: 'string',
      begin: /aptos/,
    },
  ],
}))

hljs.registerLanguage('error', () => ({
  contains: [
    {
      className: 'keyword',
      begin: /\[ERROR\]/,
    },
    {
      className: 'string',
      begin: /aptos/,
    },
  ],
}))

hljs.registerLanguage('aptos', () => ({
  contains: [
    {
      className: 'keyword',
      begin: /aptos/,
    },
    {
      className: 'string',
      begin: /\[ERROR\]|\[PASS\]/,
    },
  ],
}))

hljs.registerLanguage('move', function (hljs) {
  return {
    case_insensitive: false,
    keywords: {
      keyword: [
        'module',
        'struct',
        'public',
        'fun',
        'let',
        'mut',
        'return',
        'if',
        'else',
        'loop',
        'while',
        'break',
        'continue',
        'spec',
        'schema',
        'resource',
        'use',
        'as',
        'move',
        'copy',
        'drop',
        'store',
        'acquires',
      ].join(' '),
      type: ['u8', 'u64', 'u128', 'bool', 'address', 'vector'].join(' '),
      literal: ['true', 'false'].join(' '),
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.COMMENT('/\\*', '\\*/', { contains: ['self'] }),
      {
        className: 'string',
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE],
        illegal: '\\n',
      },
      {
        className: 'number',
        variants: [{ begin: '\\b0x([A-Fa-f0-9_]+)' }, { begin: '\\b(\\d+)' }],
        relevance: 0,
      },
      {
        className: 'function',
        beginKeywords: 'fun',
        end: '(\\(|$)',
        excludeEnd: true,
        contains: [hljs.UNDERSCORE_TITLE_MODE],
      },
      {
        className: 'class',
        beginKeywords: 'struct module',
        end: '{',
        illegal: '[\\w\\d]',
        contains: [hljs.UNDERSCORE_TITLE_MODE],
      },
      {
        className: 'built_in',
        begin: 'vector',
        end: '<',
        keywords: 'vector',
        contains: [
          {
            className: 'type',
            begin: '[a-zA-Z_]\\w*',
            relevance: 0,
          },
        ],
      },
      {
        className: 'symbol',
        begin: '@[a-zA-Z_]\\w*',
      },
      {
        className: 'operator',
        begin: '(\\+|\\-|\\*|\\/|\\%|\\=|\\<|\\>|\\&|\\|)',
      },
      {
        className: 'punctuation',
        begin: '(\\{|\\}|\\(|\\)|\\[|\\]|\\,|\\;|\\:)',
      },
      {
        className: 'meta',
        begin: '#\\[',
        end: '\\]',
        contains: [
          {
            className: 'meta-string',
            begin: '"',
            end: '"',
          },
        ],
      },
    ],
  }
})

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const mermaidRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose', // 如果你信任你的内容源
    })

    const renderMermaidDiagrams = async () => {
      if (mermaidRef.current) {
        const mermaidDivs = mermaidRef.current.querySelectorAll('.mermaid')
        for (let i = 0; i < mermaidDivs.length; i++) {
          const element = mermaidDivs[i]
          const graphDefinition = element.textContent
          if (graphDefinition) {
            const { svg } = await mermaid.render(
              `mermaid-${i}`,
              graphDefinition
            )
            element.innerHTML = svg
          }
        }
      }
    }

    hljs.highlightAll()
    // Manually trigger highlight.js after component mounts
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block as HTMLElement)
    })

    renderMermaidDiagrams()
  }, [content])
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={content}
        components={{
          h1: (props) => <h1 className={styles.h1} {...props} />,
          h2: (props) => <h2 className={styles.h2} {...props} />,
          h3: (props) => <h3 className={styles.h3} {...props} />,
          h4: (props) => <h4 className={styles.h4} {...props} />,
          h5: (props) => <h5 className={styles.h5} {...props} />,
          h6: (props) => <h6 className={styles.h6} {...props} />,
          p: (props) => <p className={styles.p} {...props} />,
          a: (props) => <a className={styles.a} {...props} />,
          em: (props) => <em className={styles.em} {...props} />,
          pre: (props) => <pre className={styles.pre} {...props} />,
          blockquote: (props) => (
            <blockquote className={styles.blockquote} {...props} />
          ),
          ul: (props) => <ul className={styles.ul} {...props} />,
          li: (props) => <li className={styles.li} {...props} />,
          ol: (props) => <ol className={styles.ol} {...props} />,
          th: (props) => <th className={styles.th} {...props} />,
          td: (props) => <td className={styles.td} {...props} />,
          table: (props) => <table className={styles.table} {...props} />,
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          img: (props) => <img className={styles.img} {...props} />,
          thead: (props) => <thead className={styles.thead} {...props} />,
          tbody: (props) => <tbody className={styles.tbody} {...props} />,
          tr: (props) => <tr className={styles.tr} {...props} />,
          strong: (props) => <strong className={styles.strong} {...props} />,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            if (match && match[1] === 'mermaid') {
              return (
                <div className="mermaid">
                  {String(children).replace(/\n$/, '')}
                </div>
              )
            }
            return match ? (
              <pre className={styles.pre}>
                <code className={`${className} ${styles.code}`} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className={`${className} ${styles.code}`} {...props}>
                {children}
              </code>
            )
          },
        }}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeHighlight, { ignoreMissing: true, detect: true }],
        ]}
      />
    </React.Suspense>
  )
}

export default MarkdownRenderer
