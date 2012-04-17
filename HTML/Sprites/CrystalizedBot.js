spriteDefinitions.CrystalizedBot = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Contents, RegenerateTime, regenTimer, temp) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Contents = Contents
   this.RegenerateTime = RegenerateTime
   this.regenTimer = regenTimer
   this.temp = temp
};
spriteDefinitions.CrystalizedBot.prototype = new Sprite();
spriteDefinitions.CrystalizedBot.prototype.constructor = spriteDefinitions.CrystalizedBot;
spriteDefinitions.CrystalizedBot.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.CrystalizedBot(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Contents,source.RegenerateTime,source.regenTimer,source.temp);
}
spriteDefinitions.CrystalizedBot.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.CrystalizedBot.prototype.toJSON = function() {
   return {"~1":"CrystalizedBot",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Contents:this.Contents,RegenerateTime:this.RegenerateTime,regenTimer:this.regenTimer,temp:this.temp};
}
spriteDefinitions.CrystalizedBot.userParams = ["Contents","RegenerateTime","regenTimer","temp"];
spriteDefinitions.CrystalizedBot.prototype.states = new Array();
spriteDefinitions.CrystalizedBot.prototype.states[0] = new SpriteState(32,32,"Sparkles",{x:-4,y:-15,width:23,height:31},[new TileFrame(3,[35,20]),new TileFrame(6,[36,21]),new TileFrame(9,[37,22]),new TileFrame(12,[38,23,10]),new TileFrame(15,[39,24,11]),new TileFrame(18,[25,12]),new TileFrame(21,[26,13,0]),new TileFrame(24,[27,14,1]),new TileFrame(27,[28,15,2]),new TileFrame(30,[29,16,3]),new TileFrame(33,[17,4]),new TileFrame(36,[18,5,30]),new TileFrame(39,[19,6,31]),new TileFrame(42,[7,32]),new TileFrame(45,[8,33]),new TileFrame(48,[9,34])]);
spriteDefinitions.CrystalizedBot.prototype.states[1] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[14,0]),new TileFrame(32,[14,1]),new TileFrame(34,[14,2]),new TileFrame(36,[14,3]),new TileFrame(38,[14,4]),new TileFrame(40,[14,5]),new TileFrame(42,[14,6]),new TileFrame(44,[14,7]),new TileFrame(46,[14,8]),new TileFrame(48,[14,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[2] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[25,0]),new TileFrame(32,[25,1]),new TileFrame(34,[25,2]),new TileFrame(36,[25,3]),new TileFrame(38,[25,4]),new TileFrame(40,[25,5]),new TileFrame(42,[25,6]),new TileFrame(44,[25,7]),new TileFrame(46,[25,8]),new TileFrame(48,[25,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[3] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[24,0]),new TileFrame(32,[24,1]),new TileFrame(34,[24,2]),new TileFrame(36,[24,3]),new TileFrame(38,[24,4]),new TileFrame(40,[24,5]),new TileFrame(42,[24,6]),new TileFrame(44,[24,7]),new TileFrame(46,[24,8]),new TileFrame(48,[24,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[4] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[19,0]),new TileFrame(32,[19,1]),new TileFrame(34,[19,2]),new TileFrame(36,[19,3]),new TileFrame(38,[19,4]),new TileFrame(40,[19,5]),new TileFrame(42,[19,6]),new TileFrame(44,[19,7]),new TileFrame(46,[19,8]),new TileFrame(48,[19,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[5] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[16,0]),new TileFrame(32,[16,1]),new TileFrame(34,[16,2]),new TileFrame(36,[16,3]),new TileFrame(38,[16,4]),new TileFrame(40,[16,5]),new TileFrame(42,[16,6]),new TileFrame(44,[16,7]),new TileFrame(46,[16,8]),new TileFrame(48,[16,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[6] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[17,0]),new TileFrame(32,[17,1]),new TileFrame(34,[17,2]),new TileFrame(36,[17,3]),new TileFrame(38,[17,4]),new TileFrame(40,[17,5]),new TileFrame(42,[17,6]),new TileFrame(44,[17,7]),new TileFrame(46,[17,8]),new TileFrame(48,[17,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[7] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[20,0]),new TileFrame(32,[20,1]),new TileFrame(34,[20,2]),new TileFrame(36,[20,3]),new TileFrame(38,[20,4]),new TileFrame(40,[20,5]),new TileFrame(42,[20,6]),new TileFrame(44,[20,7]),new TileFrame(46,[20,8]),new TileFrame(48,[20,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[8] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[21,0]),new TileFrame(32,[21,1]),new TileFrame(34,[21,2]),new TileFrame(36,[21,3]),new TileFrame(38,[21,4]),new TileFrame(40,[21,5]),new TileFrame(42,[21,6]),new TileFrame(44,[21,7]),new TileFrame(46,[21,8]),new TileFrame(48,[21,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[9] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[22,0]),new TileFrame(32,[22,1]),new TileFrame(34,[22,2]),new TileFrame(36,[22,3]),new TileFrame(38,[22,4]),new TileFrame(40,[22,5]),new TileFrame(42,[22,6]),new TileFrame(44,[22,7]),new TileFrame(46,[22,8]),new TileFrame(48,[22,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[10] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[23,0]),new TileFrame(32,[23,1]),new TileFrame(34,[23,2]),new TileFrame(36,[23,3]),new TileFrame(38,[23,4]),new TileFrame(40,[23,5]),new TileFrame(42,[23,6]),new TileFrame(44,[23,7]),new TileFrame(46,[23,8]),new TileFrame(48,[23,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[11] = new SpriteState(16,16,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[10,0]),new TileFrame(32,[10,1]),new TileFrame(34,[10,2]),new TileFrame(36,[10,3]),new TileFrame(38,[10,4]),new TileFrame(40,[10,5]),new TileFrame(42,[10,6]),new TileFrame(44,[10,7]),new TileFrame(46,[10,8]),new TileFrame(48,[10,9])]);
spriteDefinitions.CrystalizedBot.prototype.states[12] = new SpriteState(32,32,"NanoBotFrames",{x:0,y:0,width:16,height:16},[new TileFrame(30,[13,0]),new TileFrame(32,[13,1]),new TileFrame(34,[13,2]),new TileFrame(36,[13,3]),new TileFrame(38,[13,4]),new TileFrame(40,[13,5]),new TileFrame(42,[13,6]),new TileFrame(44,[13,7]),new TileFrame(46,[13,8]),new TileFrame(48,[13,9])]);
spriteDefinitions.CrystalizedBot.statesEnum = {Regenerating: 0,EnergySource: 1,Water: 2,Bomb: 3,Follower: 4,CollisionPower: 5,SplashPower: 6,MoveUp: 7,MoveRight: 8,MoveDown: 9,MoveLeft: 10,Worm: 11,Spider: 12};
spriteDefinitions.CrystalizedBot.prototype.executeRules = function() {
   // If state does not match contents
   if ((((this.Contents) != (this.state)) 
            && ((this.regenTimer) == (0)))) {
      // If contents is valid
      if (((this.Contents) > (0))) {
         // Switch state
         this.switchToState(this.Contents, "CenterMiddle");
      }
      else {
         // Else match contents to state
         this.Contents = this.state;
      }
   }
   // If regenerating
   if (((this.regenTimer) > (0))) {
      // Run regen timer
      this.regenTimer = ((this.regenTimer) - (1));
   }
   // Animate
   this.animate("ByFrame");
   // React to inertia
   this.reactToInertia(80, 80);
   // React to solidity
   this.reactToSolid();
   // Move by velocity
   this.moveByVelocity();
   // Test for collision with player
   this.temp = this.testCollisionRect(this.layer.spriteCategories.Player);
   // If collided
   if ((((this.temp) >= (0)) 
            && ((this.regenTimer) == (0)))) {
      // If this is an energy source
      if (((this.Contents) == (1))) {
         // Add energy to inventory
         this.changeCounter(counters.BotEnergySources, "IncrementAndStop");
      }
      // If this is water
      if (((this.Contents) == (2))) {
         // Add bot droplet to inventory
         this.changeCounter(counters.BotDroplets, "IncrementAndStop");
      }
      // If this is bomb
      if (((this.Contents) == (3))) {
         // Add bot bomb to inventory
         this.changeCounter(counters.BotBombs, "IncrementAndStop");
      }
      // If this is follower
      if (((this.Contents) == (4))) {
         // Add bot follower to inventory
         this.changeCounter(counters.BotFollowers, "IncrementAndStop");
      }
      // If this is collision power source
      if (((this.Contents) == (5))) {
         // Add bot collision power source to inventory
         this.changeCounter(counters.BotCollisionPowers, "IncrementAndStop");
      }
      // If this is splash power source
      if (((this.Contents) == (6))) {
         // Add bot splash power source to inventory
         this.changeCounter(counters.BotSplashPowers, "IncrementAndStop");
      }
      // If this is worm DNA
      if (((this.Contents) == (11))) {
         // Add worm DNA to inventory
         this.changeCounter(counters.DNAWorms, "IncrementAndStop");
      }
      // If this is spider DNA
      if (((this.Contents) == (12))) {
         // Add spider DNA to inventory
         this.changeCounter(counters.DNASpiders, "IncrementAndStop");
      }
      // If this is a move up bot
      if (((this.Contents) == (7))) {
         // Add move up bot to inventory
         this.changeCounter(counters.BotMoveUps, "IncrementAndStop");
      }
      // If this is a move right bot
      if (((this.Contents) == (8))) {
         // Add move right bot to inventory
         this.changeCounter(counters.BotMoveRights, "IncrementAndStop");
      }
      // If this is a move down bot
      if (((this.Contents) == (9))) {
         // Add move down bot to inventory
         this.changeCounter(counters.BotMoveDowns, "IncrementAndStop");
      }
      // If this is a move left bot
      if (((this.Contents) == (10))) {
         // Add move left bot to inventory
         this.changeCounter(counters.BotMoveLefts, "IncrementAndStop");
      }
      // If this sprite regenerates
      if (((this.RegenerateTime) > (0))) {
         // Switch to regenerating state
         this.switchToState(spriteDefinitions.CrystalizedBot.statesEnum.Regenerating, "CenterMiddle");
         // Set Regen Timer
         this.regenTimer = this.RegenerateTime;
      }
      else {
         // Else Deactivate
         this.deactivate();
      }
   }
   
};
