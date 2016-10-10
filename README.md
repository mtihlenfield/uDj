uDj!

A more portable IoT jukebox.

TODO:
	- figure out why the server is getting old "song complete" messages on startup
	- fix sqlite code to get rid of possible sql injection
	- implemenent pause/skip
	- write unit tests
	- figure out way for server to ask the player if there are any songs playing on startup and then add
	any songs currently playing to the queue. This way it can recover more gracefull from a server restart.
