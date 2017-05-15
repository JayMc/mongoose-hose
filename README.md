# mongoose-hose
<p align="center">
	<img height="200" width="200" src="https://raw.githubusercontent.com/JayMc/mongoose-hose/master/logo.png">
</p>

## use cases
* chat
* IOT
* Dashboard

## Basic usage (setup)
```javascript
MySchema = mongoose.Schema({
	title: String,
});

MySchema.plugin(hose, /* options */);
```

## options
```javascript
const options = {
	_id: false // prevent subdocs in the hose from having a mongo ObjectId
	limit: 100, // number of hose items before popping off the old ones (think about the size of your subdocs and frequency of read/writes)
	arrayName: 'hose', // name of the hose containing the subdocs
}
```

## Basic usage (save to hose)
Callback
```javascript
MySchema.hoseInsert(parent_id, newComment, function (err, doc) {

})
```

Promise
```javascript
MySchema.hoseInsert(parent_id, newComment)
	.then(result => {

	})
	.catch(error => {

	})
```

## get (dev) going
* nvm use
* npm i
* ??
* npm run test
