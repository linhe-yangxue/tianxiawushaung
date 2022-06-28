# node-xls-json

[![Build Status](https://travis-ci.org/DataGarage/node-xls-json.png?branch=master)](https://travis-ci.org/DataGarage/node-xls-json)

Converting xls file to json files using nodejs

## Install

```
  npm install xls-to-json
```

## Usage

```
  node_xj = require("xls-to-json");
  node_xj({
    input: "sample.xls", 
    output: "output.json"
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
```

In config object, you have to enter an input path. But If you don't want to output any file you can set to `null`.

## License

MIT [@chilijung](http://github.com/chilijung)

