mapInitializers.Menu = function() {
   maps.Menu = new Map(640, 480, 0,0,0,0);
   maps.Menu.layers.Background = new MapLayer(
      maps.Menu, tilesets.MainTiles,1,1,20,15,0,0,1,1,0,
      '?');
   maps.Menu.layers.Background.executeRules = function() {
      this.processSprites();
   };
   maps.Menu.layers.Main = new MapLayer(
      maps.Menu, tilesets.CoolText,59,32,0,0,0,0,1,1,0,
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                 ,181S1B  1D181J1B                                                                    ' + 
      '                                                                                                                      ' + 
      '                                 [1L181A  1D181J1B                                                                    ' + 
      '                                                                                                                      ' + 
      '                                 ^1B1I1B1Q1B  1P181S1B1A  1D181J1B                                                    ' + 
      '                                                                                                                      ' + 
      '                                 ,18101O1F1C1F101B  1M1I181V1B1O                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                 ;1B1Q1R1O1K  1Q1L  1D181J1B                                                          ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ' + 
      '                                                                                                                      ');
   maps.Menu.layers.Main.executeRules = function() {
      this.DeleteSave.executeRules();
      this.LoadGame.executeRules();
      this.LoopBottom.executeRules();
      this.LoopTop.executeRules();
      this.Return.executeRules();
      this.Sacrifice.executeRules();
      this.SaveGame.executeRules();
      this.Skip.executeRules();
      this.processSprites();
   };
   maps.Menu.layers.Main.DeleteSave = new PlanBase();
   maps.Menu.layers.Main.DeleteSave.layer = maps.Menu.layers.Main;
   maps.Menu.layers.Main.DeleteSave.left = 154;
   maps.Menu.layers.Main.DeleteSave.top = 210;
   maps.Menu.layers.Main.DeleteSave.width = 11;
   maps.Menu.layers.Main.DeleteSave.height = 15;
   (maps.Menu.layers.Main.DeleteSave.m_Coords=[{x:154, y:210},{x:165, y:225}]).forEach(function(element, index, array) {maps.Menu.layers.Main.DeleteSave[index] = element});
   maps.Menu.layers.Main.DeleteSave.executeRules = function() {
      // If menu sprite chose this command
      if ((this.isSpriteWithin(this.layer.m_MenuPointer_1, "CenterMiddle") && this.isInputPressed(this.layer.m_MenuPointer_1, Sprite.inputBits.button3, true))) {
         // Delete mode
         counters.SaveLoadDelete.value = 2;
         // Return
         this.returnToPreviousMap(true);
         // Go to save game
         this.switchToMap("SaveOrLoadGame", false);
      }
      
   };
   maps.Menu.layers.Main.LoadGame = new PlanBase();
   maps.Menu.layers.Main.LoadGame.layer = maps.Menu.layers.Main;
   maps.Menu.layers.Main.LoadGame.left = 154;
   maps.Menu.layers.Main.LoadGame.top = 180;
   maps.Menu.layers.Main.LoadGame.width = 11;
   maps.Menu.layers.Main.LoadGame.height = 15;
   (maps.Menu.layers.Main.LoadGame.m_Coords=[{x:154, y:180},{x:165, y:195}]).forEach(function(element, index, array) {maps.Menu.layers.Main.LoadGame[index] = element});
   maps.Menu.layers.Main.LoadGame.executeRules = function() {
      // If menu sprite chose this command
      if ((this.isSpriteWithin(this.layer.m_MenuPointer_1, "CenterMiddle") && this.isInputPressed(this.layer.m_MenuPointer_1, Sprite.inputBits.button3, true))) {
         // Load mode
         counters.SaveLoadDelete.value = 1;
         // Return
         this.returnToPreviousMap(true);
         // Go to load game
         this.switchToMap("SaveOrLoadGame", false);
      }
      
   };
   maps.Menu.layers.Main.LoopBottom = new PlanBase();
   maps.Menu.layers.Main.LoopBottom.layer = maps.Menu.layers.Main;
   maps.Menu.layers.Main.LoopBottom.left = 154;
   maps.Menu.layers.Main.LoopBottom.top = 330;
   maps.Menu.layers.Main.LoopBottom.width = 11;
   maps.Menu.layers.Main.LoopBottom.height = 15;
   (maps.Menu.layers.Main.LoopBottom.m_Coords=[{x:154, y:330},{x:165, y:345}]).forEach(function(element, index, array) {maps.Menu.layers.Main.LoopBottom[index] = element});
   maps.Menu.layers.Main.LoopBottom.executeRules = function() {
      // If pointer is here
      if (this.isSpriteWithin(this.layer.m_MenuPointer_1, "CenterMiddle")) {
         // Move sprite to top
         this.transportToPlan(this.layer.m_MenuPointer_1, this.layer.SaveGame, "CenterMiddle");
      }
      
   };
   maps.Menu.layers.Main.LoopTop = new PlanBase();
   maps.Menu.layers.Main.LoopTop.layer = maps.Menu.layers.Main;
   maps.Menu.layers.Main.LoopTop.left = 154;
   maps.Menu.layers.Main.LoopTop.top = 120;
   maps.Menu.layers.Main.LoopTop.width = 11;
   maps.Menu.layers.Main.LoopTop.height = 15;
   (maps.Menu.layers.Main.LoopTop.m_Coords=[{x:154, y:120},{x:165, y:135}]).forEach(function(element, index, array) {maps.Menu.layers.Main.LoopTop[index] = element});
   maps.Menu.layers.Main.LoopTop.executeRules = function() {
      // If pointer is here
      if (this.isSpriteWithin(this.layer.m_MenuPointer_1, "CenterMiddle")) {
         // Move sprite to bottom
         this.transportToPlan(this.layer.m_MenuPointer_1, this.layer.Return, "CenterMiddle");
      }
      
   };
   maps.Menu.layers.Main.Return = new PlanBase();
   maps.Menu.layers.Main.Return.layer = maps.Menu.layers.Main;
   maps.Menu.layers.Main.Return.left = 154;
   maps.Menu.layers.Main.Return.top = 300;
   maps.Menu.layers.Main.Return.width = 11;
   maps.Menu.layers.Main.Return.height = 15;
   (maps.Menu.layers.Main.Return.m_Coords=[{x:154, y:300},{x:165, y:315}]).forEach(function(element, index, array) {maps.Menu.layers.Main.Return[index] = element});
   maps.Menu.layers.Main.Return.executeRules = function() {
      // If menu sprite chose this command
      if (((this.isSpriteWithin(this.layer.m_MenuPointer_1, "CenterMiddle") && this.wasInputPressed(this.layer.m_MenuPointer_1, Sprite.inputBits.button3)) 
               && (this.isInputPressed(this.layer.m_MenuPointer_1, Sprite.inputBits.button3, false) == false))) {
         // Return to game
         this.returnToPreviousMap(true);
      }
      
   };
   maps.Menu.layers.Main.Sacrifice = new PlanBase();
   maps.Menu.layers.Main.Sacrifice.layer = maps.Menu.layers.Main;
   maps.Menu.layers.Main.Sacrifice.left = 154;
   maps.Menu.layers.Main.Sacrifice.top = 240;
   maps.Menu.layers.Main.Sacrifice.width = 11;
   maps.Menu.layers.Main.Sacrifice.height = 15;
   (maps.Menu.layers.Main.Sacrifice.m_Coords=[{x:154, y:240},{x:165, y:255}]).forEach(function(element, index, array) {maps.Menu.layers.Main.Sacrifice[index] = element});
   maps.Menu.layers.Main.Sacrifice.executeRules = function() {
      // If menu sprite chose this command
      if (((this.isSpriteWithin(this.layer.m_MenuPointer_1, "CenterMiddle") && this.wasInputPressed(this.layer.m_MenuPointer_1, Sprite.inputBits.button3)) 
               && (this.isInputPressed(this.layer.m_MenuPointer_1, Sprite.inputBits.button3, false) == false))) {
         // Set global action to hurt player
         counters.GlobalAction.value = 1;
         // Set player health to 0
         counters.Health.value = 0;
         // Return to previous map
         this.returnToPreviousMap(true);
      }
      
   };
   maps.Menu.layers.Main.SaveGame = new PlanBase();
   maps.Menu.layers.Main.SaveGame.layer = maps.Menu.layers.Main;
   maps.Menu.layers.Main.SaveGame.left = 154;
   maps.Menu.layers.Main.SaveGame.top = 150;
   maps.Menu.layers.Main.SaveGame.width = 11;
   maps.Menu.layers.Main.SaveGame.height = 15;
   (maps.Menu.layers.Main.SaveGame.m_Coords=[{x:154, y:150},{x:165, y:165}]).forEach(function(element, index, array) {maps.Menu.layers.Main.SaveGame[index] = element});
   maps.Menu.layers.Main.SaveGame.executeRules = function() {
      // If menu sprite chose this command
      if ((this.isSpriteWithin(this.layer.m_MenuPointer_1, "CenterMiddle") && this.isInputPressed(this.layer.m_MenuPointer_1, Sprite.inputBits.button3, true))) {
         // Save mode
         this.changeCounter(counters.SaveLoadDelete, "SetToMinimum");
         // Return
         this.returnToPreviousMap(true);
         // Go to save game
         this.switchToMap("SaveOrLoadGame", false);
      }
      
   };
   maps.Menu.layers.Main.Skip = new PlanBase();
   maps.Menu.layers.Main.Skip.layer = maps.Menu.layers.Main;
   maps.Menu.layers.Main.Skip.left = 154;
   maps.Menu.layers.Main.Skip.top = 270;
   maps.Menu.layers.Main.Skip.width = 11;
   maps.Menu.layers.Main.Skip.height = 15;
   (maps.Menu.layers.Main.Skip.m_Coords=[{x:154, y:270},{x:165, y:285}]).forEach(function(element, index, array) {maps.Menu.layers.Main.Skip[index] = element});
   maps.Menu.layers.Main.Skip.executeRules = function() {
      // If menu sprite is here
      if (this.isSpriteWithin(this.layer.m_MenuPointer_1, "CenterMiddle")) {
         // If up is pressed
         if (this.isInputPressed(this.layer.m_MenuPointer_1, Sprite.inputBits.up, false)) {
            // Skip to previous item
            this.transportToPlan(this.layer.m_MenuPointer_1, this.layer.Sacrifice, "CenterMiddle");
         }
         else {
            // Else skip to next item
            this.transportToPlan(this.layer.m_MenuPointer_1, this.layer.Return, "CenterMiddle");
         }
      }
      
   };
   maps.Menu.layers.Background.initSprites = function() {
      this.sprites = [];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.Menu.layers.Background.initSprites();
   maps.Menu.layers.Main.initSprites = function() {
      this.m_MenuPointer_1 = new spriteDefinitions.MenuPointer(this,154,150,0,0,spriteDefinitions.MenuPointer.statesEnum.Main,0,true,1,null,0);
      this.sprites = [this.m_MenuPointer_1];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.Menu.layers.Main.initSprites();
};
