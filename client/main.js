const { FeBe } = require('./client.js');

(async function () {
  const febe = new FeBe({ projectId: 'Tms2JdOk' });
  const postsCol = febe.collection('posts');
  let posts = await postsCol.list();
  console.log(posts);
})();
