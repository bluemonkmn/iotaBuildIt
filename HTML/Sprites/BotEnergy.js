spriteDefinitions.BotEnergy = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, DeactivateFlag) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.DeactivateFlag = DeactivateFlag
};
spriteDefinitions.BotEnergy.prototype = new Sprite();
spriteDefinitions.BotEnergy.prototype.constructor = spriteDefinitions.BotEnergy;
spriteDefinitions.BotEnergy.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.BotEnergy(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.DeactivateFlag);
}
spriteDefinitions.BotEnergy.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.BotEnergy.prototype.toJSON = function() {
   return {"~1":"BotEnergy",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),DeactivateFlag:this.DeactivateFlag};
}
spriteDefinitions.BotEnergy.userParams = ["DeactivateFlag"];
spriteDefinitions.BotEnergy.prototype.states = new Array();
spriteDefinitions.BotEnergy.prototype.categories = ["BotEnergies","Bot"];
spriteDefinitions.BotEnergy.prototype.states[0] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(2,15)]);
spriteDefinitions.BotEnergy.statesEnum = {Bolt: 0};
spriteDefinitions.BotEnergy.prototype.executeRules = function() {
   // Animate
   this.animate("ByFrame");
   // If timeout
   if ((((this.frame) > (1)) 
            || ((this.DeactivateFlag) != (0)))) {
      // Deactivate
      this.deactivate();
   }
   
};
