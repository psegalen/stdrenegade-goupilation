//***********************//
// Manage persistence    //
//***********************//

export const saveClips = (name, clips) => {
  localStorage.setItem(`save:${name}`, JSON.stringify(clips));
};

export const loadClips = (name) => {
  const savedClips = localStorage.getItem(`save:${name}`);
  if (savedClips !== null) {
    return JSON.parse(savedClips);
  } else {
    return { data: [] };
  }
};

export const deleteClips = (name) => {
  localStorage.removeItem(`save:${name}`);
};

export const getSaveNames = () => {
  const keys = Object.keys(localStorage);
  const names = [];
  for (let key of keys) {
    if (key.startsWith("save:")) names.push(key.substring(5));
  }
  return names.sort();
};