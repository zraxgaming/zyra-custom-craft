const fs = require('fs');
const path = require('path');

// List of static routes
const staticRoutes = [
  '/',
  '/shop',
  '/cart',
  '/checkout',
  '/contact',
  '/wishlist',
  '/auth',
  '/categories',
  '/products',
  '/about',
  '/404',
  '/profile',
  '/giftcards',
  '/privacy',
  '/newsletter',
  '/notfound',
  '/home',
  '/register',
  '/faq',
  '/account',
  '/privacypolicy',
  '/termsofservice',
  '/accountsettings',
  '/orderconfirmation',
  '/categorypage',
  // Add more static routes as needed
];

const baseUrl = 'https://shopzyra.vercel.app';

function generateSitemap() {
  const urls = staticRoutes.map(route => `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <priority>0.5</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const sitemap = generateSitemap();
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);
console.log('Sitemap generated at', sitemapPath);
