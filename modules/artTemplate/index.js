/**
 * Created by weijianli on 16/11/30.
 */
'use strict';
const artTemplate = require('./art-template');
const render = artTemplate({
  base:'veiws',
  openTag:'{{',
  closeTag:'}}',
  cache:false
});

module.exports = render