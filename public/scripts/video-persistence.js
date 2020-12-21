//***********************//
// Manage persistence    //
//***********************//

import { Video } from "./video-model.js";

const apiRootUrl = "https://europe-west1-goupilation.cloudfunctions.net/";

const showToast = (text) => Toastify({
  text,
  className: "info",
  gravity: "top",
  position: "center"
}).showToast();

export const saveVideo = (video) => {
  return fetch(`${apiRootUrl}create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(video)
  }).then(response => {
    if (response.status === 200) {
      showToast("Goupilation was successfully created on the server");
    } else {
      response.json().then((data) => {
        console.warn("Response from server wasn't 200", response, data);
        if (data && data.error) {
          alert(data.error);
        }
      });
    }
  });
};

export const loadVideo = (id) => {
  return fetch(`${apiRootUrl}getById?id=${id}`)
    .then(response => {
      if (response.status === 200) {
        return response.json().then(data => data);
      } else {
        return response.json().then(data => {
          console.warn("Response from server wasn't 200", response, data);
          if (data && data.error) {
            alert(data.error);
          }
          return new Video();
        });
      }
    });
};

export const deleteVideo = (id) => {
  return fetch(`${apiRootUrl}delete?id=${id}`, {
    method: "DELETE"
  }).then(response => {
    if (response.status === 200) {
      showToast("Goupilation was successfully deleted on the server");
    } else {
      response.json().then((data) => {
        console.warn("Response from server wasn't 200", response, data);
        if (data && data.error) {
          alert(data.error);
        }
      });
    }
  });
};

export const getSaveNames = () => {
  return fetch(`${apiRootUrl}getInfos`)
  .then(response => {
    if (response.status === 200) {
      return response.json().then(data => data.sort((a, b) => a.name < b.name ? - 1 : 1));
    } else {
      return response.json().then(data => {
        console.warn("Response from server wasn't 200", response, data);
        if (data && data.error) {
          alert(data.error);
        }
        return [];
      });
    }
  });
};

export const chooseVideo = (id) => {
  return fetch(`${apiRootUrl}configure?id=${id}`, {
    method: "POST"
  }).then(response => {
    if (response.status === 200) {
      showToast("Goupilation was successfully chosen as THE goupilation on the server");
    } else {
      response.json().then((data) => {
        console.warn("Response from server wasn't 200", response, data);
        if (data && data.error) {
          alert(data.error);
        }
      });
    }
  });
};

export const loadChosenVideo = () => {
  return fetch(`${apiRootUrl}getConfigured`)
    .then(response => {
      if (response.status === 200) {
        return response.json().then(data => data);
      } else {
        return response.json().then(data => {
          console.warn("Response from server wasn't 200", response, data);
          if (data && data.error) {
            alert(data.error);
          }
          return new Video();
        });
      }
    });
};