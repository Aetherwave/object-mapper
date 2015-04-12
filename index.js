'use strict';
/* jslint node: true */

var async = require('async');

function MapObjLib(map, options) {
  if(!(this instanceof MapObjLib)) {
    return new MapObjLib(map);
  }

  this.mapConfig = map;
  this.options = options || {};
}

MapObjLib.STRICT_ON = true;
MapObjLib.STRICT_OFF = false;

MapObjLib.prototype.map = function (obj, callback) {
  mapObject(obj, this.mapConfig, this.options, callback);
};

MapObjLib.getByPath = function (path, obj) {
  var pathElements = path.split('.');
  var scope = obj;

  for (var i = 0; i < pathElements.length; i++) {
    scope = scope[pathElements[i]];

    if(scope === undefined) {
      return null;
    }
  }

  return scope;
};

function mapObject(obj, map, options, callback) {
  var destinationProperties = Object.getOwnPropertyNames(map);

  async.map(destinationProperties, function (destinationProperty, callback) {
    switch(typeof(map[destinationProperty])) {
      case 'string':
        mapString(obj, map[destinationProperty], options, callback);
        break;
      default:
        mapObject(obj, map[destinationProperty], options, callback);
        break;
    }
  }, buildObject(destinationProperties, callback));
}

function mapString(obj, map, options, callback) {
  var value = MapObjLib.getByPath(map, obj);

  if(value === null) {
    if(options.strictMode) {
      return callback(new Error("\""+ map +"\" is not defined"));
    }
  }

  callback(null, value);
}

function buildObject(destinationProperties, callback) {
  return function (error, result) {
    var mappedObj = {};
    var isEmpty = true;

    if(error) {
      return callback(error);
    }

    for (var i = 0; i < destinationProperties.length; i++) {
      if(result[i] === null) continue;

      mappedObj[destinationProperties[i]] = result[i];
      isEmpty = false;
    }

    if(!isEmpty) {
      callback(null, mappedObj);
    } else {
      callback(null, null);
    }
  };
}

module.exports = MapObjLib;
