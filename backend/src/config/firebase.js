const admin = require('firebase-admin');

const hasFirebaseEnv = () => {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
};

const initFirebaseAdmin = () => {
  if (admin.apps && admin.apps.length > 0) return;
  if (!hasFirebaseEnv()) {
    console.warn('[firebase] Admin SDK not initialized (missing FIREBASE_* env vars)');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
};

initFirebaseAdmin();

admin._ensureInitialized = initFirebaseAdmin;

module.exports = admin;
