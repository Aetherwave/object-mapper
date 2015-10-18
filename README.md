# Object Mapper

[![Build Status](https://travis-ci.org/schornio/map-object.svg)](https://travis-ci.org/schornio/map-object)

## Usage

### ObjectMapper#constructor(mapSchema[, options])

- `mapSchema`: map schema
- `options`: (optional) configuration
  - `context`: Object, context, default: `{}`
  - `mapEachElement`: Boolean, error if map path doesn't exist, default: `false`
  - `stripEmptyObjects`: Boolean, ignore empty objects, default: `true`

### ObjectMapper#map(mixed[, mapSchema])

- `mixed`: object to map
- `mapSchema`: map schema, default (this.mapSchema)

### Map Schema

    {
      <string: destination name>: <string: source path>,
      <string: destination name>: <string: '$.' + context source path>,
      <string: destination name>: <object: nested schema>
    }

### Example

    var ObjectMapper = require('@schornio/object-mapper');

    var obj = {
      simpleProperty: 42,
      complexProperty: {
        child: 126
      }
    };

    var map = {
      flattern: 'complexProperty.child',
      explode: {
        child: 'simpleProperty'
      }
    };

    var objMap = new MapObjLib(map);
    objMap.map(obj);
      /* result == {
        flattern: 126,
        explode: {
          child: 42
        }
      }*/
    });
