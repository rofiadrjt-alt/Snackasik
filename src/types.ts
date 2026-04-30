export interface SiteSettings {
  headline: string;
  description: string;
  heroImage: string;
  processImage?: string;
  processHeadline?: string;
  processDescription?: string;
  processBadge?: string;
  featuresHeadline?: string;
  featuresDescription?: string;
  whatsappNumber: string;
  shopeeLink?: string;
  tokopediaLink?: string;
  location?: string;
  instagramLink?: string;
  tiktokLink?: string;
  faviconUrl?: string;
  facebookLink?: string;
  youtubeLink?: string;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  headScripts?: string;
  bodyScripts?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  weight?: string;
  order: number;
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  role?: string;
  avatarUrl?: string;
  order: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  published: boolean;
  createdAt: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}
