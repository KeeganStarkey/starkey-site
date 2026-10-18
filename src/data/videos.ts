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
    title: 'Showreel 2026', sub: 'Business · Events · Social · Documentary', cat: 'business', ratio: '16:9',
    local: 'hero-land', localPortrait: 'hero-port', duration: '2:14',
    description: 'Starkey Productions showreel: business films, event coverage, social content and documentaries.',
  },
  'longest-round': {
    title: 'The Longest Round', sub: 'Documentary teaser · DAZN', cat: 'documentary', ratio: '16:9',
    local: 'doc-longest', film: true, description: 'Documentary teaser for The Longest Round, filmed for DAZN.',
  },
  'eagle-creek-social': {
    title: 'Eagle Creek · Lisbon', sub: 'Social cut · Instagram', cat: 'social', ratio: '9:16',
    local: 'eagle-portrait', film: true, description: 'Vertical social cut filmed in Lisbon for Eagle Creek.',
  },
  'cargo-hauler': {
    title: 'Cargo Hauler XT', sub: 'Product film · Eagle Creek', cat: 'business', ratio: '16:9',
    local: 'cargo-hauler', film: true, description: 'Product film for the Eagle Creek Cargo Hauler XT.',
  },
  'coastal-resort': {
    title: 'Coastal resort', sub: 'Travel · drone film', cat: 'travel', ratio: '16:9',
    local: 'coast-resort', film: true, description: 'Drone film for a coastal resort.',
  },
  'festival-dj': {
    title: 'Festival DJ set', sub: 'Event · social cuts', cat: 'events', ratio: '9:16',
    local: 'festival-dj', film: true, description: 'Vertical event cut from a festival DJ set.',
  },
  'on-the-water': {
    title: 'On the water', sub: 'Travel · hospitality', cat: 'travel', ratio: '2.39:1',
    local: 'boat-crew', film: true, description: 'Hospitality film on the water.',
  },
  'morocco-aftermovie': {
    title: 'Morocco aftermovie', sub: 'Aftermovie · social cuts', cat: 'events', ratio: '16:9',
    local: 'morocco-wide', film: true, description: 'Event aftermovie filmed in Morocco.',
  },
  'morocco-vertical': { title: 'Morocco', sub: 'Vertical cut', cat: 'events', ratio: '9:16', local: 'morocco-a' },
  'morocco-vertical-2': { title: 'Morocco', sub: 'Vertical cut', cat: 'events', ratio: '9:16', local: 'morocco-b' },
  'events-reel': { title: 'Events reel', sub: 'Events · launches · sport', cat: 'events', ratio: '16:9', local: 'hc-wide', duration: '0:48' },
  'events-reel-scope': { title: 'Events reel', sub: 'Events · launches · sport', cat: 'events', ratio: '2.39:1', local: 'hc-239' },
  'highlights-reel': { title: 'Highlights reel', sub: 'Events · launches · sport', cat: 'events', ratio: '16:9', local: 'reel-wide' },
  'reel-a': { title: 'Reel', sub: 'Social', cat: 'social', ratio: '9:16', local: 'reel-a' },
  'reel-b': { title: 'Reel', sub: 'Social', cat: 'social', ratio: '9:16', local: 'reel-b' },
  'bts': { title: 'Behind the scenes', sub: 'Social', cat: 'social', ratio: '9:16', local: 'herqs' },
  'resort-aerial': { title: 'Resort aerial', sub: 'Website loop', cat: 'travel', ratio: '16:9', local: 'resort-aerial' },
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

export const ratioClass = (r: Video['ratio']) => (r === '9:16' ? 'r916' : r === '2.39:1' ? 'r239' : r === '1:1' ? 'r11' : '');

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
