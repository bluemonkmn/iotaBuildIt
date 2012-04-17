mapInitializers.Overlay = function() {
   maps.Overlay = new Map(0, 0, 32,32,32,32);
   maps.Overlay.layers.Main = new MapLayer(
      maps.Overlay, tilesets.MainTiles,20,15,0,0,0,0,1,1,0,
      '          p         ' + 
      '          I         ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ' + 
      '                    ');
   maps.Overlay.layers.Main.executeRules = function() {
      this.Animate_Tiles.executeRules();
      this.Draw_health.executeRules();
      this.Draw_life.executeRules();
      this.Draw_Money.executeRules();
      this.Draw_selected_inventory.executeRules();
      this.Limit_frame_rate.executeRules();
      this.processSprites();
   };
   maps.Overlay.layers.SelectedInventory = new MapLayer(
      maps.Overlay, tilesets.UsableInventory,1,1,1,1,320,32,1,1,0,
      '1A');
   maps.Overlay.layers.SelectedInventory.executeRules = function() {
      this.processSprites();
   };
   maps.Overlay.layers.InventorySelector = new MapLayer(
      maps.Overlay, tilesets.UsableInventory,15,10,15,10,-480,80,1,1,0,
      '1B1B1B1B1B1B1B1B1B1B1B1B1B1B1B' + 
      '1B   81B1B1B1B1B1B1B1B1B1B1B1B' + 
      '1B 3 9 0 A B1B1B1B1B1B1B1B1B1B' + 
      '1B 1 4 51B1B1B1B1B1B1B1B1B1B1B' + 
      '1B 6 71B1B1B1B1B1B1B1B1B1B1B1B' + 
      '1B C D E F1B1B1B1B1B1B1B1B1B1B' + 
      '1B 21B1B1B1B1B1B1B1B1B1B1B1B1B' + 
      '1B1B1B1B1B1B1B1B1B1B1B1B1B1B1B' + 
      '1B1B1B1B1B1B1B1B1B1B1B1B1B1B1B' + 
      '1B1B1B1B1B1B1B1B1B1B1B1B1B1B1B');
   maps.Overlay.layers.InventorySelector.executeRules = function() {
      this.Show_Inventory_Selector.executeRules();
      this.processSprites();
   };
   maps.Overlay.layers.Main.Animate_Tiles = new PlanBase();
   maps.Overlay.layers.Main.Animate_Tiles.layer = maps.Overlay.layers.Main;
   maps.Overlay.layers.Main.Animate_Tiles.executeRules = function() {
      // AnimateTiles
      this.changeCounter(counters.FrameCounter, "IncrementAndLoop");
      
   };
   maps.Overlay.layers.Main.Draw_health = new PlanBase();
   maps.Overlay.layers.Main.Draw_health.layer = maps.Overlay.layers.Main;
   maps.Overlay.layers.Main.Draw_health.left = 0;
   maps.Overlay.layers.Main.Draw_health.top = 32;
   maps.Overlay.layers.Main.Draw_health.width = 320;
   maps.Overlay.layers.Main.Draw_health.height = 32;
   (maps.Overlay.layers.Main.Draw_health.m_Coords=[{x:0, y:32},{x:320, y:64}]).forEach(function(element, index, array) {maps.Overlay.layers.Main.Draw_health[index] = element});
   maps.Overlay.layers.Main.Draw_health.executeRules = function() {
      // Draw counter as tile
      this.drawCounterAsTile(56, counters.Health, "RepeatRightToCounter");
      
   };
   maps.Overlay.layers.Main.Draw_life = new PlanBase();
   maps.Overlay.layers.Main.Draw_life.layer = maps.Overlay.layers.Main;
   maps.Overlay.layers.Main.Draw_life.left = 0;
   maps.Overlay.layers.Main.Draw_life.top = 0;
   maps.Overlay.layers.Main.Draw_life.width = 320;
   maps.Overlay.layers.Main.Draw_life.height = 32;
   (maps.Overlay.layers.Main.Draw_life.m_Coords=[{x:0, y:0},{x:320, y:32}]).forEach(function(element, index, array) {maps.Overlay.layers.Main.Draw_life[index] = element});
   maps.Overlay.layers.Main.Draw_life.executeRules = function() {
      // Draw life
      this.drawCounterAsTile(55, counters.Life, "RepeatRightToCounter");
      
   };
   maps.Overlay.layers.Main.Draw_Money = new PlanBase();
   maps.Overlay.layers.Main.Draw_Money.layer = maps.Overlay.layers.Main;
   maps.Overlay.layers.Main.Draw_Money.left = 352;
   maps.Overlay.layers.Main.Draw_Money.top = 0;
   maps.Overlay.layers.Main.Draw_Money.width = 128;
   maps.Overlay.layers.Main.Draw_Money.height = 32;
   (maps.Overlay.layers.Main.Draw_Money.m_Coords=[{x:352, y:0},{x:480, y:32}]).forEach(function(element, index, array) {maps.Overlay.layers.Main.Draw_Money[index] = element});
   maps.Overlay.layers.Main.Draw_Money.executeRules = function() {
      // Draw money
      this.drawCounterWithLabel("", counters.Money, "white");
      
   };
   maps.Overlay.layers.Main.Draw_selected_inventory = new PlanBase();
   maps.Overlay.layers.Main.Draw_selected_inventory.layer = maps.Overlay.layers.Main;
   maps.Overlay.layers.Main.Draw_selected_inventory.left = 352;
   maps.Overlay.layers.Main.Draw_selected_inventory.top = 32;
   maps.Overlay.layers.Main.Draw_selected_inventory.width = 128;
   maps.Overlay.layers.Main.Draw_selected_inventory.height = 32;
   (maps.Overlay.layers.Main.Draw_selected_inventory.m_Coords=[{x:352, y:32},{x:480, y:64}]).forEach(function(element, index, array) {maps.Overlay.layers.Main.Draw_selected_inventory[index] = element});
   maps.Overlay.layers.Main.Draw_selected_inventory.executeRules = function() {
      // If selected inventory is bomb
      if (((counters.SelectedInventory.value) == (0))) {
         // Draw bomb inventory
         this.drawCounterWithLabel("", counters.Bombs, "white");
      }
      // If selected inventory is bot energy source
      if (((counters.SelectedInventory.value) == (1))) {
         // Draw bot energy source inventory
         this.drawCounterWithLabel("", counters.BotEnergySources, "white");
      }
      // If selected inventory is bot droplet
      if (((counters.SelectedInventory.value) == (7))) {
         // Draw bot droplet inventory
         this.drawCounterWithLabel("", counters.BotDroplets, "white");
      }
      // If selected inventory is throwable torch
      if (((counters.SelectedInventory.value) == (8))) {
         // Draw throwable torch inventory
         this.drawCounterWithLabel("", counters.ThrowableTorches, "white");
      }
      // If selected inventory is follower
      if (((counters.SelectedInventory.value) == (3))) {
         // Draw follower inventory
         this.drawCounterWithLabel("", counters.BotFollowers, "white");
      }
      // If selected inventory is collision power source
      if (((counters.SelectedInventory.value) == (4))) {
         // Draw collision power source inventory
         this.drawCounterWithLabel("", counters.BotCollisionPowers, "white");
      }
      // If selected inventory is splash power source
      if (((counters.SelectedInventory.value) == (5))) {
         // Draw splash power source inventory
         this.drawCounterWithLabel("", counters.BotSplashPowers, "white");
      }
      // If selected inventory is bot bomb
      if (((counters.SelectedInventory.value) == (6))) {
         // Draw bot bomb inventory
         this.drawCounterWithLabel("", counters.BotBombs, "white");
      }
      // If selected inventory is bot move up
      if (((counters.SelectedInventory.value) == (9))) {
         // Draw bot move up inventory
         this.drawCounterWithLabel("", counters.BotMoveUps, "white");
      }
      // If selected inventory is bot move right
      if (((counters.SelectedInventory.value) == (10))) {
         // Draw bot move right inventory
         this.drawCounterWithLabel("", counters.BotMoveRights, "white");
      }
      // If selected inventory is bot move down
      if (((counters.SelectedInventory.value) == (11))) {
         // Draw bot move down inventory
         this.drawCounterWithLabel("", counters.BotMoveDowns, "white");
      }
      // If selected inventory is bot move left
      if (((counters.SelectedInventory.value) == (12))) {
         // Draw bot move left inventory
         this.drawCounterWithLabel("", counters.BotMoveLefts, "white");
      }
      // If selected inventory is worm DNA
      if (((counters.SelectedInventory.value) == (13))) {
         // Draw worm DNA inventory
         this.drawCounterWithLabel("", counters.DNAWorms, "white");
      }
      // If selected inventory is spider DNA
      if (((counters.SelectedInventory.value) == (14))) {
         // Draw spider DNA inventory
         this.drawCounterWithLabel("", counters.DNASpiders, "white");
      }
      
   };
   maps.Overlay.layers.Main.Limit_frame_rate = new PlanBase();
   maps.Overlay.layers.Main.Limit_frame_rate.layer = maps.Overlay.layers.Main;
   maps.Overlay.layers.Main.Limit_frame_rate.executeRules = function() {
      // Limit frame rate
      this.limitFrameRate(75);
      
   };
   maps.Overlay.layers.InventorySelector.Show_Inventory_Selector = new PlanBase();
   maps.Overlay.layers.InventorySelector.Show_Inventory_Selector.layer = maps.Overlay.layers.InventorySelector;
   maps.Overlay.layers.InventorySelector.Show_Inventory_Selector.executeRules = function() {
      // If pressing inventory button
      if ((this.isInputPressed(this.layer.m_InventorySelector_1, Sprite.inputBits.button2, false) 
               && ((counters.CanAccessInventory.value) >= (1)))) {
         // Move inventory selector layer into view
         this.moveSelectorLayer(true);
      }
      else {
         // Else move inventory selector layer out of view
         this.moveSelectorLayer(false);
      }
      // Reset inventory access
      this.changeCounter(counters.CanAccessInventory, "SetToMaximum");
      
   };
   maps.Overlay.layers.Main.initSprites = function() {
      this.sprites = [];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.Overlay.layers.Main.initSprites();
   maps.Overlay.layers.SelectedInventory.initSprites = function() {
      this.sprites = [];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.Overlay.layers.SelectedInventory.initSprites();
   maps.Overlay.layers.InventorySelector.initSprites = function() {
      this.m_InventorySelector_1 = new spriteDefinitions.InventorySelector(this,32,32,0,0,spriteDefinitions.InventorySelector.statesEnum.Main,0,true,1,solidity.Standard);
      this.sprites = [this.m_InventorySelector_1];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.Overlay.layers.InventorySelector.initSprites();
};
