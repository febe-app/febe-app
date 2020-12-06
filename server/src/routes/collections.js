const router = require('express').Router();
const { collectionRegistry } = require('../Collection.js');

router.get('/', async (req, res) => {
  // TODO: options
  const data = await collectionRegistry.list();
  res.send(data);
});

router.get('/:namespace', async (req, res) => {
  const data = await collectionRegistry.get(req.params.namespace);
  // TODO: 404
  res.send(data);
});

router.post('/:namespace', async (req, res) => {
  const options = req.body;
  // TODO: options
  // TODO: body validation
  const data = await collectionRegistry.save(req.params.namespace, options);
  // TODO: 404
  res.send(data);
});

router.delete('/:namespace', async (req, res) => {
  const data = await collectionRegistry.remove(req.params.namespace);
  // TODO: 404
  res.send(data);
});

module.exports = router;
