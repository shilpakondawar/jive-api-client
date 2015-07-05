var Q = require('q');
var prequire = require('parent-require')
var jive = prequire('jive-sdk');

var jiveRequest = function (communityUrl) {

    var request = function (params) {
        var deferred = Q.defer();
        jive.context.persistence.findByID("community", communityUrl)
            .then(function (community) {
                return jive.community.doRequest(community, params);
            })
            .then(function (response) {
                deferred.resolve(response);
            })
            .catch(function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    return  {request: request}
};

module.exports = jiveRequest;
