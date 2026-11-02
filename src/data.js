const fs = require('node:fs');
const path = require('node:path');

function readJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'content', filename), 'utf8'));
}

function loadPortfolio() {
  const media = readJson('media.json');
  const projects = readJson('projects.json')
    .filter(project => project.slug !== 'ai-knowledge-retrieval')
    .map(project => ({ ...project, videos: media[project.slug] || [] }));
  return { profile: readJson('profile.json'), projects, pages: readJson('pages.json') };
}

module.exports = { loadPortfolio };
