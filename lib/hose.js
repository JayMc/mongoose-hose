var defaultOptions = {
	limit: 100,
	arrayName: 'hose',
};

// convert limit to negative for $slice
function toNegative (number) {
	return number - (number * 2)
};

module.exports = exports = function (schema, options = defaultOptions) {

	schema.add({
		[options.arrayName]: [],
	});

	schema.statics.hoseFindByIdAndAdd = function (id, data, cb = null) {
		data.createdAt = new Date()
		console.log('objid', this);
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
