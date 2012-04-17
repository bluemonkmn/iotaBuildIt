spriteDefinitions.Platform = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, CoordIndex, WaitTime) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.CoordIndex = CoordIndex
   this.WaitTime = WaitTime
};
spriteDefinitions.Platform.prototype = new Sprite();
spriteDefinitions.Platform.prototype.constructor = spriteDefinitions.Platform;
spriteDefinitions.Platform.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Platform(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.CoordIndex,source.WaitTime);
}
spriteDefinitions.Platform.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Platform.prototype.toJSON = function() {
   return {"~1":"Platform",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),CoordIndex:this.CoordIndex,WaitTime:this.WaitTime};
}
spriteDefinitions.Platform.userParams = ["CoordIndex","WaitTime"];
spriteDefinitions.Platform.prototype.states = new Array();
spriteDefinitions.Platform.prototype.categories = ["Platforms","Pusher"];
spriteDefinitions.Platform.prototype.states[0] = new SpriteState(64,2,"Platform",{x:0,y:0,width:64,height:32},[new TileFrame(1,[0,1])]);
spriteDefinitions.Platform.statesEnum = {Main: 0};
spriteDefinitions.Platform.prototype.executeRules = function() {
   // Limit Speed
   this.limitVelocity(3);
   // React to solidity
   this.reactToSolid();
   // Move
   this.moveByVelocity();
   
};
