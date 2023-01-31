/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  siteUrl: 'https://app.storystarters.co',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', disallow: '/' }],
  },
};
