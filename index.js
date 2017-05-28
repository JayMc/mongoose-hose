var mongoose = require('mongoose');

var defaultOptions = {
	arrayName: 'hose',
	limit: 100,
};

// convert limit to negative for $slice
function toNegative (number) {
	return number - (number * 2)
};

// convert obj to dot notation for mongo
function ObjToDotNotation (obj, prefix) {
	var res = {};
	function recurse(o, p) {
		for (var f in o)
		{
			var pre = (p === undefined ? '' : p + ".");
			if (o[f] && typeof o[f] === "object"){
				res = recurse(o[f], pre + f);
			} else {
				res[pre + f] = o[f];
			}
		}
		return res;
	}
	return recurse(obj, prefix);
	return res
};

module.exports = exports = function (schema, options = defaultOptions) {

	schema.add({
		[ options.arrayName ]: [],
	});

	schema.statics.hoseInsert = function (id, data, cb = null) {
		data._id = mongoose.Types.ObjectId();
		data.createdAt = new Date()

		return this.update(
			{ _id: id },
			{
				$push: {
					[options.arrayName]: {
						$each: [ data ],
						$sort: { createdAt: 1 },
						$slice: toNegative(options.limit)
					}
				}
			},
			cb
		)
	}

	schema.statics.hoseUpdate = function (parent_id, doc_id, data, cb = null) {

		var newData = ObjToDotNotation(data, options.arrayName+'.$');

		return this.update(
			{
				_id: parent_id,
				[options.arrayName+'._id']: doc_id
			},
			{
				$set: newData
			},
			cb
		)
	}

};
