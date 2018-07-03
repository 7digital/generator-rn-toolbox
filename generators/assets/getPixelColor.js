const gm = require('gm').subClass({ imageMagick: true });

module.exports = (imagePath, x, y) =>
  new Promise((resolve, reject) =>
    gm(imagePath)
      .crop(x, y)
      .identify('%[hex:s]', (error, imageMagickColor) => {
        if (error) return reject(error);
        if (imageMagickColor && imageMagickColor.length === 8) {
          imageMagickColor = imageMagickColor.substr(0, 6);
        }
        return resolve(`#${imageMagickColor}`);
      })
  );
