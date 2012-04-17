spriteDefinitions.MenuPointer = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, MenuItemCount) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.MenuItemCount = MenuItemCount
};
spriteDefinitions.MenuPointer.prototype = new Sprite();
spriteDefinitions.MenuPointer.prototype.constructor = spriteDefinitions.MenuPointer;
spriteDefinitions.MenuPointer.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.MenuPointer(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.MenuItemCount);
}
spriteDefinitions.MenuPointer.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.MenuPointer.prototype.toJSON = function() {
   return {"~1":"MenuPointer",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),MenuItemCount:this.MenuItemCount};
}
spriteDefinitions.MenuPointer.userParams = ["MenuItemCount"];
spriteDefinitions.MenuPointer.prototype.states = new Array();
spriteDefinitions.MenuPointer.prototype.states[0] = new SpriteState(10,12,"CoolFontFrames",{x:0,y:0,width:13,height:18},[new TileFrame(1,136)]);
spriteDefinitions.MenuPointer.statesEnum = {Main: 0};
spriteDefinitions.MenuPointer.prototype.executeRules = function() {
   // Get inputs
   this.mapPlayerToInputs(1);
   // If pressed down
   if (this.isInputPressed(Sprite.inputBits.down, true)) {
      // Move down
      this.moveOverTiles("Down", 2);
   }
   // If pressed up
   if (this.isInputPressed(Sprite.inputBits.up, true)) {
      // Move up
      this.moveOverTiles("Up", 2);
   }
   
};
