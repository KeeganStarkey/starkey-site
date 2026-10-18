// Business details used across the site. Edit here, not in the pages.

export const site = {
  name: 'Starkey Productions',
  url: 'https://www.keeganstarkey.com',
  owner: 'Keegan Starkey',
  town: 'Milton Keynes',
  region: 'Buckinghamshire',
  country: 'GB',
  email: 'kstarkeyproductions@gmail.com',
  // International format without + or spaces, for wa.me links.
  whatsapp: '447816516875',
  phoneDisplay: '07816 516875',
  replyTime: 'one working day',
};

export const whatsappLink = (text = "Hi Keegan, I'd like to talk about a video project.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailLink = (subject = 'Video enquiry') =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

// Only profiles with a URL are shown.
export const socials: { name: string; url: string }[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/keeganstarkey/' },
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCWcQnYGGVynDveQ7czSiLyw' },
  { name: 'LinkedIn', url: '' },
  { name: 'Vimeo', url: '' },
];

// "Trusted by" row. Names only until logo files arrive (set `logo` to a file in /public/logos).
export const clients: { name: string; logo?: string }[] = [
  { name: 'Sky Sports News' },
  { name: 'DAZN' },
  { name: 'Just Eat' },
  { name: 'Pressbox PR' },
  { name: 'Gravity Co' },
  { name: 'Spinks Creative' },
  { name: 'Pretty Sailing' },
];

// Homepage quote. Leave `text` empty to hide the section.
export const testimonial = {
  text: '',
  name: '',
  role: '',
};

export const sisterBrands = [
  { id: 'bag', name: 'Bad At Golf', tag: 'Golf content and coaching films.', url: '' },
  { id: 'wd', name: 'Wedding Diaries', tag: 'Documentary-style wedding films.', url: '' },
];

export const nav = [
  { label: 'Work', href: '/work/', key: 'work' },
  { label: 'Services', href: '/services/', key: 'services' },
  { label: 'Retainers', href: '/retainers/', key: 'retainers' },
  { label: 'About', href: '/about/', key: 'about' },
];

export const towns = ['Milton Keynes', 'Bedford', 'Northampton', 'Luton', 'Aylesbury', 'Buckingham', 'Oxford', 'Cambridge', 'Leicester', 'Reading', 'London', 'Birmingham'];
