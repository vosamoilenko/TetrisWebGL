a01468749
Volodymyr Samoilenko

This is my code for a CG lab1b

Need to run node.js because used the server for using textures.
Other ways to fetch image into WebGL I haven't found.
I'm using express, for returning index.html from the server.
For running my project, call "npm start" command.

--> I add input buttons ',' and '.' for changing a difficult

(15%) Add gravity - done
  1. add gravity to the object such that it moves downwards by itself. - done
  2. The up "/\" movement should simply cancel the gravity and not move pieces
     down anymore! - done
  3. Further, the down "\/" movement should either reinstate gravity,
     if it was suspended or move the game piece immediately to the bottom
     of the grid (if gravity is ON). - done

(10%) Add more objects
  1. Whenever an object reached the bottom, release the control of the current
     object and introduce a new object at the top of the drawing area. - done

(20%) Non-overlapping - done

(20%) Fail-safe User Interaction - done

(20%) Keeping Score - done

(10%) Game Over/New Game - done

(5%) Change the pixels per block - done
    Add two input buttons (+/-) to increase or decrease the size of the blocks.

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
