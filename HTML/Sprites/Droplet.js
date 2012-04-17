spriteDefinitions.Droplet = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Watered) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Watered = Watered
};
spriteDefinitions.Droplet.prototype = new Sprite();
spriteDefinitions.Droplet.prototype.constructor = spriteDefinitions.Droplet;
spriteDefinitions.Droplet.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Droplet(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Watered);
}
spriteDefinitions.Droplet.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Droplet.prototype.toJSON = function() {
   return {"~1":"Droplet",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Watered:this.Watered};
}
spriteDefinitions.Droplet.userParams = ["Watered"];
spriteDefinitions.Droplet.prototype.states = new Array();
spriteDefinitions.Droplet.prototype.categories = ["Water"];
spriteDefinitions.Droplet.prototype.states[0] = new SpriteState(32,32,"SeedFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,5)]);
spriteDefinitions.Droplet.statesEnum = {Falling: 0};
spriteDefinitions.Droplet.prototype.executeRules = function() {
   // React to gravity
   this.alterYVelocity(4);
   // Limit velocity
   this.limitVelocity(8);
   // If on a camp fire
   if (this.isOnTileValue(29, "BottomCenter")) {
      // Remember watered camp fire
      this.Watered = 1;
      // Extinguish camp fire
      this.tileSetValue(28, "BottomCenter");
   }
   // If on a torch fire
   if (this.isOnTileValue(31, "BottomCenter")) {
      // Remember watered torch fire
      this.Watered = 1;
      // Extinguish torch fire
      this.tileSetValue(30, "BottomCenter");
   }
   // If hit solid
   if (this.reactToSolid()) {
      // Deactivate after hitting ground
      this.deactivate();
   }
   else {
      // Else if watered target
      if (((this.Watered) > (0))) {
         // Deactivate after watering
         this.deactivate();
      }
      else {
         // Else move by velocity
         this.moveByVelocity();
      }
   }
   
};
