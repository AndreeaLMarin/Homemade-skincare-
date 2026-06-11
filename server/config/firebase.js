// server/config/firebase.js
const admin = require('firebase-admin')



if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : require('./serviceAccountKey.json')
    ),
  })
}

const db = admin.firestore()
const auth = admin.auth()

module.exports = { admin, db, auth }
