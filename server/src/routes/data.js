const router = require('express').Router();
const { collectionRegistry } = require('../Collection.js');

router.get('/:namespace', async (req, res) => {
  // TODO: options
  const col = await collectionRegistry.getCol(req.params.namespace);
  const data = await col.list();
  res.send(data);
});

router.get('/:namespace/:key', async (req, res) => {
  const { namespace, key } = req.params;
  const col = await collectionRegistry.getCol(namespace);
  const data = await col.get(key);
  // TODO: 404
  res.send(data);
});

router.post('/:namespace/:key', async (req, res) => {
  const value = req.body;
  const { namespace, key } = req.params;
  const col = await collectionRegistry.getCol(namespace);
  // TODO: options
  // TODO: body validation
  const data = await col.put(key, value);
  // TODO: 404
  res.send(data);
});

router.delete('/:namespace/:key', async (req, res) => {
  const { namespace, key } = req.params;
  const col = await collectionRegistry.getCol(namespace);
  const data = await col.remove(key);
  // TODO: 404
  res.send(data);
});

module.exports = router;
