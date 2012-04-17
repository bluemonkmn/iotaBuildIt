spriteDefinitions.BotBomber = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, DeactivateFlag, TargetIndex) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.DeactivateFlag = DeactivateFlag
   this.TargetIndex = TargetIndex
};
spriteDefinitions.BotBomber.prototype = new Sprite();
spriteDefinitions.BotBomber.prototype.constructor = spriteDefinitions.BotBomber;
spriteDefinitions.BotBomber.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.BotBomber(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.DeactivateFlag,source.TargetIndex);
}
spriteDefinitions.BotBomber.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.BotBomber.prototype.toJSON = function() {
   return {"~1":"BotBomber",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),DeactivateFlag:this.DeactivateFlag,TargetIndex:this.TargetIndex};
}
spriteDefinitions.BotBomber.userParams = ["DeactivateFlag","TargetIndex"];
spriteDefinitions.BotBomber.prototype.states = new Array();
spriteDefinitions.BotBomber.prototype.categories = ["NeedsPower","Bot","BotBombs"];
spriteDefinitions.BotBomber.prototype.states[0] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,24)]);
spriteDefinitions.BotBomber.prototype.states[1] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,25)]);
spriteDefinitions.BotBomber.statesEnum = {Bomb: 0,Water: 1};
spriteDefinitions.BotBomber.prototype.executeRules = function() {
   // If attached to bot
   if (this.isRidingPlatform()) {
      // Stick to bot
      this.stickToAttached("BottomCenter", "TopCenter");
   }
   else {
      // Else find unattached bot
      this.TargetIndex = this.findNearestFreeBot(this.layer.spriteCategories.BotCenter, this.layer.spriteCategories.BotBombs, counters.BotRange.value);
      // If unattached bot found
      if (((this.TargetIndex) >= (0))) {
         // Attact to unattached bot
         this.pushTowardCategory(this.layer.spriteCategories.BotCenter, this.TargetIndex, 2);
      }
      // React to inertia
      this.reactToInertia(99, 99);
      // Limit velocity
      this.limitVelocity(2);
      // If react to solidity changes velocity
      if (((this.reactToSolid() 
               && (System.Math.Abs(dx) < (1))) 
               && (System.Math.Abs(dy) < (1)))) {
         // Tell self to deactivate
         this.DeactivateFlag = 1;
      }
      // Move toward bot
      this.moveByVelocity();
      // Test if reached bot
      this.TargetIndex = this.testCollisionRect(this.layer.spriteCategories.BotCenter);
      // If reached bot
      if (((this.TargetIndex) >= (0))) {
         // Check if target has bomb attachments
         this.TargetIndex = this.getTargetAttachment(this.layer.spriteCategories.BotCenter, -1, this.layer.spriteCategories.BotBombs);
         // If no other it has no other attachments
         if (((this.TargetIndex) < (0))) {
            // Attach to bot
            this.attachToNearest(this.layer.spriteCategories.BotCenter);
         }
      }
   }
   // Test if energy supplied
   this.TargetIndex = this.testCollisionRectMargin(this.layer.spriteCategories.BotEnergies, 2);
   // If energy supplied
   if (((this.TargetIndex) >= (0))) {
      // If in bomb state
      if (this.isInState(spriteDefinitions.BotBomber.statesEnum.Bomb, spriteDefinitions.BotBomber.statesEnum.Bomb)) {
         // Drop bomb
         this.addSpriteHere("Bomb", "TopCenter", "BottomCenter");
      }
      // If in water state
      if (this.isInState(spriteDefinitions.BotBomber.statesEnum.Water, spriteDefinitions.BotBomber.statesEnum.Water)) {
         // Drop water
         this.addSpriteHere("Droplet", "BottomCenter", "TopCenter");
      }
      // Deactivate because finished goal
      this.DeactivateFlag = 1;
   }
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
