const getConfigGoupilation = async (admin, res) => {
  const querySnapshot = await admin
    .firestore()
    .collection("config")
    .get();
  if (!querySnapshot.empty) {
    const config = querySnapshot.docs[0];
    const goupilation = await config.data().goupilation.get();
    res.json(goupilation.data());
  } else {
    console.log("No goupilation!");
    res.json(null);
  }
};

module.exports = getConfigGoupilation;
