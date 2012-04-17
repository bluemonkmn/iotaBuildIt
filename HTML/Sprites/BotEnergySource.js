spriteDefinitions.BotEnergySource = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, DeactivateFlag, DoGenerate, Energy, TargetIndex) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.DeactivateFlag = DeactivateFlag
   this.DoGenerate = DoGenerate
   this.Energy = Energy
   this.TargetIndex = TargetIndex
};
spriteDefinitions.BotEnergySource.prototype = new Sprite();
spriteDefinitions.BotEnergySource.prototype.constructor = spriteDefinitions.BotEnergySource;
spriteDefinitions.BotEnergySource.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.BotEnergySource(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.DeactivateFlag,source.DoGenerate,source.Energy,source.TargetIndex);
}
spriteDefinitions.BotEnergySource.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.BotEnergySource.prototype.toJSON = function() {
   return {"~1":"BotEnergySource",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),DeactivateFlag:this.DeactivateFlag,DoGenerate:this.DoGenerate,Energy:this.Energy,TargetIndex:this.TargetIndex};
}
spriteDefinitions.BotEnergySource.userParams = ["DeactivateFlag","DoGenerate","Energy","TargetIndex"];
spriteDefinitions.BotEnergySource.prototype.states = new Array();
spriteDefinitions.BotEnergySource.prototype.categories = ["Bot","BotEnergySources"];
spriteDefinitions.BotEnergySource.prototype.states[0] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,14)]);
spriteDefinitions.BotEnergySource.prototype.states[1] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,16)]);
spriteDefinitions.BotEnergySource.prototype.states[2] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,17)]);
spriteDefinitions.BotEnergySource.statesEnum = {Always: 0,OnCollision: 1,OnSplash: 2};
spriteDefinitions.BotEnergySource.prototype.executeRules = function() {
   // If attached to energy user
   if (this.isRidingPlatform()) {
      // Stick to energy user
      this.stickToAttached("LeftMiddle", "RightMiddle");
      // If always generate energy
      if (this.isInState(spriteDefinitions.BotEnergySource.statesEnum.Always, spriteDefinitions.BotEnergySource.statesEnum.Always)) {
         // Turn on generator always
         this.DoGenerate = 1;
      }
      // If generate energy on collision
      if (this.isInState(spriteDefinitions.BotEnergySource.statesEnum.OnCollision, spriteDefinitions.BotEnergySource.statesEnum.OnCollision)) {
         // Test for collision
         this.TargetIndex = this.testCollisionRect(this.layer.spriteCategories.Enemies);
         // If collision detected
         if (((this.TargetIndex) >= (0))) {
            // Turn on generator for collision
            this.DoGenerate = 1;
         }
      }
      // If generate energy on splash
      if (this.isInState(spriteDefinitions.BotEnergySource.statesEnum.OnSplash, spriteDefinitions.BotEnergySource.statesEnum.OnSplash)) {
         // Test for splash
         this.TargetIndex = this.testCollisionRect(this.layer.spriteCategories.Water);
         // If splashed
         if (((this.TargetIndex) >= (0))) {
            // Turn on generator for splash
            this.DoGenerate = 1;
         }
      }
      // If generating energy
      if (((this.DoGenerate) > (0))) {
         // Generate energy
         this.addSpriteHere("BotEnergy", "RightMiddle", "LeftMiddle");
         // Reset generator flag
         this.DoGenerate = 0;
         // Energy gets used up
         this.Energy = ((this.Energy) - (1));
      }
   }
   else {
      // Else find unattached energy user
      this.TargetIndex = this.findNearestFreeBot(this.layer.spriteCategories.NeedsPower, this.layer.spriteCategories.BotEnergySources, counters.BotRange.value);
      // If unattached energy user is found
      if (((this.TargetIndex) >= (0))) {
         // Attract to unattached energy user
         this.pushTowardCategory(this.layer.spriteCategories.NeedsPower, this.TargetIndex, 2);
      }
      // React to inertia
      this.reactToInertia(99, 99);
      // Limit velocity
      this.limitVelocity(2);
      // If react to solidity changes velocity
      if (this.reactToSolid()) {
         // Tell self to deactivate
         this.DeactivateFlag = 1;
      }
      // Move toward it
      this.moveByVelocity();
      // Test if reached energy user
      this.TargetIndex = this.testCollisionRect(this.layer.spriteCategories.NeedsPower);
      // If reached energy user
      if (((this.TargetIndex) >= (0))) {
         // Check if energy user has energy source already
         this.TargetIndex = this.getTargetAttachment(this.layer.spriteCategories.NeedsPower, -1, this.layer.spriteCategories.BotEnergySources);
         // If target has no attached energy source
         if (((this.TargetIndex) < (0))) {
            // Attach to energy user
            this.attachToNearest(this.layer.spriteCategories.NeedsPower);
         }
      }
   }
   // If touching tiles that affect bots
   if (this.touchTiles(tileCategories.AffectBots)) {
      // If on biohazard
      if (this.isOnTile(tileCategories.Biohazard, "CenterMiddle")) {
         // Flag for deactivate
         this.DeactivateFlag = 1;
      }
   }
   // If depleted
   if ((((this.Energy) <= (0)) 
            || ((this.DeactivateFlag) > (0)))) {
      // Deactivate
      this.deactivate();
   }
   
};
