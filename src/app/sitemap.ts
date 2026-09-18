import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aiml-club.university.edu';

  const routes = [
    '',
    '/ai-lab',
    '/projects',
    '/events',
    '/research',
    '/team',
    '/join',
    '/contact',
    '/admin'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : route === '/ai-lab' ? 0.9 : 0.8,
  }));
}
