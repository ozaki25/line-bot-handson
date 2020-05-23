module.exports = {
  title: 'LINE Bot Handson',
  themeConfig: {
    domain: 'https://line-bot-handson.ozaki25.now.sh',
    sidebar: ['/page1', 'page2', 'page3', 'page4', 'page5'],
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: {
    '@vuepress/medium-zoom': {},
    '@vuepress/back-to-top': {},
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: true,
    },
    seo: {},
  },
  head: [['link', { rel: 'manifest', href: '/manifest.json' }]],
};
