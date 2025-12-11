const request = require("request");
require("dotenv").config();
const qs = require("qs");

function getAccessToken() {
  return new Promise((resolve, reject) => {
    const body = qs.stringify({
      grant_type: "client_credentials",
      scope: "basic",
    });

    const authHeader =
      "Basic " +
      Buffer.from(
        `${process.env.API_CLIENT_ID}:${process.env.API_CLIENT_SECRET}`
      ).toString("base64");

    request(
      {
        url: "https://oauth.fatsecret.com/connect/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
        body,
      },
      (err, response, responseBody) => {
        if (err) return reject(err);

        try {
          const parsed = JSON.parse(responseBody);

          if (!parsed.access_token) {
            console.log("TOKEN ERROR RESPONSE:", parsed);
            return reject(parsed);
          }

          resolve(parsed.access_token);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

module.exports = { getAccessToken };
