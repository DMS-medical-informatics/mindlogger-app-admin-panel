module.exports = {
  //...
  devServer: {
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/mindlogger.info/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/mindlogger.info/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/mindlogger.info/chain.pem'),
    }
  }
};
