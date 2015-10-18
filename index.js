'use strict';

let _ = require('lodash');

class ObjectMapper {
  constructor(mapSchema, options) {
    this.mapSchema = mapSchema;
    this.options = _.defaultsDeep(options || {}, {
      context: {},
      mapEachElement: false,
      stripEmptyObjects: true
    });
  }

  map(mixed, mapSchema) {
    if(mapSchema === undefined) {
      mapSchema = this.mapSchema;
    }

    let value;

    if(_.isString(mapSchema)) {
      return this.mapStringSchema(mixed, mapSchema);
    }

    if(_.isObject(mapSchema)) {
      return this.mapObjectSchema(mixed, mapSchema);
    }

    throw Error(`Invalid map schema: ${mapSchema}`);
  }

  mapStringSchema(mixed, mapSchema) {
    let contextPath = mapSchema.match(/^\$\.(.*)/);
    if(contextPath) {
      return _.get(this.options.context, contextPath[1]);
    }

    return _.get(mixed, mapSchema);
  }

  mapObjectSchema(mixed, mapSchema) {
    let value = {};
    let valueCount = 0;
    let schemaProperties = Object.getOwnPropertyNames(mapSchema);
    let undefinedProperties = [];

    for (let propertyName of schemaProperties) {
      value[propertyName] = this.map(mixed, mapSchema[propertyName]);

      if(value[propertyName] !== undefined) {
        valueCount += 1;
      } else {
        if(this.options.mapEachElement) {
          undefinedProperties.push(propertyName);
        }
      }
    }

    if(this.options.mapEachElement && valueCount !== schemaProperties.length) {
      throw new Error(`Could not map elements: [ ${ undefinedProperties.join(', ') } ]`);
    }

    if(this.options.stripEmptyObjects && valueCount === 0) {
      return undefined;
    }

    return _.omit(value, _.isUndefined);
  }
}

module.exports = ObjectMapper;
