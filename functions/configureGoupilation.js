const configureGoupilation = async (admin, req, res) => {
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

  const goupRef = admin
    .firestore()
    .collection("goupilations")
    .doc(goupilationId);

  const goup = await goupRef.get();

  if (!goup.exists) {
    res.status(400).json({
      status: "error",
      error: "Impossible de trouver cette goupilation !",
    });
    return;
  }

  try {
    await admin
      .firestore()
      .collection("config")
      .doc("goupilation")
      .update({ ref: goupRef });

    res.json({ status: "ok" });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: "Impossible de configurer la goupilation !",
      details: error.message,
    });
  }
};

module.exports = configureGoupilation;
