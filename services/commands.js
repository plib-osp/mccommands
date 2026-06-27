const fs = require('fs');
const path = require('path');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');
const MASTER_PATH = path.join(COMMANDS_DIR, '_master_commands.json');

const cache = { master: null, versions: null, allCommands: null, stats: null };

function loadMaster() {
  if (cache.master) return cache.master;
  const raw = fs.readFileSync(MASTER_PATH, 'utf-8');
  cache.master = JSON.parse(raw);
  return cache.master;
}

function loadAllVersions() {
  if (cache.versions) return cache.versions;
  const versions = [];
  const dirs = ['alpha', 'beta', 'release'];
  for (const dir of dirs) {
    const dirPath = path.join(COMMANDS_DIR, dir);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dirPath, file), 'utf-8');
      const data = JSON.parse(raw);
      versions.push({
        version: data.version,
        type: data.type,
        fileName: file.replace('.json', ''),
        commandCount: data.commands.length,
        notes: data.notes || '',
        commands: data.commands.map(c => c.name)
      });
    }
  }
  cache.versions = versions;
  return versions;
}

function getVersions(era) {
  const all = loadAllVersions();
  if (era) return all.filter(v => v.type === era);
  return all;
}

function getVersion(versionId) {
  const dirs = ['alpha', 'beta', 'release'];
  for (const dir of dirs) {
    const dirPath = path.join(COMMANDS_DIR, dir);
    const filePath = path.join(dirPath, `${versionId}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  }
  return null;
}

function getVersionMeta(versionId) {
  const all = loadAllVersions();
  return all.find(v => v.fileName === versionId) || null;
}

function getAllUniqueCommands() {
  if (cache.allCommands) return cache.allCommands;
  const master = loadMaster();
  const versions = loadAllVersions();

  const result = [];
  for (const [name, def] of Object.entries(master)) {
    const availableIn = versions.filter(v =>
      v.commands.includes(name)
    ).map(v => ({
      version: v.version,
      type: v.type,
      fileName: v.fileName
    }));

    result.push({
      name: def.name,
      description: def.description,
      introduced: def.introduced,
      removed: def.removed,
      permission_level: def.permission_level,
      multiplayer_only: def.multiplayer_only,
      aliases: def.aliases || [],
      syntax: def.syntax,
      examples: def.examples,
      gamerules: def.gamerules || [],
      available_in: availableIn
    });
  }
  cache.allCommands = result;
  return result;
}

function getCommand(cmdName) {
  const all = getAllUniqueCommands();
  return all.find(c => c.name === cmdName.toLowerCase()) || null;
}

function searchCommands(query) {
  const q = query.toLowerCase();
  const all = getAllUniqueCommands();
  return all.filter(c =>
    c.name.includes(q) ||
    c.description.toLowerCase().includes(q) ||
    (c.aliases || []).some(a => a.includes(q)) ||
    (c.syntax || []).some(s => s.pattern.toLowerCase().includes(q))
  );
}

function getGamerules() {
  const cmd = getCommand('gamerule');
  return cmd ? cmd.gamerules : [];
}

function getStats() {
  if (cache.stats) return cache.stats;
  const versions = loadAllVersions();
  const commands = getAllUniqueCommands();

  cache.stats = {
    total_versions: versions.length,
    total_commands: commands.length,
    eras: {
      alpha: versions.filter(v => v.type === 'alpha').length,
      beta: versions.filter(v => v.type === 'beta').length,
      release: versions.filter(v => v.type === 'release').length
    },
    multiplayer_only: commands.filter(c => c.multiplayer_only).length,
    gamerules_total: getGamerules().length
  };
  return cache.stats;
}

function invalidateCache() {
  cache.master = null;
  cache.versions = null;
  cache.allCommands = null;
  cache.stats = null;
}

module.exports = {
  getVersions,
  getVersion,
  getVersionMeta,
  getAllUniqueCommands,
  getCommand,
  searchCommands,
  getGamerules,
  getStats,
  invalidateCache
};
