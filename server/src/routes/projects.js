const _ = require('lodash');
const router = require('express').Router();
const { projectRegistry: registry } = require('../system/Project.js');

router.get('/', async (req, res) => {
  // TODO: options
  const data = await registry.list();
  res.send(data);
});

router.report('/', async (req, res) => {
  const info = await registry.info();
  res.send(info);
});

router.delete('/', async (req, res) => {
  // TODO: options
  const count = await registry.truncate();
  res.send({ count });
});

router.post('/', async (req, res) => {
  const options = req.body;
  // TODO: options
  // TODO: body validation
  const data = await registry.create(options);
  // TODO: 404
  res.send(data);
});

router.put('/:id', async (req, res) => {
  const options = req.body;
  // TODO: options
  // TODO: body validation
  const data = await registry.update(req.params.id, options);
  // TODO: 404
  res.send(data);
});

router.get('/:id', async (req, res) => {
  const data = await registry.get(req.params.id);
  // TODO: 404
  res.send(data);
});

router.delete('/:id', async (req, res) => {
  const data = await registry.remove(req.params.id);
  // TODO: 404
  res.send(data);
});

const withProject = async (req, res, next) => {
  const pid = req.params.pid;
  const project = await registry.get(pid);
  if (!project) {
    // TODO: mature error handling
    res.status(404).send({ error: `Project with id="${pid}" not found` });
  } else {
    let febe = req.febe;
    if (!febe) {
      febe = req.febe = {};
    }
    _.merge(febe, { pid, project });
    next();
  }
};

module.exports = { router, withProject };
