var Q = require('q');
var prequire = require('parent-require')
var jive = prequire('jive-sdk');
var _ = require('lodash');
var logger = jive.logger;

module.exports = function (request) {

    var get = function (userUrl) {
        var deferred = Q.defer();
        request(
            {
                url: userUrl,
                "method": "GET"
            }
        ).then(
            function (successResponse) {
                logger.debug({fn: "getUser", UserUrl: userUrl, stage: "success_callback"});
                deferred.resolve(successResponse.entity);
            },
            function (failureResponse) {
                logger.error({fn: "getUser", UserUrl: userUrl, error: failureResponse, stage: "failure_callback"});
                deferred.reject(failureResponse)
            }
        );
        return deferred.promise;
    };

    var update = function (userUrl, userData) {
        var deferred = Q.defer();
        request(
            {
                url: userUrl,
                "method": "PUT",
                "postBody": userData
            }
        ).then(
            function (successResponse) {
                logger.debug({fn: "updateUser", UserUrl: userUrl, stage: "success_callback"});
                deferred.resolve(successResponse);
            },
            function (failureResponse) {
                logger.error({fn: "updateUser", UserUrl: userUrl, error: failureResponse , stage: "failure_callback"});
                deferred.reject(failureResponse)
            }
        );
        return deferred.promise;
    };

    var getAllStreams = function (userUrl) {
        var deferred = Q.defer();
        var streamUrl = userUrl + "/streams";
        request({url: streamUrl,
            "method": "GET"
        }).then(function (successResponse) {
                logger.debug({fn: "getAllStreams", userID: userUrl, stage: "success_callback"});
                deferred.resolve(successResponse.entity.list)
            },
            function (failureResponse) {
                logger.error({fn: "getAllStreams", userID: userUrl, error: failureResponse, stage: "failure_callback"});
                deferred.reject(failureResponse);
            });
        return deferred.promise;
    };

    var getFollowingInStreams = function (groupUrl, userID) {
        var deferred = Q.defer();
        var followingInUrl = groupUrl + "/followingIn";
        request({url: followingInUrl,
                "method": "GET",
                "headers": {
                    "X-Jive-Run-As": "userid " + userID
                }
            }
        ).then(function (successResponse) {
                logger.debug({fn: "getFollowingInStreams", groupUrl: groupUrl, userID: userID, stage: "success_callback"});
                deferred.resolve(successResponse.entity.list)
            },
            function (failureResponse) {
                logger.error({fn: "getFollowingInStreams", groupUrl: groupUrl, error: failureResponse, stage: "failure_callback"});
                deferred.reject(failureResponse);
            });
        return deferred.promise;
    };



    return {
        get: get,
        update: update,
        getAllStreams: getAllStreams,
        getFollowingInStreams: getFollowingInStreams
    }
};