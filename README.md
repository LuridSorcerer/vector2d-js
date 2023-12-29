# Vector2d - JavaScript Implementation

This repo demonstrates a 2D vector library written in JavaScript. 

The black square represents a player token. Clicking in the play area creates a
red target square. The player will automatically move toward the target until
it is reached, at which point the target is destroyed and the player stops
moving.

Player movement uses vector math to determine which direction it needs to move
to get to the target and when it has reached it. Animation is framerate
independent. 