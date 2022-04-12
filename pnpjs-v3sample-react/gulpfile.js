'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};
// disable tslint
build.tslintCmd.enabled = false;

// include react in dev mode 
build.configureWebpack.mergeConfig({
  additionalConfiguration: (wpcfg) => {

    // if dev build, mod config for profiling react
    if (wpcfg.mode === 'development') {
      // add alias for the react-dom profiler
      wpcfg.resolve.alias = {
        'react-dom$': 'react-dom/profiling'
      };

      // remove externalization of react & react-dom
      wpcfg.externals = wpcfg.externals.filter((external) => {
        return ((external !== 'react') && (external !== 'react-dom'));
      });
    }

    return wpcfg;
  }
});

build.initialize(require('gulp'));