*noun.* Evan |Eyˈvan|

Evan.js is a simple library for writing event oriented code for client-side.

## Overview ##

The API is designed to have as little to it as possible, while still staying useful. Evan is also designed to be asynchronous, such that when an event is emitted from it, if a function listening to an event throws error, then all the listeners will still be called.

## Usage ##

Firstly, you need an instance of Evan, luckily, there's two ways you can get one. These are:

	var MyEvents = new Evan();

and

	var Model = function(){ /* ... */ };
	Evan(Model);
	
	// or
	var MyApp = {};
	Evan(MyApp);

So what's that doing? In the first case, it simply returns a new instance of `Evan.Emitter`. In the second case, we're mixing in the prototype values of Evan.Emitter into the passed argument and also calling Evan.Emitter with the passed argument as thisArg.

## *To Be Continued...* ##