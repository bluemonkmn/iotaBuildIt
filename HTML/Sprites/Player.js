spriteDefinitions.Player = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, HurtFlag, InvincibleTimer, PlayerNum, TempNum, TouchedEnemy, TouchIndex) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.HurtFlag = HurtFlag
   this.InvincibleTimer = InvincibleTimer
   this.PlayerNum = PlayerNum
   this.TempNum = TempNum
   this.TouchedEnemy = TouchedEnemy
   this.TouchIndex = TouchIndex
};
spriteDefinitions.Player.prototype = new Sprite();
spriteDefinitions.Player.prototype.constructor = spriteDefinitions.Player;
spriteDefinitions.Player.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Player(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.HurtFlag,source.InvincibleTimer,source.PlayerNum,source.TempNum,source.TouchedEnemy,source.TouchIndex);
}
spriteDefinitions.Player.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Player.prototype.toJSON = function() {
   return {"~1":"Player",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),HurtFlag:this.HurtFlag,InvincibleTimer:this.InvincibleTimer,PlayerNum:this.PlayerNum,TempNum:this.TempNum,TouchedEnemy:this.TouchedEnemy,TouchIndex:this.TouchIndex};
}
spriteDefinitions.Player.userParams = ["HurtFlag","InvincibleTimer","PlayerNum","TempNum","TouchedEnemy","TouchIndex"];
spriteDefinitions.Player.prototype.states = new Array();
spriteDefinitions.Player.prototype.categories = ["Pusher","Player"];
spriteDefinitions.Player.prototype.states[0] = new SpriteState(24,30,"PlayerFrames",{x:-4,y:0,width:32,height:32},[new TileFrame(8,0),new TileFrame(16,1),new TileFrame(24,2),new TileFrame(32,3)]);
spriteDefinitions.Player.prototype.states[1] = new SpriteState(24,30,"PlayerFrames",{x:-4,y:0,width:32,height:32},[new TileFrame(8,4),new TileFrame(16,5),new TileFrame(24,6),new TileFrame(32,7)]);
spriteDefinitions.Player.prototype.states[2] = new SpriteState(24,30,"PlayerFrames",{x:-4,y:0,width:32,height:32},[new TileFrame(8,8),new TileFrame(16,9),new TileFrame(24,10),new TileFrame(32,11),new TileFrame(40,10),new TileFrame(48,9)]);
spriteDefinitions.Player.prototype.states[3] = new SpriteState(24,16,"PlayerFrames",{x:-4,y:0,width:32,height:32},[new TileFrame(8,12),new TileFrame(16,13),new TileFrame(24,14),new TileFrame(32,13)]);
spriteDefinitions.Player.prototype.states[4] = new SpriteState(24,16,"PlayerFrames",{x:-4,y:0,width:32,height:32},[new TileFrame(8,15),new TileFrame(16,16),new TileFrame(24,17),new TileFrame(32,16)]);
spriteDefinitions.Player.prototype.states[5] = new SpriteState(24,30,"PlayerFrames",{x:-4,y:0,width:32,height:32},[new TileFrame(1,18)]);
spriteDefinitions.Player.prototype.states[6] = new SpriteState(24,30,"PlayerFrames",{x:-4,y:0,width:32,height:32},[new TileFrame(1,19)]);
spriteDefinitions.Player.statesEnum = {Right: 0,Left: 1,Climbing: 2,Crouch_right: 3,Crouch_left: 4,Falling_right: 5,Falling_left: 6};
spriteDefinitions.Player.prototype.executeRules = function() {
   // Get Inputs
   this.mapPlayerToInputs(this.PlayerNum);
   // If hurt
   if (((this.HurtFlag) == (2))) {
      // Decrement hurt flag
      this.HurtFlag = ((this.HurtFlag) - (1));
      // If walking right when hurt
      if ((this.isInState(spriteDefinitions.Player.statesEnum.Right, spriteDefinitions.Player.statesEnum.Right) || this.isInState(spriteDefinitions.Player.statesEnum.Crouch_right, spriteDefinitions.Player.statesEnum.Crouch_right))) {
         // Hurled backwards to the left
         this.dx = -4;
         // Hurled upwards top the left
         this.dy = -4;
         // Switch to rightward hurt falling state
         this.switchToState(spriteDefinitions.Player.statesEnum.Falling_right, "BottomCenter");
      }
      else {
         // Else if in another state that needs to switch
         if (this.isInState(spriteDefinitions.Player.statesEnum.Right, spriteDefinitions.Player.statesEnum.Crouch_left)) {
            // Hurled backwards to the right
            this.dx = 4;
            // Hurled upwards to the right
            this.dy = -4;
            // Switch to leftward hurt falling state
            this.switchToState(spriteDefinitions.Player.statesEnum.Falling_left, "BottomCenter");
         }
      }
      // Set temporary invincibility
      this.InvincibleTimer = 120;
      // Set invincible color
      this.ModulateAlpha = 128;
   }
   // If invincible
   if (((this.InvincibleTimer) > (0))) {
      // Decrease invincibility time
      this.InvincibleTimer = ((this.InvincibleTimer) - (1));
      // Animate invincibility color
      this.ModulateAlpha = ((this.ModulateAlpha) - (16));
      // Loop invincibility color...
      if (((this.ModulateAlpha) < (0))) {
         // To half-transparent
         this.ModulateAlpha = 128;
      }
      // If invincibility time expired
      if (((this.InvincibleTimer) == (0))) {
         // Restore non-invincible color
         this.ModulateAlpha = 255;
      }
   }
   else {
      // Else (not invincible) check if touching enemy
      this.TouchedEnemy = this.testCollisionRect(this.layer.spriteCategories.Enemies);
      // If touching enemy
      if (((this.TouchedEnemy) >= (0))) {
         // Set hurt flag for touching an enemy
         this.HurtFlag = 2;
      }
   }
   // Check if touching touchable tiles
   this.touchTiles(tileCategories.Touchable);
   // If touching perilous tile
   if ((this.tileCategoryTouched(tileCategories.Perilous, false) 
            && ((this.InvincibleTimer) == (0)))) {
      // Hurt player from perilous tile
      this.HurtFlag = 2;
   }
   // If touching deadly tiles
   if (this.tileCategoryTouched(tileCategories.InstantDeath, false)) {
      // Set hurt flag for death
      this.HurtFlag = 1;
      // Set health to zero
      this.changeCounter(counters.Health, "SetToMinimum");
   }
   // Take coins
   this.TempNum = this.tileTake(52, counters.Money, 0);
   // If took coins
   if (((this.TempNum) > (0))) {
      // Play bing sound
      sounds.Play("bing");
   }
   // Take health
   this.TempNum = this.tileTake(56, counters.Health, 0);
   // Pay toll gate
   this.tileUseUp(89, counters.Money, 44);
   // If took health
   if (((this.TempNum) > (0))) {
      // Play ahh sound
      sounds.Play("ahh");
   }
   // Take bomb
   this.TempNum = this.tileTake(77, counters.Bombs, 0);
   // If took bomb
   if (((this.TempNum) > (0))) {
      // Play pickup sound for bomb
      sounds.Play("pickup");
   }
   // Take throwable torch
   this.TempNum = this.tileTake(78, counters.ThrowableTorches, 0);
   // If took throwable torch
   if (((this.TempNum) > (0))) {
      // Play pickup sound
      sounds.Play("pickup");
   }
   // If on health fountain
   if ((this.isOnTileValue(50, "CenterMiddle") 
            && ((counters.FrameCounter.value % 60) == (0)))) {
      // If healed
      if ((this.changeCounter(counters.Health, "IncrementAndStop") == false)) {
         // Play Ahh sound for health fountain
         sounds.Play("ahh");
      }
   }
   // If on biohazard
   if (this.isOnTileValue(66, "CenterMiddle")) {
      // Remove move lefts from inventory
      this.changeCounter(counters.BotMoveLefts, "SetToMinimum");
      // Remove move rights from inventory
      this.changeCounter(counters.BotMoveRights, "SetToMinimum");
      // Remove move ups from inventory
      this.changeCounter(counters.BotMoveUps, "SetToMinimum");
      // Remove move downs from inventory
      this.changeCounter(counters.BotMoveDowns, "SetToMinimum");
      // Remove followers from inventory
      this.changeCounter(counters.BotFollowers, "SetToMinimum");
      // Remove splash power sources from inventory
      this.changeCounter(counters.BotSplashPowers, "SetToMinimum");
      // Remove collision power sources from inventory
      this.changeCounter(counters.BotCollisionPowers, "SetToMinimum");
      // Remove bombs from inventory
      this.changeCounter(counters.BotBombs, "SetToMinimum");
      // Remove droplet bots from inventory
      this.changeCounter(counters.BotDroplets, "SetToMinimum");
      // Remove energy source bots from inventory
      this.changeCounter(counters.BotEnergySources, "SetToMinimum");
   }
   // While touching snowflakes
   for (
   ; this.tileCategoryTouched(tileCategories.PlayerMeltable, false); 
   ) {
      // Add water droplet in place of snowflake
      this.tileAddSprite(this.TouchIndex, "Droplet");
      // Remove snowflake
      this.tileChangeTouched(this.TouchIndex, 0);
   }
   // Check if touching faucet
   for (
   ; this.tileCategoryTouched(tileCategories.Faucet, true); 
   ) {
      // Add water droplet in place of faucet
      this.tileAddSprite(this.TouchIndex, "Droplet");
   }
   // If touched checkpoint tile
   if (this.tileCategoryTouched(tileCategories.Checkpoint, false)) {
      // Checkpoint save
      this.saveGame(3, false);
   }
   // If climbing
   if (this.isInState(spriteDefinitions.Player.statesEnum.Climbing, spriteDefinitions.Player.statesEnum.Climbing)) {
      // If not on climbable tile
      if ((this.isOnTile(tileCategories.Climbable, "CenterMiddle") == false)) {
         // If stopped climbing
         if (this.switchToState(spriteDefinitions.Player.statesEnum.Falling_right, "CenterMiddle")) {
            // Switch to standard solidity
            this.setSolidity(solidity.Standard);
         }
      }
      // If inventory not blocking climbing movement keys
      if ((this.isInputPressed(Sprite.inputBits.button2, false) == false)) {
         // React to inputs for climbing
         this.accelerateByInputs(2, 3, false);
      }
      // Inertia for climbing
      this.reactToInertia(90, 90);
      // Animate for climbing
      this.animate("ByVectorVelocity");
      // React To Solid for climbing
      this.reactToSolid();
   }
   else {
      // Else (not climbing) If standing on solid
      if ((this.blocked("Down") || this.isRidingPlatform())) {
         // If falling right
         if (this.isInState(spriteDefinitions.Player.statesEnum.Falling_right, spriteDefinitions.Player.statesEnum.Falling_right)) {
            // Land right
            this.switchToState(spriteDefinitions.Player.statesEnum.Right, "BottomCenter");
         }
         // If falling left
         if (this.isInState(spriteDefinitions.Player.statesEnum.Falling_left, spriteDefinitions.Player.statesEnum.Falling_left)) {
            // Land left
            this.switchToState(spriteDefinitions.Player.statesEnum.Left, "BottomCenter");
         }
         // If inventory button is not blocking jump or crouch action
         if ((this.isInputPressed(Sprite.inputBits.button2, false) == false)) {
            // If pressing jump button
            if (this.isInputPressed(Sprite.inputBits.button1, true)) {
               // If riding on a platform
               if (this.isRidingPlatform()) {
                  // Stop riding platform for jump
                  this.stopRiding();
               }
               // If crouching for jump
               if ((this.isInState(spriteDefinitions.Player.statesEnum.Crouch_right, spriteDefinitions.Player.statesEnum.Crouch_left) && this.unCrouch())) {
                  // High jump
                  this.alterYVelocity(-8);
               }
               else {
                  // Else normal jump
                  this.alterYVelocity(-5);
               }
            }
            // If pressing down
            if (this.isInputPressed(Sprite.inputBits.down, false)) {
               // If walking left
               if (this.isInState(spriteDefinitions.Player.statesEnum.Left, spriteDefinitions.Player.statesEnum.Left)) {
                  // Crouch left
                  this.switchToState(spriteDefinitions.Player.statesEnum.Crouch_left, "BottomCenter");
               }
               // If walking right
               if (this.isInState(spriteDefinitions.Player.statesEnum.Right, spriteDefinitions.Player.statesEnum.Right)) {
                  // Crouch right
                  this.switchToState(spriteDefinitions.Player.statesEnum.Crouch_right, "BottomCenter");
               }
            }
         }
      }
      else {
         // Else (not standing on solid) if walking right (for fall)
         if ((this.isInState(spriteDefinitions.Player.statesEnum.Right, spriteDefinitions.Player.statesEnum.Right) || this.isInState(spriteDefinitions.Player.statesEnum.Crouch_right, spriteDefinitions.Player.statesEnum.Crouch_right))) {
            // Switch to falling/jumping right
            this.switchToState(spriteDefinitions.Player.statesEnum.Falling_right, "BottomCenter");
         }
         // If walking left (for fall)
         if ((this.isInState(spriteDefinitions.Player.statesEnum.Left, spriteDefinitions.Player.statesEnum.Left) || this.isInState(spriteDefinitions.Player.statesEnum.Crouch_left, spriteDefinitions.Player.statesEnum.Crouch_left))) {
            // Switch to falling/jumping left
            this.switchToState(spriteDefinitions.Player.statesEnum.Falling_left, "BottomCenter");
         }
      }
      // If inventory not blocking non-climbing movement keys
      if ((this.isInputPressed(Sprite.inputBits.button2, false) == false)) {
         // If crouching
         if (this.isInState(spriteDefinitions.Player.statesEnum.Crouch_right, spriteDefinitions.Player.statesEnum.Crouch_left)) {
            // React to inputs for crouching
            this.accelerateByInputs(2, 1, true);
         }
         else {
            // Else React To Inputs for Walking
            this.accelerateByInputs(5, 4, true);
         }
         // If pressing up
         if ((((this.isInputPressed(Sprite.inputBits.up, false) && this.isOnTile(tileCategories.Climbable, "CenterMiddle")) 
                  || this.isInputPressed(Sprite.inputBits.down, false)) 
                  && this.isOnTile(tileCategories.Climbable, "BottomCenter"))) {
            // If switched to climbing
            if (this.switchToState(spriteDefinitions.Player.statesEnum.Climbing, "BottomCenter")) {
               // Use climbing solidity
               this.setSolidity(solidity.Climbing_solidity);
            }
         }
         else {
            // Else if pressing down
            if (((this.isInputPressed(Sprite.inputBits.down, false) && this.isAgainstTile(tileCategories.Climbable, "BottomCenter", "Down")) 
                     && this.switchToState(spriteDefinitions.Player.statesEnum.Climbing, "BottomCenter"))) {
               // Fall down a bit
               this.alterYVelocity(2);
               // And switch to climbing solidity
               this.setSolidity(solidity.Climbing_solidity);
            }
         }
         // If pressing up (for un-crouch)
         if (this.isInputPressed(Sprite.inputBits.up, false)) {
            // Un-crouch
            this.unCrouch();
         }
         // If using inventory
         if (this.isInputPressed(Sprite.inputBits.button3, true)) {
            // If bomb is selected
            if ((((counters.SelectedInventory.value) == (0)) 
                     && (this.changeCounter(counters.Bombs, "DecrementAndStop") == false))) {
               // Drop bomb
               this.addSpriteHere("Bomb", "BottomCenter", "BottomCenter");
            }
            // If BotEnergySource is selected
            if ((((counters.SelectedInventory.value) == (1)) 
                     && (this.changeCounter(counters.BotEnergySources, "DecrementAndStop") == false))) {
               // Drop BotEnergySource
               this.addSpriteHere("BotEnergySource", "CenterMiddle", "CenterMiddle");
               // Select new BotEnergy
               this.selectLastCreatedSprite();
               // Set Energy to 200
               this.setTargetParameter("Energy", 200);
            }
            // If BotDestructor is selected
            if (((counters.SelectedInventory.value) == (2))) {
               // Drop BotDestructor
               this.addSpriteHere("BotDestructor", "CenterMiddle", "CenterMiddle");
            }
            // If Bot Mover (follow) is selected
            if ((((counters.SelectedInventory.value) == (3)) 
                     && (this.changeCounter(counters.BotFollowers, "DecrementAndStop") == false))) {
               // Drop follower
               this.addSpriteHere("BotMover", "CenterMiddle", "CenterMiddle");
               // Select created follower
               this.selectLastCreatedSprite();
               // Set state to follow
               this.setTargetParameter("state", spriteDefinitions.BotMover.statesEnum.Follow);
            }
            // If Bot Mover (up) is selected
            if ((((counters.SelectedInventory.value) == (9)) 
                     && (this.changeCounter(counters.BotMoveUps, "DecrementAndStop") == false))) {
               // Drop bot move up
               this.addSpriteHere("BotMover", "CenterMiddle", "CenterMiddle");
               // Select created bot move up
               this.selectLastCreatedSprite();
               // Set state to up
               this.setTargetParameter("state", spriteDefinitions.BotMover.statesEnum.Up);
            }
            // If Bot Mover (right) is selected
            if ((((counters.SelectedInventory.value) == (10)) 
                     && (this.changeCounter(counters.BotMoveRights, "DecrementAndStop") == false))) {
               // Drop bot move right
               this.addSpriteHere("BotMover", "CenterMiddle", "CenterMiddle");
               // Select created bot move right
               this.selectLastCreatedSprite();
               // Set state to right
               this.setTargetParameter("state", spriteDefinitions.BotMover.statesEnum.Right);
            }
            // If Bot Mover (down) is selected
            if ((((counters.SelectedInventory.value) == (11)) 
                     && (this.changeCounter(counters.BotMoveDowns, "DecrementAndStop") == false))) {
               // Drop bot move down
               this.addSpriteHere("BotMover", "CenterMiddle", "CenterMiddle");
               // Select created bot move down
               this.selectLastCreatedSprite();
               // Set state to down
               this.setTargetParameter("state", spriteDefinitions.BotMover.statesEnum.Down);
            }
            // If Bot Mover (left) is selected
            if ((((counters.SelectedInventory.value) == (12)) 
                     && (this.changeCounter(counters.BotMoveLefts, "DecrementAndStop") == false))) {
               // Drop bot move left
               this.addSpriteHere("BotMover", "CenterMiddle", "CenterMiddle");
               // Select created bot move left
               this.selectLastCreatedSprite();
               // Set state to left
               this.setTargetParameter("state", spriteDefinitions.BotMover.statesEnum.Left);
            }
            // If collision power source is selected
            if ((((counters.SelectedInventory.value) == (4)) 
                     && (this.changeCounter(counters.BotCollisionPowers, "DecrementAndStop") == false))) {
               // Drop collision power source
               this.addSpriteHere("BotEnergySource", "CenterMiddle", "CenterMiddle");
               // Select created collision power source
               this.selectLastCreatedSprite();
               // Set collision power source energy to 200
               this.setTargetParameter("Energy", 200);
               // Set state to collision power source
               this.setTargetParameter("state", spriteDefinitions.BotEnergySource.statesEnum.OnCollision);
            }
            // If splash power source is selected
            if ((((counters.SelectedInventory.value) == (5)) 
                     && (this.changeCounter(counters.BotSplashPowers, "DecrementAndStop") == false))) {
               // Drop splash power source
               this.addSpriteHere("BotEnergySource", "CenterMiddle", "CenterMiddle");
               // Select created splash power source
               this.selectLastCreatedSprite();
               // Set splash power source energy to 200
               this.setTargetParameter("Energy", 200);
               // Set state to splash power source
               this.setTargetParameter("state", spriteDefinitions.BotEnergySource.statesEnum.OnSplash);
            }
            // If bot bomber is selected
            if ((((counters.SelectedInventory.value) == (6)) 
                     && (this.changeCounter(counters.BotBombs, "DecrementAndStop") == false))) {
               // Drop bot bomber
               this.addSpriteHere("BotBomber", "CenterMiddle", "CenterMiddle");
            }
            // If bot water bomber is selected
            if ((((counters.SelectedInventory.value) == (7)) 
                     && (this.changeCounter(counters.BotDroplets, "DecrementAndStop") == false))) {
               // Drop water bomber
               this.addSpriteHere("BotBomber", "CenterMiddle", "CenterMiddle");
               // Select new water bomber
               this.selectLastCreatedSprite();
               // Set state to water bomber
               this.setTargetParameter("state", spriteDefinitions.BotBomber.statesEnum.Water);
            }
            // If throwable torch is selected
            if ((((counters.SelectedInventory.value) == (8)) 
                     && (this.changeCounter(counters.ThrowableTorches, "DecrementAndStop") == false))) {
               // If walking rightward
               if (((this.isInState(spriteDefinitions.Player.statesEnum.Right, spriteDefinitions.Player.statesEnum.Right) || this.isInState(spriteDefinitions.Player.statesEnum.Crouch_right, spriteDefinitions.Player.statesEnum.Crouch_right)) 
                        || this.isInState(spriteDefinitions.Player.statesEnum.Falling_right, spriteDefinitions.Player.statesEnum.Falling_right))) {
                  // Add throwable torch sprite on right
                  this.addSpriteHere("ThrownTorch", "TopRight", "TopRight");
                  // Select right torch sprite
                  this.selectLastCreatedSprite();
                  // Throw torch to the right
                  this.setTargetParameter("dx", 6);
                  // Switch torch to rightward state
                  this.setTargetParameter("state", 1);
               }
               else {
                  // Else add throwable torch sprite on left
                  this.addSpriteHere("ThrownTorch", "TopLeft", "TopLeft");
                  // Select left torch sprite
                  this.selectLastCreatedSprite();
                  // Throw torch to the left
                  this.setTargetParameter("dx", -6);
               }
               // Set torch burn time
               this.setTargetParameter("BurnTime", 360);
               // Tell torch to ignite
               this.setTargetParameter("NeedIgnite", 1);
               // Throw torch upward too
               this.setTargetParameter("dy", -5);
            }
         }
      }
      else {
         // Else if pressing select button on save tile
         if (this.isOnTileValue(85, "CenterMiddle")) {
            // Go to save/load game map
            this.switchToMap("SaveOrLoadGame", false);
         }
      }
      // Land on conveyor belt
      this.landOnConveyor(1.4);
      // If inventory button not blocking left or right
      if ((this.isInputPressed(Sprite.inputBits.button2, false) == false)) {
         // If Pressing Left
         if (this.isInputPressed(Sprite.inputBits.left, false)) {
            // If standing right
            if (this.isInState(spriteDefinitions.Player.statesEnum.Right, spriteDefinitions.Player.statesEnum.Right)) {
               // Stand facing left
               this.switchToState(spriteDefinitions.Player.statesEnum.Left, "BottomCenter");
            }
            // If crouching right (for turn)
            if (this.isInState(spriteDefinitions.Player.statesEnum.Crouch_right, spriteDefinitions.Player.statesEnum.Crouch_right)) {
               // Crouch facing left
               this.switchToState(spriteDefinitions.Player.statesEnum.Crouch_left, "BottomCenter");
            }
            // If falling right (for turn)
            if (this.isInState(spriteDefinitions.Player.statesEnum.Falling_right, spriteDefinitions.Player.statesEnum.Falling_right)) {
               // Turn to fall left
               this.switchToState(spriteDefinitions.Player.statesEnum.Falling_left, "BottomCenter");
            }
         }
         // If Pressing Right
         if (this.isInputPressed(Sprite.inputBits.right, false)) {
            // If standing left
            if (this.isInState(spriteDefinitions.Player.statesEnum.Left, spriteDefinitions.Player.statesEnum.Left)) {
               // Stand facing right
               this.switchToState(spriteDefinitions.Player.statesEnum.Right, "BottomCenter");
            }
            // If crouching left (for turn)
            if (this.isInState(spriteDefinitions.Player.statesEnum.Crouch_left, spriteDefinitions.Player.statesEnum.Crouch_left)) {
               // Crouch facing right
               this.switchToState(spriteDefinitions.Player.statesEnum.Crouch_right, "BottomCenter");
            }
            // If falling left (for turn)
            if (this.isInState(spriteDefinitions.Player.statesEnum.Falling_left, spriteDefinitions.Player.statesEnum.Falling_left)) {
               // Turn to fall right
               this.switchToState(spriteDefinitions.Player.statesEnum.Falling_right, "BottomCenter");
            }
         }
      }
      // Gravity
      this.dy = ((this.dy) + (.3));
      // Inertia
      this.reactToInertia(100, 95);
      // Animate
      this.animate("ByHorizontalVelocity");
      // React to conveyor
      this.reactToConveyor(1.4);
      // If riding platform
      if (this.isRidingPlatform()) {
         // ReactToPlatform
         this.reactToPlatform();
      }
      else {
         // Else check for landing on platform
         this.landDownOnPlatform(this.layer.spriteCategories.Platforms);
      }
      // React to pushback
      this.reactToPushback(this.layer.spriteCategories.Pushback);
      // ReactToSolidity
      this.reactToSolid();
      // Snap to ground
      this.snapToGround(2);
   }
   // If pressing menu button
   if (this.isInputPressed(Sprite.inputBits.button4, true)) {
      // Go to menu
      this.switchToMap("Menu", false);
   }
   // MoveByVelocity
   this.moveByVelocity();
   // Scroll
   this.scrollSpriteIntoView(true);
   // If was hurt
   if ((((this.HurtFlag) == (1)) 
            || ((counters.GlobalAction.value) == (1)))) {
      // Reset hurt flag
      this.HurtFlag = 0;
      // Reset global action
      this.changeCounter(counters.GlobalAction, "SetToMinimum");
      // If damage to player health kills player
      if (this.changeCounter(counters.Health, "DecrementAndStop")) {
         // If cannot return to previous map
         if ((this.canReturnToPreviousMap() == false)) {
            // Reset health
            this.changeCounter(counters.Health, "SetToMaximum");
         }
         // Return to previous map and reset level
         this.returnToPreviousMap(true);
      }
   }
   
};
