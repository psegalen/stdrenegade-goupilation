const getConfigGoupilation = async (admin, res) => {
  const conf = await admin
    .firestore()
    .collection("config")
    .doc("goupilation")
    .get();
  if (conf.exists) {
    const goupilation = await conf.data().ref.get();
    res.json({ ...goupilation.data(), id: goupilation.id });
  } else {
    console.log("No goupilation!");
    res.status(400).json({
      status: "error",
      error: "Pas de goupilation configurée !",
    });
  }
};

module.exports = getConfigGoupilation;
