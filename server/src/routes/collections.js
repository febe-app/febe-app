const _ = require('lodash');
const router = require('express').Router();
const { getCollectionRegistry } = require('../system/Collection.js');

const getRegistry = (req) => getCollectionRegistry(req.febe.pid);

router.get('/', async (req, res) => {
  const registry = getRegistry(req);
  // TODO: options
  const data = await registry.list();
  res.send(data);
});

router.report('/', async (req, res) => {
  const registry = getRegistry(req);
  // TODO: options
  const data = await registry.info();
  res.send(data);
});

router.delete('/', async (req, res) => {
  const registry = getRegistry(req);
  // TODO: options
  const count = await registry.truncate();
  res.send({ count });
});

router.get('/:id', async (req, res) => {
  const registry = getRegistry(req);
  const data = await registry.get(req.params.id);
  // TODO: 404
  res.send(data);
});

router.post('/:id', async (req, res) => {
  const registry = getRegistry(req);
  const options = req.body;
  // TODO: options
  // TODO: body validation
  const data = await registry.save(req.params.id, options);
  // TODO: 404
  res.send(data);
});

router.delete('/:id', async (req, res) => {
  const registry = getRegistry(req);
  const data = await registry.remove(req.params.id);
  // TODO: 404
  res.send(data);
});

const withCollection = async (req, res, next) => {
  const { pid, cid } = req.params;
  const registry = getRegistry(req);
  const collection = await registry.get(cid);
  if (!collection) {
    // TODO: mature error handling
    res.status(404).send({
      error: `Collection with name="${cid}"  in project="${pid}" not found`,
    });
  } else {
    const namespace = await registry.getCol(cid);
    let febe = req.febe;
    if (!febe) {
      febe = req.febe = {};
    }
    _.merge(febe, { cid, collection, namespace });
    next();
  }
};

module.exports = {
  router,
  withCollection,
};
