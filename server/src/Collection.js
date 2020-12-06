const to = (key, value) => {
  const record = Buffer.from(
    JSON.stringify({ key, value, updatedAt: Date.now() }),
  );
  return record;
};

const from = (data) => (!data ? null : JSON.parse(data.toString('utf8')));

class Collection {
  constructor(db) {
    this.db = db;
  }
  count(options) {
    return new Promise((res, rej) => {
      let count = 0;
      this.db
        .createKeyStream(options)
        .on('data', () => count++)
        .on('error', (err) => {
          console.error(err);
          rej(err);
        })
        .on('close', () => {
          // console.log('Stream closed');
        })
        .on('end', () => {
          //   console.log('Stream ended');
          res(count);
        });
    });
  }
  async put(key, value, ctx) {
    // TODO: updated by...
    const record = to(key, value);
    await this.db.put(key, record);
    return { key, value, updatedAt: Date.now() };
  }
  async get(key) {
    try {
      const data = await this.db.get(key);
      return from(data);
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  list(options = {}) {
    options.keys = false;
    return new Promise((res, rej) => {
      let rows = [];
      this.db
        .createReadStream(options)
        .on('data', (data) => {
          //   console.log({ data });
          rows.push(from(data));
        })
        .on('error', (err) => {
          console.error(err);
          rej(err);
        })
        .on('close', () => {
          //   console.log('Stream closed');
        })
        .on('end', () => {
          //   console.log('Stream ended');
          res(rows);
        });
    });
  }
  async remove(key) {
    const curr = await this.get(key);
    if (!!curr) {
      await this.db.del(key);
    }
    return curr;
  }
}

module.exports = Collection;
