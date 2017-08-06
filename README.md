# mongoose-hose
<p align="center">
	<img height="200" width="200" src="https://raw.githubusercontent.com/JayMc/mongoose-hose/master/logo.png">
</p>

A capped array similar to Mongo's capped collection. The array has a fixed length providing a First in First out (FIFO) behavior. Objects in the array will be automatically pushed down as newer ones are added, when the oldest exceeds the array length it will be 'popped off' (deleted).

This plugin provides a way of storing the latest data in a parent document and saves having to secondarily fetch (or join) data from a related collection. 

## use cases
A chat-room schema with this plugin can contain the latest messages without retrieving multiple documents from the messages schema.

## Basic usage
```javascript
MySchema = mongoose.Schema({
	title: String,
});

MySchema.plugin(hose, /* options */);
```

## options
```javascript
const options = {
	limit: 100, // capped array length - number of items which can be stored before popping off.
	arrayName: 'hose', // name of the capped array hose containing the subdocs
}
```

## Basic usage
### save to hose
Callback
```javascript
const newComment = {
	body: 'Hello',
}

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

### update hose item
Callback
```javascript
MySchema.hoseUpdate(parent_id, hoseItem_id, updatedComment, function (err, doc) {

})
```

Promise
```javascript
MySchema.hoseUpdate(parent_id, hoseItem_id, updatedComment)
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
