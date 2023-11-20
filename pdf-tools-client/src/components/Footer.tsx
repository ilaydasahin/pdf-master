import {useTranslations} from 'next-intl';


import { Link } from '@/navigation';
import { Github, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Common');

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-white tracking-tight">PDF Master</span>
            <p className="mt-4 text-slate-400 text-sm">
              {t('footerDesc') || 'Professional PDF tools for everyone. Fast, secure, and free.'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/merge" className="text-slate-400 hover:text-white transition-colors text-sm">Merge PDF</Link></li>
              <li><Link href="/split" className="text-slate-400 hover:text-white transition-colors text-sm">Split PDF</Link></li>
              <li><Link href="/compress" className="text-slate-400 hover:text-white transition-colors text-sm">Compress PDF</Link></li>
              <li><Link href="/convert" className="text-slate-400 hover:text-white transition-colors text-sm">Convert PDF</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} PDF Master. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
             <p className="text-sm text-slate-600">
              Built with Next.js & .NET Core
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
