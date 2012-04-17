spriteDefinitions.Spider = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Behavior, NextWeb, PlayerDirection, StartY) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Behavior = Behavior
   this.NextWeb = NextWeb
   this.PlayerDirection = PlayerDirection
   this.StartY = StartY
};
spriteDefinitions.Spider.prototype = new Sprite();
spriteDefinitions.Spider.prototype.constructor = spriteDefinitions.Spider;
spriteDefinitions.Spider.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Spider(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Behavior,source.NextWeb,source.PlayerDirection,source.StartY);
}
spriteDefinitions.Spider.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Spider.prototype.toJSON = function() {
   return {"~1":"Spider",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Behavior:this.Behavior,NextWeb:this.NextWeb,PlayerDirection:this.PlayerDirection,StartY:this.StartY};
}
spriteDefinitions.Spider.userParams = ["Behavior","NextWeb","PlayerDirection","StartY"];
spriteDefinitions.Spider.prototype.states = new Array();
spriteDefinitions.Spider.prototype.categories = ["Enemies"];
spriteDefinitions.Spider.prototype.states[0] = new SpriteState(32,32,"SpiderFrames",{x:0,y:0,width:32,height:32},[new TileFrame(10,1),new TileFrame(20,2)]);
spriteDefinitions.Spider.statesEnum = {Main: 0};
spriteDefinitions.Spider.prototype.executeRules = function() {
   // If waiting for player
   if (((this.Behavior) == (0))) {
      // If uninitialized
      if (((this.StartY) == (0))) {
         // Record starting height
         this.StartY = this.y;
      }
      // Push toward player
      this.pushTowardCategory(this.layer.spriteCategories.Player, 0, 50);
      // Get direction
      this.PlayerDirection = this.getPolarStateByVector(spriteDefinitions.Spider.statesEnum.Main, 36);
      // If player is below
      if (((this.PlayerDirection) == (27))) {
         // Initialize NextWeb
         this.NextWeb = this.y;
         // Start falling
         this.Behavior = 1;
      }
      // Reset velocity
      this.limitVelocity(0);
   }
   else {
      // Else if falling
      if (((this.Behavior) == (1))) {
         // Go down
         this.alterYVelocity(1);
         // Limit velocity
         this.limitVelocity(10);
         // While next web is above
         for (
         ; ((this.NextWeb) < (this.y)); 
         ) {
            // Deploy a web segment
            this.addSpriteHere("Web", "TopCenter", "BottomCenter");
            // Select created segment
            this.selectLastCreatedSprite();
            // Move created segment
            this.setTargetParameter("y", this.NextWeb);
            // Increase LastWeb
            this.NextWeb = ((this.NextWeb) + (32));
         }
         // Select player
         this.selectTargetSprite(this.layer.spriteCategories.Player, 0);
         // If player is above
         if (this.isTargetDirection("Up")) {
            // Switch to climbing
            this.Behavior = 2;
            // Stop falling
            this.limitVelocity(0);
         }
      }
      else {
         // Else if climbing
         if (((this.Behavior) == (2))) {
            // climb back up
            this.alterYVelocity(-1);
            // Animate
            this.animate("ByFrame");
            // Limit climb speed
            this.limitVelocity(1);
            // Get nearest web
            this.NextWeb = this.getNearestSpriteIndex(this.layer.spriteCategories.Web);
            // Select nearest web
            this.selectTargetSprite(this.layer.spriteCategories.Web, this.NextWeb);
            // If web selected
            if (((this.NextWeb) >= (0))) {
               // Set web's deactivate height
               this.setTargetParameter("DeactivateHeight", this.y);
            }
            // If reached starting height
            if (((this.y) <= (this.StartY))) {
               // Stop climbing
               this.limitVelocity(0);
               // Snap to exact top
               this.y = this.StartY;
               // Return to waiting state
               this.Behavior = 0;
            }
         }
      }
   }
   // React To Solidity; if solid hit
   if (this.reactToSolid()) {
      // Switch to climbing after hitting solid
      this.Behavior = 2;
   }
   // Move by Velocity
   this.moveByVelocity();
   
};
