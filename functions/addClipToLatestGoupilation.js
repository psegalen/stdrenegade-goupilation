const addClipToLatestGoupilation = async (admin, req, res) => {
  const clip = req.body;

  console.log(clip);

  const querySnapshot = await admin
    .firestore()
    .collection("goupilations")
    .orderBy("update_date", "desc")
    .limit(1)
    .get();

  if (!querySnapshot.empty) {
    const latestGoupilation = querySnapshot.docs[0];
    try {
      await admin
        .firestore()
        .collection("goupilations")
        .doc(latestGoupilation.id)
        .update({
          update_date: admin.firestore.Timestamp.now(),
          video_data: admin.firestore.FieldValue.arrayUnion(clip),
        });
      res.json({
        status: "ok",
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: "Impossible de mettre à jour la goupilation !",
        details: error.message,
      });
    }
  } else {
    res.status(404).json({ error: "Pas de goupilation !" });
  }
};

module.exports = addClipToLatestGoupilation;
