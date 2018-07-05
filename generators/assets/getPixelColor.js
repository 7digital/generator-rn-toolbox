const gm = require('gm').subClass({ imageMagick: true });

module.exports = (imagePath, x, y) => {
  return new Promise((resolve, reject) => {
    gm(imagePath)
      .in('+dither')
      .in('-colors', 5)
      .in('-define', 'histogram:unique-colors=true')
      .in('-format', '%c')
      .write('histogram:info:-', (error, result) => {
        if (error) return reject(error);
        const regex = /(?:\s+([0-9]+):.+(#[0-9A-F]{6}).*)/g;
        let m;
        let backgroundColor = '#000000';
        let useTimes = 0;

        while ((m = regex.exec(result)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          const count = parseInt(m[1], 10);
          if (count > useTimes) {
            useTimes = count;
            backgroundColor = m[2];
          }
        }
        return resolve(backgroundColor);
      });
  });
};
