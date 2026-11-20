// Ergänzt app.json. Auf GitHub Pages läuft die App unter /Rally/, lokal unter /.
// Der Deploy-Workflow setzt deshalb EXPO_BASE_URL=/Rally, lokal bleibt die Variable leer.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    baseUrl: process.env.EXPO_BASE_URL ?? '',
  },
});
