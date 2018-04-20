a01468749
Volodymyr Samoilenko

This is my code for a CG lab1b

(15%) Add gravity - done
(10%) Add more objects - done
      7 tetrominos was taken from wiki page
      https://en.wikipedia.org/wiki/Tetris
(20%) Non-overlapping - done
(20%) Fail-safe User Interaction - done

(20%) Keeping Score
Whenever we "release" one object and it is stored in the array, check whether one row is completely occupied. If that is the case, clear it from the array and move all the objects about that row as far down as possible without entering already occupied blocks. Output the number of rows deleted thus far. This is the score.

(10%) Game Over/New Game
When the tetrominos stored in the array reach the top line so that there's no space left for new blocks the game should be reset and start anew.

(5%) Change the pixels per block
Add two input buttons to increase or decrease the size of the blocks.

********************************************************************************************
This is my code for a CG lab1a

Need to run node.js because used the server for using textures.
Other ways to fetch image into WebGL I haven't found.
I'm using express, for returning index.html from the server.
For running my project, call "npm start" command.

Some parts of the code were taken from tutorials, but not just copied. They were read, analysed and rewritten by me.

Tasks:
1. Set up a drawing window and draw a simple box - done
2. Draw your first block - done
  2.1 Draw your first block - done
  They defined in primitivesGeometry class.
  2.2 Draw these 2 objects at arbitrary places on the screen - done
  I'm using the getRandom function that defined in a myUtils class.
  getRandom returns a float that describes a part of a point on the canvas with margin, where the margin is 0.5.
  2.3 Assign a random colour to each object - done
  I'm using a material from this tutorial
  https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html
  There is an explanation about using varying for sharing data between shaders.
  From vertex shader to fragment shader. Also, this helps me to define colours, based on the position of vertices.
  2.4 Make the size of a block (also called 'unit') a user-defined variable - done
  I have implemented this with user interaction by pressing "+" and "-"
3. Add simple user interaction and animations  - done
  3.1 "<-" or "a": move the object drawn one unit to the left
  3.2 "->" or "d": move the object drawn one unit to the right
  3.3 "/\" or "w": move the object drawn one unit up
  3.4 "\/" or "s": move the object drawn one unit down
  3.5 "1" or "8": rotate the object drawn 90 degrees counterclockwise
  3.6 "3" or "0": rotate the object drawn 90 degrees clockwise
Extra tasks:
  1. Background image - done
  2. Multiple colours - done
  I have already implemented this in 2.3.
  3. Tetris shapes - done
  There are 4 defined classes for shapes:
  Line, Square, LShape, TShape that extends from Shape
