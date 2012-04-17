spriteDefinitions.Eater = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Digesting, HitIndex, WalkAfterBurp) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Digesting = Digesting
   this.HitIndex = HitIndex
   this.WalkAfterBurp = WalkAfterBurp
};
spriteDefinitions.Eater.prototype = new Sprite();
spriteDefinitions.Eater.prototype.constructor = spriteDefinitions.Eater;
spriteDefinitions.Eater.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Eater(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Digesting,source.HitIndex,source.WalkAfterBurp);
}
spriteDefinitions.Eater.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Eater.prototype.toJSON = function() {
   return {"~1":"Eater",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Digesting:this.Digesting,HitIndex:this.HitIndex,WalkAfterBurp:this.WalkAfterBurp};
}
spriteDefinitions.Eater.userParams = ["Digesting","HitIndex","WalkAfterBurp"];
spriteDefinitions.Eater.prototype.states = new Array();
spriteDefinitions.Eater.prototype.states[0] = new SpriteState(32,32,"EaterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(15,0),new TileFrame(30,1)]);
spriteDefinitions.Eater.prototype.states[1] = new SpriteState(32,32,"EaterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(15,6),new TileFrame(30,7)]);
spriteDefinitions.Eater.prototype.states[2] = new SpriteState(32,32,"EaterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(10,2),new TileFrame(20,3),new TileFrame(30,4),new TileFrame(50,5),new TileFrame(90,0)]);
spriteDefinitions.Eater.prototype.states[3] = new SpriteState(32,32,"EaterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(10,8),new TileFrame(20,9),new TileFrame(30,10),new TileFrame(50,11),new TileFrame(90,6)]);
spriteDefinitions.Eater.prototype.states[4] = new SpriteState(32,32,"EaterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(20,0)]);
spriteDefinitions.Eater.prototype.states[5] = new SpriteState(32,32,"EaterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(20,6)]);
spriteDefinitions.Eater.prototype.states[6] = new SpriteState(32,32,"EaterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(20,3)]);
spriteDefinitions.Eater.prototype.states[7] = new SpriteState(32,32,"EaterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(20,9)]);
spriteDefinitions.Eater.statesEnum = {WalkLeft: 0,WalkRight: 1,BiteLeft: 2,BiteRight: 3,StandLeft: 4,StandRight: 5,BurpLeft: 6,BurpRight: 7};
spriteDefinitions.Eater.prototype.executeRules = function() {
   // If walking left
   if (this.isInState(spriteDefinitions.Eater.statesEnum.WalkLeft, spriteDefinitions.Eater.statesEnum.WalkLeft)) {
      // Set inputs left
      this.setInputState(Sprite.inputBits.left, true);
      // If hole left
      if (((this.isPointBlocked("CenterMiddle", "Down", this.SolidWidth) == false) 
               && this.isPointBlocked("BottomRight", "Down", 2))) {
         // Turn right
         this.switchToState(spriteDefinitions.Eater.statesEnum.WalkRight, "BottomCenter");
      }
      // If blocked left
      if ((this.blocked("Left") 
               && (this.isMoving("Left") == false))) {
         // Also turn right
         this.switchToState(spriteDefinitions.Eater.statesEnum.WalkRight, "BottomCenter");
      }
   }
   else {
      // Else unset left
      this.setInputState(Sprite.inputBits.left, false);
   }
   // If walking right
   if (this.isInState(spriteDefinitions.Eater.statesEnum.WalkRight, spriteDefinitions.Eater.statesEnum.WalkRight)) {
      // Set input right
      this.setInputState(Sprite.inputBits.right, true);
      // If hole right
      if (((this.isPointBlocked("CenterMiddle", "Down", this.SolidWidth) == false) 
               && this.isPointBlocked("BottomLeft", "Down", 2))) {
         // Turn left
         this.switchToState(spriteDefinitions.Eater.statesEnum.WalkLeft, "BottomCenter");
      }
      // If blocked right
      if ((this.blocked("Right") 
               && (this.isMoving("Right") == false))) {
         // Also turn left
         this.switchToState(spriteDefinitions.Eater.statesEnum.WalkLeft, "BottomCenter");
      }
      // If turned left
      if (this.isInState(spriteDefinitions.Eater.statesEnum.WalkLeft, spriteDefinitions.Eater.statesEnum.WalkLeft)) {
         // Stop pressing right
         this.setInputState(Sprite.inputBits.right, false);
         // Start pressing left
         this.setInputState(Sprite.inputBits.left, true);
      }
   }
   else {
      // Else unset right
      this.setInputState(Sprite.inputBits.right, false);
   }
   // React to gravity
   this.alterYVelocity(.3);
   // React to Inertia
   this.reactToInertia(100, 80);
   // Accelerate according to inputs
   this.accelerateByInputs(5, 3, true);
   // Land on converyor
   this.landOnConveyor(1.4);
   // Land on platform
   this.landDownOnPlatform(this.layer.spriteCategories.Platforms);
   // Animate
   this.animate("ByFrame");
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
   // If biting/digesting
   if (((this.Digesting) != (0))) {
      // If done biting
      if (((this.frame) >= (90))) {
         // If biting right
         if (this.isInState(spriteDefinitions.Eater.statesEnum.BiteRight, spriteDefinitions.Eater.statesEnum.BiteRight)) {
            // Switch to burping rightward
            this.switchToState(spriteDefinitions.Eater.statesEnum.BurpRight, "BottomCenter");
         }
         else {
            // Else switch to burping left
            this.switchToState(spriteDefinitions.Eater.statesEnum.BurpLeft, "BottomCenter");
         }
         // Create burped item
         this.addSpriteHere("CrystalizedBot", "CenterMiddle", "CenterMiddle");
         // Select created sprite
         this.selectLastCreatedSprite();
         // Convert to crystal of digested type
         this.setTargetParameter("Contents", this.Digesting);
         // If burping right
         if (this.isInState(spriteDefinitions.Eater.statesEnum.BurpRight, spriteDefinitions.Eater.statesEnum.BurpRight)) {
            // Push regurgitated item rightward
            this.setTargetParameter("dx", 5);
         }
         else {
            // Else push regurgitated item leftward
            this.setTargetParameter("dx", -5);
         }
         // Reset digesting
         this.Digesting = 0;
         // Reset frame for burping
         this.frame = 0;
      }
   }
   else {
      // Else (not digesting) test touching water droplet
      this.HitIndex = this.testCollisionRect(this.layer.spriteCategories.Water);
      // If touched water
      if (((this.HitIndex) >= (0))) {
         // Digest water
         this.Digesting = 2;
      }
      // Test touching enemies
      this.HitIndex = this.testCollisionRect(this.layer.spriteCategories.Enemies);
      // If touched an enemy
      if (((this.HitIndex) >= (0))) {
         // Select touched enemy
         this.selectTargetSprite(this.layer.spriteCategories.Enemies, this.HitIndex);
         // If enemy is worm
         if (this.isSpriteForTargetOfType("", "Worm")) {
            // Eat (remove) worm
            this.deactivateTargetSpriteFor("");
            // Digest worm
            this.Digesting = 11;
         }
         // If enemy is spider
         if (this.isSpriteForTargetOfType("", "Spider")) {
            // Eat (remove) spider
            this.deactivateTargetSpriteFor("");
            // Digest spider
            this.Digesting = 12;
         }
         // If enemy is explosion
         if (this.isSpriteForTargetOfType("", "Explosion")) {
            // Deactivate this eater
            this.deactivate();
         }
      }
      // If started digesting something
      if (((this.Digesting) != (0))) {
         // If walking left when started digesting
         if (((this.isInState(spriteDefinitions.Eater.statesEnum.WalkLeft, spriteDefinitions.Eater.statesEnum.WalkLeft) || this.isInState(spriteDefinitions.Eater.statesEnum.StandLeft, spriteDefinitions.Eater.statesEnum.StandLeft)) 
                  || this.isInState(spriteDefinitions.Eater.statesEnum.BurpLeft, spriteDefinitions.Eater.statesEnum.BurpLeft))) {
            // Switch to biting left
            this.switchToState(spriteDefinitions.Eater.statesEnum.BiteLeft, "BottomCenter");
         }
         else {
            // Else bite right
            this.switchToState(spriteDefinitions.Eater.statesEnum.BiteRight, "BottomCenter");
         }
         // Reset frame to 0
         this.frame = 0;
      }
   }
   // If sprite is still active
   if (((((this.isActive) == (true)) 
            && this.isInState(spriteDefinitions.Eater.statesEnum.BurpLeft, spriteDefinitions.Eater.statesEnum.BurpRight)) 
            && ((this.frame) >= (60)))) {
      // If walk after burp
      if (((this.WalkAfterBurp) != (0))) {
         // If facing left
         if (this.isInState(spriteDefinitions.Eater.statesEnum.BurpLeft, spriteDefinitions.Eater.statesEnum.BurpLeft)) {
            // Resume walk left
            this.switchToState(spriteDefinitions.Eater.statesEnum.WalkLeft, "BottomCenter");
         }
         else {
            // Else resume walk right
            this.switchToState(spriteDefinitions.Eater.statesEnum.WalkRight, "BottomCenter");
         }
      }
      else {
         // Else (if not walk after burp) if facing left
         if (this.isInState(spriteDefinitions.Eater.statesEnum.BurpLeft, spriteDefinitions.Eater.statesEnum.BurpLeft)) {
            // Resume standing left
            this.switchToState(spriteDefinitions.Eater.statesEnum.StandLeft, "BottomCenter");
         }
         else {
            // Else resume standing right
            this.switchToState(spriteDefinitions.Eater.statesEnum.StandRight, "BottomCenter");
         }
      }
   }
   
};
