spriteDefinitions.WorldMapPlayer = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, PlayerNum) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.PlayerNum = PlayerNum
};
spriteDefinitions.WorldMapPlayer.prototype = new Sprite();
spriteDefinitions.WorldMapPlayer.prototype.constructor = spriteDefinitions.WorldMapPlayer;
spriteDefinitions.WorldMapPlayer.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.WorldMapPlayer(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.PlayerNum);
}
spriteDefinitions.WorldMapPlayer.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.WorldMapPlayer.prototype.toJSON = function() {
   return {"~1":"WorldMapPlayer",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),PlayerNum:this.PlayerNum};
}
spriteDefinitions.WorldMapPlayer.userParams = ["PlayerNum"];
spriteDefinitions.WorldMapPlayer.prototype.states = new Array();
spriteDefinitions.WorldMapPlayer.prototype.states[0] = new SpriteState(32,32,"PlayerFrames",{x:0,y:0,width:32,height:32},[new TileFrame(10,20),new TileFrame(20,21),new TileFrame(30,22),new TileFrame(40,21)]);
spriteDefinitions.WorldMapPlayer.prototype.states[1] = new SpriteState(32,32,"PlayerFrames",{x:0,y:0,width:32,height:32},[new TileFrame(10,23),new TileFrame(20,24),new TileFrame(30,25),new TileFrame(40,24)]);
spriteDefinitions.WorldMapPlayer.prototype.states[2] = new SpriteState(32,32,"PlayerFrames",{x:0,y:0,width:32,height:32},[new TileFrame(10,26),new TileFrame(20,27),new TileFrame(30,28),new TileFrame(40,27)]);
spriteDefinitions.WorldMapPlayer.prototype.states[3] = new SpriteState(32,32,"PlayerFrames",{x:0,y:0,width:32,height:32},[new TileFrame(10,29),new TileFrame(20,30),new TileFrame(30,31),new TileFrame(40,30)]);
spriteDefinitions.WorldMapPlayer.prototype.states[4] = new SpriteState(32,32,"PlayerFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,32)]);
spriteDefinitions.WorldMapPlayer.statesEnum = {Up: 0,Right: 1,Down: 2,Left: 3,Dead: 4};
spriteDefinitions.WorldMapPlayer.prototype.executeRules = function() {
   // If not pressing horizontal direction
   if ((this.isInputPressed(Sprite.inputBits.right|Sprite.inputBits.left, false) == false)) {
      // Stop horizontal movement
      this.reactToInertia(98, 0);
   }
   // If not pressing vertical direction
   if ((this.isInputPressed(Sprite.inputBits.up|Sprite.inputBits.down, false) == false)) {
      // Stop vertical movement
      this.reactToInertia(0, 98);
   }
   // If dead
   if (this.isInState(spriteDefinitions.WorldMapPlayer.statesEnum.Dead, spriteDefinitions.WorldMapPlayer.statesEnum.Dead)) {
      // Reset inputs
      this.setInputState(Sprite.inputBits.up|Sprite.inputBits.right|Sprite.inputBits.down|Sprite.inputBits.left|Sprite.inputBits.button1|Sprite.inputBits.button2|Sprite.inputBits.button3|Sprite.inputBits.button4, false);
   }
   else {
      // Else read inputs
      this.mapPlayerToInputs(this.PlayerNum);
   }
   // React to inputs
   this.accelerateByInputs(5, 4, false);
   // If pressing right
   if ((this.isInputPressed(Sprite.inputBits.right, false) 
            && (this.isInState(spriteDefinitions.WorldMapPlayer.statesEnum.Right, spriteDefinitions.WorldMapPlayer.statesEnum.Right) == false))) {
      // Face right
      this.switchToState(spriteDefinitions.WorldMapPlayer.statesEnum.Right, "CenterMiddle");
   }
   // If pressing down
   if ((this.isInputPressed(Sprite.inputBits.down, false) 
            && (this.isInState(spriteDefinitions.WorldMapPlayer.statesEnum.Down, spriteDefinitions.WorldMapPlayer.statesEnum.Down) == false))) {
      // Face down
      this.switchToState(spriteDefinitions.WorldMapPlayer.statesEnum.Down, "CenterMiddle");
   }
   // If pressing left
   if ((this.isInputPressed(Sprite.inputBits.left, false) 
            && (this.isInState(spriteDefinitions.WorldMapPlayer.statesEnum.Left, spriteDefinitions.WorldMapPlayer.statesEnum.Left) == false))) {
      // Face left
      this.switchToState(spriteDefinitions.WorldMapPlayer.statesEnum.Left, "CenterMiddle");
   }
   // If pressing up
   if ((this.isInputPressed(Sprite.inputBits.up, false) 
            && (this.isInState(spriteDefinitions.WorldMapPlayer.statesEnum.Up, spriteDefinitions.WorldMapPlayer.statesEnum.Up) == false))) {
      // Face up
      this.switchToState(spriteDefinitions.WorldMapPlayer.statesEnum.Up, "CenterMiddle");
   }
   // React to Solidity
   this.reactToSolid();
   // Move
   this.moveByVelocity();
   // Scroll into view
   this.scrollSpriteIntoView(true);
   // Animate
   this.animate("ByVectorVelocity");
   // If health is zero
   if (((counters.Health.value) == (0))) {
      // If decrease life count hits zero lives
      if (this.changeCounter(counters.Life, "DecrementAndStop")) {
         // Die
         this.switchToState(spriteDefinitions.WorldMapPlayer.statesEnum.Dead, "CenterMiddle");
      }
      else {
         // Else reset health
         this.changeCounter(counters.Health, "SetToMaximum");
      }
   }
   
};
