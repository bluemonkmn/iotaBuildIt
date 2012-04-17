spriteDefinitions.Package = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Contents, temp) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Contents = Contents
   this.temp = temp
};
spriteDefinitions.Package.prototype = new Sprite();
spriteDefinitions.Package.prototype.constructor = spriteDefinitions.Package;
spriteDefinitions.Package.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Package(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Contents,source.temp);
}
spriteDefinitions.Package.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Package.prototype.toJSON = function() {
   return {"~1":"Package",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Contents:this.Contents,temp:this.temp};
}
spriteDefinitions.Package.userParams = ["Contents","temp"];
spriteDefinitions.Package.prototype.states = new Array();
spriteDefinitions.Package.prototype.categories = ["Platforms","Pusher","Pushback"];
spriteDefinitions.Package.prototype.states[0] = new SpriteState(32,32,"MainFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,83)]);
spriteDefinitions.Package.statesEnum = {Main: 0};
spriteDefinitions.Package.prototype.executeRules = function() {
   // Gravity
   this.dy = ((this.dy) + (.3));
   // Inertia
   this.reactToInertia(100, 50);
   // Land on conveyor
   this.landOnConveyor(1.4);
   // React to conveyor
   this.reactToConveyor(1.4);
   // React to pushers
   this.reactToPush(this.layer.spriteCategories.Pusher);
   // React to pushback
   this.reactToPushback(this.layer.spriteCategories.Pushback);
   // Limit Velocity
   this.limitVelocity(6);
   // React to solidity
   this.reactToSolid();
   // Snap to ground
   this.snapToGround(2);
   // Move
   this.moveByVelocity();
   // Test for explosion
   this.temp = this.testCollisionRect(this.layer.spriteCategories.Igniters);
   // If exploded
   if (((this.temp) >= (0))) {
      // Create crystalized bot
      this.addSpriteHere("CrystalizedBot", "CenterMiddle", "CenterMiddle");
      // Select created sprite
      this.selectLastCreatedSprite();
      // Set contents of crystal
      this.setTargetParameter("Contents", this.Contents);
      // Deactivate
      this.deactivate();
   }
   
};
