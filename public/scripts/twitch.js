//***********************//
// Twitch API calls      //
//***********************//

let authToken = "";

const BROADCASTER_ID = "89285457"; // StudioRenegade
const CLIENT_ID = "rssu2h41e352q0x8qmu8m9m7c1ymaw";
const CLIENT_SECRET = "0xjzyddhbn30w0jjqliqen3kjsrn36";

export const fetchClips = (startDate, endDate) => {
  return getToken().then((token) => {
    authToken = token;
    const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&started_at=${startDate}&ended_at=${endDate}&first=100`;

    return fetch(url, {headers: {"Client-ID": CLIENT_ID, Authorization: `Bearer ${authToken}`}})
      .then((response) => response.json());
  });
};

const getToken = () => {
  if(authToken.length === 0) {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
    
    return fetch(url, {method: "POST"})
      .then((response) => response.status>=400 ? Promise.reject(response.json()) : Promise.resolve(response.json()))
      .then((data) => data.access_token, (error) => alert("Could not authenticate"));
  } else {
    return Promise.resolve(authToken);
  }
};