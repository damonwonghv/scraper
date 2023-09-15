const fs = require("fs");
const path = require("path");
const Axios = require("axios");

const { logger } = require("../utils/logger.util");

const checkPath = (destPath) => {
  let p = path.dirname(destPath);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    logger.info(`Directory created: ${p}`);
  }
  return Promise.resolve();
};

function process(event) {
  if (!event.lengthComputable) return; // guard
  var downloadingPercentage = Math.floor((event.loaded / event.total) * 100);
  // what to do ...
}

const DownloadFile = async (url, dest) => {
  checkPath(dest);
  const urlObj = new URL(encodeURI(url));
  urlObj.search = "";
  const result = urlObj.toString();
  console.log(result);
  return await downloadFile(url, dest);
};

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return Axios({
    method: "get",
    url: fileUrl,
    responseType: "stream"
  }).then((response) => {
    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
}

module.exports = { DownloadFile };
