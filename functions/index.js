const functions = require("firebase-functions");

// CORS Express middleware to enable CORS Requests.
const cors = require("cors")({
  origin: true,
});

// This should be your credentials downloaded from Firebase console
const serviceAccount = require("./creds.json");

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://goupilation.firebaseio.com",
});

const getLatestGoupilation = require("./getLatestGoupilation");
const addClipToLatestGoupilation = require("./addClipToLatestGoupilation");
const createGoupilation = require("./createGoupilation");
const getAllGoupilations = require("./getAllGoupilations");
const getConfigGoupilation = require("./getConfigGoupilation");
const getGoupilationsInfos = require("./getGoupilationsInfos");
const deleteGoupilation = require("./deleteGoupilation");
const getGoupilationById = require("./getGoupilationById");
const configureGoupilation = require("./configureGoupilation");

exports.getLatest = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getLatestGoupilation(admin, res);
    });
  });

exports.getConfigured = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getConfigGoupilation(admin, res);
    });
  });

exports.getAll = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getAllGoupilations(admin, res);
    });
  });

exports.getInfos = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getGoupilationsInfos(admin, res);
    });
  });

exports.getById = functions
  .region("europe-west1") // Deploy in Belgium
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await getGoupilationById(admin, res, req);
    });
  });

exports.addClipToLatest = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await addClipToLatestGoupilation(admin, req, res);
    });
  });

exports.create = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await createGoupilation(admin, req, res);
    });
  });

exports.delete = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      await deleteGoupilation(admin, req, res);
    });
  });

exports.configure = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) =>
    cors(
      req,
      res,
      async () => await configureGoupilation(admin, req, res)
    )
  );
