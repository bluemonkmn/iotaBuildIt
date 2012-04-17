spriteDefinitions.MenuDummy = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, InputsReleased) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.InputsReleased = InputsReleased
};
spriteDefinitions.MenuDummy.prototype = new Sprite();
spriteDefinitions.MenuDummy.prototype.constructor = spriteDefinitions.MenuDummy;
spriteDefinitions.MenuDummy.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.MenuDummy(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.InputsReleased);
}
spriteDefinitions.MenuDummy.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.MenuDummy.prototype.toJSON = function() {
   return {"~1":"MenuDummy",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),InputsReleased:this.InputsReleased};
}
spriteDefinitions.MenuDummy.userParams = ["InputsReleased"];
spriteDefinitions.MenuDummy.prototype.states = new Array();
spriteDefinitions.MenuDummy.prototype.states[0] = new SpriteState(32,32,"SeedFrames",{x:-9,y:-4,width:49,height:41},[new TileFrame(5,0),new TileFrame(10,1),new TileFrame(15,2),new TileFrame(20,3),new TileFrame(25,4),new TileFrame(30,3),new TileFrame(35,2),new TileFrame(40,1)]);
spriteDefinitions.MenuDummy.statesEnum = {Main: 0};
spriteDefinitions.MenuDummy.prototype.executeRules = function() {
   // Map player 1 to inputs
   this.mapPlayerToInputs(1);
   // If any inputs are pressed
   if ((this.isInputPressed(Sprite.inputBits.up|Sprite.inputBits.right|Sprite.inputBits.down|Sprite.inputBits.left|Sprite.inputBits.button1|Sprite.inputBits.button2|Sprite.inputBits.button3|Sprite.inputBits.button4, false) 
            && ((this.InputsReleased) == (0)))) {
      // Clear all inputs
      this.clearInputs(false);
   }
   else {
      // Else remember that inputs were unpressed
      this.InputsReleased = 1;
   }
   
};
