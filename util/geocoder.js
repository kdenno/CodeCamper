const NodegeoCoder = require("node-geocoder");
const options = {
  provider: 'mapquest',
  httpAdapter: "https",
  apiKey: 'EGmzLNYWAtqFvA3t6oWtZApKlQATq4s1',
  formatter: null
};
const geocoder = NodegeoCoder(options);
module.exports = geocoder;
