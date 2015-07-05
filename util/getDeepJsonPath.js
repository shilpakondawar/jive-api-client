var _ =require('lodash');

var getDeepPath = function (obj, keys) {
    if (typeof keys == "string") keys = keys.split(".");
    if (obj === undefined) return void 0;

    if (keys.length === 0) return obj;

    if (obj === null) return void 0;

    return getDeepPath(obj[_.first(keys)], _.rest(keys));
};
module.exports = getDeepPath;