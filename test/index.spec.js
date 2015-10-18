'use strict';

let expect = require('chai').expect;

describe('Object Mapper', function (done) {
  let ObjectMapper = require(__dirname + '/../index.js');

  it('should map objects by dot notation', function () {
    let obj = {
      simpleProperty: 42,
      complexProperty: {
        child: 126
      }
    };

    let map = {
      flattern: 'complexProperty.child',
      explode: {
        child: 'simpleProperty'
      }
    };

    let objMap = new ObjectMapper(map);
    expect(objMap.map(obj)).to.be.deep.equal({
      flattern: 126,
      explode: {
        child: 42
      }
    });
  });

  it('should ignore undefined paths', function () {
    let obj = {
      value: 42,
      nullValue: null
    };

    let map = {
      flattern: 'complexPropertyNULL.child',
      explode: {
        child: 'simplePropertyNULL'
      },
      value: 'value',
      nullValue: 'nullValue'
    };

    let objMap = new ObjectMapper(map);
    expect(objMap.map(obj)).to.deep.equal({
      value: 42,
      nullValue: null
    });
  });

  it('should throw an error if map each element is forced', function () {
    let obj = {
      simpleProperty: 42,
      complexProperty: {
        child: 126
      }
    };

    let map = {
      flattern: 'complexPropertyNULL.child',
      explode: {
        child: 'simplePropertyNULL'
      }
    };

    let objMap = new ObjectMapper(map, { mapEachElement: true });
    expect(function () {
      objMap.map(obj);
    }).to.throw(/Could not map elements/);
  });

  it('should map by provided context "$."-prefix', function () {
    let obj = {
      simpleProperty: 42,
      complexProperty: {
        child: 126
      }
    };

    let context = {
      contextProp: 23
    };

    let map = {
      flattern: 'complexProperty.child',
      explode: {
        child: '$.contextProp'
      }
    };

    let objMap = new ObjectMapper(map, { context: context });
    expect(objMap.map(obj)).to.deep.equal({
      flattern: 126,
      explode: {
        child: 23
      }
    });
  });

  it('should throw an error on invalid map schema', function () {
    let objectMapper = new ObjectMapper();
    expect(function () {
      objectMapper.map({}, NaN);
    }).to.throw(/Invalid map schema/);
  });

});
