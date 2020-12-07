const router = require('express').Router();
const { collectionRegistry } = require('../system/Collection.js');

router.get('/', async (req, res) => {
  const registry = req.febe.namespace;
  const data = await registry.list();
  res.send(data);
});

router.report('/', async (req, res) => {
  const registry = req.febe.namespace;
  const data = await registry.info();
  res.send(data);
});

router.delete('/', async (req, res) => {
  const registry = req.febe.namespace;
  const count = await registry.truncate();
  res.send({ count });
});

router.get('/:key', async (req, res) => {
  const registry = req.febe.namespace;
  const { key } = req.params;
  const data = await registry.get(key);
  // TODO: 404
  res.send(data);
});

router.post('/:key', async (req, res) => {
  const registry = req.febe.namespace;
  const value = req.body;
  const { key } = req.params;
  // TODO: options
  // TODO: body validation
  const data = await registry.put(key, value);
  // TODO: 404
  res.send(data);
});

router.delete('/:key', async (req, res) => {
  const registry = req.febe.namespace;
  const { key } = req.params;
  const data = await registry.remove(key);
  // TODO: 404
  res.send(data);
});

module.exports = router;
