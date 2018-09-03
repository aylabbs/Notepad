const appRoutes = require('./app_routes');

module.exports = (app, db) => {
  appRoutes(app, db);

};
