'use client'

import { memo } from 'react'
import Image from 'next/image'

function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0">
                <Image
                  src="/images/logo codervex pronto.png"
                  alt="Codervex Logo"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 48px, (max-width: 1024px) 56px, 64px"
                />
              </div>
              <span className="text-lg md:text-xl font-bold text-white">Codervex</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Codervex transforms web projects into AI-ready instructions.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Demo</li>
              <li className="text-gray-400">Pricing</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Privacy</li>
              <li className="text-gray-400">Terms</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} Codervex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)

