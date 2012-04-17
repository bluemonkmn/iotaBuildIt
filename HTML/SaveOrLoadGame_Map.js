mapInitializers.SaveOrLoadGame = function() {
   maps.SaveOrLoadGame = new Map(640, 480, 32,32,32,32);
   maps.SaveOrLoadGame.layers.Background = new MapLayer(
      maps.SaveOrLoadGame, tilesets.MainTiles,1,1,59,32,0,0,1,1,0,
      'H');
   maps.SaveOrLoadGame.layers.Background.executeRules = function() {
      this.processSprites();
   };
   maps.SaveOrLoadGame.layers.Main = new MapLayer(
      maps.SaveOrLoadGame, tilesets.CoolText,59,34,0,0,0,0,1,1,0,
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                         i i i i i i i i i i i i i i i i i i i i i                                                    ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                               ,181S1B1A   )181J1B   ,1I1L1Q1P                                                        ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                        1d1d1d   ,1I1L1Q   m   i   1          1d1d1d                                                  ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                        1e1e1e   ,1I1L1Q   n   i   2          1e1e1e                                                  ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                        1f1f1f   ,1I1L1Q   o   i   3          1f1f1f                                                  ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                    1g1g1g   %1E1B101H1M1L1F1K1Q   i   4          1g1g1g                                              ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                1h1h1h   %181K101B1I  1h1h1h                                                          ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '     ,  18  1S  1B       )  18  1J  1B         [  1L  18  1A       )  18  1J  1B                                      ' + 
      ' ^  1B  1I  1B  1Q  1B       )  18  1J  1B                                                                            ');
   maps.SaveOrLoadGame.layers.Main.executeRules = function() {
      this.HandleMenu.executeRules();
      this.SaveOrLoad.executeRules();
      this.processSprites();
   };
   maps.SaveOrLoadGame.layers.Main.DeleteText = new PlanBase();
   maps.SaveOrLoadGame.layers.Main.DeleteText.layer = maps.SaveOrLoadGame.layers.Main;
   maps.SaveOrLoadGame.layers.Main.DeleteText.left = 0;
   maps.SaveOrLoadGame.layers.Main.DeleteText.top = 495;
   maps.SaveOrLoadGame.layers.Main.DeleteText.width = 231;
   maps.SaveOrLoadGame.layers.Main.DeleteText.height = 15;
   (maps.SaveOrLoadGame.layers.Main.DeleteText.m_Coords=[{x:0, y:495},{x:231, y:510}]).forEach(function(element, index, array) {maps.SaveOrLoadGame.layers.Main.DeleteText[index] = element});
   maps.SaveOrLoadGame.layers.Main.HandleMenu = new PlanBase();
   maps.SaveOrLoadGame.layers.Main.HandleMenu.layer = maps.SaveOrLoadGame.layers.Main;
   maps.SaveOrLoadGame.layers.Main.HandleMenu.left = 21;
   maps.SaveOrLoadGame.layers.Main.HandleMenu.top = 411;
   maps.SaveOrLoadGame.layers.Main.HandleMenu.width = 47;
   maps.SaveOrLoadGame.layers.Main.HandleMenu.height = 46;
   (maps.SaveOrLoadGame.layers.Main.HandleMenu.m_Coords=[{x:21, y:411},{x:68, y:457}]).forEach(function(element, index, array) {maps.SaveOrLoadGame.layers.Main.HandleMenu[index] = element});
   maps.SaveOrLoadGame.layers.Main.HandleMenu.executeRules = function() {
      // If not initialized
      if ((this.isMapFlagOn(1) == false)) {
         // If game slot 1 is full
         if (this.saveExists(0, false)) {
            // Set slot 1 status
            this.changeCounter(counters.SaveSlot1, "SetToMaximum");
         }
         else {
            // Else clear slot 1 status
            this.changeCounter(counters.SaveSlot1, "SetToMinimum");
         }
         // If game slot 2 is full
         if (this.saveExists(1, false)) {
            // Set slot 2 status
            this.changeCounter(counters.SaveSlot2, "SetToMaximum");
         }
         else {
            // Else clear slot 2 status
            this.changeCounter(counters.SaveSlot2, "SetToMinimum");
         }
         // If game slot 3 is full
         if (this.saveExists(2, false)) {
            // Set slot 3 status
            this.changeCounter(counters.SaveSlot3, "SetToMaximum");
         }
         else {
            // Else clear slot 3 status
            this.changeCounter(counters.SaveSlot3, "SetToMinimum");
         }
         // If checkpoint game slot is full
         if (this.saveExists(3, false)) {
            // Set checkpoint slot status
            this.changeCounter(counters.SaveSlotCP, "SetToMaximum");
         }
         else {
            // Else clear checkpoint lsot status
            this.changeCounter(counters.SaveSlotCP, "SetToMinimum");
         }
         // Set initialized
         this.setMapFlag(1, true);
      }
      // If sprite is on return plan
      if ((this.isSpriteWithin(this.layer.m_MenuDummy_1, "CenterMiddle") 
               && (this.isInputPressed(this.layer.m_MenuDummy_1, Sprite.inputBits.up|Sprite.inputBits.right|Sprite.inputBits.down|Sprite.inputBits.left|Sprite.inputBits.button1|Sprite.inputBits.button2|Sprite.inputBits.button3|Sprite.inputBits.button4, false) == false))) {
         // Return to previous map
         this.returnToPreviousMap(true);
      }
      else {
         // Else If pressed up
         if (this.isInputPressed(this.layer.m_MenuDummy_1, Sprite.inputBits.up, true)) {
            // Previous slot
            this.changeCounter(counters.CurrentSlot, "DecrementAndLoop");
            // While current slot has no save (up)
            for (
            ; (((this.saveExists(counters.CurrentSlot.value, false) == false) 
                     && ((counters.CurrentSlot.value) != (4))) 
                     && ((counters.SaveLoadDelete.value) > (0))); 
            ) {
               // Skip slot up
               this.changeCounter(counters.CurrentSlot, "DecrementAndLoop");
            }
         }
         // If pressed down
         if (this.isInputPressed(this.layer.m_MenuDummy_1, Sprite.inputBits.down, true)) {
            // Next slot
            this.changeCounter(counters.CurrentSlot, "IncrementAndLoop");
            // While current slot has no save (down)
            for (
            ; (((this.saveExists(counters.CurrentSlot.value, false) == false) 
                     && ((counters.CurrentSlot.value) != (4))) 
                     && ((counters.SaveLoadDelete.value) > (0))); 
            ) {
               // Skip slot down
               this.changeCounter(counters.CurrentSlot, "IncrementAndLoop");
            }
         }
         // If pressed button
         if (this.isInputPressed(this.layer.m_MenuDummy_1, Sprite.inputBits.button1|Sprite.inputBits.button2|Sprite.inputBits.button3|Sprite.inputBits.button4, true)) {
            // If slot is less than 4
            if (((counters.CurrentSlot.value) < (4))) {
               // If loading game
               if (((counters.SaveLoadDelete.value) == (1))) {
                  // Load the game
                  this.loadGame(counters.CurrentSlot.value, false);
               }
               else {
                  // Else if saving the game
                  if (((counters.SaveLoadDelete.value) == (0))) {
                     // Save the game
                     this.saveGame(counters.CurrentSlot.value, false);
                  }
                  else {
                     // Else delete the game
                     this.deleteSave(counters.CurrentSlot.value, false);
                  }
               }
            }
            // Move dummy sprite to return plan
            this.transportToPlan(this.layer.m_MenuDummy_1, this.layer.HandleMenu, "CenterMiddle");
         }
         // If pressed left or right
         if (false) {
            // While current slot has no save (swap)
            for (
            ; false; 
            ) {
            }
         }
      }
      
   };
   maps.SaveOrLoadGame.layers.Main.LoadText = new PlanBase();
   maps.SaveOrLoadGame.layers.Main.LoadText.layer = maps.SaveOrLoadGame.layers.Main;
   maps.SaveOrLoadGame.layers.Main.LoadText.left = 231;
   maps.SaveOrLoadGame.layers.Main.LoadText.top = 480;
   maps.SaveOrLoadGame.layers.Main.LoadText.width = 231;
   maps.SaveOrLoadGame.layers.Main.LoadText.height = 15;
   (maps.SaveOrLoadGame.layers.Main.LoadText.m_Coords=[{x:231, y:480},{x:462, y:495}]).forEach(function(element, index, array) {maps.SaveOrLoadGame.layers.Main.LoadText[index] = element});
   maps.SaveOrLoadGame.layers.Main.SaveOrLoad = new PlanBase();
   maps.SaveOrLoadGame.layers.Main.SaveOrLoad.layer = maps.SaveOrLoadGame.layers.Main;
   maps.SaveOrLoadGame.layers.Main.SaveOrLoad.left = 132;
   maps.SaveOrLoadGame.layers.Main.SaveOrLoad.top = 75;
   maps.SaveOrLoadGame.layers.Main.SaveOrLoad.width = 231;
   maps.SaveOrLoadGame.layers.Main.SaveOrLoad.height = 15;
   (maps.SaveOrLoadGame.layers.Main.SaveOrLoad.m_Coords=[{x:132, y:75},{x:363, y:90}]).forEach(function(element, index, array) {maps.SaveOrLoadGame.layers.Main.SaveOrLoad[index] = element});
   maps.SaveOrLoadGame.layers.Main.SaveOrLoad.executeRules = function() {
      // If is loading game
      if (((counters.SaveLoadDelete.value) == (1))) {
         // Copy "Load" text
         this.copyFrom(this.layer.LoadText, "TopLeft");
      }
      else {
         // Else if saving the game
         if (((counters.SaveLoadDelete.value) == (0))) {
            // Copy "Save" text
            this.copyFrom(this.layer.SaveText, "TopLeft");
         }
         else {
            // Else copy "Delete" text
            this.copyFrom(this.layer.DeleteText, "TopLeft");
         }
      }
      
   };
   maps.SaveOrLoadGame.layers.Main.SaveText = new PlanBase();
   maps.SaveOrLoadGame.layers.Main.SaveText.layer = maps.SaveOrLoadGame.layers.Main;
   maps.SaveOrLoadGame.layers.Main.SaveText.left = 0;
   maps.SaveOrLoadGame.layers.Main.SaveText.top = 480;
   maps.SaveOrLoadGame.layers.Main.SaveText.width = 231;
   maps.SaveOrLoadGame.layers.Main.SaveText.height = 15;
   (maps.SaveOrLoadGame.layers.Main.SaveText.m_Coords=[{x:0, y:480},{x:231, y:495}]).forEach(function(element, index, array) {maps.SaveOrLoadGame.layers.Main.SaveText[index] = element});
   maps.SaveOrLoadGame.layers.Background.initSprites = function() {
      this.sprites = [];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.SaveOrLoadGame.layers.Background.initSprites();
   maps.SaveOrLoadGame.layers.Main.initSprites = function() {
      this.m_MenuDummy_1 = new spriteDefinitions.MenuDummy(this,593,428,0,0,spriteDefinitions.MenuDummy.statesEnum.Main,0,true,1,null,0);
      this.sprites = [this.m_MenuDummy_1];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.SaveOrLoadGame.layers.Main.initSprites();
};
