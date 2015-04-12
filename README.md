# map-obj-lib

## Usage

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
