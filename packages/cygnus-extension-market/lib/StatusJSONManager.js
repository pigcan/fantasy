'use strict';

const { existsSync, moveSync } = require('fs');

const { readJsonSync, outputJsonSync } = require('fs-extra');
const merge = require('lodash.merge');
const { pathUtil } = require('cygnus-util');

const { getDownloadInfoJSONPath } = pathUtil;

class StatusJSONManager {
  constructor(suffix) {
    this.suffix = suffix;
    this.dlInfoJSONPath = getDownloadInfoJSONPath(this.suffix);
  }
  static readStatusJSON() {
    let statusJSON;
    if (!existsSync(this.dlInfoJSONPath)) {
      outputJsonSync(this.dlInfoJSONPath, {});

      statusJSON = {};
    } else {
      try {
        statusJSON = readJsonSync(this.dlInfoJSONPath);
      } catch (err) {
        moveSync(this.dlInfoJSONPath, `${this.dlInfoJSONPath}.${(new Date()).getTime()}`);
        outputJsonSync(this.dlInfoJSONPath, {});
        statusJSON = {};
      }
    }

    return statusJSON;
  }

  static updateStatusJSON(data = {}, reset = false) {
    const oldJSON = StatusJSONManager.readStatusJSON();
    let newJSON = {};
    if (!reset) {
      newJSON = merge(oldJSON, data);
    } else {
      newJSON = Object.assign({}, data);
    }
    outputJsonSync(this.dlInfoJSONPath, newJSON);

    return newJSON;
  }

  static deleteAGlobalExtensionFromStatusJSON(name, type) {
    const oldJSON = StatusJSONManager.readStatusJSON();
    if (type === 0) {
      delete oldJSON.Project[name];
    }
    if (type === 1) {
      delete oldJSON.Plugin[name];
    }

    outputJsonSync(this.dlInfoJSONPath, oldJSON);

    return oldJSON;
  }
}

module.exports = StatusJSONManager;
