const { nanoid } = require('nanoid');
const _ = require('lodash');
const { projectsDb } = require('../db.js');
const { Collection } = require('./Collection.js');

class ProjectRegistry {
  constructor(db = projectsDb) {
    this.col = new Collection(db);
    this.cols = {};
  }
  info() {
    return this.col.info();
  }
  list() {
    return this.col.list();
  }
  get(projectId) {
    return this.col.get(projectId);
  }
  create(options) {
    const projectId = nanoid(8);
    return this.col.put(projectId, { projectId, options });
  }
  async update(projectId, options) {
    const curr = await this.col.get(projectId);
    if (!curr) {
      throw new Error(`Project with id ${projectId} not found.`);
    }
    options = _.merge({}, curr.value.options, options);
    return await this.col.put(projectId, { projectId, options });
  }
  remove(projectId) {
    return this.col.remove(projectId);
  }
  truncate() {
    return this.col.truncate();
  }
}

module.exports = {
  ProjectRegistry,
  projectRegistry: new ProjectRegistry(),
};
