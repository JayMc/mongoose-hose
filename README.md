# mongoose-hose

## use cases
* chat
* IOT

## Basic usage
```javascript
mySchema = mongoose.Schema({
	title: String,
});

mySchema.plugin(hose);
```

## options
```javascript
const options = {
	_id: false // prevent subdocs in the hose from having a mongo ObjectId
	limit: 100, // number of hose items before popping off the old ones (think about the size of your subdocs and frequency of read/writes)
	arrayName: 'hose', // name of the hose containing the subdocs
}
```

## API
### hoseFindByIdAndAdd
Callbacks
```javascript
doc.hoseFindByIdAndAdd(parent_id, newComment, function (err, doc) {

})
```

Promise
```javascript
doc.hoseFindByIdAndAdd(parent_id, newComment)
	.then(result => {

	})
	.catch(error => {

	})
```

## get (dev) going
* nvm use
* npm i
* ??
* mocha test
