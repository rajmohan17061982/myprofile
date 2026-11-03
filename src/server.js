const path = require('node:path');
const express = require('express');
const { loadPortfolio } = require('./data');
const { createRouter } = require('./routes');

const app = express();
const portfolio = loadPortfolio();
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.siteName = portfolio.profile.name;
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h' }));
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.profile = portfolio.profile;
  res.locals.year = new Date().getFullYear();
  next();
});
app.use(createRouter(portfolio));
app.use((req, res) => res.status(404).render('404', { title: 'Page not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: 'Something went wrong' });
});

if (require.main === module) {
  const { SSL_KEY_FILE, SSL_CERT_FILE } = process.env;
  if (SSL_KEY_FILE && SSL_CERT_FILE) {
    const https = require('node:https');
    const fs = require('node:fs');
    const options = { key: fs.readFileSync(SSL_KEY_FILE), cert: fs.readFileSync(SSL_CERT_FILE) };
    https.createServer(options, app).listen(port, () => console.log(`Portfolio available at https://localhost:${port}`));
  } else {
    app.listen(port, () => console.log(`Portfolio available at http://localhost:${port}`));
  }
}

module.exports = app;
