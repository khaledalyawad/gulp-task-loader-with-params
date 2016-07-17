# gulp-task-loader-with-params
npm install --save gulp-task-loader-with-params

##Usage:
Assuming your gulp folder is /gulp-tasks

####Sample gulp file /gulp/sample.js
```
module.exports =  function(params) {
  return function () {
        browserSync({
          open: gutil.env.open === 'true',
          port: 9955,
          server: {
            baseDir: params.buildTarget+'/'+params.proj
          }
        });
  }
}
```


### In your gulpfile.js
```
var handleError = function(){
  //some function here
}

taskConfigObj = {
	'buildTarget': 'release',
	'forRelease': true,
	'proj': 'projectName',
	'pass-call-function': handleError
};

require('gulp-task-loader-with-params')('gulp-tasks', taskConfigObj)
```
