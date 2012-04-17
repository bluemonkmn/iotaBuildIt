spriteDefinitions.Sprout = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, LengthTemp, Seeds, seedsTemp, Structure, structureTemp) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.LengthTemp = LengthTemp
   this.Seeds = Seeds
   this.seedsTemp = seedsTemp
   this.Structure = Structure
   this.structureTemp = structureTemp
};
spriteDefinitions.Sprout.prototype = new Sprite();
spriteDefinitions.Sprout.prototype.constructor = spriteDefinitions.Sprout;
spriteDefinitions.Sprout.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Sprout(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.LengthTemp,source.Seeds,source.seedsTemp,source.Structure,source.structureTemp);
}
spriteDefinitions.Sprout.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Sprout.prototype.toJSON = function() {
   return {"~1":"Sprout",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),LengthTemp:this.LengthTemp,Seeds:this.Seeds,seedsTemp:this.seedsTemp,Structure:this.Structure,structureTemp:this.structureTemp};
}
spriteDefinitions.Sprout.userParams = ["LengthTemp","Seeds","seedsTemp","Structure","structureTemp"];
spriteDefinitions.Sprout.prototype.states = new Array();
spriteDefinitions.Sprout.prototype.states[0] = new SpriteState(32,32,"MainFrames",{x:0,y:0,width:32,height:32},[new TileFrame(30,69),new TileFrame(60,70),new TileFrame(90,71)]);
spriteDefinitions.Sprout.prototype.states[1] = new SpriteState(32,32,"MainFrames",{x:0,y:0,width:32,height:32},[new TileFrame(30,75),new TileFrame(60,76),new TileFrame(90,77)]);
spriteDefinitions.Sprout.prototype.states[2] = new SpriteState(32,32,"MainFrames",{x:0,y:0,width:32,height:32},[new TileFrame(30,79),new TileFrame(60,80),new TileFrame(90,81)]);
spriteDefinitions.Sprout.prototype.states[3] = new SpriteState(32,32,"SeedFrames",{x:-9,y:-4,width:49,height:41},[new TileFrame(4,0),new TileFrame(8,1),new TileFrame(12,2),new TileFrame(16,3),new TileFrame(20,4),new TileFrame(24,3),new TileFrame(28,2),new TileFrame(32,1)]);
spriteDefinitions.Sprout.statesEnum = {Up: 0,Right: 1,Left: 2,Seed: 3};
spriteDefinitions.Sprout.prototype.executeRules = function() {
   // Animate
   this.animate("ByFrame");
   // If seed
   if (this.isInState(spriteDefinitions.Sprout.statesEnum.Seed, spriteDefinitions.Sprout.statesEnum.Seed)) {
      // React to gravity
      this.alterYVelocity(.3);
      // React to inertia
      this.reactToInertia(100, 95);
      // Land on platform
      this.landDownOnPlatform(this.layer.spriteCategories.Platforms);
      // Land on conveyor
      this.landOnConveyor(1.4);
      // React to platform
      this.reactToPlatform();
      // React to conveyor
      this.reactToConveyor(1.4);
      // React to solidity
      this.reactToSolid();
      // Move
      this.moveByVelocity();
      // Check if watered
      this.seedsTemp = this.testCollisionRect(this.layer.spriteCategories.Water);
      // If watered
      if (((this.seedsTemp) >= (0))) {
         // Switch to sprout
         this.switchToState(spriteDefinitions.Sprout.statesEnum.Up, "BottomCenter");
         // Snap to tile horizontally
         this.snapToTile();
         // Select water
         this.selectTargetSprite(this.layer.spriteCategories.Water, this.seedsTemp);
         // Tell water to finish
         this.setTargetParameter("Watered", 1);
         // Reset frame
         this.frame = 0;
      }
   }
   else {
      // Else (not seed) if finished animating current growth tile
      if (((this.frame) >= (90))) {
         // If (upward) sprout is active
         if ((((this.isActive) == (true)) 
                  && this.isInState(spriteDefinitions.Sprout.statesEnum.Up, spriteDefinitions.Sprout.statesEnum.Up))) {
            // If needs initialization
            if (((this.structureTemp) == (0))) {
               // Initialize Length
               this.LengthTemp = -1;
               // Initialize Seeds
               this.seedsTemp = this.Seeds;
               // Initialize structure
               this.structureTemp = this.Structure;
            }
            // If temporary length is not initialized
            if (((this.LengthTemp) < (0))) {
               // If structure is complete
               if (((this.structureTemp) == (-1))) {
                  // Persist tile value
                  this.tileSetValue(34, "CenterMiddle");
                  // Deactivate upward sprout (while reading length)
                  this.deactivate();
               }
               else {
                  // Else read temporary length from structure
                  this.LengthTemp = this.structureTemp % 10;
                  // Remove length from temporary structure
                  this.structureTemp = this.removeDigit(this.structureTemp);
               }
            }
            // If sprout is still active for upward growth
            if (((this.isActive) == (true))) {
               // Persist stalk tile for growing up
               this.tileSetValue(35, "CenterMiddle");
               // If growth segment has finished (time to branch)
               if (((this.LengthTemp) <= (0))) {
                  // If structure is not empty
                  if (((this.structureTemp) > (0))) {
                     // Get left branch length
                     this.LengthTemp = this.structureTemp % 10;
                     // Remove left branch length from structure
                     this.structureTemp = this.removeDigit(this.structureTemp);
                     // If left branch exists
                     if (((this.LengthTemp) > (0))) {
                        // Spawn left branch
                        this.addSpriteHere("Sprout", "LeftMiddle", "RightMiddle");
                        // Select left sprout
                        this.selectLastCreatedSprite();
                        // Set left branch length
                        this.setTargetParameter("LengthTemp", this.LengthTemp);
                        // Get left branch seed
                        this.LengthTemp = this.seedsTemp % 10;
                        // Set left branch seed
                        this.setTargetParameter("Seeds", this.LengthTemp);
                        // Remove left seed from queue
                        this.seedsTemp = this.removeDigit(this.seedsTemp);
                        // Set left branch state
                        this.setTargetParameter("state", spriteDefinitions.Sprout.statesEnum.Left);
                        // Set stalk to branch left
                        this.tileSetValue(37, "CenterMiddle");
                     }
                     // Get right branch length
                     this.LengthTemp = this.structureTemp % 10;
                     // Remove right branch length from structure
                     this.structureTemp = this.removeDigit(this.structureTemp);
                     // If right branch exists
                     if (((this.LengthTemp) > (0))) {
                        // Spawn right branch
                        this.addSpriteHere("Sprout", "RightMiddle", "LeftMiddle");
                        // Select right sprout
                        this.selectLastCreatedSprite();
                        // Set right branch length
                        this.setTargetParameter("LengthTemp", this.LengthTemp);
                        // Get right branch seed
                        this.LengthTemp = this.seedsTemp % 10;
                        // Set right branch seed
                        this.setTargetParameter("Seeds", this.LengthTemp);
                        // Remove right seed from queue
                        this.seedsTemp = this.removeDigit(this.seedsTemp);
                        // Set right branch state
                        this.setTargetParameter("state", spriteDefinitions.Sprout.statesEnum.Right);
                        // If branched left
                        if (this.isOnTileValue(37, "CenterMiddle")) {
                           // Set stalk to branch both directions
                           this.tileSetValue(41, "CenterMiddle");
                        }
                        else {
                           // Else set stalk to branch right
                           this.tileSetValue(36, "CenterMiddle");
                        }
                     }
                     // Reset temporary length
                     this.LengthTemp = 0;
                  }
                  else {
                     // Else (structure growth is done) set top tile
                     this.tileSetValue(34, "CenterMiddle");
                     // Deactivate upward sprout (during branching check)
                     this.deactivate();
                  }
               }
               // Grow sprout upward
               this.moveOverTiles("Up", 1);
               // Reset growth frame
               this.frame = 0;
            }
            // If remaining structure is empty
            if (((this.structureTemp) == (0))) {
               // Mark structure as completed
               this.structureTemp = -1;
            }
         }
         // If (leftward) sprout is active
         if ((((this.isActive) == (true)) 
                  && this.isInState(spriteDefinitions.Sprout.statesEnum.Left, spriteDefinitions.Sprout.statesEnum.Left))) {
            // If done growing left
            if (((this.LengthTemp) <= (0))) {
               // Persist left tile
               this.tileSetValue(40, "CenterMiddle");
               // Mark sprite to check for left branch seeds and deactivate
               this.seedsTemp = -1;
            }
            else {
               // Set left branch tile
               this.tileSetValue(39, "CenterMiddle");
               // Grow sprout leftward
               this.moveOverTiles("Left", 1);
            }
            // Reset frame for leftward growth
            this.frame = 0;
         }
         // If (rightward) sprout is active
         if ((((this.isActive) == (true)) 
                  && this.isInState(spriteDefinitions.Sprout.statesEnum.Right, spriteDefinitions.Sprout.statesEnum.Right))) {
            // If done growing right
            if (((this.LengthTemp) <= (0))) {
               // Persist right tile
               this.tileSetValue(38, "CenterMiddle");
               // Mark sprite to check for right branch seeds and deactivate
               this.seedsTemp = -1;
            }
            else {
               // Set right branch tile
               this.tileSetValue(39, "CenterMiddle");
               // Grow sprout rightward
               this.moveOverTiles("Right", 1);
            }
            // Reset frame for rightward growth
            this.frame = 0;
         }
         // If time to seed and deactivate
         if (((this.seedsTemp) == (-1))) {
            // If branch contains first seed
            if (((this.Seeds) == (1))) {
               // Spawn first seed
               this.addSpriteHere("Sprout", "RightMiddle", "LeftMiddle");
               // Select created seed
               this.selectLastCreatedSprite();
               // Set seed state
               this.setTargetParameter("state", spriteDefinitions.Sprout.statesEnum.Seed);
               // Set structure
               this.setTargetParameter("Structure", 559);
            }
            // If branch contains second seed
            if (((this.Seeds) == (2))) {
               // Spawn second seed
               this.addSpriteHere("Bomb", "CenterMiddle", "CenterMiddle");
            }
            // If branch contains third seed
            if (((this.Seeds) == (3))) {
               // Spawn third seed
               this.addSpriteHere("Worm", "CenterMiddle", "CenterMiddle");
            }
            // Deactivate branch after seeding
            this.deactivate();
         }
         // Decrease remaining length
         this.LengthTemp = ((this.LengthTemp) - (1));
      }
      // If active
      if ((((this.isActive) == (true)) 
               && (this.isOnTileValue(0, "CenterMiddle") == false))) {
         // Deactivate due to hitting solid
         this.deactivate();
      }
   }
   
};
