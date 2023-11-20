"use client";

import {useTranslations} from 'next-intl';
import {Link} from '@/navigation';
import { FileText, Scissors, RotateCw, Trash2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-2 rounded-lg shadow-lg shadow-red-500/30 mr-3 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 tracking-tight leading-none">PDF Master</span>
                <span className="text-[10px] font-medium text-red-500 uppercase tracking-wider">Professional Tools</span>
              </div>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {[
                { href: '/merge', icon: FileText, label: t('merge') },
                { href: '/split', icon: Scissors, label: t('split') },
                { href: '/rotate', icon: RotateCw, label: t('rotate') },
                { href: '/delete', icon: Trash2, label: t('delete') },
                { href: '/compress', icon: FileText, label: t('compress') },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-md hover:bg-red-50/50 transition-all duration-200 group"
                >
                  <item.icon className="w-4 h-4 mr-2 text-gray-400 group-hover:text-red-500 transition-colors" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-1 bg-gray-100/50 p-1 rounded-full border border-gray-200">
                <Link href="/" locale="tr" className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-white rounded-full transition-all shadow-sm hover:shadow" aria-label="Switch to Turkish">TR</Link>
                <Link href="/" locale="en" className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-white rounded-full transition-all shadow-sm hover:shadow" aria-label="Switch to English">EN</Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-5 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { href: '/merge', icon: FileText, label: t('merge') },
              { href: '/split', icon: Scissors, label: t('split') },
              { href: '/rotate', icon: RotateCw, label: t('rotate') },
              { href: '/delete', icon: Trash2, label: t('delete') },
              { href: '/compress', icon: FileText, label: t('compress') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-4 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <Link href="/" locale="tr" className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">Türkçe</Link>
              <Link href="/" locale="en" className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">English</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
