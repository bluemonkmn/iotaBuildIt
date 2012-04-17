spriteDefinitions.BotMover = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, DeactivateFlag, TempNum) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.DeactivateFlag = DeactivateFlag
   this.TempNum = TempNum
};
spriteDefinitions.BotMover.prototype = new Sprite();
spriteDefinitions.BotMover.prototype.constructor = spriteDefinitions.BotMover;
spriteDefinitions.BotMover.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.BotMover(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.DeactivateFlag,source.TempNum);
}
spriteDefinitions.BotMover.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.BotMover.prototype.toJSON = function() {
   return {"~1":"BotMover",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),DeactivateFlag:this.DeactivateFlag,TempNum:this.TempNum};
}
spriteDefinitions.BotMover.userParams = ["DeactivateFlag","TempNum"];
spriteDefinitions.BotMover.prototype.states = new Array();
spriteDefinitions.BotMover.prototype.categories = ["NeedsPower","Bot","BotCenter"];
spriteDefinitions.BotMover.prototype.states[0] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,23)]);
spriteDefinitions.BotMover.prototype.states[1] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,21)]);
spriteDefinitions.BotMover.prototype.states[2] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,20)]);
spriteDefinitions.BotMover.prototype.states[3] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,22)]);
spriteDefinitions.BotMover.prototype.states[4] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,19)]);
spriteDefinitions.BotMover.statesEnum = {Left: 0,Right: 1,Up: 2,Down: 3,Follow: 4};
spriteDefinitions.BotMover.prototype.executeRules = function() {
   // Get touched energy
   this.TempNum = this.testCollisionRectMargin(this.layer.spriteCategories.BotEnergies, 2);
   // Clear inputs
   this.clearInputs(true);
   // If touched energy
   if (((this.TempNum) >= (0))) {
      // If move right
      if (this.isInState(spriteDefinitions.BotMover.statesEnum.Right, spriteDefinitions.BotMover.statesEnum.Right)) {
         // Input right
         this.setInputState(Sprite.inputBits.right, true);
      }
      // If move left
      if (this.isInState(spriteDefinitions.BotMover.statesEnum.Left, spriteDefinitions.BotMover.statesEnum.Left)) {
         // Input left
         this.setInputState(Sprite.inputBits.left, true);
      }
      // If move up
      if (this.isInState(spriteDefinitions.BotMover.statesEnum.Up, spriteDefinitions.BotMover.statesEnum.Up)) {
         // Input up
         this.setInputState(Sprite.inputBits.up, true);
      }
      // If move down
      if (this.isInState(spriteDefinitions.BotMover.statesEnum.Down, spriteDefinitions.BotMover.statesEnum.Down)) {
         // Input down
         this.setInputState(Sprite.inputBits.down, true);
      }
      // If follow
      if (this.isInState(spriteDefinitions.BotMover.statesEnum.Follow, spriteDefinitions.BotMover.statesEnum.Follow)) {
         // Input follow
         this.setInputsTowardCategory(this.layer.spriteCategories.Enemies, -1);
         // If not following anything
         if ((this.isInputPressed(Sprite.inputBits.up|Sprite.inputBits.right|Sprite.inputBits.down|Sprite.inputBits.left, false) == false)) {
            // Stop moving when not following
            this.reactToInertia(0, 0);
         }
      }
      // Select touched energy
      this.selectTargetSprite(this.layer.spriteCategories.BotEnergies, this.TempNum);
      // Terminate touched energy
      this.setTargetParameter("DeactivateFlag", 1);
   }
   else {
      // Else stop moving
      this.reactToInertia(0, 0);
   }
   // Accelerate by inputs
   this.accelerateByInputs(2, 2, false);
   // React to solidity
   this.reactToSolid();
   // Move
   this.moveByVelocity();
   // If touching tiles that affect bots
   if (this.touchTiles(tileCategories.AffectBots)) {
      // If on biohazard
      if (this.isOnTile(tileCategories.Biohazard, "CenterMiddle")) {
         // Flag for deactivate
         this.DeactivateFlag = 1;
      }
   }
   // If deactivate flag is set
   if (((this.DeactivateFlag) > (0))) {
      // Deactivate
      this.deactivate();
   }
   
};
