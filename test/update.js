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

	it('should add many to the hose ', function (done) {
		Channel.findOne({}, function(err, parent) {
			var arr = []
			for (var i = 0; i < 100; i++) {
				arr.push(Channel.hoseInsert(parent._id, { body: 'should add many '+i }))
			}

			Promise.all(arr).then(function(a) {
				Channel.findOne(parent._id, function(err, result) {
					expect(result.hose.length).to.eql(3)
					expect(result.hose[2].body).to.eql('should add many 99')
					done()
				})
			})

		})
	})

	it('should update the first item in the hose', function ( done) {
		Channel.findOne({}, function(err, parent) {

			Channel.hoseUpdate(parent._id, parent.hose[0]._id, { body: 'updated value for first item' })
				.then(r => {
					Channel.findOne(parent._id, function(err, result) {
						expect(result.hose[0].body).to.eql('updated value for first item')
						done();
					})
				})
				.catch(e => {
					console.log('e',e);
				})
		})

	})

	it('should update the last item in the hose', function ( done) {
		Channel.findOne({}, function(err, parent) {

			Channel.hoseUpdate(parent._id, parent.hose[parent.hose.length-1]._id, { body: 'updated value for last item', a: { foo: 'bar' } })
				.then(r => {
					Channel.findOne(parent._id, function(err, result) {
						expect(result.hose[2].body).to.eql('updated value for last item')
						done();
					})
				})
				.catch(e => {
					console.log('e',e);
				})
		})

	})


})
