var simplePost = require('../tools/net/http_request').simplePost;


var url = 'http://10.0.0.226:8080';
var form = {
    msg : 'Hello!'
};

simplePost(url, form, function(err, response, body) {
    console.log(JSON.stringify(err));
    console.log(JSON.stringify(response));
    console.log(body);
});
