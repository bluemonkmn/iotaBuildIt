spriteDefinitions.ThrownTorch = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, BurnTime, NeedIgnite) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.BurnTime = BurnTime
   this.NeedIgnite = NeedIgnite
};
spriteDefinitions.ThrownTorch.prototype = new Sprite();
spriteDefinitions.ThrownTorch.prototype.constructor = spriteDefinitions.ThrownTorch;
spriteDefinitions.ThrownTorch.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.ThrownTorch(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.BurnTime,source.NeedIgnite);
}
spriteDefinitions.ThrownTorch.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.ThrownTorch.prototype.toJSON = function() {
   return {"~1":"ThrownTorch",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),BurnTime:this.BurnTime,NeedIgnite:this.NeedIgnite};
}
spriteDefinitions.ThrownTorch.userParams = ["BurnTime","NeedIgnite"];
spriteDefinitions.ThrownTorch.prototype.states = new Array();
spriteDefinitions.ThrownTorch.prototype.categories = ["ThrownTorch"];
spriteDefinitions.ThrownTorch.prototype.states[0] = new SpriteState(32,32,"ThrownTorchFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,0)]);
spriteDefinitions.ThrownTorch.prototype.states[1] = new SpriteState(32,32,"ThrownTorchFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,1)]);
spriteDefinitions.ThrownTorch.statesEnum = {Left: 0,Right: 1};
spriteDefinitions.ThrownTorch.prototype.executeRules = function() {
   // Gravity
   this.dy = ((this.dy) + (.3));
   // Inertia
   this.reactToInertia(100, 95);
   // Land on platform
   this.landDownOnPlatform(this.layer.spriteCategories.Platforms);
   // Land on conveyor
   this.landOnConveyor(1.4);
   // Animate
   this.animate("ByFrame");
   // React to platform
   this.reactToPlatform();
   // React to conveyor
   this.reactToConveyor(1.4);
   // React to solidity
   this.reactToSolid();
   // Move
   this.moveByVelocity();
   // If need to ignite
   if (((this.NeedIgnite) > (0))) {
      // Create igniter
      this.addSpriteHere("Igniter", "TopLeft", "TopLeft");
      // Select created igniter
      this.selectLastCreatedSprite();
      // If need igniter on left
      if (this.isInState(spriteDefinitions.ThrownTorch.statesEnum.Left, spriteDefinitions.ThrownTorch.statesEnum.Left)) {
         // Set igniter to be on left
         this.setTargetParameter("BecomeFire", 1);
      }
      else {
         // Else set ignoter to be on right
         this.setTargetParameter("BecomeFire", 2);
      }
      // Reset need ignite
      this.NeedIgnite = 0;
   }
   // If burned out
   if (((this.frame) >= (this.BurnTime))) {
      // Deactivate
      this.deactivate();
   }
   
};
