const browserSync = require('browser-sync').create();

browserSync.init({
  proxy: 'http://localhost:3000',  // The Express server address
  files: ['public/**/*.*'],        // Watch files in the 'public' folder
  port: 4000,                      // BrowserSync will run on this port
  open: false                       // Don't open the browser automatically
});
