const getLatestGoupilation = async (admin, res) => {
  const querySnapshot = await admin
    .firestore()
    .collection("goupilations")
    .orderBy("update_date", "desc")
    .limit(1)
    .get();

  console.log("Query done ...");
  if (!querySnapshot.empty) {
    const latestGoupilation = querySnapshot.docs[0];
    res.json(latestGoupilation.data());
  } else {
    console.log("No goupilation!");
    res.json(null);
  }
};

module.exports = getLatestGoupilation;
