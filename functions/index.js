const functions = require("firebase-functions");

// CORS Express middleware to enable CORS Requests.
const cors = require("cors")({
  origin: true,
});

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const getLatestGoupilation = require("./getLatestGoupilation");
const addClipToLatestGoupilation = require("./addClipToLatestGoupilation");

exports.getLatestGoupilation = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    console.log("Starting getLatestGoupilation ...");
    return cors(req, res, async () => {
      console.log("CORS Ok ...");
      await getLatestGoupilation(admin, res);
    });
  });

exports.addClipToLatestGoupilation = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await addClipToLatestGoupilation(admin, req, res);
    });
  });
