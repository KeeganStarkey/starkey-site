import { site, socials } from '../data/site';
import { videos, poster } from '../data/videos';

const abs = (p: string) => (p.startsWith('http') ? p : site.url + p);
const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();

export const areaServed = [
  ...['Milton Keynes', 'Bedford', 'Northampton', 'Luton', 'Aylesbury', 'Buckingham'].map((name) => ({ '@type': 'City', name })),
  { '@type': 'Country', name: 'United Kingdom' },
];

export const business = {
  '@type': 'ProfessionalService',
  '@id': site.url + '/#business',
  name: site.name,
  url: site.url + '/',
  image: site.url + '/og.png',
  logo: site.url + '/icon-512.png',
  description: 'Video production company in Milton Keynes: corporate and promotional videos, event videography, monthly social media content and brand documentaries.',
  email: site.email,
  telephone: '+' + site.whatsapp,
  founder: { '@type': 'Person', name: site.owner },
  address: { '@type': 'PostalAddress', addressLocality: site.town, addressRegion: site.region, addressCountry: site.country },
  areaServed,
  sameAs: socials.filter((s) => s.url).map((s) => s.url),
};

export const website = {
  '@type': 'WebSite',
  '@id': site.url + '/#website',
  url: site.url + '/',
  name: site.name,
  publisher: { '@id': site.url + '/#business' },
};

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path),
    })),
  };
}

export function faq(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
  };
}

export function service(o: { name: string; serviceType: string; description: string; path: string; offers?: string[] }) {
  return {
    '@type': 'Service',
    name: o.name,
    serviceType: o.serviceType,
    description: o.description,
    url: abs(o.path),
    provider: { '@id': site.url + '/#business' },
    areaServed,
    ...(o.offers ? {
      hasOfferCatalog: { '@type': 'OfferCatalog', name: o.name, itemListElement: o.offers.map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })) },
    } : {}),
  };
}

/** VideoObject for films hosted on Mux. Stand-in local clips are skipped. */
export function videoObjects(keys: string[]) {
  return keys.flatMap((k) => {
    const v = videos[k];
    if (!v?.mux) return [];
    return [{
      '@type': 'VideoObject',
      name: v.title,
      description: v.description || `${v.title}: ${v.sub}`,
      thumbnailUrl: poster(k),
      uploadDate: v.uploadDate || '2026-10-18',
      contentUrl: `https://stream.mux.com/${v.mux}.m3u8`,
      ...(v.duration ? { duration: 'PT' + v.duration.replace(':', 'M') + 'S' } : {}),
      publisher: { '@id': site.url + '/#business' },
    }];
  });
}
