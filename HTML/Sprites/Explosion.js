spriteDefinitions.Explosion = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, ExplodeIndex) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.ExplodeIndex = ExplodeIndex
};
spriteDefinitions.Explosion.prototype = new Sprite();
spriteDefinitions.Explosion.prototype.constructor = spriteDefinitions.Explosion;
spriteDefinitions.Explosion.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Explosion(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.ExplodeIndex);
}
spriteDefinitions.Explosion.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Explosion.prototype.toJSON = function() {
   return {"~1":"Explosion",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),ExplodeIndex:this.ExplodeIndex};
}
spriteDefinitions.Explosion.userParams = ["ExplodeIndex"];
spriteDefinitions.Explosion.prototype.states = new Array();
spriteDefinitions.Explosion.prototype.categories = ["Enemies","Igniters"];
spriteDefinitions.Explosion.prototype.states[0] = new SpriteState(32,32,"Explosion",{x:-10,y:-10,width:54,height:54},[new TileFrame(4,0),new TileFrame(8,1),new TileFrame(12,2),new TileFrame(16,3),new TileFrame(20,4),new TileFrame(24,5),new TileFrame(28,6)]);
spriteDefinitions.Explosion.statesEnum = {Main: 0};
spriteDefinitions.Explosion.prototype.executeRules = function() {
   // If on first frame
   if ((((this.frame) == (0)) 
            && this.isVisible())) {
      // Play explosion sound
      sounds.Play("explode");
   }
   // Animate
   this.animate("ByFrame");
   // If ready to propogate
   if (((this.frame) == (20))) {
      // Check for ignitable
      this.touchTiles(tileCategories.Ignitable);
      // Select explosive
      this.ExplodeIndex = this.tileTouchingIndex(27, false, true);
      // While explosives remain
      for (
      ; ((this.ExplodeIndex) >= (0)); 
      ) {
         // Explode
         this.tileAddSprite(this.ExplodeIndex, "Explosion");
         // Select next explosive
         this.ExplodeIndex = this.tileTouchingIndex(27, false, true);
      }
      // Select wood pile
      this.ExplodeIndex = this.tileTouchingIndex(28, false, true);
      // While wood piles remain
      for (
      ; ((this.ExplodeIndex) >= (0)); 
      ) {
         // Ignite wood pile
         this.tileAddSprite(this.ExplodeIndex, "Igniter");
         // Select next wood pile
         this.ExplodeIndex = this.tileTouchingIndex(28, false, true);
      }
      // Select torch
      this.ExplodeIndex = this.tileTouchingIndex(30, false, true);
      // While torches remain
      for (
      ; ((this.ExplodeIndex) >= (0)); 
      ) {
         // Ignite torch
         this.tileAddSprite(this.ExplodeIndex, "Igniter");
         // Select next torch
         this.ExplodeIndex = this.tileTouchingIndex(30, false, true);
      }
      // Check for ignitables again to reset processed flag
      this.touchTiles(tileCategories.Ignitable);
      // Remove explosives
      this.tileChange(27, 0, false);
      // Replace wood piles with igniting wood piles
      this.tileChange(28, 32, false);
      // Replace torches with igniting torches
      this.tileChange(30, 33, false);
   }
   // If looped back to start
   if (((this.frame) >= (29))) {
      // Deactivate
      this.deactivate();
   }
   
};
