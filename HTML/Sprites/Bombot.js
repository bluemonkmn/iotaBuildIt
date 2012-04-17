spriteDefinitions.Bombot = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, BehaviorTimer, MoveTime, TempNum, WaitAfter, WaitBefore) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.BehaviorTimer = BehaviorTimer
   this.MoveTime = MoveTime
   this.TempNum = TempNum
   this.WaitAfter = WaitAfter
   this.WaitBefore = WaitBefore
};
spriteDefinitions.Bombot.prototype = new Sprite();
spriteDefinitions.Bombot.prototype.constructor = spriteDefinitions.Bombot;
spriteDefinitions.Bombot.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Bombot(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.BehaviorTimer,source.MoveTime,source.TempNum,source.WaitAfter,source.WaitBefore);
}
spriteDefinitions.Bombot.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Bombot.prototype.toJSON = function() {
   return {"~1":"Bombot",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),BehaviorTimer:this.BehaviorTimer,MoveTime:this.MoveTime,TempNum:this.TempNum,WaitAfter:this.WaitAfter,WaitBefore:this.WaitBefore};
}
spriteDefinitions.Bombot.userParams = ["BehaviorTimer","MoveTime","TempNum","WaitAfter","WaitBefore"];
spriteDefinitions.Bombot.prototype.states = new Array();
spriteDefinitions.Bombot.prototype.categories = ["Enemies"];
spriteDefinitions.Bombot.prototype.states[0] = new SpriteState(32,32,"Bombot",{x:0,y:0,width:32,height:32},[new TileFrame(4,0),new TileFrame(8,1),new TileFrame(12,2)]);
spriteDefinitions.Bombot.prototype.states[1] = new SpriteState(32,32,"Bombot",{x:0,y:0,width:32,height:32},[new TileFrame(4,3),new TileFrame(8,4),new TileFrame(12,5)]);
spriteDefinitions.Bombot.statesEnum = {Right: 0,Left: 1};
spriteDefinitions.Bombot.prototype.executeRules = function() {
   // Increment behavior timer
   this.BehaviorTimer = ((this.BehaviorTimer) + (1));
   // If current behavior is moving
   if (((this.BehaviorTimer) < (this.MoveTime))) {
      // If state is facing right
      if (this.isInState(spriteDefinitions.Bombot.statesEnum.Right, spriteDefinitions.Bombot.statesEnum.Right)) {
         // If blocked on right
         if (this.blocked("Right")) {
            // Turn to left
            this.switchToState(spriteDefinitions.Bombot.statesEnum.Left, "BottomCenter");
            // Un-press right
            this.setInputState(Sprite.inputBits.right, false);
         }
         else {
            // Press right
            this.setInputState(Sprite.inputBits.right, true);
         }
      }
      else {
         // Else if blocked on left
         if (this.blocked("Left")) {
            // Turn to right
            this.switchToState(spriteDefinitions.Bombot.statesEnum.Right, "BottomCenter");
            // Un-press left
            this.setInputState(Sprite.inputBits.left, false);
         }
         else {
            // Else press left
            this.setInputState(Sprite.inputBits.left, true);
         }
      }
   }
   else {
      // Else un-press inputs
      this.setInputState(Sprite.inputBits.right|Sprite.inputBits.left, false);
      // Calculate wait time
      this.TempNum = ((this.MoveTime) + (this.WaitBefore));
      // If done waiting before bomb
      if (((this.BehaviorTimer) == (this.TempNum))) {
         // Create bomb
         this.addSpriteHere("Bomb", "TopCenter", "TopCenter");
         // Select bomb sprite
         this.selectLastCreatedSprite();
         // Throw bomb upward
         this.setTargetParameter("dy", -4);
         // If bombing leftward
         if (this.isInState(spriteDefinitions.Bombot.statesEnum.Left, spriteDefinitions.Bombot.statesEnum.Left)) {
            // Throw bomb leftward
            this.setTargetParameter("dx", -4);
         }
         else {
            // Else throw bomb rightward
            this.setTargetParameter("dx", 4);
         }
      }
      else {
         // Else calculate wait after 1
         this.TempNum = ((this.MoveTime) + (this.WaitBefore));
         // Calculate wait after 2
         this.TempNum = ((this.TempNum) + (this.WaitAfter));
         // If done waiting after bomb
         if (((this.BehaviorTimer) == (this.TempNum))) {
            // Reset behavior counter for moving
            this.BehaviorTimer = 0;
         }
      }
   }
   // Accelerate
   this.accelerateByInputs(5, 2, true);
   // Gravity
   this.alterYVelocity(.3);
   // Inertia
   this.reactToInertia(100, 95);
   // Land on platform
   this.landDownOnPlatform(this.layer.spriteCategories.Platforms);
   // Land on conveyor
   this.landOnConveyor(1.4);
   // Animate
   this.animate("ByHorizontalVelocity");
   // React to platform
   this.reactToPlatform();
   // React to conveyor
   this.reactToConveyor(1.4);
   // React to solidity
   this.reactToSolid();
   // Move
   this.moveByVelocity();
   // Test collision with water
   this.TempNum = this.testCollisionRect(this.layer.spriteCategories.Water);
   // If touched water
   if (((this.TempNum) >= (0))) {
      // Explode
      this.addSpriteHere("Explosion", "CenterMiddle", "CenterMiddle");
      // Deactivate
      this.deactivate();
   }
   
};
