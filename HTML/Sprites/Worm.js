spriteDefinitions.Worm = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, collideIndex) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.collideIndex = collideIndex
};
spriteDefinitions.Worm.prototype = new Sprite();
spriteDefinitions.Worm.prototype.constructor = spriteDefinitions.Worm;
spriteDefinitions.Worm.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Worm(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.collideIndex);
}
spriteDefinitions.Worm.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Worm.prototype.toJSON = function() {
   return {"~1":"Worm",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),collideIndex:this.collideIndex};
}
spriteDefinitions.Worm.userParams = ["collideIndex"];
spriteDefinitions.Worm.prototype.states = new Array();
spriteDefinitions.Worm.prototype.categories = ["Enemies"];
spriteDefinitions.Worm.prototype.states[0] = new SpriteState(32,32,"Worm",{x:0,y:0,width:32,height:32},[new TileFrame(6,0),new TileFrame(12,1),new TileFrame(18,2),new TileFrame(24,1)]);
spriteDefinitions.Worm.prototype.states[1] = new SpriteState(32,32,"Worm",{x:0,y:0,width:32,height:32},[new TileFrame(6,3),new TileFrame(12,4),new TileFrame(18,5),new TileFrame(24,4)]);
spriteDefinitions.Worm.statesEnum = {Left: 0,Right: 1};
spriteDefinitions.Worm.prototype.executeRules = function() {
   // Gravity
   this.dy = ((this.dy) + (.3));
   // Inertia
   this.reactToInertia(100, 95);
   // Un-set inputs
   this.setInputState(Sprite.inputBits.right|Sprite.inputBits.left, false);
   // If facing left
   if (this.isInState(spriteDefinitions.Worm.statesEnum.Left, spriteDefinitions.Worm.statesEnum.Left)) {
      // If blocked left
      if (this.blocked("Left")) {
         // If hit dirt (left)
         if (this.isAgainstTile(tileCategories.WormDiggable, "LeftMiddle", "Left")) {
            // Touch tiles (left)
            this.touchTiles(tileCategories.WormDiggable);
            // Replace dirt with passable dirt (left)
            this.tileChange(9, 88, true);
         }
         else {
            // Else face right
            this.switchToState(spriteDefinitions.Worm.statesEnum.Right, "BottomCenter");
         }
      }
      else {
         // Else move left
         this.setInputState(Sprite.inputBits.left, true);
      }
   }
   else {
      // Else if blocked right
      if (this.blocked("Right")) {
         // Face left
         this.switchToState(spriteDefinitions.Worm.statesEnum.Left, "BottomCenter");
      }
      else {
         // Else move right
         this.setInputState(Sprite.inputBits.right, true);
      }
   }
   // Accelerate
   this.accelerateByInputs(10, 1, true);
   // Land on conveyor
   this.landOnConveyor(1.4);
   // Land on platform
   this.landDownOnPlatform(this.layer.spriteCategories.Platforms);
   // Animate
   this.animate("ByHorizontalVelocity");
   // React to conveyor
   this.reactToConveyor(1.4);
   // React to platform
   this.reactToPlatform();
   // React to solidity
   this.reactToSolid();
   // Snap to ground
   this.snapToGround(2);
   // Move by velocity
   this.moveByVelocity();
   // Test collision with explosion
   this.collideIndex = this.testCollisionRect(this.layer.spriteCategories.Igniters);
   // If collided
   if (((this.collideIndex) >= (0))) {
      // Deactivate
      this.deactivate();
   }
   
};
