const fs = require('fs');
const path = require('path');
const levelup = require('levelup');
const leveldown = require('leveldown');

const CACHE = {};

const DATA_PATH = process.env.DATA_PATH || `data`;

const getDb = (ctx, namespace) => {
  const { realm, projectId } = ctx;
  console.log('Fetching DB for', { realm, projectId, namespace });

  const dbFilePath = !!projectId
    ? path.join(DATA_PATH, realm, projectId, namespace)
    : path.join(DATA_PATH, realm, namespace);
  if (!CACHE[dbFilePath]) {
    if (!fs.existsSync(dbFilePath)) {
      const parentFilePath = !!projectId
        ? path.join(DATA_PATH, realm, projectId)
        : path.join(DATA_PATH, realm);
      fs.mkdirSync(parentFilePath, { recursive: true });
    }
    CACHE[dbFilePath] = levelup(leveldown(dbFilePath));
  }
  return CACHE[dbFilePath];
};

const REALM_SYSTEM = 'system';
const REALM_APP = 'app';
const REALM_COLLECTIONS = 'colByPrj';
const getDataDb = (projectId, namespace) =>
  getDb({ realm: REALM_APP, projectId }, namespace);
const getCollectionsDb = (projectId) =>
  getDb({ realm: REALM_COLLECTIONS }, projectId);

const collectionsDb = getDb({ realm: REALM_SYSTEM }, 'collections');
const projectsDb = getDb({ realm: REALM_SYSTEM }, 'projects');

module.exports = {
  collectionsDb,
  projectsDb,
  getDb,
  getDataDb,
  getCollectionsDb,
};
