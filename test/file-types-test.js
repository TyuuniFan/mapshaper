var api = require('../'),
  assert = require('assert');

describe('mapshaper-file-types.js', function () {

  describe('guessInputType()', function() {
    var guess = api.internal.guessInputType;
    it('identifies known file types', function() {
      assert.equal(guess(null, {type: 'FeatureCollection'}), 'json');
      assert.equal(guess('input.txt', 'NAME,FOO'), 'text');
      assert.equal(guess('/dev/stdin', '{type:FeatureCollection,features:[]}'), 'json');
      assert.equal(guess('/dev/stdin', 'NAME,FOO'), 'text');
      assert.equal(guess('/dev/stdin', null), null);
      assert.equal(guess('input.shp', null), 'shp');
      assert.equal(guess('input.dbf', null), 'dbf');
      assert.equal(guess('input.prj', null), 'prj');
    })
  })


  describe('inferOutputFormat()', function () {
    it('.json -> geojson', function () {
      assert.equal(api.internal.inferOutputFormat("file.json"), "geojson");
    })

    it('.json + topojson -> topojson', function () {
      assert.equal(api.internal.inferOutputFormat("file.json", "topojson"), "topojson");
    })

    it('.topojson -> topojson', function () {
      assert.equal(api.internal.inferOutputFormat("file.topojson"), "topojson");
    })

    it('.shp -> shapefile', function () {
      assert.equal(api.internal.inferOutputFormat("file.shp"), "shapefile");
    })

    it('.txt -> dsv', function () {
      assert.equal(api.internal.inferOutputFormat("file.txt"), 'dsv');
    })

    it('.dbf -> dbf', function () {
      assert.equal(api.internal.inferOutputFormat("file.dbf"), 'dbf');
    })

    it('.csv -> dsv', function () {
      assert.equal(api.internal.inferOutputFormat("file.csv"), 'dsv');
    })

    it('.tsv -> dsv', function () {
      assert.equal(api.internal.inferOutputFormat("file.tsv"), 'dsv');
    })

  })

  describe('filenameIsUnsupportedOutputType()', function () {
    var test = api.internal.filenameIsUnsupportedOutputType;
    it('unsupported types -> true', function () {
      assert(test('filename.gdb'))
      assert(test('filename.shx'))
    })

    it('supported and unknown types -> false', function() {
      assert(!test('/dev/stdout'))
      assert(!test('output.shp'))
      assert(!test('output.txt'))
      assert(!test('somename'))
    })
  })

});
