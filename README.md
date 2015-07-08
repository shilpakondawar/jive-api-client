This is Wrapper for the Jive V3 REST API which uses jive-sdk api client to do rest api requests.

# Why?

1. Use of OAuth in api request instead of just basic auth. Since library is using jive-sdk api client for api requests, oauth refresh token  flow is automatically handle by sdk  after the successful installation of add ons.No need of extra efforts.
2. Reuse of wrapper method in your various jive add on. Library can save your duplication of same code in various different add ons.

# Pre-requisite

You have to install addons on jive community.


# Sample Usage:
```
var jive= require('jive-api-client');
var api = jive("https://jive.example.com");

api.group.get("https://jive.example.com/api/core/v3/places/17257").
    then(function(groupData){
            console.log("groupData",groupData);},
         function(error){
            console.log("Something got wrong",error)});

api.request({url:"https://jive.example.com/api/core/v3/search/places?filter=search(%22test%22)", method:"GET"})
    .then(function (places) {
             console.log("Searched places:", places);},
          function (err) {
             console.log(err);});
```

# Available Wrapper:

* Group
   * get: Returns groupData for the specified groupURL,
   * getAllGroupsIDAndName: Returns all the groups with IDS and names on your instance,
   * update: Update the group with specified group data

* Stream
   * create: Create the stream for specified user with the specified stream name  and email preferences ,
   * deleteStream: Delete the stream with specified stream URL,
   * getAssociatedGroups: Return all the associated group with specified stream URL
   * isPresent: Return if the stream exists with specified stream name for user,
   * changeEmailPreference: Change the email preference of stream
   * createStreamAssociation: Associate the specified stream with specified placeURL

* User
   * get: Returns the userData of specified userURL,
   * update: Update the user with specified user data
   * getAllStreams: Returns all the streams of users,
   * getFollowingInStreams: Returns all streams of user following in group

* Generic request Wrapper
   You can call any REST api using this request method of wrapper which will help you to reduce your authentication code.

For debugging purpose set the jive logger at debug level

Read [more](https://community.jivesoftware.com/docs/DOC-147007) about using jive-sdk for rest api calls.

# Contributing:

There are lots of [jive apis](https://developers.jivesoftware.com/api/v3/cloud/rest/), right now I have covered few of them.Pull requests are welcome if you want to add support for addition wrapper methods.

# License

MIT