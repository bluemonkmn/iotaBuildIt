spriteDefinitions.InventorySelector = function(layer, x, y, dx, dy, state, frame, active, priority, solidity) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
};
spriteDefinitions.InventorySelector.prototype = new Sprite();
spriteDefinitions.InventorySelector.prototype.constructor = spriteDefinitions.InventorySelector;
spriteDefinitions.InventorySelector.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.InventorySelector(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName]);
}
spriteDefinitions.InventorySelector.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.InventorySelector.prototype.toJSON = function() {
   return {"~1":"InventorySelector",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity)};
}
spriteDefinitions.InventorySelector.userParams = [];
spriteDefinitions.InventorySelector.prototype.states = new Array();
spriteDefinitions.InventorySelector.prototype.states[0] = new SpriteState(32,32,"InventorySelector",{x:-3,y:-3,width:38,height:38},[new TileFrame(5,0),new TileFrame(10,1),new TileFrame(15,2),new TileFrame(20,1)]);
spriteDefinitions.InventorySelector.statesEnum = {Main: 0};
spriteDefinitions.InventorySelector.prototype.executeRules = function() {
   // Map player inputs to sprite inputs
   this.mapPlayerToInputs(1);
   // If inventory button is not pressed
   if ((this.isInputPressed(Sprite.inputBits.button2, false) == false)) {
      // Clear inputs
      this.clearInputs(false);
   }
   // If pressed right
   if (this.isInputPressed(Sprite.inputBits.right, true)) {
      // Plan to move right 1 column
      this.alterXVelocity(32);
   }
   // If pressed down
   if (this.isInputPressed(Sprite.inputBits.down, true)) {
      // Plan to move down one row
      this.alterYVelocity(32);
   }
   // If pressed up
   if (this.isInputPressed(Sprite.inputBits.up, true)) {
      // Plan to move up one row
      this.alterYVelocity(-32);
   }
   // If pressed left
   if (this.isInputPressed(Sprite.inputBits.left, true)) {
      // Plan to move left one column
      this.alterXVelocity(-32);
   }
   // React to solidity (edges of available inventory)
   this.reactToSolid();
   // Move to new cell
   this.moveByVelocity();
   // Stop moving
   this.limitVelocity(0);
   // Select inventory item under cursor
   counters.SelectedInventory.value = this.tileGetValue("CenterMiddle");
   // Animate
   this.animate("ByFrame");
   
};
