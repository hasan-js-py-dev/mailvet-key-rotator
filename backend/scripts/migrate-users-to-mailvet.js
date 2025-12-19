/*
  Copies `users` collection from the DB referenced by SOURCE_MONGODB_URI (or MONGODB_URI)
  to the `mailvet` database on the same cluster (or TARGET_MONGODB_URI).

  Why: MongoDB Atlas doesn't "rename" a DB; you copy data then switch connection string.

  Usage (PowerShell):
    $env:SOURCE_MONGODB_URI="<your current uri>"; node scripts/migrate-users-to-mailvet.js

  Or if MONGODB_URI is already set:
    node scripts/migrate-users-to-mailvet.js

  Optional:
    $env:TARGET_MONGODB_URI="<uri that points to /mailvet>"
*/

require('dotenv').config();
const mongoose = require('mongoose');

const SOURCE_ENV = 'SOURCE_MONGODB_URI';
const TARGET_ENV = 'TARGET_MONGODB_URI';

const withDbName = (uri, dbName) => {
  if (!uri || typeof uri !== 'string') return uri;
  const [beforeQuery, query] = uri.split('?');

  const protoIdx = beforeQuery.indexOf('://');
  if (protoIdx === -1) return uri;

  const afterProto = protoIdx + 3;
  const slashIdx = beforeQuery.indexOf('/', afterProto);
  const base = slashIdx === -1 ? beforeQuery : beforeQuery.slice(0, slashIdx);

  const rebuilt = `${base}/${dbName}`;
  return query ? `${rebuilt}?${query}` : rebuilt;
};

const connect = async (uri, label) => {
  if (!uri) throw new Error(`${label} MongoDB URI is missing`);
  return mongoose.createConnection(uri).asPromise();
};

const migrateUsers = async () => {
  const sourceUri = process.env[SOURCE_ENV] || process.env.MONGODB_URI;
  if (!sourceUri) {
    throw new Error(`Missing ${SOURCE_ENV} or MONGODB_URI`);
  }

  const targetUri = process.env[TARGET_ENV] || withDbName(sourceUri, 'mailvet');

  if (withDbName(sourceUri, 'mailvet') === sourceUri && !process.env[TARGET_ENV]) {
    console.log('Source URI already points to /mailvet; nothing to migrate.');
    return;
  }

  const sourceConn = await connect(sourceUri, 'Source');
  const targetConn = await connect(targetUri, 'Target');

  try {
    const sourceDb = sourceConn.db;
    const targetDb = targetConn.db;

    const sourceDbName = sourceDb.databaseName;
    const targetDbName = targetDb.databaseName;

    console.log(`Source DB: ${sourceDbName}`);
    console.log(`Target DB: ${targetDbName}`);

    if (targetDbName !== 'mailvet') {
      throw new Error(`Target database must be 'mailvet' (got '${targetDbName}')`);
    }

    const sourceCol = sourceDb.collection('users');
    const targetCol = targetDb.collection('users');

    const cursor = sourceCol.find({}).batchSize(500);

    let batch = [];
    let processed = 0;
    let upserted = 0;

    const flush = async () => {
      if (batch.length === 0) return;
      const result = await targetCol.bulkWrite(batch, { ordered: false });
      upserted += (result.upsertedCount || 0) + (result.modifiedCount || 0) + (result.insertedCount || 0);
      batch = [];
    };

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      processed += 1;

      batch.push({
        replaceOne: {
          filter: { _id: doc._id },
          replacement: doc,
          upsert: true,
        },
      });

      if (batch.length >= 500) {
        await flush();
        if (processed % 2000 === 0) {
          console.log(`Processed ${processed} users...`);
        }
      }
    }

    await flush();

    console.log(`Done. Processed: ${processed}. Upsert operations applied: ${upserted}.`);
    console.log('Next: update your backend MONGODB_URI to end with /mailvet and restart the server.');
    console.log("After verifying everything works, you can drop the old DB (e.g. 'test') in Atlas.");
  } finally {
    await sourceConn.close();
    await targetConn.close();
  }
};

migrateUsers().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
