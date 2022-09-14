'use strict';

const path = require('path');
const electronEnv = require('./electronEnv');
const IS_PROD = require('./env').IS_PROD;
const isPackaged = require('electron-is-packaged').isPackaged;

const PACKAGED_NODE_MODULES_PATH = '/node_modules/electron-root-path/lib';

function stripTrailingSlashes(string) {
  return string.replace(/\/+$/, '');
}

function doesStringEndsWith(str, target) {
  if (target.length < 1) {
    return str.length < 1;
  }

  const last = str.substring(str.length - target.length);

  return last === target;
}

function pathCorrection() {
  let dirname = __dirname;

  // if the directory name ends with `/src` or `/dist` then remove them
  if (
    doesStringEndsWith(dirname, '/src') ||
    doesStringEndsWith(dirname, '/dist')
  ) {
    dirname = path.join(dirname, '..');
  }

  // if the directory name DOES NOT ends with `/node_modules/electron-root-path/lib` then append it
  if (!doesStringEndsWith(dirname, PACKAGED_NODE_MODULES_PATH)) {
    dirname = path.join(dirname, PACKAGED_NODE_MODULES_PATH);
  }

  return dirname;
}

let rootPath = null;
const dirname = pathCorrection();

if (isPackaged) {
  // renderer and main process - packaged build
  if (electronEnv.isWindows) {
    // windows platform
    rootPath = path.join(dirname, '..', '../../../../');
  } else {
    // non windows platform
    rootPath = path.join(dirname, '..', '../../../../../');
  }
} else if (IS_PROD) {
  // renderer and main process - prod build
  if (electronEnv.isRenderer) {
    // renderer process - prod build
    rootPath = path.join(dirname, '..', '..', '..');
  } else if (!module.parent) {
    // main process - prod build (case: run "start")
    rootPath = path.join(dirname, '..', '..', '..');
  } else {
    // main process - prod (case: run "build")
    rootPath = path.join(dirname, '..', '..', '..');
  }
} else if (electronEnv.isRenderer) {
  // renderer process - dev build
  rootPath = path.join(dirname, '..', '..', '..');
} else {
  // main process - dev build
  rootPath = path.join(dirname, '..', '..', '..');
}

module.exports.rootPath = path.resolve(rootPath);
