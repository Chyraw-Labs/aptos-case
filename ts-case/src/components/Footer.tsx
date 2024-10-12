'use client'
import React from 'react'

import Link from 'next/link'
import Image from 'next/image'

const Footer: React.FC = () => {
  return (
    <footer className="pt-4 pd-4 mb-8">
      {/* 布局容器 */}
      <div className="container mx-auto px-4 sm:px-6 md-8 lg:px-8">
        {/* info area: Blocks */}
        <div className="grid md:grid-cols-12 gap-8 lg:gap-20 mb-8 md:mb-12">
          {/* 1st block */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="mb-2">
              {/* Logo */}
              <Link href="/" className="inline-block " aria-label="Cruip">
                <Image
                  src="/assets/logo.svg"
                  alt="Chyraw Labs"
                  width={200}
                  height={200}
                />
              </Link>
            </div>
            <div className="text-gray-400">理解 Web3，从 Aptos 开始</div>
          </div>

          {/*  */}
          <div className="md:col-span-8 lg:col-span-7 grid sm:grid-cols-3 gap-8">
            {/* 分类一 */}
            <div className="text-sm">
              <h2 className="text-black font-bold mb-1">
                <p>公司</p>
              </h2>
              <ul>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    职业
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    合作
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    申请
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    入门
                  </Link>
                </li>
              </ul>
            </div>

            {/* 分类二 */}
            <div className="text-sm">
              <h2 className="text-black font-bold mb-1">
                <p>团队</p>
              </h2>
              <ul>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    开发者
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    用户关系
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    活动
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    事件
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    资源
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    管理
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    支持
                  </Link>
                </li>
              </ul>
            </div>

            {/* 分类三 */}
            <div className="text-sm">
              <h2 className="text-black font-bold mb-1">
                <p>资源</p>
              </h2>
              <ul>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    UI
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    合约
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-600 transition duration-150 ease-in-out"
                  >
                    安全
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* media area */}
        <div className="md:flex md:items-center md:justify-between mr-0 pr-0">
          {/* Social links */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            {/* telegram */}
            <li className="ml-4">
              <Link
                href="/"
                className="flex justify-center items-center text-blue-400 bg-gray-100 hover:text-blue-600 hover:bg-blue-200 rounded-full transition duration-150 ease-in-out"
                aria-label="Telegram"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 1160 1160"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="7430"
                >
                  <path
                    d="M883.612 145.595s82.887-32.335 75.979 46.192c-2.302 32.335-23.023 145.505-39.14 267.915L865.193 822.31s-4.604 53.12-46.048 62.36c-41.444 9.237-103.607-32.335-115.121-41.574-9.21-6.928-172.679-110.861-230.24-161.672-16.118-13.858-34.537-41.574 2.302-73.908l241.753-230.96c27.63-27.715 55.258-92.384-59.863-13.857L335.64 582.112s-36.839 23.095-105.91 2.309L80.073 538.229s-55.258-34.644 39.14-69.29c230.242-108.552 513.438-219.413 764.4-323.344z"
                    p-id="7431"
                  ></path>
                </svg>
              </Link>
            </li>

            {/* twitter */}
            <li className="ml-4">
              <Link
                href="/"
                className="flex justify-center items-center text-blue-400 bg-gray-100 hover:text-blue-600 hover:bg-blue-200 rounded-full transition duration-150 ease-in-out"
                aria-label="Twitter"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                </svg>
              </Link>
            </li>
            {/* 微信 */}
            <li className="ml-4">
              <Link
                href="/"
                className="flex justify-center items-center text-blue-400 bg-gray-100 hover:text-blue-600 hover:bg-blue-200 rounded-full transition duration-150 ease-in-out"
                aria-label="Linkedin"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  // viewBox="0 0 32 32"
                  viewBox="0 0 1024 1024"
                  // version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4301"
                  // width="32"
                  // height="32"
                >
                  <path
                    d="M474.697931 463.133036c52.537564-55.155181 119.125121-74.453712 197.466374-70.189595-1.747807-8.009418-1.814322-14.22191-4.389984-19.11843-12.712533-24.170492-22.698978-50.789757-39.787168-71.474868-102.242616-123.764791-308.057121-138.461515-427.463652-31.18935-61.691037 55.423287-87.38421 124.68986-69.739341 206.809159 11.298324 52.575426 43.588751 92.715635 85.609797 124.551714 13.697977 10.382465 15.916505 19.665899 10.030447 34.608216-7.30436 18.535145-12.809747 37.781488-19.0908 56.720839 17.596773-3.874237 31.816636-9.761318 44.911886-17.542538 30.707372-18.24555 61.189617-28.17162 98.18623-16.900925 22.337751 6.800893 47.565319 4.123924 74.762751 5.92085C405.477406 585.486688 421.574013 518.909363 474.697931 463.133036zM497.939261 319.220369c19.834744-0.284479 31.798217 10.92277 32.226982 30.178323 0.442068 19.85521-10.726296 31.997762-29.841655 32.44597-21.970384 0.51677-38.566364-12.741185-38.723953-30.930453C461.449185 333.410556 477.38411 319.510988 497.939261 319.220369zM309.594639 381.837498c-21.693068 0.073678-37.788651-13.573133-37.541011-31.828916 0.233314-17.353227 16.143679-30.628578 36.897352-30.79333 19.576871-0.150426 33.157167 13.06148 32.867572 31.983435C341.537142 369.591593 328.722278 381.778146 309.594639 381.837498z"
                    p-id="4302"
                  ></path>
                  <path
                    d="M835.363224 471.499587c-81.796958-78.773088-215.099986-91.444689-312.212768-29.66974-125.474736 79.81379-124.392078 243.768933 2.771113 320.735885 61.081147 36.97103 127.145795 47.321772 196.581214 28.592198 14.377452-3.879354 26.002211-2.758834 38.630832 5.067412 17.174148 10.645454 35.464723 19.495006 53.278437 29.115108 1.274016-0.950651 2.548032-1.901303 3.822049-2.852978-4.882194-17.019629-10.796904-33.842783-14.117532-51.16531-1.249457-6.507204 1.530866-15.896038 5.932106-20.968567 11.326976-13.038968 25.615401-23.515576 36.914748-36.58115C913.685034 636.613112 908.943033 542.366611 835.363224 471.499587zM589.682755 564.978609c-14.864546 0.228197-26.891464-11.264555-26.424836-25.248034 0.456395-13.707187 11.322883-23.429619 26.14752-23.38971 16.312524 0.041956 29.684066 11.452843 29.205159 24.921599C618.16239 553.809221 604.82257 564.746318 589.682755 564.978609zM737.859539 565.009308c-13.485129-0.203638-26.317389-11.747555-26.63359-23.958668-0.340761-13.07069 12.692067-24.846898 27.374464-24.735357 16.766872 0.12996 28.897144 11.084453 28.241204 25.499767C766.255263 554.683125 753.061776 565.241598 737.859539 565.009308z"
                    p-id="4303"
                  ></path>
                </svg>
                {/* <LinkedinIcon /> */}
              </Link>
            </li>
            {/* 小红书 */}
            {/* <li className="ml-4">
              <Link
                href="/"
                className="flex justify-center items-center text-blue-400 bg-gray-100 hover:text-blue-600 hover:bg-blue-200 rounded-full transition duration-150 ease-in-out"
                aria-label="Instagram"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M199.936 439.04H147.456c4.608 68.352-12.288 120.064-12.288 120.064l28.16 51.456c37.376-15.872 36.608-171.52 36.608-171.52m169.984 0H317.44s-0.768 155.648 36.352 171.52l28.16-51.456c0.256 0.256-16.64-51.712-12.032-120.064M232.96 595.712H199.936c0 38.656 32.512 41.984 32.512 41.984h16.64c33.536 0 34.816-38.4 34.816-38.4v-228.352H232.96v224.768z m176.128-109.568h34.048L417.28 539.392s-15.104 29.952 9.216 30.976h56.576l22.528-41.216h-28.416c-2.56 0-4.864-2.048-4.864-4.864 0-0.768 0.256-1.536 0.512-2.048l42.24-82.944H465.92l-2.816 5.888h-3.328c-2.56 0-4.864-2.048-4.864-4.864 0-0.768 0.256-1.536 0.512-2.048l35.328-67.328h-49.152l-41.984 84.48c0.512 0-14.592 29.696 9.472 30.72m7.68 100.608s-6.4 0.512-10.496-3.584l-25.344 48.896s4.096 5.632 12.8 5.632h62.976l26.88-50.944h-66.816z"
                    p-id="5506"
                  ></path>
                  <path
                    d="M606.976 439.04h32.512v-52.224h-115.968v52.224h32.768v149.248h-48.64l-24.32 49.152h172.8v-49.152h-49.152v-149.248z m232.192 38.656h-5.888v-33.792c0-31.488-25.6-57.088-57.088-57.088h-19.712v-15.872h-50.176v15.872h-31.488v51.2h31.488v39.68h-50.176v51.2h50.176v109.056h50.176v-108.8h68.864c6.656 0 12.288 5.376 12.288 12.288v53.76h-47.872c0 23.808 19.2 43.008 43.008 43.008h13.056c23.808 0 43.008-19.2 43.008-43.008v-67.584c-0.256-27.904-22.272-49.92-49.664-49.92M756.48 437.76h17.92c4.352 0 7.68 3.584 7.68 7.68v32h-25.856V437.76z"
                    p-id="5507"
                  ></path>
                  <path
                    d="M888.064 411.904c0-13.824-11.008-24.832-24.832-24.832-13.824 0-24.832 11.008-24.832 24.832v24.832h24.832c13.568 0 24.832-11.264 24.832-24.832"
                    p-id="5508"
                  ></path>
                </svg>
              </Link>
            </li> */}
          </ul>

          {/* Copyrights note */}
          <div className="text-gray-400 text-sm mr-4">
            <p>
              &copy;&nbsp;{new Date().getFullYear()}&nbsp; ©️&nbsp;All rights
              reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
