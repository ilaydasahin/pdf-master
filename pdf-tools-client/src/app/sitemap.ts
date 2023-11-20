import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

const locales = ['tr', 'en'];
const pathnames = [
  '/',
  '/merge',
  '/split',
  '/compress',
  '/office-to-pdf',
  '/jpg-to-pdf',
  '/pdf-to-jpg',
  '/edit-pdf',
  '/watermark',
  '/rotate',
  '/unlock',
  '/protect',
  '/delete',
  '/page-number',
  '/ocr',
  '/html-to-pdf',
  '/pdf-to-pdfa',
  '/repair',
  '/compare',
  '/redact',
  '/crop',
  '/workflows',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  pathnames.forEach((pathname) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${siteConfig.url}/${locale}${pathname === '/' ? '' : pathname}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: pathname === '/' ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}
