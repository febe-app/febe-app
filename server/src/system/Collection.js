const _ = require('lodash');
const { getDb, getCollectionsDb } = require('../db.js');

const to = (key, value) => {
  const row = { key, value, updatedAt: Date.now() };
  const binRow = Buffer.from(JSON.stringify(row));
  return { row, binRow };
};

const from = (data) => {
  if (!!data) {
    try {
      return JSON.parse(data.toString('utf8'));
    } catch (err) {
      return data.toString();
    }
  }
  return null;
};

class Collection {
  constructor(db) {
    this.db = db;
  }
  /**
   * See https://www.npmjs.com/package/levelup#dbcreatereadstreamoptions
   * @param {*} options
   */
  count(options) {
    return new Promise((res, rej) => {
      let count = 0;
      this.db
        .createKeyStream(options)
        .on('data', () => count++)
        .on('error', (err) => {
          console.error(err);
          rej(err);
        })
        .on('close', () => {
          // console.log('Stream closed');
        })
        .on('end', () => {
          //   console.log('Stream ended');
          res(count);
        });
    });
  }
  async info() {
    const count = await this.count();
    let first = null;
    let last = null;
    if (count > 0) {
      first = (await this.list({ limit: 1 }))[0];
      last = (await this.list({ limit: 1, reverse: true }))[0];
      if (first.key === last.key) {
        last = null;
      }
    }
    return {
      count,
      first,
      last,
    };
  }
  async put(key, value, ctx) {
    // TODO: updated by...
    const { row, binRow } = to(key, value);
    await this.db.put(key, binRow);
    return row;
  }
  async get(key) {
    try {
      const data = await this.db.get(key);
      return from(data);
    } catch (error) {
      console.error(error);
    }
    return { key, value: null };
  }
  /**
   * See https://www.npmjs.com/package/levelup#dbcreatereadstreamoptions
   * @param {*} options
   */
  list(options = {}) {
    options.keys = false;
    return new Promise((res, rej) => {
      let rows = [];
      this.db
        .createReadStream(options)
        .on('data', (data) => {
          //   console.log({ data });
          rows.push(from(data));
        })
        .on('error', (err) => {
          console.error(err);
          rej(err);
        })
        .on('close', () => {
          //   console.log('Stream closed');
        })
        .on('end', () => {
          //   console.log('Stream ended');
          res(rows);
        });
    });
  }
  async remove(key) {
    const curr = await this.get(key);
    if (!!curr) {
      await this.db.del(key);
    }
    return curr;
  }
  async truncate() {
    const count = await this.count();
    await this.db.clear();
    return count;
  }
}

class CollectionRegistry {
  constructor(projectId, db) {
    this.projectId = projectId;
    this.col = new Collection(db);
    this.ctx = { realm: 'app', projectId };
    this.cols = {};
  }
  count() {
    return this.col.count();
  }
  info() {
    return this.col.info();
  }
  list() {
    return this.col.list();
  }
  get(namespace) {
    return this.col.get(namespace);
  }
  async getCol(namespace) {
    if (!this.cols[namespace]) {
      const ns = await this.get(namespace);
      if (!!ns) {
        this.cols[namespace] = new Collection(getDb(this.ctx, namespace));
      }
    }
    return this.cols[namespace];
  }
  save(namespace, options) {
    return this.col.put(namespace, {
      projectId: this.projectId,
      namespace,
      options,
    });
  }
  remove(namespace) {
    delete this.cols[namespace];
    return this.col.remove(namespace);
  }
  truncate() {
    return this.col.truncate();
  }
}
const getCollectionRegistry = (projectId) =>
  new CollectionRegistry(projectId, getCollectionsDb(projectId));

module.exports = {
  Collection,
  CollectionRegistry,
  getCollectionRegistry,
};
