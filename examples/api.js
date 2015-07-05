var jiveApiClient = require('./../index.js')
var api = jiveApiClient("https://jive.example.com");

//Get data of group

api.group.get("https://jive.example.com/api/core/v3/places/17257").then(function (groupData) {
    console.log("Group Data", groupData);
});


//Get all groups ID and name
api.group.getAllGroupsIDAndName("https://jive.example.com/api/core/v3/places").then(function (groupData) {
    console.log("Groups ID and name", groupData);
});


//Get All streams of specific user
api.user.getAllStreams("https://jive.example.com/api/v3/people/5707").then(function (streamData) {
    console.log("Streams of user", streamData);
}, function (err) {
    console.log(err);
});


//Get if the specific stream exists for user?
api.stream.isPresent("https://jive.example.com/api/v3/people/5707/streams", "Email Watches").then(function (presentFlag) {
    console.log("Stream Present?", presentFlag);
}, function (err) {
    console.log(err);
});


//Get all associated group with the stream
api.stream.getAssociatedGroups("https://jive.example.com/api/v3/streams/10487/associations?filter=type(group)").then(function (groups) {
    console.log("Associated groups:", groups);
}, function (err) {
    console.log(err);
});


//Get all streams of user following in group
api.user.getFollowingInStreams("https://jive.example.com/api/v3/places/17257", 5707).then(function (streamData) {
    console.log("Following In streams:", streamData);
}, function (err) {
    console.log(err);
});

//Get user
api.user.get("https://jive.example.com/api/v3/people/5705").then(function (userData) {
    console.log("UserData:", userData);
}, function (err) {
    console.log(err);
});

//Update user
api.user.update("https://jive.example.com/api/v3/people/5705",{}).then(function (userData) {
    console.log("Update successful:", userData);
}, function (err) {
    console.log(err);
});

//Create stream with specific name
api.stream.create("https://jive.example.com/api/core/v3/people/5707", "my stream2", false).then(function () {
    console.log("Stream created Successful");
}, function (err) {
    console.log(err);
});


//Change Email Preference of specific stream
api.stream.changeEmailPreference("https://jive.example.com/api/v3/streams/19151", true).then(function () {
    console.log("Email Preferences changed successfully");
}, function (err) {
    console.log(err);
});

//Delete specific stream
api.stream.deleteStream("https://jive.example.com/api/core/v3/streams/19151").then(function () {
    console.log("Request Successful");
}, function (err) {
    console.log(err);
});

//Generic request for calling apis
api.request({url:"https://jive.example.com/api/core/v3/search/places?filter=search(%22test%22)", method:"GET"}).then(function (places) {
    console.log("Searched places:", places);
}, function (err) {
    console.log(err);
});