const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');
const express = require('express');
const cors = require('cors');
const {
  router: collectionRoutes,
  withCollection,
} = require('./routes/collections.js');
const { router: projectRoutes, withProject } = require('./routes/projects.js');
const dataRoutes = require('./routes/data.js');

const PORT = process.env.PORT || 3030;
const INFO = {
  ..._.pick(package, [
    'name',
    'version',
    'description',
    'keywords',
    'author',
    'license',
    'repository',
  ]),
};

const getRouterPath = (slug) => {
  const urlPath = `/api/v1/${slug}`;
  console.log(`Registering Router at: ${urlPath}`);
  return urlPath;
};

const app = express();
app.use(express.json());
app.use(cors());
app.use(getRouterPath('p/:pid/collections'), withProject, collectionRoutes);
app.use(getRouterPath('projects'), projectRoutes);
app.use(
  getRouterPath('p/:pid/data/:cid'),
  [withProject, withCollection],
  dataRoutes,
);

app.get(getRouterPath('info'), (req, res) => {
  res.send(INFO);
});

app.listen(PORT, () => {
  console.log(`Server started successfully`);
});
