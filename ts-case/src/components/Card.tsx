'use client'
import React, { useState } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import styles from '@/styles/md.module.css'

interface CardProps {
  mdPath: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  description?: string
  tag?: string
  children?: React.ReactNode
}

const Card: React.FC<CardProps> = ({
  mdPath,
  size = 'md',
  className,
  description,
  tag,
  children,
}) => {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sizeClasses = {
    sm: 'w-64 h-40',
    md: 'w-80 h-48',
    lg: 'w-96 h-56',
  }

  const baseClasses = twMerge(
    'bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300',
    sizeClasses[size],
    className
  )

  const fetchMdxContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let response
      console.log(mdPath)
      if (mdPath.startsWith('http')) {
        // External URL
        response = await fetch(mdPath)
      } else {
        const url = `/api/mdx?path=${encodeURIComponent(mdPath)}`
        console.log(url)
        // Local file
        response = await fetch(url)
      }

      if (!response.ok) {
        throw new Error('Failed to fetch MDX content')
      }

      const mdxText = await response.text()
      const mdxSource = await serialize(mdxText)
      setMdxSource(mdxSource)
    } catch (err) {
      console.error('Error fetching MDX:', err)
      setError('Failed to load MDX content')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <PopoverButton
            as="div"
            className={baseClasses}
            onClick={fetchMdxContent}
          >
            {mdPath && (
              <div className="h-1/2 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">overview</span>
              </div>
            )}
            <div className="p-4">
              {tag && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                  {tag}
                </span>
              )}
              {description && (
                <p className="text-gray-600 text-sm">{description}</p>
              )}
              {children}
            </div>
          </PopoverButton>

          {open && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
              aria-hidden="true"
            />
          )}

          <PopoverPanel className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="mt-2">
                  {isLoading && <p>Loading...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {mdxSource && (
                    <>
                      <div className="p">
                        <MDXRemote
                          {...mdxSource}
                          components={{
                            h1: (props) => (
                              <h1 className={styles.h1} {...props} />
                            ),
                            h2: (props) => (
                              <h2 className={styles.h2} {...props} />
                            ),
                            h3: (props) => (
                              <h3 className={styles.h3} {...props} />
                            ),
                            h4: (props) => (
                              <h4 className={styles.h4} {...props} />
                            ),
                            h5: (props) => (
                              <h5 className={styles.h5} {...props} />
                            ),
                            h6: (props) => (
                              <h6 className={styles.h6} {...props} />
                            ),

                            p: (props) => <p className={styles.p} {...props} />,
                            code: (props) => (
                              <code className={styles.code} {...props} />
                            ),
                            button: (props) => (
                              <button className={styles.button} {...props} />
                            ),
                            body: (props) => (
                              <body className={styles.body} {...props} />
                            ),
                            pre: (props) => (
                              <pre className={styles.pre} {...props} />
                            ),
                            blockquote: (props) => (
                              <blockquote
                                className={styles.blockquote}
                                {...props}
                              />
                            ),
                            ul: (props) => (
                              <ul className={styles.ul} {...props} />
                            ),
                            li: (props) => (
                              <li className={styles.li} {...props} />
                            ),
                            ol: (props) => (
                              <ol className={styles.ol} {...props} />
                            ),
                            // 可以在这里添加其他组件样式
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={close}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}

export default Card
