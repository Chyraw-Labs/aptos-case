'use client'

import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css'
// import 'highlight.js/styles/github.css'
import 'highlight.js/styles/atom-one-dark.css' // 暗色主题
import styles from '@/styles/md.module.css'
import hljs from 'highlight.js'
import '@/styles/custom-dark-highlight.css' // 自定义样式

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
  useEffect(() => {
    hljs.highlightAll()
    // Manually trigger highlight.js after component mounts
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block as HTMLElement)
    })
  }, [content])
  // Log the content for debugging
  // console.log('Markdown content:', content)

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
          code: (props) => <code className={styles.code} {...props} />,
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

          thead: (props) => <thead className={styles.thead} {...props} />,
          tbody: (props) => <tbody className={styles.tbody} {...props} />,
          tr: (props) => <tr className={styles.tr} {...props} />,
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
