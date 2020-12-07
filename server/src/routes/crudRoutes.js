const Router = require('express').Router;

const getCrudRouter = (registry) => {
  const router = Router();

  router.get('/', async (req, res) => {
    // TODO: options
    const data = await registry.list();
    res.send(data);
  });

  router.report('/', async (req, res) => {
    // TODO: options
    const data = await registry.info();
    res.send(data);
  });

  router.delete('/', async (req, res) => {
    // TODO: options
    const data = await registry.truncate();
    res.send(data);
  });

  router.get('/:id', async (req, res) => {
    const data = await registry.get(req.params.id);
    // TODO: 404
    res.send(data);
  });

  router.post('/:id', async (req, res) => {
    const options = req.body;
    // TODO: options
    // TODO: body validation
    const data = await registry.save(req.params.id, options);
    // TODO: 404
    res.send(data);
  });

  router.delete('/:id', async (req, res) => {
    const data = await registry.remove(req.params.id);
    // TODO: 404
    res.send(data);
  });

  return router;
};

module.exports = { getCrudRouter };
