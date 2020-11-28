//***********************//
// Twitch API calls      //
//***********************//

let authToken = "";

const BROADCASTER_ID = "89285457"; // StudioRenegade
const CLIENT_ID = "rssu2h41e352q0x8qmu8m9m7c1ymaw";

const getToken = () =>
  authToken.length === 0
    ? fetch(
        "https://id.twitch.tv/oauth2/token?client_id=rssu2h41e352q0x8qmu8m9m7c1ymaw&client_secret=0xjzyddhbn30w0jjqliqen3kjsrn36&grant_type=client_credentials",
        { method: "POST" }
      )
        .then((response) => response.json())
        .then((data) => data.access_token)
    : Promise.resolve(authToken);

export const fetchClips = (startDate, endDate) =>
  getToken().then((token) => {
    authToken = token;

    const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${BROADCASTER_ID}&started_at=${startDate}&ended_at=${endDate}&first=100`;

    return fetch(url, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => response.json());
  });
