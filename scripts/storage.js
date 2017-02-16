// Load packages
var path = require('path')
var run = require('./run')
var cmd = require('interactive-command')
var showOnly = require('./show-only')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Load configuration
var cfg = require('./config.js')

showOnly('Preparing Firebase storage rules deployment - please wait ...')
run('node "' + path.resolve(cfg.packageRoot, 'scripts/prepare-firebase') + '"', function () {
  showOnly('Login to Firebase - please wait ...')
  cmd('./node_modules/.bin/firebase', ['login'], {cwd: cfg.projectRoot}, function () {
    showOnly('Deploying to Firebase - please wait ...')
    cmd('firebase', ['deploy', '--only', 'storage'], {cwd: path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin')}, function () {
      showOnly('Clean up temp files - please wait ...')
      run('node "' + path.resolve(cfg.packageRoot, 'scripts/cleanup-firebase') + '"', function () {
        showOnly('Firebase storage rules deployed!')
      }, 'Firebase clean up failed')
    }, 'Firebase storage rules deployment failed')
  }, 'Firebase login failed')
}, 'Cannot prepare Firebase storage rules deployment')