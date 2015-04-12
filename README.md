# map-obj-lib

## Usage

### _constructor(map, options)

- `map`: map schema
- `options`: (optional) configuration
  - `strictMode`: error on unsuccessful mapping (default: ignore)

### prototype.map(obj, callback)

- `obj`: object to map
- `callback(error, obj)`: on mapping finished

### Map Schema

    {
      <string: destination name>: <string: source path>,
      <string: destination name>: <object: nested schema>
    }

### Example

    var MapObjLib = require('map-obj-lib');

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
    objMap.map(obj, function(error, result) {
      /* result == {
        flattern: 126,
        explode: {
          child: 42
        }
      }*/
    });
