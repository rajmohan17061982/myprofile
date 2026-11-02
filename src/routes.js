const express = require('express');

function createRouter(portfolio) {
  const router = express.Router();
  const pageSlugs = ['about', 'cad-development', '3dexperience-plm', 'ai-innovation', 'software-projects', 'achievements', 'resume', 'contact'];

  router.get('/', (req, res) => res.render('home', {
    title: 'CAD & PLM Solution Architect', description: portfolio.profile.summary,
    projects: portfolio.projects.filter(project => project.featured), skills: portfolio.profile.homeSkills
  }));
  router.get('/projects', (req, res) => res.render('projects', {
    title: 'Selected projects', description: 'Engineering software, CAD automation and enterprise integration projects.', projects: portfolio.projects
  }));
  router.get('/projects/:slug', (req, res, next) => {
    const project = portfolio.projects.find(item => item.slug === req.params.slug);
    if (!project) return next();
    res.render('project', { title: project.title, description: project.summary, project });
  });
  pageSlugs.forEach(slug => router.get(`/${slug}`, (req, res) => {
    const page = portfolio.pages[slug];
    res.render('page', { title: page.title, description: page.description, page, slug });
  }));
  router.get('/interview', (req, res) => res.render('interview', {
    title: 'Interview presentation', description: 'A focused presentation of engineering experience and selected projects.', projects: portfolio.projects, profile: portfolio.profile
  }));
  router.get('/resume.pdf', (req, res) => res.status(404).render('resume-missing', { title: 'Resume PDF not available' }));
  return router;
}

module.exports = { createRouter };
