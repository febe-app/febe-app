const axios = require('axios');
const _ = require('lodash');

const DEFAULT_HOST = 'http://159.203.147.100';
const BASEURL = 'api/v1';

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const r = (url, method = GET, data) =>
  axios({ url, method, data })
    .then(({ data }) => data)
    .catch((err) => console.error(err, { url, method }));

const asCRUD = (url) => {
  const u = (id) => `${url}/${id}`;
  return {
    list: () => r(url),
    get: (id) => r(u(id)),
    create: (model) => r(url, POST, model),
    update: (id, model) => r(u(id), PUT, model),
    remove: (id) => r(u(id), DELETE),
  };
};

const asKV = (url) => {
  const u = (id) => `${url}/${id}`;
  return {
    list: () => r(url),
    get: (id) => r(u(id)),
    upsert: (id, model) => r(u(id), POST, model),
    remove: (id) => r(u(id), DELETE),
  };
};

const asProjects = (host) => asCRUD(`${host}/${BASEURL}/projects`);
const asProject = (host) => (projectId) => ({
  collections: asKV(`${host}/${BASEURL}/p/${projectId}/collections`),
});
const asCollection = (host, pid) => (cid) =>
  asKV(`${host}/${BASEURL}/p/${pid}/data/${cid}`);

class FeBe {
  constructor({ host = DEFAULT_HOST, projectId }) {
    this.host = host;
    const project = asProject(host)(projectId);
    this.collections = project.collections;
    this.collection = asCollection(host, projectId);
  }
}

class FeBeAdmin {
  constructor({ host }) {
    this.host = host;
    this.projects = asProjects(host);
    this.project = asProject(host);
  }
}

module.exports = {
  FeBe,
  FeBeAdmin,
};
