
const profileRouter = require("./profile.route");
const homeRouter = require("./home.route");
const loginRouter = require("./login.route");

function route(app) {
  app.use('/api/v1/login', loginRouter);
  app.use('/api/v1/home', homeRouter);
  app.use('/api/v1/profile', profileRouter);
  app.use('/', () => {
    console.log('/');
  })
}

module.exports = route;