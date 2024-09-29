'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'
import styles from '@/styles/md.module.css'

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Log the content for debugging
  console.log('Markdown content:', content)

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

          thead: (props) => <thead className="md-thead" {...props} />,
          tbody: (props) => <tbody className="md-tbody" {...props} />,
          tr: (props) => <tr className={styles.tr} {...props} />,
        }}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      />
    </React.Suspense>
  )
}

export default MarkdownRenderer
