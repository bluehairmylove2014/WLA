
const profileRouter = require("./profile.route");
const homeRouter = require("./home.route");

function route(app) {
  app.use('/api/v1/home', homeRouter);
  app.use('/api/v1/profile', profileRouter);
  app.use('/', () => {
    console.log('/');
  })
}

module.exports = route;