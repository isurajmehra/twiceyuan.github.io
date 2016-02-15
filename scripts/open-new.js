var spawn = require('child_process').spawn;
// Hexo 3
hexo.on('new', function(data){
  spawn('open', [data.path]);
});
