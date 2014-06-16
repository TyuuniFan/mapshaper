/* @requires mapshaper-common */


api.splitLayer = function(lyr0, arcs, field) {
  var dataTable = lyr0.data;
  if (!dataTable) error("[splitLayer] Missing a data table");
  if (!dataTable.fieldExists(field)) error("[splitLayer] Missing field:", field);

  var index = {},
      properties = dataTable.getRecords(),
      shapes = lyr0.shapes,
      splitLayers = [];

  Utils.forEach(shapes, function(shp, i) {
    var rec = properties[i],
        key = String(rec[field]), // convert numbers to strings (for layer naming)
        lyr, idx;

    if (key in index === false) {
      idx = splitLayers.length;
      index[key] = idx;
      splitLayers.push({
        name: MapShaper.getSplitLayerName(lyr0.name, key),
        properties: [],
        shapes: []
      });
    } else {
      idx = index[key];
    }

    lyr = splitLayers[idx];
    lyr.shapes.push(shapes[i]);
    lyr.properties.push(properties[i]);
  });

  return Utils.map(splitLayers, function(obj) {
    return Opts.copyNewParams({
      name: obj.name,
      shapes: obj.shapes,
      data: new DataTable(obj.properties)
    }, lyr0);
  });
};

MapShaper.getSplitLayerName = function(base, key) {
  return (base || 'split') + '-' + (key || '');
};