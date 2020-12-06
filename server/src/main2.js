const { getDb } = require('./db.js');
const Collection = require('./Collection.js');

const foo = new Collection(getDb({ realm: 'testing' }, 'foo'));

(async function () {
  console.log('TEST CASE #1');
  const key = 'asdf';
  const value = 'Helo, World!';
  await foo.put(key, value);
  let data = await foo.get(key);
  console.log({ data });
  console.log(await foo.remove(key));
  data = await foo.get(key);
  console.log({ data });

  //
  //
  console.log('TEST CASE #2');
  for (let i = 0; i < 10; i++) {
    await foo.put(i, `test0${i}`);
  }
  console.log(await foo.count());
  console.log(await foo.get(4));
  console.log(await foo.list());
})();
