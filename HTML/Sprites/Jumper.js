spriteDefinitions.Jumper = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, JumpWait, NearestPlayer, WaitTimer) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.JumpWait = JumpWait
   this.NearestPlayer = NearestPlayer
   this.WaitTimer = WaitTimer
};
spriteDefinitions.Jumper.prototype = new Sprite();
spriteDefinitions.Jumper.prototype.constructor = spriteDefinitions.Jumper;
spriteDefinitions.Jumper.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Jumper(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.JumpWait,source.NearestPlayer,source.WaitTimer);
}
spriteDefinitions.Jumper.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Jumper.prototype.toJSON = function() {
   return {"~1":"Jumper",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),JumpWait:this.JumpWait,NearestPlayer:this.NearestPlayer,WaitTimer:this.WaitTimer};
}
spriteDefinitions.Jumper.userParams = ["JumpWait","NearestPlayer","WaitTimer"];
spriteDefinitions.Jumper.prototype.states = new Array();
spriteDefinitions.Jumper.prototype.categories = ["Enemies"];
spriteDefinitions.Jumper.prototype.states[0] = new SpriteState(32,32,"JumperFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,0),new TileFrame(11,1),new TileFrame(12,2),new TileFrame(17,1),new TileFrame(18,0)]);
spriteDefinitions.Jumper.prototype.states[1] = new SpriteState(32,32,"JumperFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,5),new TileFrame(11,4),new TileFrame(12,3),new TileFrame(17,4),new TileFrame(18,5)]);
spriteDefinitions.Jumper.statesEnum = {Right: 0,Left: 1};
spriteDefinitions.Jumper.prototype.executeRules = function() {
   // If jump timer has reached wait time
   if (((this.WaitTimer) >= (this.JumpWait))) {
      // Animate jump
      this.animate("ByFrame");
      // Jump velocity up
      this.alterYVelocity(-6);
      // Don't be riding a platform
      this.stopRiding();
      // Don't be riding a conveyor
      OnConveyorBelt = 0;
      // If sitting right
      if (this.isInState(spriteDefinitions.Jumper.statesEnum.Right, spriteDefinitions.Jumper.statesEnum.Right)) {
         // Jump velocity right
         this.alterXVelocity(4);
      }
      else {
         // Else Jump velocity left
         this.alterXVelocity(-4);
      }
      // Reset jump timer
      this.WaitTimer = -1;
   }
   // If waiting to jump
   if (((this.WaitTimer) >= (0))) {
      // If on first sitting frame
      if (((this.frame) == (0))) {
         // Get nearest player
         this.NearestPlayer = this.getNearestSpriteIndex(this.layer.spriteCategories.Player);
         // If nearest player exists
         if (this.selectTargetSprite(this.layer.spriteCategories.Player, this.NearestPlayer)) {
            // If player is left of this sprite
            if ((this.isTargetDirection("Left") && this.isInState(spriteDefinitions.Jumper.statesEnum.Right, spriteDefinitions.Jumper.statesEnum.Right))) {
               // Switch to facing left
               this.switchToState(spriteDefinitions.Jumper.statesEnum.Left, "BottomCenter");
            }
            // If player is right of this sprite
            if ((this.isTargetDirection("Right") && this.isInState(spriteDefinitions.Jumper.statesEnum.Left, spriteDefinitions.Jumper.statesEnum.Left))) {
               // Switch to facing right
               this.switchToState(spriteDefinitions.Jumper.statesEnum.Right, "BottomCenter");
            }
            // Zero inertia
            this.reactToInertia(0, 0);
         }
      }
      else {
         // Else animate landing
         this.animate("ByFrame");
      }
      // If returned to sitting
      if (((this.frame) >= (18))) {
         // Reset to sitting frame
         this.frame = 0;
      }
      // Pass the time
      this.WaitTimer = ((this.WaitTimer) + (1));
   }
   // React to gravity
   this.alterYVelocity(.3);
   // Land on platform
   this.landDownOnPlatform(this.layer.spriteCategories.Platforms);
   // Land on conveyor
   this.landOnConveyor(1.4);
   // If jumping
   if (((this.WaitTimer) < (0))) {
      // If riding platform
      if (((this.isRidingPlatform() || this.blocked("Down")) 
               && ((this.dy) >= (0)))) {
         // Stop horizontal velocity
         this.reactToInertia(100, 0);
         // End jump
         this.WaitTimer = ((this.WaitTimer) + (1));
      }
      // If jump animation has not reached jumping frame
      if (((this.frame) != (11))) {
         // Animate until jumping frame
         this.animate("ByFrame");
      }
   }
   // React to platform
   this.reactToPlatform();
   // React to conveyor
   this.reactToConveyor(1.4);
   // React to solidity
   this.reactToSolid();
   // Move
   this.moveByVelocity();
   
};
