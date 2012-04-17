spriteDefinitions.Igniter = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, BecomeFire, TouchIndex) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.BecomeFire = BecomeFire
   this.TouchIndex = TouchIndex
};
spriteDefinitions.Igniter.prototype = new Sprite();
spriteDefinitions.Igniter.prototype.constructor = spriteDefinitions.Igniter;
spriteDefinitions.Igniter.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Igniter(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.BecomeFire,source.TouchIndex);
}
spriteDefinitions.Igniter.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Igniter.prototype.toJSON = function() {
   return {"~1":"Igniter",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),BecomeFire:this.BecomeFire,TouchIndex:this.TouchIndex};
}
spriteDefinitions.Igniter.userParams = ["BecomeFire","TouchIndex"];
spriteDefinitions.Igniter.prototype.states = new Array();
spriteDefinitions.Igniter.prototype.categories = ["Igniters"];
spriteDefinitions.Igniter.prototype.states[0] = new SpriteState(32,32,"IgniterFrames",{x:0,y:0,width:32,height:32},[new TileFrame(20,0),new TileFrame(26,1),new TileFrame(32,2),new TileFrame(38,3),new TileFrame(44,4),new TileFrame(50,3)]);
spriteDefinitions.Igniter.prototype.states[1] = new SpriteState(32,32,"ThrownTorchFrames",{x:-4,y:10,width:32,height:32},[new TileFrame(10,2),new TileFrame(20,3),new TileFrame(30,4),new TileFrame(40,5)]);
spriteDefinitions.Igniter.prototype.states[2] = new SpriteState(32,32,"ThrownTorchFrames",{x:6,y:10,width:32,height:32},[new TileFrame(10,6),new TileFrame(20,7),new TileFrame(30,8),new TileFrame(40,9)]);
spriteDefinitions.Igniter.statesEnum = {Ignite: 0,FireLeft: 1,FireRight: 2};
spriteDefinitions.Igniter.prototype.executeRules = function() {
   // Animate
   this.animate("ByFrame");
   // If become fire
   if (((this.BecomeFire) > (0))) {
      // If not attached
      if ((this.isRidingPlatform() == false)) {
         // Attach to nearest thrown torch
         this.attachToNearest(this.layer.spriteCategories.ThrownTorch);
      }
      // If become fire left
      if (((this.BecomeFire) == (1))) {
         // Switch to left fire
         this.switchToState(spriteDefinitions.Igniter.statesEnum.FireLeft, "CenterMiddle");
      }
      // If become fire right
      if (((this.BecomeFire) == (2))) {
         // Switch to right fire
         this.switchToState(spriteDefinitions.Igniter.statesEnum.FireRight, "CenterMiddle");
      }
      // Stick to attached torch
      this.stickToAttached("TopLeft", "TopLeft");
      // If not still attached
      if ((this.isRidingPlatform() == false)) {
         // Deactivate because torch is gone
         this.deactivate();
      }
   }
   // If time to propogate
   if (((this.frame % 50) == (32))) {
      // Find ignitable tiles
      this.touchTiles(tileCategories.Ignitable);
      // Find wood pile tile
      this.TouchIndex = this.tileTouchingIndex(28, false, true);
      // While wood pile tile found
      for (
      ; ((this.TouchIndex) >= (0)); 
      ) {
         // Ignite neighboring woodpile
         this.tileAddSprite(this.TouchIndex, "Igniter");
         // Find next wood pile tile
         this.TouchIndex = this.tileTouchingIndex(28, false, true);
      }
      // Find torch tile
      this.TouchIndex = this.tileTouchingIndex(30, false, true);
      // While torch tile found
      for (
      ; ((this.TouchIndex) >= (0)); 
      ) {
         // Ignite neighboring torch
         this.tileAddSprite(this.TouchIndex, "Igniter");
         // Find next torch tile
         this.TouchIndex = this.tileTouchingIndex(30, false, true);
      }
      // Select explosive
      this.TouchIndex = this.tileTouchingIndex(27, false, true);
      // While explosives remain
      for (
      ; ((this.TouchIndex) >= (0)); 
      ) {
         // Explode
         this.tileAddSprite(this.TouchIndex, "Explosion");
         // Select next explosive
         this.TouchIndex = this.tileTouchingIndex(27, false, true);
      }
      // Select ice
      this.TouchIndex = this.tileTouchingIndex(57, false, true);
      // While ice remains
      for (
      ; ((this.TouchIndex) >= (0)); 
      ) {
         // Melt
         this.tileAddSprite(this.TouchIndex, "Droplet");
         // Select next ice
         this.TouchIndex = this.tileTouchingIndex(57, false, true);
      }
      // Find ignitable tiles for replacing
      this.touchTiles(tileCategories.Ignitable);
      // Remove explosives
      this.tileChange(27, 0, false);
      // Replace wood piles with igniting wood piles
      this.tileChange(28, 32, false);
      // Remove ice
      this.tileChange(57, 0, false);
      // Replace torches with igniting torches
      this.tileChange(30, 33, false);
   }
   // If looped back to start
   if (((((this.frame) >= (50)) 
            && ((this.isActive) == (true))) 
            && this.isInState(spriteDefinitions.Igniter.statesEnum.Ignite, spriteDefinitions.Igniter.statesEnum.Ignite))) {
      // Find igniting tiles
      this.touchTiles(tileCategories.Igniting);
      // Replace igniting wood pile with buring wood pile
      this.tileChange(32, 29, false);
      // Replace igniting torch with burning torch
      this.tileChange(33, 31, false);
      // Deactivate
      this.deactivate();
   }
   
};
