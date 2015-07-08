var Q = require('q');
var prequire = require('parent-require')
var jive = prequire('jive-sdk');
var _ = require('lodash');
var getPath = require('./../util/getDeepJsonPath');
var logger = jive.logger;

module.exports = function (request) {
    var deleteStream = function (streamUrl) {
        var deferred = Q.defer();
        var streamDeletionRequest = {
            url: streamUrl,
            "method": "DELETE"
        };

        request(streamDeletionRequest)
            .then(function (response) {
                logger.debug({fn: "deleteJiveStream", streamURL: streamUrl, stage: "Success Handler"});
                deferred.resolve(response.entity.id);
            }, function (failureResponse) {
                logger.error({fn: "changeEmailPreference", stage: "error handler", error: failureResponse});
                deferred.reject(failureResponse);
            });
        return deferred.promise;
    };

    var getAssociatedGroupsWithStream = function (streamAssociationUrl, list,callback) {
        if (streamAssociationUrl == undefined) {
            logger.debug({fn: "getAssociatedGroupWithStream", stage: "function_completed"});
            return callback(null,list)
        } else {
            request(
                {
                    url: streamAssociationUrl,
                    "method": "GET"
                }
            ).then(
                function (successResponse) {
                    logger.debug({fn: "getAssociatedGroupWithStream", streamAssociationUrl: streamAssociationUrl, stage: "success_callback"});
                    getAssociatedGroupsWithStream(getPath(successResponse, "entity.links.next"), list.concat(successResponse.entity.list),callback);
                },
                function (failureResponse) {
                    logger.error({fn: "getAssociatedGroupWithStream", streamAssociationUrl: streamAssociationUrl, error: failureResponse, stage: "failure_callback"});
                    return callback(failureResponse, null);
                }
            )
        }
    };

    var getAssociatedGroups = function (streamUrl) {
        var deferred = Q.defer();
        getAssociatedGroupsWithStream(streamUrl, [],function (err,list) {
            if(err)
              deferred.reject(err);
            deferred.resolve(list)
        });
        return deferred.promise;
    };

    var isPresent = function (userStreamsUrl, streamName) {
        var deferred = Q.defer();
        request({
                url: userStreamsUrl,
                "method": "GET"
            }
        ).then(function (successResponse) {
                var streams = _.find(successResponse.entity.list, function (stream) {
                    return stream.name.toLowerCase() == streamName.toLowerCase();
                });
                streams === undefined ? deferred.resolve(false) : deferred.resolve(true);
            },
            function (failureResponse) {
                deferred.reject(failureResponse);
            });

        return deferred.promise;
    };

    var changeEmailPreference = function (streamUrl, isEmailEnabled) {
        var deferred = Q.defer();
        var streamPreferenceChangeRequest = {url: streamUrl,
            "method": "PUT",
            "postBody": {"receiveEmails": isEmailEnabled}};
        request(streamPreferenceChangeRequest)
            .then(function () {
                logger.debug({fn: "changeEmailPreference", streamURL: streamUrl, stage: "success handler"});
                deferred.resolve();
            }, function (failureResponse) {
                logger.error({fn: "changeEmailPreference", stage: "error handler", error: failureResponse});
                deferred.reject(failureResponse);
            });
        return deferred.promise;
    };

    var create = function (userUrl, streamName, isEmailEnabled) {
        var deferred = Q.defer();
        var streamCreationRequest = {url: userUrl + "/streams",
            "method": "POST",
            "postBody": {"name": streamName, "source": "custom", "receiveEmails": isEmailEnabled}};
        request(streamCreationRequest)
            .then(function (response) {
                logger.debug({fn: "createStream", UserUrl: userUrl, streamName: streamName, stage: "success_callback"});

                deferred.resolve(response.entity.id);
            }, function (failureResponse) {
                deferred.reject(failureResponse);
                logger.error({fn: "createStream", stage: "error handler", error: failureResponse});
            });

        return deferred.promise;
    };

    var createStreamAssociation = function (streamAssociationUrl, groupUrl) {
        var deferred = Q.defer();
        request({url: streamAssociationUrl,
                "method": "POST",
                "postBody": [ groupUrl ]
            }
        ).then(function (successResponse) {
                logger.debug({fn: "createStreamAssociation", streamAssociationUrl: streamAssociationUrl,groupUrl: groupUrl, stage: "success handler"})
                deferred.resolve(successResponse);
            }, function (failureResponse) {
                logger.error({fn: "createStreamAssociation", streamAssociationUrl: streamAssociationUrl,groupUrl: groupUrl, stage: "error handler", error:failureResponse});
                deferred.reject(failureResponse);
            });
        return deferred.promise;
    };

    return {
        create: create,
        deleteStream: deleteStream,
        getAssociatedGroups: getAssociatedGroups,
        isPresent: isPresent,
        changeEmailPreference: changeEmailPreference,
        createStreamAssociation: createStreamAssociation
    }
};