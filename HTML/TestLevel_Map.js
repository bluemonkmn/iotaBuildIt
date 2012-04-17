mapInitializers.TestLevel = function() {
   maps.TestLevel = new Map(2000, 1600, 280,200,280,200);
   maps.TestLevel.layers.Background = new MapLayer(
      maps.TestLevel, tilesets.MainTiles,1,1,59,32,0,0,0,0,0,
      'G');
   maps.TestLevel.layers.Background.executeRules = function() {
      this.processSprites();
   };
   maps.TestLevel.layers.Main = new MapLayer(
      maps.TestLevel, tilesets.MainTiles,63,50,0,0,0,0,1,1,0,
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '     I                                                         ' + 
      '     I                                                         ' + 
      '     I                                                         ' + 
      '     I                                                         ' + 
      '     I                                                         ' + 
      '     I                                                         ' + 
      '     I                                 Q                       ' + 
      '     I      uRRRRRRQQ                 QQQRRTRQ                 ' + 
      '     I       111111QQ  y             QQQQ1111Q 211             ' + 
      '     I            1 111z1qqq11111111111111  1Q2111   11 Q      ' + 
      '     I                 y                    1Q1         Q11111 ' + 
      '     I                 y      n             1Q1 QT      Q1     ' + 
      '     I           Q v p y    451qqqq111rrrr  1QQQQ1      Q1     ' + 
      '     I           Q     y  451113 s         21  211      Q1     ' + 
      '     I           Q     y45111111113       21  2111      Q1     ' + 
      '     I11111111111111111111111111111111111    21111      Q1     ' + 
      '     I11111111111111111111111111111111111111111111     111     ' + 
      '                                                 1     1       ' + 
      '                                                 1111111       ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ' + 
      '                                                               ');
   maps.TestLevel.layers.Main.executeRules = function() {
      this.L1Platform1.executeRules();
      this.L1Platform2.executeRules();
      this.processSprites();
   };
   maps.TestLevel.layers.Main.L1Platform1 = new PlanBase();
   maps.TestLevel.layers.Main.L1Platform1.layer = maps.TestLevel.layers.Main;
   maps.TestLevel.layers.Main.L1Platform1.left = 1600;
   maps.TestLevel.layers.Main.L1Platform1.top = 992;
   maps.TestLevel.layers.Main.L1Platform1.width = 0;
   maps.TestLevel.layers.Main.L1Platform1.height = 256;
   (maps.TestLevel.layers.Main.L1Platform1.m_Coords=[{x:1600, y:1248, weight:60},{x:1600, y:992, weight:60}]).forEach(function(element, index, array) {maps.TestLevel.layers.Main.L1Platform1[index] = element});
   maps.TestLevel.layers.Main.L1Platform1.executeRules = function() {
      // Push platform 1
      this.followPath(this.layer.m_Platform_1, "CoordIndex", "WaitTime");
      
   };
   maps.TestLevel.layers.Main.L1Platform2 = new PlanBase();
   maps.TestLevel.layers.Main.L1Platform2.layer = maps.TestLevel.layers.Main;
   maps.TestLevel.layers.Main.L1Platform2.left = 224;
   maps.TestLevel.layers.Main.L1Platform2.top = 832;
   maps.TestLevel.layers.Main.L1Platform2.width = 0;
   maps.TestLevel.layers.Main.L1Platform2.height = 352;
   (maps.TestLevel.layers.Main.L1Platform2.m_Coords=[{x:224, y:1184, weight:60},{x:224, y:832, weight:30}]).forEach(function(element, index, array) {maps.TestLevel.layers.Main.L1Platform2[index] = element});
   maps.TestLevel.layers.Main.L1Platform2.executeRules = function() {
      // Platform 2 Follow
      this.followPath(this.layer.m_Platform_2, "CoordIndex", "WaitTime");
      
   };
   maps.TestLevel.layers.Background.initSprites = function() {
      this.sprites = [];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.TestLevel.layers.Background.initSprites();
   maps.TestLevel.layers.Main.initSprites = function() {
      this.m_Rocket_1 = new spriteDefinitions.Rocket(this,1568,1086,0,0,spriteDefinitions.Rocket.statesEnum.Right,0,true,1,solidity.Standard,0);
      this.m_BotEnergySource_1 = new spriteDefinitions.BotEnergySource(this,786,1126,0,0,spriteDefinitions.BotEnergySource.statesEnum.Always,0,true,1,null,0,0,200,0);
      this.m_Jumper_1 = new spriteDefinitions.Jumper(this,414,1184,0,0,spriteDefinitions.Jumper.statesEnum.Right,0,true,1,solidity.Standard,120,0,0);
      this.m_BotMover_1 = new spriteDefinitions.BotMover(this,650,1097,0,0,spriteDefinitions.BotMover.statesEnum.Follow,0,true,1,solidity.Standard,0,0);
      this.m_Spider_1 = new spriteDefinitions.Spider(this,448,1024,0,0,spriteDefinitions.Spider.statesEnum.Main,0,true,1,solidity.Standard,0,0,0,0);
      this.m_Platform_2 = new spriteDefinitions.Platform(this,224,1184,0,0,spriteDefinitions.Platform.statesEnum.Main,0,true,1,null,0,0);
      this.m_Worm_1 = new spriteDefinitions.Worm(this,705,990,0,0,spriteDefinitions.Worm.statesEnum.Right,0,true,1,solidity.Standard,0);
      this.m_Bombot_1 = new spriteDefinitions.Bombot(this,902,991,0,0,spriteDefinitions.Bombot.statesEnum.Right,0,true,1,solidity.Standard,0,300,0,200,60);
      this.m_Platform_1 = new spriteDefinitions.Platform(this,1600,1248,0,0,spriteDefinitions.Platform.statesEnum.Main,0,true,1,null,0,0);
      this.m_Sprout_1 = new spriteDefinitions.Sprout(this,384,1184,0,0,spriteDefinitions.Sprout.statesEnum.Seed,0,true,1,solidity.Standard,0,10,0,4501041,0);
      this.m_Player_1 = new spriteDefinitions.Player(this,657,1180,0,0,spriteDefinitions.Player.statesEnum.Right,0,true,1,solidity.Standard,0,0,1,0,0,0);
      this.m_Package_3 = new spriteDefinitions.Package(this,545,1071,0,0,spriteDefinitions.Package.statesEnum.Main,0,true,2,solidity.Standard,0,0);
      this.m_Package_2 = new spriteDefinitions.Package(this,240,1137,0,0,spriteDefinitions.Package.statesEnum.Main,0,true,2,solidity.Standard,0,0);
      this.m_Package_1 = new spriteDefinitions.Package(this,240,1099,0,0,spriteDefinitions.Package.statesEnum.Main,0,true,2,solidity.Standard,0,0);
      this.m_Package_4 = new spriteDefinitions.Package(this,724,1172,0,0,spriteDefinitions.Package.statesEnum.Main,0,true,2,solidity.Standard,0,0);
      this.m_Package_6 = new spriteDefinitions.Package(this,543,1019,0,0,spriteDefinitions.Package.statesEnum.Main,0,true,2,solidity.Standard,0,0);
      this.m_Package_5 = new spriteDefinitions.Package(this,453,1175,0,0,spriteDefinitions.Package.statesEnum.Main,0,true,2,solidity.Standard,0,0);
      this.sprites = [this.m_Rocket_1,this.m_BotEnergySource_1,this.m_Jumper_1,this.m_BotMover_1,this.m_Spider_1,this.m_Platform_2,this.m_Worm_1,this.m_Bombot_1,this.m_Platform_1,this.m_Sprout_1,this.m_Player_1,this.m_Package_3,this.m_Package_2,this.m_Package_1,this.m_Package_4,this.m_Package_6,this.m_Package_5];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.TestLevel.layers.Main.initSprites();
};
