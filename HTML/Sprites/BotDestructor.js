spriteDefinitions.BotDestructor = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, DeactivateFlag, TargetIndex) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.DeactivateFlag = DeactivateFlag
   this.TargetIndex = TargetIndex
};
spriteDefinitions.BotDestructor.prototype = new Sprite();
spriteDefinitions.BotDestructor.prototype.constructor = spriteDefinitions.BotDestructor;
spriteDefinitions.BotDestructor.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.BotDestructor(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.DeactivateFlag,source.TargetIndex);
}
spriteDefinitions.BotDestructor.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.BotDestructor.prototype.toJSON = function() {
   return {"~1":"BotDestructor",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),DeactivateFlag:this.DeactivateFlag,TargetIndex:this.TargetIndex};
}
spriteDefinitions.BotDestructor.userParams = ["DeactivateFlag","TargetIndex"];
spriteDefinitions.BotDestructor.prototype.states = new Array();
spriteDefinitions.BotDestructor.prototype.categories = ["Bot"];
spriteDefinitions.BotDestructor.prototype.states[0] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(1,27)]);
spriteDefinitions.BotDestructor.statesEnum = {Main: 0};
spriteDefinitions.BotDestructor.prototype.executeRules = function() {
   // Seek bot
   this.pushTowardCategory(this.layer.spriteCategories.Bot, -1, 2);
   // Limit velocity
   this.limitVelocity(4);
   // Move
   this.moveByVelocity();
   // Test collision with bot
   this.TargetIndex = this.testCollisionRectMargin(this.layer.spriteCategories.Bot, 2);
   // If collided
   if (((this.TargetIndex) >= (0))) {
      // Select target
      this.selectTargetSprite(this.layer.spriteCategories.Bot, this.TargetIndex);
      // Tell target to deactivate
      this.setTargetParameter("DeactivateFlag", 1);
      // Tell self to deactivate
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
