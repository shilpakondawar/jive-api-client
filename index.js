var Q = require('q');
var prequire = require('parent-require');
var jive = prequire('jive-sdk');
var _ = require('lodash');
var user = require("./service/user");
var stream = require("./service/stream");
var group = require("./service/group");
var jiveApi  = require('./service/apiRequest');

var jiveWrapper = function (communityUrl) {
    var api =  jiveApi(communityUrl);
    var apiRequest = api.request;

    //For local development you might need to save community object in memory
    var saveCommunityInMemory = function (community) {
        jive.context.persistence = new jive.persistence.memory();
        return jive.context.persistence.save('community', communityUrl, community);
    };

    //Get the community object only after successful installation of add ons or saving of community object in memory

    var getCommunity = function () {
        return  jive.context.persistence.findByID("community", communityUrl);
    };

    return {
        saveCommunityInMemory: saveCommunityInMemory,
        getCommunity: getCommunity,
        group:group(apiRequest),
        user:user(apiRequest),
        stream:stream(apiRequest),
        request: apiRequest
    }
};


module.exports = jiveWrapper;