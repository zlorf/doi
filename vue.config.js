module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  publicPath: process.env.NODE_ENV === 'production'? '/doi/' : '/',
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'doi2better',
    },
  },
};
