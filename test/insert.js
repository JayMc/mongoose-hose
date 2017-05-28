var hose = require('../index');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

describe('hose schema method test', function() {
	before(function(done) {
		mongoose.connect('mongodb://localhost/mongoose-hose-test');

		channelSchema = mongoose.Schema({
			title: String,
		});

		options = {
			arrayName: 'hose',
			limit: 3,
		};

		channelSchema.plugin(hose, options);
		Channel = mongoose.model('HoseSchemaPluginTest', channelSchema);

		// reset collection
		Channel.remove({}, function() {
			done();
		})

	})

	after(function() {
		mongoose.connection.close()
	})

	it('should save the doc with a hose', function (done) {
		testChannel = new Channel({ title: 'testChannel' })

		testChannel.save(function (err, doc){

			Channel.findOne({}, function (err, doc) {
				expect(typeof doc.hose).to.eql('object')
				expect(doc.hose).to.be.empty
				done();
			});
		});
	});


	it('should add one to the hose', function (done) {
		// get a parent id for test
		Channel.findOne({}, function(err, parent) {
			Channel.hoseInsert(parent._id, { body: 'hello from hoseInsert' })
				.then((result) => {
					expect(result.nModified).to.be.equal(1)
					Channel.findOne(parent._id, function(err, result) {

						expect(result.hose.length).to.eql(1)
						expect(result.hose[0].body).to.eql('hello from hoseInsert')
						done()
					})

				})
		})
	})

	it('should add 2 more to a hose', function (done) {

		Channel.findOne({}, function(err, parent) {

			Channel.hoseInsert(parent._id, { body: 'hello from hoseInsert 2' })
			.then((result) => {
				expect(result.nModified).to.be.equal(1)

				Channel.hoseInsert(parent._id, { body: 'hello from hoseInsert 3' })
				.then((result) => {
					expect(result.nModified).to.be.equal(1)

					Channel.findOne(parent._id, function(err, result) {
						expect(result.hose.length).to.eql(3)
						expect(result.hose[1].body).to.eql('hello from hoseInsert 2')
						expect(result.hose[2].body).to.eql('hello from hoseInsert 3')
						done()
					})

				})
			})
		})
	})

	it('should add the 4th to a hose by parent id and remove the oldest', function (done) {
		// get a parent id for test
		Channel.findOne({}, function(err, parent) {

			Channel.hoseInsert(parent._id, { body: 'hello from hoseInsert 4' })
			.then((result) => {
				expect(result.nModified).to.be.equal(1)

				Channel.findOne(parent._id, function(err, result) {
					expect(result.hose.length).to.eql(3)
					expect(result.hose[2].body).to.eql('hello from hoseInsert 4')
					done()
				})

			})
		})
	})

	it('should add many to the hose ', function (done) {
		Channel.findOne({}, function(err, parent) {
			var arr = []
			for (var i = 0; i < 1350; i++) {
				arr.push(Channel.hoseInsert(parent._id, { body: 'should add many '+i }))
			}

			Promise.all(arr).then(function(a) {
				Channel.findOne(parent._id, function(err, result) {
					expect(result.hose.length).to.eql(3)
					expect(result.hose[2].body).to.eql('should add many 1349')
					done()
				})
			})

		})
	})

	it('should work with a callback', function (done) {
	// get a parent id for test
	Channel.findOne({}, function(err, parent) {

		Channel.hoseInsert(parent._id, { body: 'with callback' }, function(err, result) {
			expect(result.nModified).to.be.equal(1)

			Channel.findOne(parent._id, function(err, result) {
				expect(result.hose.length).to.eql(3)
				expect(result.hose[2].body).to.eql('with callback')
				done()
			})

		})

	})

})

})
