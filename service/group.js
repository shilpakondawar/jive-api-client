var Q = require('q');
var prequire = require('parent-require')
var jive = prequire('jive-sdk');
var _ = require('lodash');
var logger = jive.logger;
var getPath = require('./../util/getDeepJsonPath');

module.exports = function (request) {
    var get = function (groupApiUrl) {
        var deferred = Q.defer();
        request({
            url: groupApiUrl,
            method: "GET"
        }).then(function (successResponse) {
                deferred.resolve(successResponse.entity)
            },
            function (failureResponse) {
                logger.error({fn: "getGroupEmailID", groupUrl: groupApiUrl, error: failureResponse, stage: "failure_callback"});
                deferred.reject(failureResponse)
            });
        return deferred.promise;
    };

    var update = function (groupApiUrl, groupData) {
        var deferred = Q.defer();
        request({
                url: groupApiUrl,
                "method": "PUT",
                "postBody": groupData
            }
        ).then(function () {
                logger.info({fn: "addEmailIdToGroupDescription", groupUrl: groupApiUrl, stage: "success_callback" });
                deferred.resolve(true)
            },
            function (failureResponse) {
                logger.error({fn: "addEmailIdToGroupDescription", groupUrl: groupApiUrl, error: failureResponse, stage: "failure_callback"});
                deferred.reject(failureResponse);

            });
        return deferred.promise;
    };

    var getGroupData = function (list) {
        return _.map(list, function (e) {
            return {id: e.placeID, name: e.name};
        });
    };

    var getGroups =  function(url, list,callback){
        if(url){
                request({
                    url: url,
                    "method": "GET"
                }).then(function (successResponse) {
                    getGroups(getPath(successResponse, "entity.links.next"), list.concat(getGroupData(successResponse.entity.list)), callback);
                }, function (failureResponse) {
                    logger.error({fn: "getJiveGroups", error: failureResponse});
                    callback(failureResponse, null);
                });
        }else{
            callback(null,list);
        }
    };

    var getAllGroupsIDAndName = function(placeUrl){
        var deferred = Q.defer();
        var groupStartUrl = placeUrl + "?filter=type(group)&count=100&startIndex=0";
        getGroups(groupStartUrl,[],function(err,data){
            if(err)
               deferred.reject(err) ;
            deferred.resolve(data);
        })
        return deferred.promise;
    }

    var deleteGroup = function(groupUrl){
        var deferred = Q.defer();
        request({
            url: groupUrl,
            "method": "DELETE"
        }).then(function () {
            logger.info({fn: "deleteGroup", groupUrl: groupUrl, stage: "success_callback" });
            deferred.resolve(true)
        },function(failureResponse){
            logger.error({fn: "deleteGroup", groupUrl: groupUrl, error: failureResponse, stage: "failure_callback"});
            deferred.reject(failureResponse);
        })
        return deferred.promise;
    }

    var  getFollowerUserId = function (list) {
        return _.map(list, function (e) {
            return e.id
        });
    }

    var getFollowers = function (url, list, callback) {
        if (url) {
            request({
                    url: url,
                    "method": "GET"
                }).then(function (successResponse) {
                    logger.info("got followers successfully",{fn: "getFollowersList", stage: "success_handler"})
                    getFollowers(getPath(successResponse, "entity.links.next"), list.concat(getFollowerUserId(successResponse.entity.list)), callback);
                }, function (failureResponse) {
                    logger.error("getting followers failed",{fn: "getFollowersList", stage: "failure_handler"})
                    return callback(failureResponse, null)
                });
        }
        else
            return  callback(null, list);
    }

    var  getMemberUserId = function (list) {
        return _.map(list, function (e) {
            return e.person.id
        });
    }

    var getMembers = function (url, list, callback) {
        if (url) {
            request({
                    url: url,
                    "method": "GET"
                }).then(function (successResponse) {
                    logger.info("got members successfully",{fn: "getJiveGroup", stage: "success_handler"})
                    getMembers(getPath(successResponse, "entity.links.next"), list.concat(getMemberUserId(successResponse.entity.list)), callback);
                }, function (failureResponse)
                {
                    logger.error("getting members failed",{fn: "getJiveGroup",stage: "failure_handler", error: JSON.stringify(failureResponse)});
                    return callback(failureResponse, null)
                });
        }
        else
            return  callback(null, list);
    }


    return {
        get: get,
        getAllGroupsIDAndName: getAllGroupsIDAndName,
        update: update,
        deleteGroup: deleteGroup,
        getFollowers: getFollowers,
        getMembers: getMembers
    }
};