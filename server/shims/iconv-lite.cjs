const { StringDecoder } = require('node:string_decoder');

module.exports = {
  getDecoder: function(encoding) {
    const enc = String(encoding || 'utf8').toLowerCase().replace(/[^a-z0-9]/g, '');
    const validEnc = enc.includes('ascii') ? 'ascii' : enc.includes('latin1') ? 'latin1' : 'utf8';
    const decoder = new StringDecoder(validEnc);
    return {
      write: function(buf) {
        return decoder.write(buf);
      },
      end: function() {
        return decoder.end();
      }
    };
  },
  decode: function(buf, encoding) {
    return Buffer.isBuffer(buf) ? buf.toString(encoding || 'utf8') : String(buf);
  },
  encode: function(str, encoding) {
    return Buffer.from(String(str), encoding || 'utf8');
  },
  encodingExists: function() {
    return true;
  }
};
