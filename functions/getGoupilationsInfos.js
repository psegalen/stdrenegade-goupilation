const { info } = require("firebase-functions/lib/logger");

const getGoupilationsInfos = async (admin, res) => {
  const querySnapshot = await admin
    .firestore()
    .collection("goupilations")
    .orderBy("update_date", "desc")
    .get();

  const goups = [];
  querySnapshot.forEach((doc) => {
    const infos = doc.data();
    goups.push({
      id: doc.id,
      name: infos.name,
      nbClips: infos.clips ? infos.clips.length : 0,
      updateDate: infos.update_date
        ? infos.update_date.seconds
        : null,
    });
  });
  res.json(goups);
};

module.exports = getGoupilationsInfos;
