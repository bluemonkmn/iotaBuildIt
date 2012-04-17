spriteDefinitions.Rocket = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Ignited) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Ignited = Ignited
};
spriteDefinitions.Rocket.prototype = new Sprite();
spriteDefinitions.Rocket.prototype.constructor = spriteDefinitions.Rocket;
spriteDefinitions.Rocket.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Rocket(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Ignited);
}
spriteDefinitions.Rocket.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Rocket.prototype.toJSON = function() {
   return {"~1":"Rocket",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Ignited:this.Ignited};
}
spriteDefinitions.Rocket.userParams = ["Ignited"];
spriteDefinitions.Rocket.prototype.states = new Array();
spriteDefinitions.Rocket.prototype.categories = ["Igniters"];
spriteDefinitions.Rocket.prototype.states[0] = new SpriteState(32,32,"RocketFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,0)]);
spriteDefinitions.Rocket.prototype.states[1] = new SpriteState(32,32,"RocketFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,1)]);
spriteDefinitions.Rocket.prototype.states[2] = new SpriteState(32,32,"RocketFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,2)]);
spriteDefinitions.Rocket.prototype.states[3] = new SpriteState(32,32,"RocketFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,3)]);
spriteDefinitions.Rocket.prototype.states[4] = new SpriteState(32,32,"RocketFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,4)]);
spriteDefinitions.Rocket.prototype.states[5] = new SpriteState(32,32,"RocketFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,5)]);
spriteDefinitions.Rocket.prototype.states[6] = new SpriteState(32,32,"RocketFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,6)]);
spriteDefinitions.Rocket.prototype.states[7] = new SpriteState(32,32,"RocketFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,7)]);
spriteDefinitions.Rocket.statesEnum = {Up: 0,Right: 1,Down: 2,Left: 3,UpLaunched: 4,RightLaunched: 5,DownLaunched: 6,LeftLaunched: 7};
spriteDefinitions.Rocket.prototype.executeRules = function() {
   // Check for igniters
   this.Ignited = this.testCollisionRect(this.layer.spriteCategories.Igniters);
   // If ignited
   if (((this.Ignited) >= (0))) {
      // If facing up
      if (this.isInState(spriteDefinitions.Rocket.statesEnum.Up, spriteDefinitions.Rocket.statesEnum.Up)) {
         // Launch up
         this.switchToState(spriteDefinitions.Rocket.statesEnum.UpLaunched, "CenterMiddle");
      }
      // If facing right
      if (this.isInState(spriteDefinitions.Rocket.statesEnum.Right, spriteDefinitions.Rocket.statesEnum.Right)) {
         // Launch right
         this.switchToState(spriteDefinitions.Rocket.statesEnum.RightLaunched, "CenterMiddle");
      }
      // If facing down
      if (this.isInState(spriteDefinitions.Rocket.statesEnum.Down, spriteDefinitions.Rocket.statesEnum.Down)) {
         // Launch down
         this.switchToState(spriteDefinitions.Rocket.statesEnum.DownLaunched, "CenterMiddle");
      }
      // If facing left
      if (this.isInState(spriteDefinitions.Rocket.statesEnum.Left, spriteDefinitions.Rocket.statesEnum.Left)) {
         // Launch left
         this.switchToState(spriteDefinitions.Rocket.statesEnum.LeftLaunched, "CenterMiddle");
      }
   }
   // If launched up
   if (this.isInState(spriteDefinitions.Rocket.statesEnum.UpLaunched, spriteDefinitions.Rocket.statesEnum.UpLaunched)) {
      // Press up
      this.setInputState(Sprite.inputBits.up, true);
   }
   else {
      // Else un-press up
      this.setInputState(Sprite.inputBits.up, false);
   }
   // If launched left
   if (this.isInState(spriteDefinitions.Rocket.statesEnum.LeftLaunched, spriteDefinitions.Rocket.statesEnum.LeftLaunched)) {
      // Press left
      this.setInputState(Sprite.inputBits.left, true);
   }
   else {
      // Else un-press left
      this.setInputState(Sprite.inputBits.left, false);
   }
   // If launched down
   if (this.isInState(spriteDefinitions.Rocket.statesEnum.DownLaunched, spriteDefinitions.Rocket.statesEnum.DownLaunched)) {
      // Press down
      this.setInputState(Sprite.inputBits.down, true);
   }
   else {
      // Else un-press down
      this.setInputState(Sprite.inputBits.down, false);
   }
   // If launched right
   if (this.isInState(spriteDefinitions.Rocket.statesEnum.RightLaunched, spriteDefinitions.Rocket.statesEnum.RightLaunched)) {
      // Press right
      this.setInputState(Sprite.inputBits.right, true);
   }
   else {
      // Else un-press right
      this.setInputState(Sprite.inputBits.right, false);
   }
   // If no horizontal inputs are pressed
   if ((this.isInputPressed(Sprite.inputBits.right|Sprite.inputBits.left, false) == false)) {
      // React to horizontal inertia
      this.reactToInertia(100, 50);
   }
   else {
      // Else if no vertical inputs are pressed
      if ((this.isInputPressed(Sprite.inputBits.up|Sprite.inputBits.down, false) == false)) {
         // React to vertical inertia
         this.reactToInertia(50, 100);
      }
   }
   // Accelerate by inputs
   this.accelerateByInputs(10, 8, false);
   // If no inputs are pressed
   if ((this.isInputPressed(Sprite.inputBits.up|Sprite.inputBits.right|Sprite.inputBits.down|Sprite.inputBits.left, false) == false)) {
      // React to gravity
      this.alterYVelocity(.3);
      // Land on conveyor belt
      this.landOnConveyor(1.4);
      // React to conveyor
      this.reactToConveyor(1.4);
      // If riding platform
      if (this.isRidingPlatform()) {
         // ReactToPlatform
         this.reactToPlatform();
      }
      else {
         // Else check for landing on platform
         this.landDownOnPlatform(this.layer.spriteCategories.Platforms);
      }
   }
   // If reacting to solidity hits solid
   if ((this.reactToSolid() && this.isInState(spriteDefinitions.Rocket.statesEnum.UpLaunched, spriteDefinitions.Rocket.statesEnum.LeftLaunched))) {
      // Move next to solid
      this.moveByVelocity();
      // Explode
      this.addSpriteHere("Explosion", "CenterMiddle", "CenterMiddle");
      // Deactivate
      this.deactivate();
   }
   else {
      // Else move by velocity
      this.moveByVelocity();
   }
   
};
