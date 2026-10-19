// Every piece of footage on the site, by key.
//
// `mux`   Mux playback ID. When set, the clip streams from Mux and its poster comes from Mux.
// `local` Stand-in file in /public/media (name without extension). Used until a Mux ID is set.
// `muxPortrait` / `localPortrait`  Optional vertical version used on phones held upright (hero only).
// `thumbTime` Second of the video to use for the poster frame (Mux only).
//
// Films (`film: true`) are portfolio projects: they appear on /work/ and open in the player.

export type Category = 'business' | 'events' | 'social' | 'documentary' | 'travel';

export interface Video {
  title: string;
  sub: string;
  cat: Category;
  ratio: '16:9' | '9:16' | '2.39:1' | '1:1';
  mux?: string;
  muxPortrait?: string;
  local?: string;
  localPortrait?: string;
  thumbTime?: number;
  duration?: string; // m:ss, shown on play buttons
  description?: string; // for search engines (VideoObject)
  uploadDate?: string; // YYYY-MM-DD, for search engines
  film?: boolean;
}

export const videos: Record<string, Video> = {
  showreel: {
    title: 'Starkey Productions', sub: 'Business · Events · Social · Documentary', cat: 'business', ratio: '16:9',
    mux: 'vExMuR0102ZieQrbHTLI9571J5aHhgMzbkgisZSiie6bc',
    description: 'Starkey Productions showreel: business films, event coverage, social content and documentaries.',
  },
  'business-main': {
    title: 'Losberger De Boer', sub: 'Brand film · Wrapped Up 26', cat: 'business', ratio: '16:9',
    mux: '4LQMEYECtb02KvSOTd1rLNBbEnDzac801QvMaWafluS01M', film: true,
    description: 'Brand film for Losberger De Boer: Wrapped Up 26.',
  },
  'mgm-grand': {
    title: 'ELAN Artist x MGM Grand', sub: 'Event film · The Grand', cat: 'events', ratio: '16:9',
    mux: 'QflHc1tEH01YCnz9AATWmP007MSpsLdlY27GacO01101zvE', film: true,
    description: 'Event film for ELAN Artist at MGM Grand: The Grand.',
  },
  'sidemen-charity': {
    title: 'Sidemen x Julia Charles', sub: 'Event film · Charity match', cat: 'events', ratio: '16:9',
    mux: 'RPPzOtlg5OUz2v5N6lu95Wb5lacexZABQswrnFNzfIA', film: true,
    description: 'Event film of the Sidemen x Julia Charles charity football match.',
  },
  'longest-round': {
    title: 'The Longest Round', sub: 'Documentary trailer · DAZN', cat: 'documentary', ratio: '16:9',
    mux: 'PXxbXXPqU2Sm7eXQvErwhrImBv1iJ02ETO5Cuf00FtSDw', film: true,
    description: 'Documentary trailer for The Longest Round, filmed for DAZN.',
  },
  'eagle-creek-social': {
    title: 'Eagle Creek · Lisbon', sub: 'Social edit · Instagram', cat: 'social', ratio: '9:16',
    mux: 'jgnFZNUQ6zSebd1jlBR1tZ9zEOEnhOaFXrgTjpb78mc', film: true,
    description: 'Vertical social edit filmed in Lisbon for Eagle Creek.',
  },
  'eagle-creek-cargo': {
    title: 'Eagle Creek · Cargo Hauler', sub: 'Product film · Social', cat: 'business', ratio: '9:16',
    mux: 'mHHfGFWOtDj00FOXXoQvFwPmg8FVrxhH7ZSyZF6OyYGw', film: true,
    description: 'Vertical product film for the Eagle Creek Cargo Hauler.',
  },
  'festival-a': {
    title: 'UK festival', sub: 'Social clip · Event', cat: 'events', ratio: '9:16',
    mux: 'i2JuUZf8W1dezkz2ig8BL6pKD58keObthrB500x01E5GA', film: true,
    description: 'Vertical social clip filmed at a UK festival.',
  },
  'festival-b': {
    title: 'UK festival', sub: 'Social clip · Event', cat: 'events', ratio: '9:16',
    mux: 'r9xAiyIqBXHzhj84MEgSpuiG7sTyVRBcUTBaWQ5W7WM',
    description: 'Vertical social clip filmed at a UK festival.',
  },
  'just-eat-longest-round': {
    title: 'Just Eat x The Longest Round', sub: 'Social cut · Documentary', cat: 'social', ratio: '9:16',
    mux: '2NzL2q00Rk7XpAkNvU8653oZ02Gz00clJXXo5mGK49dqps', film: true,
    description: 'Vertical social cut from The Longest Round, in partnership with Just Eat.',
  },
  'securitas': {
    title: 'Securitas Risk Intelligence', sub: 'Corporate film', cat: 'business', ratio: '16:9',
    mux: 'nClPA00H02WyjimMSHYL7l5iQ3a7dxRvVPHv00gNUi21kk', film: true,
    description: 'Corporate film for Securitas Risk Intelligence.',
  },
  'surf-yoga-morocco': {
    title: 'Surf Yoga Beer · Morocco', sub: 'Event reel', cat: 'events', ratio: '9:16',
    mux: 'eaAYIIy7J6AXBkrEhDWt02JOt9lKjiGoUYHq8OwOJXEs', film: true,
    description: 'Vertical event reel filmed in Morocco for Surf Yoga Beer.',
  },
  'banks-boxing': {
    title: 'Banks Boxing', sub: 'Social reel', cat: 'social', ratio: '9:16',
    mux: 'UFqkbzkJHfBFuv9zCjrj801akU00MMHzTNb1DaACvR3NM', film: true,
    description: 'Vertical social reel for Banks Boxing.',
  },
  'herqs-1': {
    title: "Herq's", sub: 'Social clip', cat: 'social', ratio: '9:16',
    mux: 'wlWslcfAIR8sANvO4GcV01isnHHg401rbSwyU5MOMqP3U', film: true,
    description: "Vertical social clip for Herq's.",
  },
  'herqs-2': {
    title: "Herq's", sub: 'Social clip', cat: 'social', ratio: '9:16',
    mux: 'rREXe1LuYs9OtdCOG7o9K3W6C02HSep01N00izNBixgHSs',
    description: "Vertical social clip for Herq's.",
  },
  'gravity-co': {
    title: 'Gravity Co', sub: 'Social clip', cat: 'social', ratio: '9:16',
    mux: 'CQjcCwfirFScC45cmDNNcTz1wP7artJnVLlGkZzyF3M', film: true,
    description: 'Vertical social clip for Gravity Co.',
  },
  'beach': { title: 'Beach', sub: 'Loop', cat: 'travel', ratio: '16:9', local: 'beach' },
};

