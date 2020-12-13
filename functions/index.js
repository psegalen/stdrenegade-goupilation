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
const createGoupilation = require("./createGoupilation");
const getAllGoupilations = require("./getAllGoupilations");
const getConfigGoupilation = require("./getConfigGoupilation");

exports.getLatestGoupilation = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getLatestGoupilation(admin, res);
    });
  });

exports.getConfigGoupilation = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getConfigGoupilation(admin, res);
    });
  });

exports.getAllGoupilations = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getAllGoupilations(admin, res);
    });
  });

exports.addClipToLatestGoupilation = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await addClipToLatestGoupilation(admin, req, res);
    });
  });

exports.createGoupilation = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await createGoupilation(admin, req, res);
    });
  });
