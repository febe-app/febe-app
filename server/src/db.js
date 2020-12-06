var levelup = require('levelup');
var leveldown = require('leveldown');

// 1) Create our store

const CACHE = {};

const getDb = (ctx, namespace) => {
  const { realm } = ctx;
  const dbFilePath = `./data/${realm}/${namespace}`;
  if (!CACHE[dbFilePath]) {
    CACHE[dbFilePath] = levelup(leveldown(dbFilePath));
  }
  return CACHE[dbFilePath];
};

const collectionsDb = getDb({ realm: 'system' }, 'collections');

module.exports = {
  collectionsDb,
  getDb,
};
