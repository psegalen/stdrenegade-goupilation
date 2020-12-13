const createGoupilation = async (admin, req, res) => {
  const goupilation = req.body;

  console.log(goupilation);
  try {
    await admin
      .firestore()
      .collection("goupilations")
      .add({
        ...goupilation,
        update_date: admin.firestore.Timestamp.now(),
      });

    res.json({ status: "ok" });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: "Impossible de créer la goupilation !",
      details: error.message,
    });
  }
};

module.exports = createGoupilation;
