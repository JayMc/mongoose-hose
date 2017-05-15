var mongoose = require('mongoose');

var defaultOptions = {
	_id: true,
	arrayName: 'hose',
	limit: 100,
};

// convert limit to negative for $slice
function toNegative (number) {
	return number - (number * 2)
};

module.exports = exports = function (schema, options = defaultOptions) {

	schema.add({
		[ options.arrayName ]: [],
	});

	schema.statics.hoseInsert = function (id, data, cb = null) {
		if (options._id !== false) {
			data._id = mongoose.Types.ObjectId();
		}
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

};
