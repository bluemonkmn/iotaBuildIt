spriteDefinitions.Bomb = function(layer, x, y, dx, dy, state, frame, active, priority, solidity) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
};
spriteDefinitions.Bomb.prototype = new Sprite();
spriteDefinitions.Bomb.prototype.constructor = spriteDefinitions.Bomb;
spriteDefinitions.Bomb.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Bomb(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName]);
}
spriteDefinitions.Bomb.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Bomb.prototype.toJSON = function() {
   return {"~1":"Bomb",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity)};
}
spriteDefinitions.Bomb.userParams = [];
spriteDefinitions.Bomb.prototype.states = new Array();
spriteDefinitions.Bomb.prototype.states[0] = new SpriteState(20,16,"BombFrames",{x:-8,y:-16,width:32,height:32},[new TileFrame(3,0),new TileFrame(6,1),new TileFrame(9,0),new TileFrame(12,1),new TileFrame(15,0),new TileFrame(18,1),new TileFrame(21,0),new TileFrame(24,1),new TileFrame(27,2),new TileFrame(30,3),new TileFrame(33,2),new TileFrame(36,3),new TileFrame(39,2),new TileFrame(42,3),new TileFrame(45,2),new TileFrame(48,3),new TileFrame(51,4),new TileFrame(54,5),new TileFrame(57,4),new TileFrame(60,5),new TileFrame(63,4),new TileFrame(66,5),new TileFrame(69,4),new TileFrame(72,5),new TileFrame(75,6),new TileFrame(78,7),new TileFrame(81,6),new TileFrame(84,7),new TileFrame(87,6),new TileFrame(90,7),new TileFrame(93,6),new TileFrame(96,7),new TileFrame(99,8),new TileFrame(102,9),new TileFrame(105,8),new TileFrame(108,9),new TileFrame(111,8),new TileFrame(114,9),new TileFrame(117,8),new TileFrame(120,9),new TileFrame(123,10),new TileFrame(126,11),new TileFrame(129,10),new TileFrame(132,11),new TileFrame(135,10),new TileFrame(138,11),new TileFrame(141,10),new TileFrame(144,11),new TileFrame(147,12),new TileFrame(150,13),new TileFrame(153,12),new TileFrame(156,13),new TileFrame(159,12),new TileFrame(162,13),new TileFrame(165,12),new TileFrame(168,13),new TileFrame(171,14),new TileFrame(174,15),new TileFrame(177,14),new TileFrame(180,15),new TileFrame(183,14),new TileFrame(186,15),new TileFrame(189,14),new TileFrame(192,15),new TileFrame(195,16),new TileFrame(198,17),new TileFrame(201,16),new TileFrame(204,17),new TileFrame(207,16),new TileFrame(210,17),new TileFrame(213,16),new TileFrame(216,17)]);
spriteDefinitions.Bomb.statesEnum = {Main: 0};
spriteDefinitions.Bomb.prototype.executeRules = function() {
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
   // If looped to start
   if (((this.frame) >= (216))) {
      // Explode
      this.addSpriteHere("Explosion", "CenterMiddle", "CenterMiddle");
      // Deactivate
      this.deactivate();
   }
   
};
