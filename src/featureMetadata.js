const siteUrl = 'https://tam.minorgroup.site';

export const featuresMetadata = {
  title: 'Travel Agency Management Features | TAM',
  description: 'Explore TAM features for travel agencies, including Umrah and Hajj packages, visa tracking, bookings, invoicing, team permissions, and reporting.',
  url: `${siteUrl}/features`,
};

export const homepageMetadata = {
  title: 'TAM – Travel Agency Management System | Umrah, Hajj & Visa SaaS Platform',
  description: 'TAM is a complete Travel Agency Management System designed for Umrah, Hajj, Visa & Ticketing businesses. Manage bookings, agents, payments & analytics in one powerful SaaS platform.',
  url: `${siteUrl}/`,
  socialTitle: 'TAM – Travel Agency Management System',
  socialDescription: 'Complete Travel Agency Management System for Umrah, Hajj & Visa Businesses',
};

export function headAttributes({ title, description, url, socialTitle = title, socialDescription = description }) {
  return [
    ['meta', 'name', 'title', 'content', title],
    ['meta', 'name', 'description', 'content', description],
    ['link', 'rel', 'canonical', 'href', url],
    ['meta', 'property', 'og:title', 'content', socialTitle],
    ['meta', 'property', 'og:description', 'content', socialDescription],
    ['meta', 'property', 'og:url', 'content', url],
    ['meta', 'name', 'twitter:title', 'content', socialTitle],
    ['meta', 'name', 'twitter:description', 'content', socialDescription],
    ['meta', 'name', 'twitter:url', 'content', url],
  ];
}
