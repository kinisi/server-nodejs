module.exports.handler = function handler(req, res, next) {
  if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "http") {
    res.redirect(301, "https://" + req.headers.host + req.url);
  } else {
    next();
  }
};