const muxPoster = (id: string, t = 1, w = 1600) =>
  `https://image.mux.com/${id}/thumbnail.webp?width=${w}&time=${t}`;

export function poster(key: string, portrait = false): string {
  const v = videos[key];
  if (!v) throw new Error(`Unknown video key: ${key}`);
  if (portrait && v.muxPortrait) return muxPoster(v.muxPortrait, v.thumbTime);
  if (portrait && !v.mux && v.localPortrait) return `/media/${v.localPortrait}.jpg`;
  if (v.mux) return muxPoster(v.mux, v.thumbTime);
  return `/media/${v.local}.jpg`;
}

/** Data attributes the footage script reads to pick a source. */
export function sourceAttrs(key: string) {
  const v = videos[key];
  if (!v) throw new Error(`Unknown video key: ${key}`);
  return {
    'data-key': key,
    'data-mux': v.mux || undefined,
    'data-src': v.mux ? undefined : `/media/${v.local}.mp4`,
    'data-mux-portrait': v.muxPortrait || undefined,
    'data-src-portrait': !v.mux && v.localPortrait ? `/media/${v.localPortrait}.mp4` : undefined,
    'data-poster-portrait': v.muxPortrait || v.localPortrait ? poster(key, true) : undefined,
  };
}

export const films = Object.entries(videos).filter(([, v]) => v.film).map(([key, v]) => ({ key, ...v }));

export const ratioClass = (r: Video['ratio']) => (r === '9:16' ? 'r916' : r === '2.39:1' ? 'r239' : r === '1:1' ? 'r11' : 'r169');

/** Attributes for any element that opens the film player. */
export function playAttrs(key: string) {
  const v = videos[key];
  if (!v) throw new Error(`Unknown video key: ${key}`);
  return {
    'data-play': '',
    'data-title': v.title,
    'data-sub': v.sub,
    'data-poster': poster(key),
    'data-mux': v.mux || undefined,
    'data-src': v.mux ? undefined : `/media/${v.local}.mp4`,
  };
}

/** Attributes for an element that swaps a background loop to this clip on hover. */
export function swapAttrs(key: string) {
  return { ...sourceAttrs(key), 'data-poster': poster(key) };
}
