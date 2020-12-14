const getGoupilationById = async (admin, res, req) => {
  const goupilationId = req.query.id;

  console.log(goupilationId);
  if (!goupilationId) {
    res.status(400).json({
      status: "error",
      error:
        'Merci de donner un ID de goupilation dans le paramètre GET "id" !',
    });
  } else {
    const goup = await admin
      .firestore()
      .collection("goupilations")
      .doc(goupilationId)
      .get();

    if (goup.exists) {
      res.json(goup.data());
    } else {
      console.log("No goupilation!");
      res.status(400).json({
        status: "error",
        error: "La goupilation n'existe pas !",
      });
    }
  }
};

module.exports = getGoupilationById;
