mapInitializers.World = function() {
   maps.World = new Map(1000, 1000, 200,200,200,200);
   maps.World.layers.Background = new MapLayer(
      maps.World, tilesets.WorldMapTiles,1,1,59,32,0,0,0,0,0,
      '`');
   maps.World.layers.Background.executeRules = function() {
      this.processSprites();
   };
   maps.World.layers.Grass = new MapLayer(
      maps.World, tilesets.WorldMapTiles,91,67,0,0,0,0,1,1,0,
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '               O O O                                                                                                                                                                  ' + 
      '               4 4 4 4 4 4 4                                                                                                                                                          ' + 
      '             4 4 4 4 4 4 4 4 4 4 4 4 4 4                                                                                                                                              ' + 
      '           j h h h h d 4 f h h k 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '       4 4 g 4 4 4 4 4 4 4 4 4 g 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 g 4 4 4 4 4 4 4 4 4 g 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 g 4 4 4 : _ 4 4 4 4 g 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 f h p 4 4 . _ _ 4 4 f h q h h 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 g 4 4 4 _ _ 4 4 4 4 g 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 g 4 4 41416 4 4 4 4 g 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 g 4 4 4111T 4 4 4 4 g 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 g 4 z $1R1T % ! j h l 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 i h u b b b b % r ! 4 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 4 4 # y y * b ^ y @ 4 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '     4 4 4 4 4 4 4 4 # y @ 4 4 4 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '       4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ' + 
      '                                                                                                                                                                                      ');
   maps.World.layers.Grass.executeRules = function() {
      this.processSprites();
   };
   maps.World.layers.Main = new MapLayer(
      maps.World, tilesets.WorldMapTiles,32,32,0,0,0,0,1,1,0,
      '                                                                ' + 
      '                                                                ' + 
      '               ] - {                                            ' + 
      '               | [ }                                            ' + 
      '             R 2 1 3 O O O O S                                  ' + 
      '           R V               W O O O O O S                      ' + 
      '         R V                             W O O O S              ' + 
      '     R O V             ~                                        ' + 
      '   R V                                                          ' + 
      '   N               ] - {                                        ' + 
      '   N           ] -     =                                        ' + 
      '   N           | .     =                                        ' + 
      '   N             +     =                                        ' + 
      '   N             |     }                                        ' + 
      '   N             2     3                                        ' + 
      '   N                                                            ' + 
      '   N                                                            ' + 
      '   N                  1                                         ' + 
      '   N                                                            ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ' + 
      '                                                                ');
   maps.World.layers.Main.executeRules = function() {
      this.Go_to_level_1.executeRules();
      this.processSprites();
   };
   maps.World.layers.Main.Go_to_level_1 = new PlanBase();
   maps.World.layers.Main.Go_to_level_1.layer = maps.World.layers.Main;
   maps.World.layers.Main.Go_to_level_1.left = 352;
   maps.World.layers.Main.Go_to_level_1.top = 224;
   maps.World.layers.Main.Go_to_level_1.width = 32;
   maps.World.layers.Main.Go_to_level_1.height = 32;
   (maps.World.layers.Main.Go_to_level_1.m_Coords=[{x:352, y:224},{x:384, y:256}]).forEach(function(element, index, array) {maps.World.layers.Main.Go_to_level_1[index] = element});
   maps.World.layers.Main.Go_to_level_1.executeRules = function() {
      // If player touches
      if ((this.isSpriteWithin(this.layer.m_WorldMapPlayer_1, "CenterMiddle") && this.isInputPressed(this.layer.m_WorldMapPlayer_1, Sprite.inputBits.button1, true))) {
         // Go to level 1
         this.switchToMap("Level_1", false);
      }
      
   };
   maps.World.layers.Main.Go_to_level_2 = new PlanBase();
   maps.World.layers.Main.Go_to_level_2.layer = maps.World.layers.Main;
   maps.World.layers.Main.Go_to_level_2.left = 352;
   maps.World.layers.Main.Go_to_level_2.top = 544;
   maps.World.layers.Main.Go_to_level_2.width = 32;
   maps.World.layers.Main.Go_to_level_2.height = 32;
   (maps.World.layers.Main.Go_to_level_2.m_Coords=[{x:352, y:544},{x:384, y:576}]).forEach(function(element, index, array) {maps.World.layers.Main.Go_to_level_2[index] = element});
   maps.World.layers.Background.initSprites = function() {
      this.sprites = [];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.World.layers.Background.initSprites();
   maps.World.layers.Grass.initSprites = function() {
      this.sprites = [];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.World.layers.Grass.initSprites();
   maps.World.layers.Main.initSprites = function() {
      this.m_WorldMapPlayer_1 = new spriteDefinitions.WorldMapPlayer(this,96,352,0,0,spriteDefinitions.WorldMapPlayer.statesEnum.Right,11,true,0,solidity.Standard,1);
      this.sprites = [this.m_WorldMapPlayer_1];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.World.layers.Main.initSprites();
};
