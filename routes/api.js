const express = require('express');
const router = express.Router();
const cmd = require('../services/commands');

function json(res, data, status = 200) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(status).json(data);
}

function error(res, msg, status = 400) {
  json(res, { error: true, message: msg }, status);
}

router.get('/', (req, res) => {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) {
    return res.render('api', {
      title: 'API | MCCommands',
      layout: 'layouts/main',
      siteName: req.app.locals.siteName,
      companyName: req.app.locals.companyName,
      companyUrl: req.app.locals.companyUrl,
      githubUrl: req.app.locals.githubUrl,
      appUrl: process.env.APP_URL || 'https://commands.logicbyte.org'
    });
  }
  json(res, {
    message: 'MCCommands API - use /api/versions as the root endpoint',
    endpoints: {
      'GET /api/versions': 'List all versions (?era=alpha|beta|release)',
      'GET /api/versions/:version': 'Get version with commands',
      'GET /api/commands': 'List all commands (?search=query)',
      'GET /api/commands/:command': 'Get command details',
      'GET /api/gamerules': 'List all gamerules',
      'GET /api/stats': 'Database statistics'
    }
  });
});

router.get('/versions', (req, res) => {
  const { era } = req.query;
  const versions = cmd.getVersions(era || null);
  json(res, {
    count: versions.length,
    versions: versions.map(v => ({
      version: v.version,
      type: v.type,
      commandCount: v.commandCount,
      notes: v.notes
    }))
  });
});

router.get('/versions/:version', (req, res) => {
  const data = cmd.getVersion(req.params.version);
  if (!data) return error(res, `Version '${req.params.version}' not found`, 404);
  json(res, data);
});

router.get('/commands', (req, res) => {
  const { search } = req.query;
  let commands;
  if (search) {
    commands = cmd.searchCommands(search);
  } else {
    commands = cmd.getAllUniqueCommands();
  }
  json(res, {
    count: commands.length,
    commands: commands.map(c => ({
      name: c.name,
      description: c.description,
      introduced: c.introduced,
      removed: c.removed,
      permission_level: c.permission_level,
      aliases: c.aliases,
      syntax: c.syntax,
      examples: c.examples,
      gamerules: c.gamerules,
      available_in: c.available_in
    }))
  });
});

router.get('/commands/:command', (req, res) => {
  const command = cmd.getCommand(req.params.command);
  if (!command) return error(res, `Command '${req.params.command}' not found`, 404);
  json(res, command);
});

router.get('/gamerules', (req, res) => {
  const rules = cmd.getGamerules();
  json(res, { count: rules.length, gamerules: rules });
});

router.get('/stats', (req, res) => {
  json(res, cmd.getStats());
});

router.all('*', (req, res) => {
  json(res, {
    name: 'MCCommands API',
    version: '1.0.0',
    description: 'Minecraft command list API for every version',
    endpoints: {
      'GET /api/versions': 'List all versions (optional ?era=alpha|beta|release)',
      'GET /api/versions/:version': 'Get a specific version with its commands',
      'GET /api/commands': 'List all unique commands (?search=query to filter)',
      'GET /api/commands/:command': 'Get details for a specific command',
      'GET /api/gamerules': 'List all gamerules',
      'GET /api/stats': 'Database statistics'
    }
  });
});

module.exports = router;
