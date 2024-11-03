'use client'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useState, useEffect } from 'react'

export default function DocsTable() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 当 Popover 关闭时，重置颜色
    if (!isOpen) {
      setIsOpen(false)
    }
  }, [isOpen])

  return (
    <div className="pt-0">
      <div className="flex gap-8">
        <Popover>
          {({ open }) => (
            <>
              <PopoverButton
                className={`flex items-center text-sm/6 font-semibold ${
                  open ? 'text-blue-700' : 'text-black'
                } focus:outline-none`}
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={open ? '#006eff' : '#fff'}
                    stroke={open ? '#006eff' : '#000'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 7h.01" />
                    <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
                    <path d="m20 7 2 .5-2 .5" />
                    <path d="M10 18v3" />
                    <path d="M14 17.75V21" />
                    <path d="M7 18a6 6 0 0 0 3.84-10.61" />
                  </svg>
                  <span
                    className={`ml-2 ${open ? 'text-blue-700' : 'text-black'}`}
                  >
                    使用说明
                  </span>
                </span>
              </PopoverButton>

              <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 z-50 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0  bg-opacity-50 backdrop-blur-xl "
              >
                {/* PopoverPanel content remains the same */}
                <div className="p-3 max-w-md overflow-hidden">
                  <a
                    className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                    href="#"
                  >
                    <p className="font-semibold text-white">🥹 注意</p>
                    <div>
                      <ol className="ol">
                        <li className="li">⚠️ 建议命名 </li>
                        <li className="li">✅ 可用库</li>
                        <li className="li">
                          ❌ 不可用库
                          <ol className="ol">
                            <li className="li">debug</li>
                            <li className="li">
                              <ol className="ol">
                                <li className="li">
                                  <details>
                                    <summary>🌟 建议 1</summary>
                                    <div>这里是建议 1 的详细内容。</div>
                                  </details>
                                </li>
                                <li className="li">三级有序列表项 2</li>
                              </ol>
                            </li>
                            <li className="li">建议名称</li>
                          </ol>
                        </li>
                        <li className="li">一级有序列表项 2</li>
                      </ol>
                    </div>
                    <p className="text-white/50">debug 库不可用</p>
                  </a>
                  <div>
                    <a
                      className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                      href="#"
                    >
                      <details>
                        <summary>🌟 编码约定</summary>
                        <div className="ml-4">
                          <details>
                            <summary>💫 命名规范</summary>
                            <div className="ml-4">
                              <p className="text-white/50">
                                <div className="break-words">
                                  <ul>
                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <strong>模块名称</strong>：
                                        <code>module_name</code>
                                        <br />
                                        应为小写蛇形，例如，
                                        <code>fixed_point32</code>，
                                        <code>vector</code>。
                                      </a>
                                    </li>

                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <strong>类型名称</strong>：
                                        <code>TypeName</code>
                                        <br />
                                        如果它们不是原生类型，则应为大驼峰命名法，例如
                                        <code>Coin</code>、<code>RoleId</code>。
                                      </a>
                                    </li>
                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <strong>函数名称</strong>：
                                        <code>function_name</code>
                                        <br />
                                        应为小写蛇形命名法，例如，{' '}
                                        <code>destroy_empty</code>。
                                      </a>
                                    </li>
                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <p>
                                          <strong>常量名称</strong>：
                                          <code>EAnError</code>&
                                          <code>CONST_NAME</code>
                                          <br />
                                          应为大驼峰命名法，如果代表错误代码（例如，
                                          <code>EIndexOutOfBounds</code>
                                          ），则应以
                                          <code>E</code>
                                          开头，如果代表非错误值（例如，
                                          <code>MIN_STAKE</code>
                                          ），则应以大写蛇形命名法
                                          <strong>大写开头</strong>。
                                        </p>
                                      </a>
                                    </li>
                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <p>
                                          <strong>泛型名称</strong>：
                                          <code>GenericName</code>
                                          <br />
                                          应是描述性的，或适时的反描述性的，例如，
                                          <code>Vector</code>泛型参数的
                                          <code>T</code>或<code>Element</code>
                                          。大多数时候，模块中
                                          <strong>主</strong>
                                          类型应该与模块名称相同，例如，
                                          <code>option::Option</code>，
                                          <code>
                                            fixed_point32::FixedPoint32
                                          </code>
                                          。
                                        </p>
                                      </a>
                                    </li>
                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <strong>模块文件名</strong>：
                                        <code>module_file_name.move</code>
                                        <br />
                                        应与模块名称相同，例如
                                        <code>option.move</code>。
                                      </a>
                                    </li>
                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <strong>脚本文件名</strong>：
                                        <code>script_file_name.move</code>
                                        <br />
                                        应为小写蛇形，并应与脚本中
                                        <strong>主</strong>
                                        函数的名称匹配。
                                      </a>
                                    </li>
                                    <li className="break-words">
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <strong>混合文件名</strong>：
                                        <code>mixed_file_name.move</code>
                                        <br />
                                        如果文件包含多个模块和/或脚本，文件名应为小写蛇形命名法，其中名称不与内部的任何特定模块/脚本相同。
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </p>
                            </div>
                          </details>
                        </div>
                        <div className="ml-4">
                          <details>
                            <summary>💫 注释</summary>
                            <div className="ml-4">
                              <p className="text-white/50">
                                <div className="break-words">
                                  <ul>
                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        每个模块、结构体和公共函数声明都应该进行注释。
                                      </a>
                                    </li>

                                    <li>
                                      <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                        <strong>文档注释</strong>: ///
                                        <br />
                                        <strong>常规单行注释</strong>: //
                                        <br />
                                        <strong>块注释</strong>: /* */
                                        <br />
                                        <strong>块文档注释</strong>: /** */
                                      </a>
                                    </li>
                                    <li>
                                      <a>
                                        文档注释必须位于注释的项目正上方。例如，以下内容是有效的：
                                        <pre>
                                          {`/// 我很棒的模块，文档注释可以在这里使用
module 0x42::example { // 常规单行注释可以出现在任何地方
  /* 常规块注释可以
   * 出现在
   * 任何地方 */
  use module_name::example
  /** 有效的
   * 块文档
   * 注释 */
  const E_MY_ERROR: u64 = 10;
  /// 有效的单行文档注释 
  const E_MY_ERROR: u64 = 10;
  /// 在这里的文档注释是无效的
  #[view]
  /// 有效的文档注释
  fun show_me_the_money() {
    // ...
  }
  /* 同样，块注释可以出现在任何地方 */
`}
                                        </pre>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </p>
                            </div>
                          </details>
                        </div>
                      </details>
                    </a>
                  </div>
                  <a
                    className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                    href="#"
                  >
                    <p className="font-semibold text-white">Reports</p>
                    <p className="text-white/50">Keep track of your growth</p>
                  </a>
                </div>
                <div className="p-3">
                  <a
                    className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
                    href="#"
                  >
                    <p className="font-semibold text-white">Documentation</p>
                    <p className="text-white/50">
                      Start integrating products and tools
                    </p>
                  </a>
                  {/* Other content remains the same */}
                </div>
              </PopoverPanel>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}
