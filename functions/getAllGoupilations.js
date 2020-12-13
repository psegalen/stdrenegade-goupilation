const getAllGoupilations = async (admin, res) => {
  const querySnapshot = await admin
    .firestore()
    .collection("goupilations")
    .orderBy("update_date", "desc")
    .get();

  const goups = [];
  querySnapshot.forEach((doc) => {
    goups.push(Object.assign({}, doc.data(), { id: doc.id }));
  });
  res.json(goups);
};

module.exports = getAllGoupilations;
