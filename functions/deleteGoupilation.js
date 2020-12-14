const deleteGoupilation = async (admin, req, res) => {
  const goupilationId = req.query.id;

  console.log(goupilationId);
  if (!goupilationId) {
    res.status(400).json({
      status: "error",
      error:
        'Merci de donner un ID de goupilation dans le paramètre GET "id" !',
    });
    return;
  }

  let configuredId = null;
  const conf = await admin
    .firestore()
    .collection("config")
    .doc("goupilation")
    .get();
  if (conf.exists) {
    configuredId = conf.data().ref.id;
  }
  if (goupilationId === configuredId) {
    res.status(400).json({
      status: "error",
      error:
        "Impossible de supprimer la goupilation : elle est actuellement configurée !",
    });
    return;
  }

  try {
    await admin
      .firestore()
      .collection("goupilations")
      .doc(goupilationId)
      .delete();

    res.json({ status: "ok" });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: "Impossible de supprimer la goupilation !",
      details: error.message,
    });
  }
};

module.exports = deleteGoupilation;
