var request = require('request');

var simplePost = function (url, form, callback) {
    request.post({url:url, form:form}, function(err, response, body) {
        callback(err, response, body);
    });
};

exports.simplePost = simplePost;
