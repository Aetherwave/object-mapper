'use strict';

let _async = require('async');

class ObjectMapper {
  constructor(map, options) {
    this.mapConfig = map;
    this.options = options || {};
  }

  map(obj, callback) {
    mapObject(obj, this.mapConfig, this.options, callback);
  }

  static getByPath(path, obj) {
    let pathElements = path.split('.');
    let scope = obj;

    for (let i = 0; i < pathElements.length; i++) {
      scope = scope[pathElements[i]];

      if(scope === undefined) {
        return null;
      }
    }

    return scope;
  }
}

ObjectMapper.STRICT_ON = true;
ObjectMapper.STRICT_OFF = false;

function mapObject(obj, map, options, callback) {
  let destinationProperties = Object.getOwnPropertyNames(map);

  _async.map(destinationProperties, function (destinationProperty, callback) {
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
  let value;
  let scope = obj;
  let contextPath = map.match(/^\$(.*)/);

  if(contextPath) {
    scope = options.context;
    map = contextPath[1];
  }

  value = ObjectMapper.getByPath(map, scope);

  if(typeof(value) === 'function') {
    value(obj, options, callback);
    return;
  }

  if(value === null) {
    if(options.strictMode) {
      return callback(new Error("\""+ map +"\" is not defined"));
    }
  }

  callback(null, value);
}

function buildObject(destinationProperties, callback) {
  return function (error, result) {
    let mappedObj = {};
    let isEmpty = true;

    if(error) {
      return callback(error);
    }

    for (let i = 0; i < destinationProperties.length; i++) {
      if(result[i] === undefined) continue;
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

module.exports = ObjectMapper;
