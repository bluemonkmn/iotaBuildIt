var viewWidth = 640;
var viewHeight = 480;
function firstMap() {
   GeneralRules.prototype.switchToMap("Tutorial_1", false);
   GeneralRules.prototype.setOverlay("Overlay");
}
var gameViewContext;
var mouseInfo = {x: 0,y:0,pressed:false,oldX:0,oldY:0,clicked:false};
var currentMap;
var overlayMap;
var mainLoop = {interval:null, milliseconds:20};
var sounds = {};
function startGame() {
   initGraphicSheets();
   initFramesets();
   initTilesets();
   initTileCategories();
   firstMap();
   var gameView = document.getElementById('gameView');

   sounds.initialize();

   gameView.onmousedown = function(e) {
      e = e || window.event;
      mouseInfo.x = e.clientX;
      mouseInfo.y = e.clientY;
      mouseInfo.pressed = true;
      mouseInfo.clicked = true;
   };

   gameView.onmousemove = function(e) {
      e = e || window.event;
      mouseInfo.x = e.clientX;
      mouseInfo.y = e.clientY;
   };

   gameView.onmouseup = function(e) {
      mouseInfo.pressed = false;
   };

   gameView.onmouseout = function(e) {
      mouseInfo.pressed = false;
   };

   gameView.ontouchstart = function(e) {
      e = e || window.event;
      e.preventDefault();
      var touch = e.touches.item(0);
      mouseInfo.x = touch.clientX;
      mouseInfo.y = touch.clientY;
      mouseInfo.pressed = true;
      mouseInfo.clicked = true;
   };

   gameView.ontouchmove = function(e) {
      e = e || window.event;
      e.preventDefault();
      var touch = e.touches.item(0);
      mouseInfo.x = touch.clientX;
      mouseInfo.y = touch.clientY;
      mouseInfo.pressed = true;
   };
   
   gameView.ontouchend = function(e) {
      e = e || window.event;
      e.preventDefault();
      mouseInfo.pressed = false;
   }

   gameViewContext = gameView.getContext('2d');
   mainLoop.interval = setInterval("pulse()", mainLoop.milliseconds);
}

function pulse() {
   if (currentMap != null)
   {
      currentMap.draw(gameViewContext);
      currentMap.executeRules();
   }
   GeneralRules.drawMessages();
   if (overlayMap != null)
   {
      overlayMap.draw(gameViewContext);
      overlayMap.executeRules();
   }
   cycleMouseInfo();
}

function cycleMouseInfo() {
   mouseInfo.oldX = mouseInfo.x;
   mouseInfo.oldY = mouseInfo.y;
   mouseInfo.clicked = false;
}

function resizeView() {
   viewWidth = window.innerWidth;
   viewHeight = window.innerHeight;
   var gameView = document.getElementById('gameView');
   gameView.width = viewWidth;
   gameView.height = viewHeight;
   if ((gameViewContext != null) && (currentMap != null))
      currentMap.draw(gameViewContext);
}

function truncate(n) {
   return n | 0;
}

function GraphicSheet(image, cellWidth, cellHeight, columns, rows) {
   this.image = image;
   this.cellWidth = cellWidth;
   this.cellHeight = cellHeight;
   this.columns = columns;
   this.rows = rows;
}
var graphicSheets;
function initGraphicSheets() {
   graphicSheets = {
      CoolFont: new GraphicSheet(document.getElementById('CoolFont'), 13,18,24,5),
      FireFont: new GraphicSheet(document.getElementById('FireFont'), 13,18,24,4),
      Main: new GraphicSheet(document.getElementById('Main'), 32,32,16,10),
      NanoBots: new GraphicSheet(document.getElementById('NanoBots'), 16,16,16,8)
   };
}
function Frameset(name, frames) {
   this.name = name;
   this.frames = frames;
}
function XFrame(m11, m12, m21, m22, dx, dy, graphicSheet, imageSource, cellIndex) {
   this.m11 = m11;
   this.m12 = m12;
   this.m21 = m21;
   this.m22 = m22;
   this.dx = dx;
   this.dy = dy;
   this.graphicSheet = graphicSheet;
   this.imageSource = imageSource;
   this.cellIndex = cellIndex;
}
function Frame(graphicSheet, imageSource, cellIndex) {
   this.graphicSheet = graphicSheet;
   this.imageSource = imageSource;
   this.cellIndex = cellIndex;
}
Frame.prototype.draw = function(ctx, x, y) {
   if (this.imageSource == null) return;
   ctx.drawImage(this.imageSource, (this.cellIndex % this.graphicSheet.columns) * this.graphicSheet.cellWidth,
   Math.floor(this.cellIndex / this.graphicSheet.columns) * this.graphicSheet.cellHeight,
   this.graphicSheet.cellWidth, this.graphicSheet.cellHeight, x, y, this.graphicSheet.cellWidth, this.graphicSheet.cellHeight);
};
XFrame.prototype.draw = function(ctx, x, y) {
   ctx.save();
   ctx.transform(this.m11, this.m12, this.m21, this.m22, this.dx+x, this.dy+y);
   ctx.drawImage(this.imageSource, (this.cellIndex % this.graphicSheet.columns) * this.graphicSheet.cellWidth,
      Math.floor(this.cellIndex / this.graphicSheet.columns) * this.graphicSheet.cellHeight,
      this.graphicSheet.cellWidth, this.graphicSheet.cellHeight, 0, 0, this.graphicSheet.cellWidth, this.graphicSheet.cellHeight);
   ctx.restore();
};
function ModulateCelColor(target, x, y, width, height, r, g, b, a) {
   var cel;
   try { cel = target.getImageData(x, y, width, height); }
   catch(e) {
      document.write('Failed to process images. This may occur when running from local files; see <a href="http://stackoverflow.com/questions/2704929/uncaught-error-security-err-dom-exception-18">see details</a>');
      throw(e);
   }
   var celData = cel.data;
   for (yi = 0; yi < height; yi++) {
      for (xi = 0; xi < width; xi++) {
         var byteIdx = (yi * width + xi) * 4;
         celData[byteIdx] = Math.floor(celData[byteIdx] * r / 255);
         celData[byteIdx+1] = Math.floor(celData[byteIdx+1] * g / 255);
         celData[byteIdx+2] = Math.floor(celData[byteIdx+2] * b / 255);
         celData[byteIdx+3] = Math.floor(celData[byteIdx+3] * a / 255);
      }
   }
   target.putImageData(cel, x, y);
}
var frameSets = new Object();
function initFramesets() {
   var ctx;
   var gfx;
   gfx = graphicSheets.Main;
   gfx.extra = document.createElement('canvas');
   gfx.extra.width = 512;
   gfx.extra.height = 160;
   ctx = gfx.extra.getContext('2d');

   ctx.drawImage(gfx.image,64,0,32,32,0,0,32,32);
   ModulateCelColor(ctx,0,0,32,32,196,196,196,128);
   ctx.drawImage(gfx.image,64,0,32,32,32,0,32,32);
   ModulateCelColor(ctx,32,0,32,32,0,128,0,255);
   ctx.drawImage(gfx.image,96,0,32,32,64,0,32,32);
   ModulateCelColor(ctx,64,0,32,32,0,128,0,255);
   ctx.drawImage(gfx.image,160,0,32,32,96,0,32,32);
   ModulateCelColor(ctx,96,0,32,32,0,128,0,255);
   ctx.drawImage(gfx.image,192,0,32,32,128,0,32,32);
   ModulateCelColor(ctx,128,0,32,32,0,128,0,255);
   ctx.drawImage(gfx.image,128,0,32,32,160,0,32,32);
   ModulateCelColor(ctx,160,0,32,32,0,128,0,255);
   ctx.drawImage(gfx.image,64,0,32,32,192,0,32,32);
   ModulateCelColor(ctx,192,0,32,32,128,0,0,255);
   ctx.drawImage(gfx.image,96,0,32,32,224,0,32,32);
   ModulateCelColor(ctx,224,0,32,32,128,0,0,255);
   ctx.drawImage(gfx.image,160,0,32,32,256,0,32,32);
   ModulateCelColor(ctx,256,0,32,32,128,0,0,255);
   ctx.drawImage(gfx.image,192,0,32,32,288,0,32,32);
   ModulateCelColor(ctx,288,0,32,32,128,0,0,255);
   ctx.drawImage(gfx.image,128,0,32,32,320,0,32,32);
   ModulateCelColor(ctx,320,0,32,32,128,0,0,255);
   ctx.drawImage(gfx.image,64,0,32,32,352,0,32,32);
   ModulateCelColor(ctx,352,0,32,32,32,64,255,255);
   ctx.drawImage(gfx.image,64,0,32,32,384,0,32,32);
   ModulateCelColor(ctx,384,0,32,32,32,0,196,255);
   ctx.drawImage(gfx.image,160,160,32,32,416,0,32,32);
   ModulateCelColor(ctx,416,0,32,32,32,220,64,255);
   ctx.drawImage(gfx.image,192,160,32,32,448,0,32,32);
   ModulateCelColor(ctx,448,0,32,32,32,220,64,255);
   ctx.drawImage(gfx.image,224,160,32,32,480,0,32,32);
   ModulateCelColor(ctx,480,0,32,32,32,220,64,255);
   ctx.drawImage(gfx.image,256,160,32,32,0,32,32,32);
   ModulateCelColor(ctx,0,32,32,32,32,220,64,255);
   ctx.drawImage(gfx.image,288,160,32,32,32,32,32,32);
   ModulateCelColor(ctx,32,32,32,32,32,220,64,255);
   ctx.drawImage(gfx.image,320,160,32,32,64,32,32,32);
   ModulateCelColor(ctx,64,32,32,32,32,220,64,255);
   ctx.drawImage(gfx.image,32,192,32,32,96,32,32,32);
   ModulateCelColor(ctx,96,32,32,32,255,0,0,255);
   ctx.drawImage(gfx.image,96,32,32,32,128,32,32,32);
   ModulateCelColor(ctx,128,32,32,32,255,0,0,255);
   ctx.drawImage(gfx.image,224,224,32,32,160,32,32,32);
   ModulateCelColor(ctx,160,32,32,32,196,196,255,255);
   ctx.drawImage(gfx.image,32,256,32,32,192,32,32,32);
   ModulateCelColor(ctx,192,32,32,32,255,255,0,255);
   ctx.drawImage(gfx.image,32,256,32,32,224,32,32,32);
   ModulateCelColor(ctx,224,32,32,32,255,0,255,255);
   ctx.drawImage(gfx.image,32,256,32,32,256,32,32,32);
   ModulateCelColor(ctx,256,32,32,32,0,255,255,255);
   ctx.drawImage(gfx.image,32,256,32,32,288,32,32,32);
   ModulateCelColor(ctx,288,32,32,32,0,255,0,255);
   ctx.drawImage(gfx.image,96,256,32,32,320,32,32,32);
   ModulateCelColor(ctx,320,32,32,32,255,255,0,255);
   ctx.drawImage(gfx.image,96,256,32,32,352,32,32,32);
   ModulateCelColor(ctx,352,32,32,32,255,0,255,255);
   ctx.drawImage(gfx.image,96,256,32,32,384,32,32,32);
   ModulateCelColor(ctx,384,32,32,32,0,255,255,255);
   ctx.drawImage(gfx.image,96,256,32,32,416,32,32,32);
   ModulateCelColor(ctx,416,32,32,32,0,255,0,255);
   ctx.drawImage(gfx.image,64,0,32,32,448,32,32,32);
   ModulateCelColor(ctx,448,32,32,32,64,0,0,255);
   ctx.drawImage(gfx.image,128,160,32,32,480,32,32,32);
   ModulateCelColor(ctx,480,32,32,32,196,127,0,255);
   ctx.drawImage(gfx.image,64,0,32,32,0,64,32,32);
   ModulateCelColor(ctx,0,64,32,32,0,0,128,255);
   ctx.drawImage(gfx.image,256,192,32,32,32,64,32,32);
   ModulateCelColor(ctx,32,64,32,32,96,32,0,255);
   ctx.drawImage(gfx.image,288,192,32,32,64,64,32,32);
   ModulateCelColor(ctx,64,64,32,32,96,32,0,255);
   ctx.drawImage(gfx.image,256,192,32,32,96,64,32,32);
   ModulateCelColor(ctx,96,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,96,192,32,32,128,64,32,32);
   ModulateCelColor(ctx,128,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,128,192,32,32,160,64,32,32);
   ModulateCelColor(ctx,160,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,160,192,32,32,192,64,32,32);
   ModulateCelColor(ctx,192,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,192,192,32,32,224,64,32,32);
   ModulateCelColor(ctx,224,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,224,192,32,32,256,64,32,32);
   ModulateCelColor(ctx,256,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,384,192,32,32,288,64,32,32);
   ModulateCelColor(ctx,288,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,288,192,32,32,320,64,32,32);
   ModulateCelColor(ctx,320,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,416,192,32,32,352,64,32,32);
   ModulateCelColor(ctx,352,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,320,192,32,32,384,64,32,32);
   ModulateCelColor(ctx,384,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,352,192,32,32,416,64,32,32);
   ModulateCelColor(ctx,416,64,32,32,0,200,0,255);
   ctx.drawImage(gfx.image,256,192,32,32,448,64,32,32);
   ModulateCelColor(ctx,448,64,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,96,192,32,32,480,64,32,32);
   ModulateCelColor(ctx,480,64,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,128,192,32,32,0,96,32,32);
   ModulateCelColor(ctx,0,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,160,192,32,32,32,96,32,32);
   ModulateCelColor(ctx,32,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,192,192,32,32,64,96,32,32);
   ModulateCelColor(ctx,64,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,224,192,32,32,96,96,32,32);
   ModulateCelColor(ctx,96,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,384,192,32,32,128,96,32,32);
   ModulateCelColor(ctx,128,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,288,192,32,32,160,96,32,32);
   ModulateCelColor(ctx,160,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,416,192,32,32,192,96,32,32);
   ModulateCelColor(ctx,192,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,320,192,32,32,224,96,32,32);
   ModulateCelColor(ctx,224,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,352,192,32,32,256,96,32,32);
   ModulateCelColor(ctx,256,96,32,32,128,96,0,255);
   ctx.drawImage(gfx.image,256,192,32,32,288,96,32,32);
   ModulateCelColor(ctx,288,96,32,32,0,160,0,255);
   ctx.drawImage(gfx.image,288,192,32,32,320,96,32,32);
   ModulateCelColor(ctx,320,96,32,32,0,160,0,255);
   ctx.drawImage(gfx.image,416,192,32,32,352,96,32,32);
   ModulateCelColor(ctx,352,96,32,32,0,160,0,255);
   ctx.drawImage(gfx.image,320,192,32,32,384,96,32,32);
   ModulateCelColor(ctx,384,96,32,32,0,160,0,255);
   ctx.drawImage(gfx.image,352,192,32,32,416,96,32,32);
   ModulateCelColor(ctx,416,96,32,32,0,160,0,255);
   ctx.drawImage(gfx.image,64,192,32,32,448,96,32,32);
   ModulateCelColor(ctx,448,96,32,32,64,64,255,255);
   ctx.drawImage(gfx.image,64,192,32,32,480,96,32,32);
   ModulateCelColor(ctx,480,96,32,32,255,64,255,255);
   ctx.drawImage(gfx.image,64,192,32,32,0,128,32,32);
   ModulateCelColor(ctx,0,128,32,32,255,64,64,255);
   ctx.drawImage(gfx.image,64,192,32,32,32,128,32,32);
   ModulateCelColor(ctx,32,128,32,32,255,255,64,255);
   ctx.drawImage(gfx.image,64,192,32,32,64,128,32,32);
   ModulateCelColor(ctx,64,128,32,32,255,128,64,255);
   ctx.drawImage(gfx.image,64,192,32,32,96,128,32,32);
   ModulateCelColor(ctx,96,128,32,32,64,64,64,255);
   ctx.drawImage(gfx.image,32,224,32,32,128,128,32,32);
   ModulateCelColor(ctx,128,128,32,32,255,196,128,255);
   ctx.drawImage(gfx.image,64,224,32,32,160,128,32,32);
   ModulateCelColor(ctx,160,128,32,32,255,196,128,255);
   ctx.drawImage(gfx.image,352,64,32,32,192,128,32,32);
   ModulateCelColor(ctx,192,128,32,32,255,128,255,255);
   ctx.drawImage(gfx.image,384,64,32,32,224,128,32,32);
   ModulateCelColor(ctx,224,128,32,32,255,128,255,255);
   ctx.drawImage(gfx.image,416,64,32,32,256,128,32,32);
   ModulateCelColor(ctx,256,128,32,32,255,128,255,255);
   gfx = graphicSheets.NanoBots;
   gfx.extra = document.createElement('canvas');
   gfx.extra.width = 256;
   gfx.extra.height = 16;
   ctx = gfx.extra.getContext('2d');

   ctx.drawImage(gfx.image,112,16,16,16,0,0,16,16);
   ModulateCelColor(ctx,0,0,16,16,255,255,255,229);
   ctx.drawImage(gfx.image,112,16,16,16,16,0,16,16);
   ModulateCelColor(ctx,16,0,16,16,255,255,255,204);
   ctx.drawImage(gfx.image,112,16,16,16,32,0,16,16);
   ModulateCelColor(ctx,32,0,16,16,255,255,255,178);
   ctx.drawImage(gfx.image,112,16,16,16,48,0,16,16);
   ModulateCelColor(ctx,48,0,16,16,255,255,255,153);
   ctx.drawImage(gfx.image,112,16,16,16,64,0,16,16);
   ModulateCelColor(ctx,64,0,16,16,255,255,255,127);
   ctx.drawImage(gfx.image,112,16,16,16,80,0,16,16);
   ModulateCelColor(ctx,80,0,16,16,255,255,255,102);
   ctx.drawImage(gfx.image,112,16,16,16,96,0,16,16);
   ModulateCelColor(ctx,96,0,16,16,255,255,255,76);
   ctx.drawImage(gfx.image,112,16,16,16,112,0,16,16);
   ModulateCelColor(ctx,112,0,16,16,255,255,255,51);
   ctx.drawImage(gfx.image,112,16,16,16,128,0,16,16);
   ModulateCelColor(ctx,128,0,16,16,255,255,255,25);
   frameSets.BombFrames = new Frameset('BombFrames', [
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,50),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,51),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,52),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,53),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,54),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,55),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,56),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,57),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,58),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,59),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,60),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,61),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,62),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,63),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,64),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,65),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,66),
      new XFrame(1,0,0,1,-8,-16,graphicSheets.Main,graphicSheets.Main.image,67)]);
   frameSets.Bombot = new Frameset('Bombot', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,80),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,81),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,82),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,80),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,81),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,82)]);
   frameSets.CoolFontFrames = new Frameset('CoolFontFrames', [
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,12),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,13),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,17),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,16),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,22),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,14),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,0),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,1),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,2),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,3),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,4),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,5),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,6),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,7),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,8),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,9),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,10),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,11),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,12),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,13),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,14),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,15),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,16),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,17),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,18),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,19),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,20),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,21),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,22),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,23),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,24),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,25),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,26),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,27),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,28),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,29),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,31),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,32),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,33),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,34),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,35),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,36),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,37),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,38),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,39),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,40),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,41),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,42),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,43),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,44),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,45),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,46),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,47),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,48),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,49),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,50),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,51),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,52),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,53),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,54),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,55),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,56),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,57),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,58),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,59),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,60),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,61),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,62),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,63),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,64),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,65),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,66),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,67),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,68),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,69),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,70),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,71),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,72),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,73),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,74),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,75),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,76),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,77),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,78),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,79),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,80),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,81),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,82),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,83),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,84),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,85),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,86),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,87),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,88),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,89),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,90),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,91),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,92),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,93),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,94),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,95),
      new XFrame(1,0,0,1,10,0,graphicSheets.CoolFont,graphicSheets.CoolFont.image,76),
      new XFrame(1,0,0,1,20,0,graphicSheets.CoolFont,graphicSheets.CoolFont.image,79),
      new XFrame(1,0,0,1,30,0,graphicSheets.CoolFont,graphicSheets.CoolFont.image,83),
      new XFrame(1,0,0,1,40,0,graphicSheets.CoolFont,graphicSheets.CoolFont.image,88),
      new XFrame(1,0,0,1,10,0,graphicSheets.CoolFont,graphicSheets.CoolFont.image,84),
      new XFrame(1,0,0,1,20,0,graphicSheets.CoolFont,graphicSheets.CoolFont.image,75),
      new XFrame(1,0,0,1,30,0,graphicSheets.CoolFont,graphicSheets.CoolFont.image,75),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,96),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,97)]);
   frameSets.EaterFrames = new Frameset('EaterFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,138),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,139),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,140),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,141),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,142),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,143),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,138),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,139),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,140),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,141),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,142),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,143)]);
   frameSets.Explosion = new Frameset('Explosion', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,71),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,72),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,73),
      new XFrame(1.1,0,0,1.1,-2,-2,graphicSheets.Main,graphicSheets.Main.image,74),
      new XFrame(1.3,0,0,1.3,-5,-5,graphicSheets.Main,graphicSheets.Main.image,75),
      new XFrame(1.5,0,0,1.5,-7,-7,graphicSheets.Main,graphicSheets.Main.image,76),
      new XFrame(1.7,0,0,1.7,-10,-10,graphicSheets.Main,graphicSheets.Main.image,77)]);
   frameSets.FireFontFrames = new Frameset('FireFontFrames', [
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,0),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,1),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,2),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,3),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,4),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,5),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,6),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,7),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,8),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,9),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,10),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,11),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,12),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,13),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,14),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,15),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,16),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,17),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,18),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,19),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,20),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,21),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,22),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,23),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,24),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,25),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,26),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,27),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,28),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,29),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,31),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,32),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,33),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,34),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,35),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,36),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,37),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,38),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,39),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,40),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,41),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,42),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,43),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,44),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,45),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,46),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,47),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,48),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,49),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,50),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,51),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,52),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,53),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,54),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,55),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,56),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,57),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,58),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,59),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,60),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,61),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,62),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,63),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,64),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,65),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,66),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,67),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,68),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,69),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,70),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,71),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,72),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,73),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,74),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,75),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,76),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,77),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,78),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,79),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,80),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,81),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,82),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,83),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,84),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,85),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,86),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,87),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,88),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,89),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,90),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,91),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,92),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,93),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,94),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,95)]);
   frameSets.IgniterFrames = new Frameset('IgniterFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,46),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,47),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,47),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,48),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,48)]);
   frameSets.InventoryFrames = new Frameset('InventoryFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,50),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,16),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,22),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,12),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,17),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,18),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,13),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,14),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,0),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,133),
      new XFrame(1,0,0,1,-4,10,graphicSheets.Main,graphicSheets.Main.image,78),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,20),
      new XFrame(0,1,-1,0,24,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,20),
      new XFrame(1,0,0,-1,8,24,graphicSheets.NanoBots,graphicSheets.NanoBots.image,20),
      new XFrame(0,1,1,0,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,20),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,2),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,5),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,3),
      new XFrame(1,0,0,1,8,8,graphicSheets.NanoBots,graphicSheets.NanoBots.image,4)]);
   frameSets.InventorySelector = new Frameset('InventorySelector', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,128),
      new XFrame(1.1,0,0,1.1,-1.6,-1.6,graphicSheets.Main,graphicSheets.Main.image,128),
      new XFrame(1.2,0,0,1.2,-3.2,-3.2,graphicSheets.Main,graphicSheets.Main.image,128)]);
   frameSets.JumperFrames = new Frameset('JumperFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,121),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,122),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,123),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,123),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,122),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,121)]);
   frameSets.MainFrames = new Frameset('MainFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,1),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,1),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,2),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,2),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,3),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,4),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,4),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,3),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,5),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,6),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,7),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,7),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,8),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,9),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,9),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,8),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,10),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,11),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,12),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,2),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,3),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,3),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,5),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,6),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,6),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,5),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,4),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,20),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,21),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,22),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,23),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,24),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,25),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,26),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,36),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,37),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,38),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,39),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,40),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,41),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,42),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,33),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,34),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,35),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,49),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,33),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,34),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,35),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,49),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,16),
      new XFrame(0.75,0,0,1,4,0,graphicSheets.Main,graphicSheets.Main.image,16),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.image,16),
      new XFrame(0.25,0,0,1,12,0,graphicSheets.Main,graphicSheets.Main.image,16),
      new XFrame(0.25,0,0,1,12,0,graphicSheets.Main,graphicSheets.Main.image,32),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.image,32),
      new XFrame(0.75,0,0,1,4,0,graphicSheets.Main,graphicSheets.Main.image,32),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,32),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,7),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,8),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,9),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,10),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,70),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,15),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,68),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,69),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,83),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,78),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,79),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,46),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,13),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,14),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,15),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,16),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,17),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,17),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,13),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,14),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,15),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,16),
      new XFrame(0,1,1,0,0,0,graphicSheets.Main,graphicSheets.Main.extra,13),
      new XFrame(0,1,1,0,0,0,graphicSheets.Main,graphicSheets.Main.extra,14),
      new XFrame(0,1,1,0,0,0,graphicSheets.Main,graphicSheets.Main.extra,15),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,18),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,11),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,19),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,20),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,116),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,117),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,118),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,118),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,21),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,17),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,120),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,120),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,126),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,127),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,44),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,68),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,82),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,64),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,70),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,68),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,19),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,52),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,72),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,81),
      new XFrame(1,0,0,1,9,6,graphicSheets.CoolFont,graphicSheets.CoolFont.image,0),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,30),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,31),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,22),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,23),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,24),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,25),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,130),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,26),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,27),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,28),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,29),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,14),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,133),
      new XFrame(1,0,0,-1,0,32,graphicSheets.Main,graphicSheets.Main.extra,2),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,2),
      new XFrame(1,0,0,-1,0,32,graphicSheets.Main,graphicSheets.Main.extra,7),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,7),
      new XFrame(1,0,0,-1,0,32,graphicSheets.Main,graphicSheets.Main.image,3),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.image,3),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,134),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,135),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,30),
      new XFrame(0.5,0,0,0.5,8,16,graphicSheets.Main,graphicSheets.Main.image,16)]);
   frameSets.NanoBotFrames = new Frameset('NanoBotFrames', [
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,6),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,7),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,8),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,9),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,10),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,11),
      new XFrame(-1,0,0,-1,16,16,graphicSheets.NanoBots,graphicSheets.NanoBots.image,10),
      new XFrame(-1,0,0,-1,16,16,graphicSheets.NanoBots,graphicSheets.NanoBots.image,9),
      new XFrame(-1,0,0,-1,16,16,graphicSheets.NanoBots,graphicSheets.NanoBots.image,8),
      new XFrame(-1,0,0,-1,16,16,graphicSheets.NanoBots,graphicSheets.NanoBots.image,7),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,2),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,3),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,4),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,5),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,16),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,21),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,17),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,18),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,19),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,12),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,20),
      new XFrame(0,1,-1,0,16,0,graphicSheets.NanoBots,graphicSheets.NanoBots.image,20),
      new XFrame(-1,0,0,-1,16,16,graphicSheets.NanoBots,graphicSheets.NanoBots.image,20),
      new XFrame(0,-1,1,0,0,16,graphicSheets.NanoBots,graphicSheets.NanoBots.image,20),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,13),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,14),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,15),
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,22)]);
   frameSets.Platform = new Frameset('Platform', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,4),
      new XFrame(1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,4)]);
   frameSets.PlayerFrames = new Frameset('PlayerFrames', [
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,33),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,34),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,35),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,49),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,33),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,34),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,35),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,49),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,91),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,92),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,92),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,91),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,93),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,94),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,95),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,93),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,94),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,95),
      new XFrame(1,0,0,1,-4,0,graphicSheets.Main,graphicSheets.Main.image,96),
      new XFrame(-1,0,0,1,28,0,graphicSheets.Main,graphicSheets.Main.image,96),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,110),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,111),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,110),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.image,110),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.image,111),
      new XFrame(0,-1,-1,0,32,32,graphicSheets.Main,graphicSheets.Main.image,110),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.image,110),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.image,111),
      new XFrame(1,0,0,-1,0,32,graphicSheets.Main,graphicSheets.Main.image,110),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.image,110),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.image,111),
      new XFrame(0,1,1,0,0,0,graphicSheets.Main,graphicSheets.Main.image,110),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,112)]);
   frameSets.RocketFrames = new Frameset('RocketFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,12),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.image,12),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.image,12),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.image,12),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,13),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.image,13),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.image,13),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.image,13)]);
   frameSets.SeedFrames = new Frameset('SeedFrames', [
      new XFrame(0.9613,-0.2756,0.2756,0.9613,-8.7904,6.03,graphicSheets.Main,graphicSheets.Main.extra,31),
      new XFrame(0.9816,-0.1908,0.1908,0.9816,-6,4,graphicSheets.Main,graphicSheets.Main.extra,31),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,31),
      new XFrame(0.9848,0.1736,-0.1736,0.9848,6,-3,graphicSheets.Main,graphicSheets.Main.extra,31),
      new XFrame(0.9659,0.2588,-0.2588,0.9659,9,-4,graphicSheets.Main,graphicSheets.Main.extra,31),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,115)]);
   frameSets.Sparkles = new Frameset('Sparkles', [
      new Frame(graphicSheets.NanoBots,graphicSheets.NanoBots.image,23),
      new XFrame(1,0,0,1,0,-1,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,0),
      new XFrame(1,0,0,1,0,-2,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,1),
      new XFrame(1,0,0,1,0,-3,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,2),
      new XFrame(1,0,0,1,0,-4,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,3),
      new XFrame(1,0,0,1,0,-5,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,4),
      new XFrame(1,0,0,1,0,-6,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,5),
      new XFrame(1,0,0,1,0,-7,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,6),
      new XFrame(1,0,0,1,0,-8,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,7),
      new XFrame(1,0,0,1,0,-9,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,8),
      new XFrame(1,0,0,1,3,-4,graphicSheets.NanoBots,graphicSheets.NanoBots.image,23),
      new XFrame(1,0,0,1,3,-5,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,0),
      new XFrame(1,0,0,1,3,-6,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,1),
      new XFrame(1,0,0,1,3,-7,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,2),
      new XFrame(1,0,0,1,3,-8,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,3),
      new XFrame(1,0,0,1,3,-9,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,4),
      new XFrame(1,0,0,1,3,-10,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,5),
      new XFrame(1,0,0,1,3,-11,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,6),
      new XFrame(1,0,0,1,3,-12,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,7),
      new XFrame(1,0,0,1,3,-13,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,8),
      new XFrame(1,0,0,1,-4,-6,graphicSheets.NanoBots,graphicSheets.NanoBots.image,23),
      new XFrame(1,0,0,1,-4,-7,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,0),
      new XFrame(1,0,0,1,-4,-8,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,1),
      new XFrame(1,0,0,1,-4,-9,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,2),
      new XFrame(1,0,0,1,-4,-10,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,3),
      new XFrame(1,0,0,1,-4,-11,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,4),
      new XFrame(1,0,0,1,-4,-12,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,5),
      new XFrame(1,0,0,1,-4,-13,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,6),
      new XFrame(1,0,0,1,-4,-14,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,7),
      new XFrame(1,0,0,1,-4,-15,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,8),
      new XFrame(1,0,0,1,2,0,graphicSheets.NanoBots,graphicSheets.NanoBots.image,23),
      new XFrame(1,0,0,1,2,-1,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,0),
      new XFrame(1,0,0,1,2,-2,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,1),
      new XFrame(1,0,0,1,2,-3,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,2),
      new XFrame(1,0,0,1,2,-4,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,3),
      new XFrame(1,0,0,1,2,-5,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,4),
      new XFrame(1,0,0,1,2,-6,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,5),
      new XFrame(1,0,0,1,2,-7,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,6),
      new XFrame(1,0,0,1,2,-8,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,7),
      new XFrame(1,0,0,1,2,-9,graphicSheets.NanoBots,graphicSheets.NanoBots.extra,8)]);
   frameSets.SpiderFrames = new Frameset('SpiderFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,124),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,125),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,125)]);
   frameSets.ThrownTorchFrames = new Frameset('ThrownTorchFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.image,133),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.image,133),
      new XFrame(1,0,0,1,-4,10,graphicSheets.Main,graphicSheets.Main.image,78),
      new XFrame(1,0,0,1,-4,10,graphicSheets.Main,graphicSheets.Main.image,79),
      new XFrame(-1,0,0,1,28,10,graphicSheets.Main,graphicSheets.Main.image,78),
      new XFrame(-1,0,0,1,28,10,graphicSheets.Main,graphicSheets.Main.image,79),
      new XFrame(1,0,0,1,6,10,graphicSheets.Main,graphicSheets.Main.image,78),
      new XFrame(1,0,0,1,6,10,graphicSheets.Main,graphicSheets.Main.image,79),
      new XFrame(-1,0,0,1,38,10,graphicSheets.Main,graphicSheets.Main.image,78),
      new XFrame(-1,0,0,1,38,10,graphicSheets.Main,graphicSheets.Main.image,79)]);
   frameSets.WorldMapFrames = new Frameset('WorldMapFrames', [
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,32),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,33),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,34),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,34),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,35),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,36),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,36),
      new XFrame(1,0,0,-1,0,32,graphicSheets.Main,graphicSheets.Main.extra,36),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,36),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,37),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,37),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,38),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,38),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,38),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,38),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,39),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,39),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,39),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,39),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,40),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,41),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,41),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,41),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,41),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,42),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,42),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,42),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,42),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,43),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,43),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,43),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,43),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,44),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,44),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,44),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,44),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,45),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,45),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,46),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,47),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,47),
      new XFrame(1,0,0,-1,0,32,graphicSheets.Main,graphicSheets.Main.extra,47),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,47),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,48),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,48),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,49),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,49),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,49),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,49),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,50),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,50),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,50),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,50),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,51),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,52),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,52),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,52),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,52),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,53),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,53),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,53),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,53),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,54),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,54),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,54),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,54),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,55),
      new XFrame(0,1,-1,0,32,0,graphicSheets.Main,graphicSheets.Main.extra,55),
      new XFrame(-1,0,0,-1,32,32,graphicSheets.Main,graphicSheets.Main.extra,55),
      new XFrame(0,-1,1,0,0,32,graphicSheets.Main,graphicSheets.Main.extra,55),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,56),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,56),
      new XFrame(1,0,0,1,0,-16,graphicSheets.Main,graphicSheets.Main.extra,57),
      new XFrame(1,0,0,1,0,-16,graphicSheets.Main,graphicSheets.Main.extra,58),
      new XFrame(0,1,-1,0,32,-16,graphicSheets.Main,graphicSheets.Main.extra,58),
      new XFrame(-1,0,0,1,32,-16,graphicSheets.Main,graphicSheets.Main.extra,58),
      new XFrame(0,-1,1,0,0,16,graphicSheets.Main,graphicSheets.Main.extra,58),
      new XFrame(1,0,0,1,0,-16,graphicSheets.Main,graphicSheets.Main.extra,59),
      new XFrame(0,1,-1,0,32,-16,graphicSheets.Main,graphicSheets.Main.extra,59),
      new XFrame(-1,0,0,-1,32,16,graphicSheets.Main,graphicSheets.Main.extra,59),
      new XFrame(0,-1,1,0,0,16,graphicSheets.Main,graphicSheets.Main.extra,59),
      new XFrame(1,0,0,1,0,-16,graphicSheets.Main,graphicSheets.Main.extra,60),
      new XFrame(0,1,-1,0,32,-16,graphicSheets.Main,graphicSheets.Main.extra,60),
      new XFrame(-1,0,0,-1,32,16,graphicSheets.Main,graphicSheets.Main.extra,60),
      new XFrame(0,-1,1,0,0,16,graphicSheets.Main,graphicSheets.Main.extra,60),
      new XFrame(1,0,0,1,0,-16,graphicSheets.Main,graphicSheets.Main.extra,61),
      new XFrame(-1,0,0,1,32,-16,graphicSheets.Main,graphicSheets.Main.extra,61),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,62),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,63),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,64),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,65),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,66),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,67),
      new Frame(graphicSheets.Main,graphicSheets.Main.image,98),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,16),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,17),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,18),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,19),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,20),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,21),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,22),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,23),
      new XFrame(1,0,0,1,9,8,graphicSheets.FireFont,graphicSheets.FireFont.image,24),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.extra,62),
      new XFrame(0.2,0,0,1,13,0,graphicSheets.Main,graphicSheets.Main.extra,62),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.extra,63),
      new XFrame(0.2,0,0,1,13,0,graphicSheets.Main,graphicSheets.Main.extra,63),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.extra,64),
      new XFrame(0.2,0,0,1,13,0,graphicSheets.Main,graphicSheets.Main.extra,64),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.extra,65),
      new XFrame(0.2,0,0,1,13,0,graphicSheets.Main,graphicSheets.Main.extra,65),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.extra,66),
      new XFrame(0.2,0,0,1,13,0,graphicSheets.Main,graphicSheets.Main.extra,66),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.extra,67),
      new XFrame(0.2,0,0,1,13,0,graphicSheets.Main,graphicSheets.Main.extra,67),
      new XFrame(0.5,0,0,1,8,0,graphicSheets.Main,graphicSheets.Main.image,98),
      new XFrame(0.2,0,0,1,13,0,graphicSheets.Main,graphicSheets.Main.image,98),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,68),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,69),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,68)]);
   frameSets.Worm = new Frameset('Worm', [
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,70),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,71),
      new Frame(graphicSheets.Main,graphicSheets.Main.extra,72),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,70),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,71),
      new XFrame(-1,0,0,1,32,0,graphicSheets.Main,graphicSheets.Main.extra,72)]);
}
function Counter(value, min, max) {
   this.value = value;
   this.min = min;
   this.max = max;
}
var counters = {
   Bombs: new Counter(0, 0, 5),
   BotBombs: new Counter(0, 0, 100),
   BotCollisionPowers: new Counter(0, 0, 100),
   BotDroplets: new Counter(0, 0, 100),
   BotEnergySources: new Counter(0, 0, 100),
   BotFollowers: new Counter(0, 0, 100),
   BotMoveDowns: new Counter(0, 0, 100),
   BotMoveLefts: new Counter(0, 0, 100),
   BotMoveRights: new Counter(0, 0, 100),
   BotMoveUps: new Counter(0, 0, 100),
   BotRange: new Counter(500, 0, 10000),
   BotSplashPowers: new Counter(0, 0, 100),
   CanAccessInventory: new Counter(1, 0, 1),
   CurrentSlot: new Counter(0, 0, 4),
   DNASpiders: new Counter(0, 0, 100),
   DNAWorms: new Counter(0, 0, 100),
   FrameCounter: new Counter(1, 0, 25200),
   GlobalAction: new Counter(0, 0, 5),
   Health: new Counter(10, 0, 10),
   Life: new Counter(3, 0, 10),
   Money: new Counter(0, 0, 10000),
   SaveLoadDelete: new Counter(0, 0, 2),
   SaveSlot1: new Counter(0, 0, 1),
   SaveSlot2: new Counter(0, 0, 1),
   SaveSlot3: new Counter(0, 0, 1),
   SaveSlotCP: new Counter(0, 0, 1),
   SelectedInventory: new Counter(0, 0, 14),
   ThrowableTorches: new Counter(0, 0, 5)
};
function Tileset(name, tileWidth, tileHeight, frameSet, tiles) {
   this.name = name;
   this.tileWidth = tileWidth;
   this.tileHeight = tileHeight;
   this.frameSet = frameSet;
   this.tiles = tiles;
}
function TileFrame(accumulatedDuration, subFrames) {
   this.accumulatedDuration = accumulatedDuration;
   this.subFrames = subFrames;
}
function AnimTile(counter, frames) {
   this.counter = counter;
   this.frames = frames;
   this.totalDuration = frames[frames.length - 1].accumulatedDuration;
}
AnimTile.prototype.getCurFrameIndex = function() {
   for(var i = 0; i < this.frames.length; i++) {
      if((this.counter.value % this.totalDuration) < this.frames[i].accumulatedDuration) return i;
   }
   return this.frames.length - 1;
};
AnimTile.prototype.getCurFrames = function() {
   return this.frames[this.getCurFrameIndex()].subFrames;
};
var tilesets = new Object();
function initTilesets() {
   tilesets.CoolText = new Tileset('CoolText',11,15, frameSets.CoolFontFrames,[null,
      new AnimTile(counters.SaveSlot1,[new TileFrame(1,[69,129,130,131,132]),new TileFrame(2,[70,133,134,135])]),
      new AnimTile(counters.SaveSlot2,[new TileFrame(1,[69,129,130,131,132]),new TileFrame(2,[70,133,134,135])]),
      new AnimTile(counters.SaveSlot3,[new TileFrame(1,[69,129,130,131,132]),new TileFrame(2,[70,133,134,135])]),
      new AnimTile(counters.SaveSlotCP,[new TileFrame(1,[69,129,130,131,132]),new TileFrame(2,[70,133,134,135])]),
      5,6,7,0,1,10,2,3,13,4,5,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,null,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,
      new AnimTile(counters.CurrentSlot,[new TileFrame(1,136),new TileFrame(5,137)]),
      new AnimTile(counters.CurrentSlot,[new TileFrame(1,137),new TileFrame(2,136),new TileFrame(5,137)]),
      new AnimTile(counters.CurrentSlot,[new TileFrame(2,137),new TileFrame(3,136),new TileFrame(5,137)]),
      new AnimTile(counters.CurrentSlot,[new TileFrame(3,137),new TileFrame(4,136),new TileFrame(5,137)]),
      new AnimTile(counters.CurrentSlot,[new TileFrame(4,137),new TileFrame(5,136)]),
      134,135,136,137]);
   tilesets.FireText = new Tileset('FireText',11,15, frameSets.FireFontFrames,[null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,null,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128]);
   tilesets.MainTiles = new Tileset('MainTiles',32,32, frameSets.MainFrames,[null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,61,62,
      new AnimTile(counters.FrameCounter,[new TileFrame(6,[62,63]),new TileFrame(12,[62,64])]),
      65,
      new AnimTile(counters.FrameCounter,[new TileFrame(6,[65,66]),new TileFrame(12,[65,67])]),
      [62,68],[65,68],71,72,73,74,77,78,81,82,
      new AnimTile(counters.FrameCounter,[new TileFrame(16,[95,96]),new TileFrame(32,[95,97]),new TileFrame(64,[95,98]),new TileFrame(80,[95,99]),new TileFrame(96,[95,100]),new TileFrame(112,[95,101]),new TileFrame(128,95),new TileFrame(144,[95,102]),new TileFrame(160,[95,103]),new TileFrame(176,95),new TileFrame(192,[95,98]),new TileFrame(208,[95,104]),new TileFrame(224,[95,105]),new TileFrame(240,[95,106]),new TileFrame(300,95)]),
      107,108,45,46,47,48,49,
      new AnimTile(counters.FrameCounter,[new TileFrame(4,27),new TileFrame(8,28),new TileFrame(12,29),new TileFrame(16,30),new TileFrame(20,31),new TileFrame(24,32),new TileFrame(28,33)]),
      new AnimTile(counters.FrameCounter,[new TileFrame(4,34),new TileFrame(8,35),new TileFrame(12,36),new TileFrame(16,37),new TileFrame(20,38),new TileFrame(24,39),new TileFrame(28,40)]),
      new AnimTile(counters.FrameCounter,[new TileFrame(4,49),new TileFrame(8,50),new TileFrame(12,51),new TileFrame(16,52),new TileFrame(20,54),new TileFrame(24,55),new TileFrame(28,56),new TileFrame(32,55),new TileFrame(36,54),new TileFrame(40,52),new TileFrame(44,51),new TileFrame(48,50)]),
      new AnimTile(counters.FrameCounter,[new TileFrame(3,57),new TileFrame(6,58),new TileFrame(9,59),new TileFrame(12,60)]),
      new AnimTile(counters.FrameCounter,[new TileFrame(3,60),new TileFrame(6,59),new TileFrame(9,58),new TileFrame(12,57)]),
      84,85,86,87,88,89,90,[90,26],91,92,93,94,[19,94],109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,0,127,128,[107,129],90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129]);
   tilesets.UsableInventory = new Tileset('UsableInventory',32,32, frameSets.InventoryFrames,[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,9,10],[8,11],[8,12],[8,13],[8,14],[8,15],[8,16],[8,17],[8,18],17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,
      new AnimTile(counters.SelectedInventory,[new TileFrame(1,0),new TileFrame(2,1),new TileFrame(3,2),new TileFrame(4,3),new TileFrame(5,4),new TileFrame(6,5),new TileFrame(7,6),new TileFrame(8,7),new TileFrame(9,[9,10]),new TileFrame(10,11),new TileFrame(11,12),new TileFrame(12,13),new TileFrame(13,14),new TileFrame(14,15),new TileFrame(15,16),new TileFrame(16,17),new TileFrame(17,18)]),
      8]);
   tilesets.WorldMapTiles = new Tileset('WorldMapTiles',32,32, frameSets.WorldMapFrames,[null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,[4,39],[4,40],[4,41],[4,42],[4,43],[4,44],[4,45],[4,46],[4,47],[4,48],[4,49],[4,50],[4,51],[4,52],[4,53],[4,54],[4,55],[4,56],[4,57],[4,58],[4,59],[4,60],[4,61],[4,62],[4,63],[4,64],[4,65],[4,66],[4,67],[4,68],[4,69],[4,70],[4,71],72,73,74,75,[1,76],77,78,[3,79],[2,80],81,82,[1,83],[1,84],[1,85],[1,86],0,
      new AnimTile(counters.FrameCounter,[new TileFrame(6,[90,94]),new TileFrame(12,[109,94]),new TileFrame(18,[110,94]),new TileFrame(24,[109,94])]),
      new AnimTile(counters.FrameCounter,[new TileFrame(6,[91,95]),new TileFrame(12,[111,95]),new TileFrame(18,[112,95]),new TileFrame(24,[111,95])]),
      117,118,119,[72,117],[72,118],[72,119],96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119]);
};
var keyboardState;
keyboardState = new Object();
keyboardState.key= { None:0, Enter:13, Shift:16, Ctrl:17, Alt: 18, Pause:19, Escape:27, Space:32, PageUp:33, PageDown:34,
   End:35, Home:36, Left:37, Up:38, Right:39, Down:40, Insert:45, Delete:46,
   Digit0:48, Digit1:49, Digit2:50, Digit3:51, Digit4:52, Digit5:53, Digit6:54, Digit7:55, Digit8:56, Digit9:57,
   A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79,
   P: 80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90,
   LWindow:91, RWindow:92, ContextMenu:93,
   NumPad0:96, NumPad1:97, NumPad2:98, NumPad3:99, NumPad4:100, NumPad5:101, NumPad6:102, NumPad7:103, NumPad8:104, NumPad9:105,
   NumPadMultiply:106, NumPadAdd:107, NumPadEnter:108, NumPadSubtract:109, NumPadDecimal:110, NumPadDivide:111,
   F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123,
   NumLock:144, ScrollLock:145,
   SemiColon:186, Equal:187, Comma:188, Minus:189, Period:190, Slash:191, Backtick:192,
   LeftBracket:219, BackSlash:220, RightBracket:221, Quote:222 };

keyboardState.keyState = new Array();
keyboardState.handleKeyDown = function(e) {
   e = e || window.event;
   keyboardState.keyState[e.keyCode] = true;
};

keyboardState.handleKeyUp = function(e) {
   e = e || window.event;
   keyboardState.keyState[e.keyCode] = false;
};

keyboardState.isKeyPressed = function(key) { return keyboardState.keyState[key]; };

document.onkeydown = keyboardState.handleKeyDown;
document.onkeyup = keyboardState.handleKeyUp;

function KeyboardPlayer(defaultSet) {
   switch(defaultSet)
   {
      case 0:
         this.initializeKeys(
            keyboardState.key.Up,     // Up
            keyboardState.key.Left,   // Left
            keyboardState.key.Right,  // Right
            keyboardState.key.Down,   // Down
            keyboardState.key.Ctrl,   // Button 1
            keyboardState.key.Space,  // Button 2
            keyboardState.key.Enter,  // Button 3
            keyboardState.key.Shift); // Button 4
         break;
      case 1:
         this.initializeKeys(
            keyboardState.key.W,     // Up
            keyboardState.key.A,     // Left
            keyboardState.key.D,     // Right
            keyboardState.key.S,     // Down
            keyboardState.key.Z,     // Button 1
            keyboardState.key.C,     // Button 2
            keyboardState.key.Q,     // Button 3
            keyboardState.key.E);    // Button 4
         break;
      case 2:
         this.initializeKeys(
            keyboardState.key.NumPad8,      // Up
            keyboardState.key.NumPad4,      // Right
            keyboardState.key.NumPad6,      // Left
            keyboardState.key.NumPad2,      // Down
            keyboardState.key.NumPad5,      // Button 1
            keyboardState.key.NumPad0,      // Button 2
            keyboardState.key.NumPadEnter,  // Button 3
            keyboardState.key.NumPad7);     // Button 4
         break;
      default:
         this.initializeKeys(
            keyboardState.key.I,            // Up
            keyboardState.key.J,            // Right
            keyboardState.key.L,            // Left
            keyboardState.key.K,            // Down
            keyboardState.key.U,            // Button 1
            keyboardState.key.O,            // Button 2
            keyboardState.key.M,            // Button 3
            keyboardState.key.Comma);       // Button 4
         break;
   }
}

KeyboardPlayer.prototype.initializeKeys = function(up, left, right, down, button1, button2, button3, button4) {
   this.upKey = up;
   this.leftKey = left;
   this.rightKey = right;
   this.downKey = down;
   this.button1Key = button1;
   this.button2Key = button2;
   this.button3Key = button3;
   this.button4Key = button4;
};

KeyboardPlayer.prototype.up = function() { return keyboardState.keyState[this.upKey]; };
KeyboardPlayer.prototype.left = function() { return keyboardState.keyState[this.leftKey]; };
KeyboardPlayer.prototype.right = function() { return keyboardState.keyState[this.rightKey]; };
KeyboardPlayer.prototype.down = function() { return keyboardState.keyState[this.downKey]; };
KeyboardPlayer.prototype.button1 = function() { return keyboardState.keyState[this.button1Key]; };
KeyboardPlayer.prototype.button2 = function() { return keyboardState.keyState[this.button2Key]; };
KeyboardPlayer.prototype.button3 = function() { return keyboardState.keyState[this.button3Key]; };
KeyboardPlayer.prototype.button4 = function() { return keyboardState.keyState[this.button4Key]; };

var players = [ new KeyboardPlayer(0), new KeyboardPlayer(1), new KeyboardPlayer(2), new KeyboardPlayer(3) ];
function GeneralRules() {
}

GeneralRules.buttonSpecifier = {first:1, second:2, third:4, fourth:8, freezeInputs:16};
GeneralRules.maxMessages = 4;
GeneralRules.messageBackground = "rgba(64, 0, 255, .5)";
GeneralRules.currentPlayer = 0;
GeneralRules.activeMessages = [];
GeneralRules.messageMargin = 6;

GeneralRules.prototype.saveGame = function(slot, temporary) {
   if (GeneralRules.saveUnit == null) {
      this.includeInSaveUnit("AllMaps");
      this.includeInSaveUnit("AllCounters");
      this.includeInSaveUnit("WhichMapIsCurrent");
      this.includeInSaveUnit("WhichMapIsOverlaid");
   }
   if (GeneralRules.saveUnit.allMaps) {
      GeneralRules.saveUnit.maps = {};
      for(var key in maps) {
         GeneralRules.saveUnit.maps[key] = maps[key].getState();
      }
   } else if (GeneralRules.saveUnit.maps !== undefined) {
      for(var key in GeneralRules.saveUnit.maps) {
         GeneralRules.saveUnit.maps[key] = maps[key].getState();
      }
   }
   if (GeneralRules.saveUnit.counters != null) {
      for(var key in GeneralRules.saveUnit.counters) {
         GeneralRules.saveUnit.counters[key] = counters[key];
      }
   }
   if (GeneralRules.saveUnit.currentMap !== undefined)
      GeneralRules.saveUnit.currentMap = getMapName(currentMap);
   if (GeneralRules.saveUnit.overlayMap !== undefined)
      GeneralRules.saveUnit.overlayMap = getMapName(overlayMap);
   if (temporary)
      GeneralRules["save" + slot] = JSON.stringify(GeneralRules.saveUnit);
   else
      localStorage.setItem("save" + slot, JSON.stringify(GeneralRules.saveUnit));
   GeneralRules.saveUnit = null;
};

GeneralRules.prototype.loadGame = function(slot, temporary) {
   var data;
   if (temporary)
      data = GeneralRules["save" + slot];
   else
      data = localStorage.getItem("save" + slot);
   if (data == null) return;
   data = JSON.parse(data);
   for(var key in data.maps)
   {
      if (maps[key] == null)
         mapInitializers[key]();
      maps[key].setState(data.maps[key]);
   }
   if (data.allMaps)
   {
      for(var key in maps)
         if (data.maps[key] == null)
            delete maps[key];
   }
   if (data.counters != null) {
      for(var key in data.counters)
         counters[key].value = data.counters[key].value; // Tile definitions are linked to the original counter instance
   }
   if (data.currentMap !== undefined) {
      if (maps[data.currentMap] === undefined)
         mapInitializers[data.currentMap]();
      currentMap = maps[data.currentMap];
   }
   if (data.overlayMap !== undefined)
      this.setOverlay(data.overlayMap);
};

GeneralRules.prototype.deleteSave = function(slot, temporary) {
   if (temporary)
      delete GeneralRules["save" + slot];
   else
      localStorage.removeItem("save" + slot);
}

GeneralRules.prototype.saveExists = function(slot, temporary) {
   if (temporary)
      return GeneralRules["save" + slot] != null;
   else
      return localStorage.getItem("save" + slot) != null;
};

GeneralRules.prototype.includeMapInSaveUnit = function(mapName) {
   if (GeneralRules.saveUnit == null)
      GeneralRules.saveUnit = {};
   if (GeneralRules.saveUnit.maps == null)
      GeneralRules.saveUnit.maps = {};
   GeneralRules.saveUnit.maps[mapName] = null;
};

GeneralRules.prototype.excludeMapFromSaveUnit = function(mapName) {
   if ((GeneralRules.saveUnit == null) || (GeneralRules.saveUnit.maps == null))
      return;
   if (GeneralRules.saveUnit.maps[mapName] !== undefined)
      delete GeneralRules.saveUnit.maps[mapName];
}

GeneralRules.prototype.includeInSaveUnit = function(include) {
   if (GeneralRules.saveUnit == null)
      GeneralRules.saveUnit = {};

   switch (include) {
      case "AllMaps":
         GeneralRules.saveUnit.allMaps = true;
         break;
      case "AllCounters":
         GeneralRules.saveUnit.counters = {};
         for(key in counters)
            GeneralRules.saveUnit.counters[key] = null;
         break;
      case "WhichMapIsCurrent":
         GeneralRules.saveUnit.currentMap = null;
         break;
      case "WhichMapIsOverlaid":
         GeneralRules.saveUnit.overlayMap = null;
         break;
      case "PlayerOptions":
         // Not implemented
         break;
   }
};

GeneralRules.prototype.includeCounterInSaveUnit = function(counter) {
   if (GeneralRules.saveUnit == null)
      GeneralRules.saveUnit = {};
   if (GeneralTules.saveUnit.counters == null)
      GeneralRules.saveUnit.counters = {};
   GeneralRules.saveUnit.counters[key] = null;
}

GeneralRules.prototype.excludeCounterFromSaveUnit = function(counter) {
   if ((GeneralRules.saveUnit == null) || (GeneralRules.saveUnit.counters == null))
      return;
   for (key in GeneralRules.saveUnit.counters) {
      if (counters[key] === counter)
         delete GeneralRules.saveUnit.counters[key];
   }
};

GeneralRules.prototype.changeCounter = function(counter, operation) {
   switch (operation) {
      case "IncrementAndStop":
         if (counter.value < counter.max)
            counter.value += 1;
         else
            return true;
         return false;
      case "DecrementAndStop":
         if (counter.value > counter.min)
            counter.value -= 1;
         else
            return true;
         return false;
      case "IncrementAndLoop":
         if (counter.value < counter.max)
         {
            counter.value += 1;
            return false;
         }
         counter.value = counter.min;
         return true;
      case "DecrementAndLoop":
         if (counter.value > counter.min) {
            counter.value -= 1;
            return false;
         }
         counter.value = counter.max;
         return true;
      case "SetToMinimum":
         if (counter.value == counter.min)
            return true;
         counter.value = counter.min;
         return false;
      case "SetToMaximum":
         if (counter.value == counter.max)
            return true;
         counter.value = counter.max;
         return false;
   }
   return false;
};

GeneralRules.prototype.setMapFlag = function(flagIndex, value) {
   if (this.layer.map.mapFlags == null)
      this.layer.map.mapFlags = 0;
   if (value)
      this.layer.map.mapFlags |= 1 << flagIndex;
   else
      this.layer.map.mapFlags &= ~(1 << flagIndex);
};

GeneralRules.prototype.isMapFlagOn = function(flagIndex) {
   if (this.layer.map.mapFlags == null)
      this.layer.map.mapFlags = 0;
   return ((this.layer.map.mapFlags & (1 << flagIndex)) != 0);
};

GeneralRules.prototype.setTargetMapFlag = function(mapName, flagIndex, value) {
   if (value)
      maps[mapName].mapFlags |= 1 << flagIndex;
   else
      maps[mapName].mapFlags &= ~(1 << flagIndex);
}

GeneralRules.prototype.clearOverlay = function() {
   overlayMap = null;
};

GeneralRules.prototype.clearAllMessages = function() {
   GeneralRules.activeMessages.length = 0;
};

GeneralRules.prototype.canReturnToPreviousMap = function() {
   return currentMap.cameFromMapName != null;
};

GeneralRules.prototype.returnToPreviousMap = function(unloadCurrent) {
   var source = currentMap.cameFromMapName;
   if (source == null)
      source = getMapName(currentMap);
   if (unloadCurrent)
      for(var key in maps)
         if (maps[key] == currentMap)
            delete maps[key];
   if (maps[source] === undefined)
      mapInitializers[source]();
   currentMap = maps[source];
};

GeneralRules.prototype.switchToMap = function(mapName, unloadCurrent) {
   var oldMapName = null;
   if (currentMap != null) {
      for(key in maps) {
         if (maps[key] === currentMap) {
            if (unloadCurrent)
               delete maps[key];
            oldMapName = key;
         }
      }
   }
   if (maps[mapName] === undefined)
      mapInitializers[mapName]();
   currentMap = maps[mapName];
   currentMap.cameFromMapName = oldMapName;
};

GeneralRules.prototype.isKeyPressed = function(key) {
   return keyboardState.isKeyPressed(key);
};

GeneralRules.prototype.setOverlay = function(mapName) {
   if (maps[mapName] === undefined)
      mapInitializers[mapName]();
   overlayMap = maps[mapName];
};

GeneralRules.prototype.unloadBackgroundMaps = function() {
   for(key in maps) {
      if ((maps[key] !== currentMap) && (maps[key] !== overlayMap))
         delete maps[key];
   }
};

GeneralRules.prototype.unloadMap = function(mapName) {
   delete maps[mapName];
}

GeneralRules.prototype.setMessageFont = function(tileset) {
   GeneralRules.fontTileset = tileset;
};

GeneralRules.colorNameToRgba = function(color, alpha) {
    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    return "rgba(" + parseInt(colors[color].substr(1,2), 16) + "," + parseInt(colors[color].substr(3,2), 16) + "," + parseInt(colors[color].substr(5,2), 16) + "," + alpha/255 + ")";
};

GeneralRules.prototype.setMessageBackground = function(color, alpha) {
   GeneralRules.messageBackground = GeneralRules.colorNameToRgba(color, alpha);
};

GeneralRules.prototype.setMessageDismissal = function(dismissButton, player) {
   GeneralRules.dismissButton = dismissButton;
   GeneralRules.currentPlayer = player - 1;
};

GeneralRules.prototype.showMessage = function(message) {
   if (GeneralRules.activeMessages.length >= GeneralRules.maxMessages)
      throw "Maximum number of displayed messages exceeded";
   else
      GeneralRules.activeMessages.push(this.createMessage(message));
};

function MessageLayer(tileset, map, columns, rows, offsetX, offsetY, background, player, dismissButton) {
   MapLayer.call(this, map, tileset, columns, rows, 0, 0, offsetX, offsetY, 0, 0, 0, null);
   this.background = background;
   this.dismissButton = dismissButton;
   this.player = player;
}

MessageLayer.prototype = new MapLayer();
MessageLayer.prototype.constructor = MessageLayer;

GeneralRules.playerPressButton = function(playerNumber) {
   for (var i = 0; i < GeneralRules.activeMessages.length; i++) {
      var msg = GeneralRules.activeMessages[i];
      if (msg.player == playerNumber - 1) {
         var player = players[playerNumber - 1];
         var dismissPressed = false;
         if ((msg.dismissButton & GeneralRules.buttonSpecifier.first) && player.button1())
            dismissPressed = true;
         if ((msg.dismissButton & GeneralRules.buttonSpecifier.second) && player.button2())
            dismissPressed = true;
         if ((msg.dismissButton & GeneralRules.buttonSpecifier.third) && player.button3())
            dismissPressed = true;
         if ((msg.dismissButton & GeneralRules.buttonSpecifier.fourth) && player.button4())
            dismissPressed = true;

         // dismissPhase[x]:
         // 0 = No frames have passed yet
         // 1 = Frames have passed and the dismiss button was initially pressed
         // 2 = Frames have passed and the dismiss button is not pressed
         // 3 = Dismiss button was not pressed, but now it is.

         if (GeneralRules.dismissPhase == null)
            GeneralRules.dismissPhase = [0,0,0,0];

         if (dismissPressed) {
            if ((GeneralRules.dismissPhase[msg.player] == 0) || (GeneralRules.dismissPhase[msg.player] == 2))
               GeneralRules.dismissPhase[msg.player]++;
         } else {
            if (GeneralRules.dismissPhase[msg.player] < 2)
               GeneralRules.dismissPhase[msg.player] = 2;
            else if (GeneralRules.dismissPhase[msg.player] > 2) {
               GeneralRules.dismissMessage(i);
               GeneralRules.dismissPhase[msg.player] = 0;
            }
         }

         if (msg.dismissButton & GeneralRules.buttonSpecifier.freezeInputs) {
            return false;
         }
      }
   }
   return true;
};

GeneralRules.dismissMessage = function (messageIndex) {
   GeneralRules.activeMessages.splice(messageIndex, 1);
};

GeneralRules.prototype.createMessage = function(message) {
   if (GeneralRules.fontTileset == null) {
      var tilesetKey;
      for (tilesetKey in tilesets)
         break;
      GeneralRules.fontTileset = tilesets[tilesetKey];
   }

   var x = 0, y = 1;
   var maxWidth = 1;
   for (var charIdx = 0; charIdx < message.length; charIdx++) {
      if (message[charIdx] == '\n') {
         x = 0;
         y++;
      } else if (message[charIdx] != '\r') {
         if (++x > maxWidth)
            maxWidth = x;
      }
   }

   var messageSize = {width: maxWidth * GeneralRules.fontTileset.tileWidth, height: y * GeneralRules.fontTileset.tileHeight};
   var messageX = Math.floor((viewWidth - messageSize.width) / 2);
   var messageY = Math.floor((viewHeight - messageSize.height) / 2);

   var result = new MessageLayer(
      GeneralRules.fontTileset, this.layer.map, maxWidth, y, messageX, messageY,
      GeneralRules.messageBackground, GeneralRules.currentPlayer, GeneralRules.dismissButton);

   x = 0;
   y = 0;
   for (var charIdx = 0; charIdx < message.length; charIdx ++) {
      if (message.charAt(charIdx) == '\n') {
         x = 0;
         y++;
      } else if (message.charAt(charIdx) != '\r') {
         result.setTile(x++, y, message.charCodeAt(charIdx));
      }
   }

   return result;
}

GeneralRules.drawMessage = function(msg) {
   var messageRect = {
      x: msg.currentX - GeneralRules.messageMargin,
      y: msg.currentY - GeneralRules.messageMargin,
      width: msg.virtualColumns * msg.tileset.tileWidth + GeneralRules.messageMargin * 2,
      height: msg.virtualRows * msg.tileset.tileHeight + GeneralRules.messageMargin * 2};
   gameViewContext.fillStyle = msg.background;
   gameViewContext.fillRect(messageRect.x, messageRect.y, messageRect.width, messageRect.height);
   gameViewContext.strokeStyle = "#ffffff";
   gameViewContext.lineWidth = 2;
   gameViewContext.strokeRect(messageRect.x, messageRect.y, messageRect.width, messageRect.height);
   msg.draw(gameViewContext);
};

GeneralRules.drawMessages = function() {
   for (var i = 0; i < GeneralRules.activeMessages.length; i++) {
      var msg = GeneralRules.activeMessages[i];
      GeneralRules.drawMessage(msg);
   }
};

GeneralRules.prototype.limitFrameRate = function(fps) {
   if (fps == 0) {
      mainLoop.milliseconds = 0;
      if (mainLoop.interval != null)
         clearInterval(mainLoop.interval);
      mainLoop.interval = null;
      return;
   }

   var milliseconds = Math.ceil(1000 / fps);
   if (milliseconds != mainLoop.milliseconds) {
      if (mainLoop.interval != null)
         clearInterval(mainLoop.interval);
      mainLoop.milliseconds = milliseconds;
      mainLoop.interval = setInterval("pulse()", mainLoop.milliseconds);
   }
};

GeneralRules.prototype.setCategorySpriteState = function(category, spriteIndex, state) {
   category[spriteIndex].state = state;
};

GeneralRules.prototype.quitGame = function() {
   window.close();
};

GeneralRules.prototype.getRandomNumber = function(minimum, maximum) {
   return Math.floor(Math.random() * (maximum - minimum)) + minimum;
};

GeneralRules.prototype.dragMap = function () {
   if (mouseInfo.pressed && !mouseInfo.clicked)
      currentMap.scroll(currentMap.scrollX + mouseInfo.x - mouseInfo.oldX, currentMap.scrollY + mouseInfo.y - mouseInfo.oldY);
};

GeneralRules.prototype.clicked = function() {
   return mouseInfo.clicked;
};

function SpriteState(solidWidth, solidHeight, frameSetName, bounds, frames) {
   this.solidWidth = solidWidth;
   this.solidHeight = solidHeight;
   this.frameSetName = frameSetName;
   this.bounds = bounds;
   this.frames = frames;
   this.totalDuration = frames ? frames[frames.length - 1].accumulatedDuration : 0;
}

function Sprite(layer, x, y, dx, dy, state, frame, active, priority, solidity) {
   this.layer = layer;
   this.x = x;
   this.y = y;
   this.dx = dx;
   this.dy = dy;
   this.state = state;
   this.frame = frame;
   this.isActive = active;
   this.priority = priority;
   this.solidity = solidity;
   this.ridingOn = null;
   this.localDX = null;
   this.inputs = 0;
   this.oldInputs = 0;
}

Sprite.prototype = new GeneralRules();
Sprite.prototype.constructor = Sprite;

Sprite.categorize = function(sprites) {
   var categories = {};
   for(var sprKey in sprites) {
      var spr = sprites[sprKey];
      if (spr.categories == null) continue;
      for(var sprCatKey in spr.categories) {
         var cat = spr.categories[sprCatKey];
         if (categories[cat] == null)
            categories[cat] = [spr];
         else
            categories[cat].push(spr);
      }
   }
   return categories;
}

Sprite.deserialize = function(layer,data) {
   var source = JSON.parse(data);
   return spriteDefinitions[source["~1"]].deserialize(layer, data);
}

Sprite.prototype.getCurFrames = function() {
   var curState = this.states[this.state];
   if (curState.frames == null) return null;
   for(var i = 0; i < curState.frames.length; i++) {
      if((this.frame % curState.totalDuration) < curState.frames[i].accumulatedDuration) return curState.frames[i].subFrames;
   }
   return curState.frames[curState.frames.length - 1].subFrames;
};

Sprite.prototype.getSolidWidth = function() {
   return this.states[this.state].solidWidth;
};

Sprite.prototype.getSolidHeight = function() {
   return this.states[this.state].solidHeight;
};

Sprite.prototype.reactToSolid = function() {
   if (this.solidity == null)
      return;
   var hit = false;
   var dyOrig = this.dy;
   var dxOrig = this.dx;

   var proposedPixelY2 = Math.ceil(this.y + this.dy);
   var pixelX = Math.floor(this.x);
   var pixelY = Math.floor(this.y);
   var solidWidth = this.getSolidWidth();
   var solidHeight = this.getSolidHeight();
   var proposedPixelX = Math.floor(this.x + this.dx);
   var proposedPixelY = Math.floor(this.y + this.dy);
   var solidPixelWidth = solidWidth + Math.ceil(this.x) - pixelX;
   if (this.dy > 0)
   {
      var ground = this.layer.getTopSolidPixel(pixelX, pixelY + solidHeight, solidPixelWidth, proposedPixelY2 - pixelY, this.solidity);
      if (ground != MapLayer.noSolid)
      {
         this.dy = ground - solidHeight - this.y;
         hit = true;
      }
   }
   else if (this.dy < 0)
   {
      var ceiling = this.layer.getBottomSolidPixel(pixelX, proposedPixelY, solidPixelWidth, pixelY - proposedPixelY, this.solidity);
      if (ceiling != MapLayer.noSolid)
      {
         this.dy = ceiling + 1 - this.y;
         hit = true;
      }
   }

   proposedPixelY = Math.floor(this.y + this.dy);

   if (this.dx > 0)
   {
      var proposedPixelX2 = Math.ceil(this.x + this.dx);
      var pixelX2 = Math.ceil(this.x);
      var rightwall = this.layer.getLeftSolidPixel(pixelX2 + solidWidth, proposedPixelY, proposedPixelX2 - pixelX2, solidHeight, this.solidity);
      var hitWall = false;
      if (rightwall != MapLayer.noSolid)
      {
         var maxSlopeProposedY = Math.floor(this.y + this.dy - this.dx);
         var slopedFloor = this.layer.getTopSolidPixel(pixelX2 + solidWidth, maxSlopeProposedY + solidHeight, proposedPixelX2 - pixelX2, proposedPixelY - maxSlopeProposedY, this.solidity);
         if (slopedFloor != MapLayer.noSolid)
         {
            var ceiling = this.layer.getBottomSolidPixel(pixelX2, slopedFloor - solidHeight, solidWidth, proposedPixelY + solidHeight - slopedFloor, this.solidity);
            if ((ceiling == MapLayer.noSolid) && (this.ridingOn == null))
            {
               var rightwall2 = this.layer.getLeftSolidPixel(pixelX2 + solidWidth, slopedFloor - solidHeight, proposedPixelX2 - pixelX2, solidHeight, this.solidity);
               if (rightwall2 == MapLayer.noSolid)
                  this.dy = dyOrig = slopedFloor - solidHeight - 1 - this.y;
               else
                  hitWall = true;
            }
            else
               hitWall = true;
         }
         else
         {
            maxSlopeProposedY = Math.floor(this.y + this.dy + this.dx);
            var slopedCeiling = this.layer.getBottomSolidPixel(pixelX2 + solidWidth, proposedPixelY, proposedPixelX2 - pixelX2, maxSlopeProposedY - proposedPixelY, this.solidity);
            if (slopedCeiling != MapLayer.noSolid)
            {
               slopedCeiling++;
               var floor = this.layer.getTopSolidPixel(pixelX2, proposedPixelY + solidHeight, solidWidth, slopedCeiling - proposedPixelY, this.solidity);
               if ((floor == MapLayer.noSolid) && (this.ridingOn == null))
               {
                  var rightwall2 = this.layer.getLeftSolidPixel(pixelX2 + solidWidth, slopedCeiling, proposedPixelX2 - pixelX2, solidHeight, this.solidity);
                  if (rightwall2 == MapLayer.noSolid)
                     this.dy = dyOrig = slopedCeiling - this.y;
                  else
                     hitWall = true;
               }
               else
                  hitWall = true;
            }
            else
               hitWall = true;
         }
         if (hitWall)
         {
            this.dx = rightwall - solidWidth - this.x;
         }
         hit = true;
      }
   }
   else if (this.dx < 0)
   {
      var leftwall = this.layer.getRightSolidPixel(proposedPixelX, proposedPixelY, pixelX - proposedPixelX, solidHeight, this.solidity);
      var hitWall = false;
      if (leftwall != MapLayer.noSolid)
      {
         var maxSlopeProposedY = Math.floor(this.y + this.dy + this.dx);
         var slopedFloor = this.layer.getTopSolidPixel(proposedPixelX, maxSlopeProposedY + solidHeight, pixelX - proposedPixelX, proposedPixelY - maxSlopeProposedY, this.solidity);
         if (slopedFloor != MapLayer.noSolid)
         {
            var ceiling = this.layer.getBottomSolidPixel(pixelX, slopedFloor - solidHeight, solidWidth, proposedPixelY + solidHeight - slopedFloor, this.solidity);
            if ((ceiling == MapLayer.noSolid) && (this.ridingOn == null))
            {
               var leftwall2 = this.layer.getRightSolidPixel(proposedPixelX, slopedFloor - solidHeight, pixelX - proposedPixelX, solidHeight, this.solidity);
               if (leftwall2 == MapLayer.noSolid)
                  this.dy = dyOrig = slopedFloor - solidHeight - 1 - this.y;
               else
                  hitWall = true;
            }
            else
               hitWall = true;
         }
         else
         {
            maxSlopeProposedY = Math.floor(this.y + this.dy - this.dx);
            var slopedCeiling = this.layer.getBottomSolidPixel(proposedPixelX, proposedPixelY, pixelX - proposedPixelX, maxSlopeProposedY - proposedPixelY, this.solidity);
            if (slopedCeiling != MapLayer.noSolid)
            {
               slopedCeiling++;
               var floor = this.layer.getTopSolidPixel(pixelX, proposedPixelY + solidHeight, solidWidth, slopedCeiling - proposedPixelY, this.solidity);
               if ((floor == MapLayer.noSolid) && (this.ridingOn == null))
               {
                  var leftwall2 = this.layer.getRightSolidPixel(proposedPixelX, slopedCeiling, pixelX - proposedPixelX, solidHeight, this.solidity);
                  if (leftwall2 == MapLayer.noSolid)
                     this.dy = dyOrig = slopedCeiling - this.y;
                  else
                     hitWall = true;
               }
               else
                  hitWall = true;
            }
            else
               hitWall = true;
         }
         if (hitWall)
         {
            // Do integer arithmetic before double otherwise strange rounding seems to happen
            this.dx = leftwall + 1 - this.x;
         }
         hit = true;
      }
   }

   this.dy = dyOrig;
   proposedPixelX = Math.floor(this.x + this.dx);
   proposedPixelY = Math.floor(this.y + this.dy);
   var proposedSolidPixelWidth = solidWidth + Math.ceil(this.x + this.dx) - proposedPixelX;
   if (this.dy > 0)
   {
      proposedPixelY2 = Math.ceil(this.y + this.dy);
      var ground = this.layer.getTopSolidPixel(proposedPixelX, pixelY + solidHeight, proposedSolidPixelWidth, proposedPixelY2 - pixelY, this.solidity);
      if (ground != MapLayer.noSolid)
      {
         this.dy = ground - solidHeight - this.y;
         hit = true;
      }
   }
   else if (this.dy < 0)
   {
      var ceiling = this.layer.getBottomSolidPixel(proposedPixelX, proposedPixelY, proposedSolidPixelWidth, pixelY - proposedPixelY, this.solidity);
      if (ceiling != MapLayer.noSolid)
      {
         this.dy = ceiling + 1 - this.y;
         hit = true;
      }
   }

   if (hit && (this.localDX != null))
      this.localDX += this.dx - dxOrig;

   return hit;
};

Sprite.inputBits = { up:1, right:2, down:4, left:8, button1:16, button2:32, button3:64, button4:128 };
Sprite.prototype.mapPlayerToInputs = function(playerNum) {
   var p = players[playerNum - 1];
   this.oldInputs = this.inputs;
   this.inputs = 0;
   if (GeneralRules.playerPressButton(playerNum)) {
      if (p.up()) this.inputs |= Sprite.inputBits.up;
      if (p.left()) this.inputs |= Sprite.inputBits.left;
      if (p.right()) this.inputs |= Sprite.inputBits.right;
      if (p.down()) this.inputs |= Sprite.inputBits.down;
      if (p.button1()) this.inputs |= Sprite.inputBits.button1;
      if (p.button2()) this.inputs |= Sprite.inputBits.button2;
      if (p.button3()) this.inputs |= Sprite.inputBits.button3;
      if (p.button4()) this.inputs |= Sprite.inputBits.button4;
   }
};

Sprite.prototype.accelerateByInputs = function(acceleration, max, horizontalOnly) {
   if (!horizontalOnly) {
      if (0 != (this.inputs & Sprite.inputBits.up))
         this.dy -= acceleration / 10;
      if (this.dy < -max)
         this.dy = -max;
      if (0 != (this.inputs & Sprite.inputBits.down))
         this.dy += acceleration / 10;
      if (this.dy > max)
         this.dy = max;
   }
   if (this.localDX == null) {
      if (0 != (this.inputs & Sprite.inputBits.left))
         this.dx -= acceleration / 10;
      if (this.dx < -max)
         this.dx = -max;
      if (0 != (this.inputs & Sprite.inputBits.right))
         this.dx += acceleration / 10;
      if (this.dx > max)
         this.dx = max;
   } else {
      if (0 != (this.inputs & Sprite.inputBits.left))
         this.localDX -= acceleration / 10;
      if (this.localDX < -max)
         this.localDX = -max;
      if (0 != (this.inputs & Sprite.inputBits.right))
         this.localDX += acceleration / 10;
      if (this.localDX > max)
         this.localDX = max;
   }
};

Sprite.prototype.isInState = function(firstState, lastState) {
   return (this.state >= firstState) && (this.state <= lastState);
};

Sprite.prototype.moveByVelocity = function() {
   this.oldX = this.x;
   this.oldY = this.y;
   this.x += this.dx;
   this.y += this.dy;
};

Sprite.prototype.scrollSpriteIntoView = function(useScrollMargins) {
   this.layer.scrollSpriteIntoView(this, useScrollMargins);
};

Sprite.prototype.limitVelocity = function(maximum) {
   var useDX;
   if (this.localDX == null)
      useDX = this.dx;
   else
      useDX = this.localDX;
   var dist = useDX * useDX + this.dy * this.dy;
   if (dist > maximum * maximum) {
      dist = Math.sqrt(dist);
      useDX = useDX * maximum / dist;
      this.dy = this.dy * maximum / dist;
      if (this.localDX == null)
         this.dx = useDX;
      else
         this.localDX = useDX;
   }
}

Sprite.prototype.isOnTile = function(category, relativePosition) {
   var rp = this.getRelativePosition(relativePosition);
   var tile = this.layer.getTile(Math.floor(rp.x / this.layer.tileset.tileWidth), Math.floor(rp.y / this.layer.tileset.tileHeight));
   return category.isTileMember(this.layer.tileset, tile);
}

Sprite.prototype.getRelativePosition = function(relativePosition) {
   var rp = {x:Math.floor(this.x),y:Math.floor(this.y)};

   switch (relativePosition) {
      case "TopCenter":
         rp.x = Math.floor(this.x + this.getSolidWidth() / 2);
         break;
      case "TopRight":
         rp.x = Math.floor(this.x) + this.getSolidWidth() - 1;
         break;
      case "LeftMiddle":
         rp.y = Math.floor(this.y + this.getSolidHeight() / 2);
         break;
      case "CenterMiddle":
         rp.x = Math.floor(this.x + this.getSolidWidth() / 2);
         rp.y = Math.floor(this.y + this.getSolidHeight() / 2);
         break;
      case "RightMiddle":
         rp.x = Math.floor(this.x) + this.getSolidWidth() - 1;
         rp.y = Math.floor(this.y + this.getSolidHeight() / 2);
         break;
      case "BottomLeft":
         rp.y = Math.floor(this.y + this.getSolidHeight() - 1);
         break;
      case "BottomCenter":
         rp.x = Math.floor(this.x + this.getSolidWidth() / 2);
         rp.y = Math.floor(this.y + this.getSolidHeight() - 1);
         break;
      case "BottomRight":
         rp.x = Math.floor(this.x) + this.getSolidWidth() - 1;
         rp.y = Math.floor(this.y + this.getSolidHeight() - 1);
         break;
   }
   return rp;
}

Sprite.prototype.blocked = function(direction) {
   var solidPixelWidth;
   var solidPixelHeight;
   switch (direction)
   {
      case "Up":
         solidPixelWidth = this.getSolidWidth() + Math.ceil(this.x) - Math.floor(this.x);
         return this.layer.getBottomSolidPixel(Math.floor(this.x), Math.floor(this.y) - 1, solidPixelWidth, 1, this.solidity) != MapLayer.noSolid;
      case "Right":
         solidPixelHeight = this.getSolidHeight() + Math.ceil(this.y) - Math.floor(this.y);
         return this.layer.getLeftSolidPixel(Math.floor(this.x) + this.getSolidWidth(), Math.floor(this.y), 1, solidPixelHeight, this.solidity) != MapLayer.noSolid;
      case "Down":
         solidPixelWidth = this.getSolidWidth() + Math.ceil(this.x) - Math.floor(this.x);
         return this.layer.getTopSolidPixel(Math.floor(this.x), Math.floor(this.y) + this.getSolidHeight(), solidPixelWidth, 1, this.solidity) != MapLayer.noSolid;
      case "Left":
         solidPixelHeight = this.getSolidHeight() + Math.ceil(this.y) - Math.floor(this.y);
         return this.layer.getRightSolidPixel(Math.floor(this.x) - 1, Math.floor(this.y), 1, solidPixelHeight, this.solidity) != MapLayer.noSolid;
   }
   return false;
}

Sprite.prototype.isMoving = function(direction) {
   var useDX;
   if (this.localDX == null)
      useDX = this.dx;
   else
      useDX = this.localDX;

   switch (direction) {
      case "Left":
         return useDX < 0;
      case "Right":
         return useDX > 0;
      case "Up":
         return this.dy < 0;
      case "Down":
         return this.dy > 0;
   }
   return false;
}

Sprite.prototype.isInputPressed = function(input, initialOnly) {
   return (this.inputs & input) &&
      (!initialOnly || (0 == (this.oldInputs & input)));
}

Sprite.prototype.alterXVelocity = function(delta) {
   this.dx += delta;
}

Sprite.prototype.alterYVelocity = function(delta) {
   this.dy += delta;
}

Sprite.prototype.reactToInertia = function(retainPercentVertical, retainPercentHorizontal) {
   if (this.localDX == null) {
      if (Math.abs(this.dx) < .01)
         this.dx = 0;
      else
         this.dx *= retainPercentHorizontal / 100.0;
   } else {
      if (Math.abs(this.localDX) < .01)
         this.localDX = 0;
      else
         this.localDX *= retainPercentHorizontal / 100.0;
   }
   if (Math.abs(this.dy) < .01)
      this.dy = 0;
   else
      this.dy *= retainPercentVertical / 100.0;
}

Sprite.prototype.animate = function(correlation) {
   switch (correlation)
   {
      case "ByFrame":
         this.frame++;
         break;
      case "ByHorizontalVelocity":
         if (this.localDX == null)
            this.frame += Math.abs(Math.floor(this.x + this.dx) - Math.floor(this.x));
         else
            this.frame += Math.abs(Math.floor(this.localDX));
         break;
      case "ByVerticalVelocity":
         this.frame += Math.abs(Math.floor(this.y + this.dy) - Math.floor(this.y));
         break;
      case "ByVectorVelocity":
         var tmpDx = Math.abs(Math.floor(this.x + this.dx) - Math.floor(this.x));
         var tmpDy = Math.abs(Math.floor(this.y + this.dy) - Math.floor(this.y));
         this.frame += Math.floor(Math.sqrt(tmpDx * tmpDx + tmpDy * tmpDy));
         break;
   }
}

Sprite.prototype.isRidingPlatform = function() {
   return this.ridingOn != null;
}

Sprite.prototype.processRules = function() {
   if ((!this.processed) && (this.isActive)) {
      this.processed = true;
      if (this.executeRules != null) this.executeRules();
   }
}

Sprite.prototype.reactToPlatform = function() {
   if (this.ridingOn == null)
      return;

   if (!this.ridingOn.processed)
      this.ridingOn.processRules();

   if ((this.ridingOn.isActive == false) || (this.x + this.getSolidWidth() < this.ridingOn.oldX) || (this.x > this.ridingOn.oldX + this.ridingOn.getSolidWidth()) ||
      (this.y + this.getSolidHeight() < this.ridingOn.oldY - 1) || (this.y + this.getSolidHeight() >= this.ridingOn.oldY + this.ridingOn.getSolidHeight()))
   {
      this.stopRiding();
      return;
   }

   if (this.localDX != null)
      this.dx = this.localDX + this.ridingOn.dx;
   this.dy = this.ridingOn.y - this.getSolidHeight() - this.y;
}

Sprite.prototype.landDownOnPlatform = function(platformList) {
   if (this.ridingOn != null)
      return false;
   for(var sprKey in platformList) {
      var spr = platformList[sprKey];
      if (!spr.isActive)
         continue;
      if ((this.oldY + this.getSolidHeight() <= spr.oldY) &&
         (this.y + this.getSolidHeight() > spr.y) &&
         (this.x + this.getSolidWidth() > spr.x) &&
         (this.x < spr.x + spr.getSolidWidth()))
      {
         this.ridingOn = spr;
         spr.processRules();
         this.localDX = this.dx - spr.dx;
         this.dy = spr.y - this.getSolidHeight() - this.y;
         return true;
      }
   }
   return false;
}

Sprite.prototype.snapToGround = function(threshhold) {
   var proposedPixelX = Math.floor(this.x + this.dx);
   var proposedPixelY = Math.floor(this.y + this.dy);
   var proposedSolidPixelWidth = this.getSolidWidth() + Math.ceil(this.x + this.dx) - proposedPixelX;
   var ground = this.layer.getTopSolidPixel(proposedPixelX, proposedPixelY + this.getSolidHeight(), proposedSolidPixelWidth, threshhold, this.solidity);
   if (ground != MapLayer.noSolid) {
      newDy = ground - this.getSolidHeight() - this.y;
      if (newDy > this.dy)
         this.dy = newDy;
      return true;
   }
   return false;
}

Sprite.prototype.stopRiding = function() {
   this.localDX = null;
   this.ridingOn = null;
}

Sprite.prototype.switchToState = function(state, alignment) {
   var oldRect = {x:Math.floor(this.x), y:Math.floor(this.y), width:this.getSolidWidth(), height:this.getSolidHeight()};
   oldRect.bottom = oldRect.y + oldRect.height;
   oldRect.right = oldRect.x + oldRect.width;
   var newWidth = this.states[state].solidWidth;
   var newHeight = this.states[state].solidHeight;
   var newX, newY;
   switch (alignment) {
      case "TopCenter":
      case "CenterMiddle":
      case "BottomCenter":
         newX = this.x + (oldRect.width - newWidth) / 2;
         break;
      case "TopRight":
      case "RightMiddle":
      case "BottomRight":
         newX = this.x + oldRect.width - newWidth;
         break;
      default:
         newX = this.x;
         break;
   }
   switch (alignment) {
      case "LeftMiddle":
      case "CenterMiddle":
      case "RightMiddle":
         newY = this.y + (oldRect.height - newHeight) / 2;
         break;
      case "BottomLeft":
      case "BottomCenter":
      case "BottomRight":
         newY = this.y + oldRect.height - newHeight;
         break;
      default:
         newY = this.y;
         break;
   }

   if ((Math.ceil(newY + newHeight) > oldRect.bottom) && (this.layer.getTopSolidPixel(
      Math.floor(newX), oldRect.bottom, newWidth, Math.ceil(newY) + newHeight - oldRect.bottom, this.solidity) != MapLayer.noSolid))
      return false;

   if ((Math.floor(newY) < oldRect.y) && (this.layer.getBottomSolidPixel(
      Math.floor(newX), Math.floor(newY), newWidth, oldRect.y - Math.floor(newY), this.solidity) != MapLayer.noSolid))
      return false;

   if ((Math.floor(newX) < oldRect.x) && (this.layer.getRightSolidPixel(
      Math.floor(newX), Math.floor(newY), oldRect.x - Math.floor(newX), newHeight, this.solidity) != MapLayer.noSolid))
      return false;

   if ((Math.ceil(newX + newWidth) > oldRect.right) && (this.layer.getLeftSolidPixel(
      oldRect.right, Math.floor(newY), Math.ceil(newX) + newWidth - oldRect.right, newHeight, this.solidity) != MapLayer.noSolid))
      return false;

   this.x = newX;
   this.y = newY;
   this.state = state;
   return true;
}

Sprite.prototype.deactivate = function() {
   this.isActive = false;
}

Sprite.prototype.touchTiles = function(category) {
   if (this.touchedTiles != null)
      this.touchedTiles.length = 0;

   var tw = this.layer.tileset.tileWidth;
   var th = this.layer.tileset.tileHeight;
   var minYEdge = Math.floor(Math.floor(this.y) / th);
   var maxY = Math.floor((Math.floor(this.y) + this.getSolidHeight()) / th);
   if (maxY >= this.layer.virtualRows)
      maxY = this.layer.virtualRows - 1;
   var maxYEdge = Math.floor((Math.floor(this.y) + this.getSolidHeight() - 1) / th);
   var minX = Math.floor(Math.floor(this.x - 1) / tw);
   var minXEdge = Math.floor(Math.floor(this.x) / tw);
   var maxX = Math.floor((Math.floor(this.x) + this.getSolidWidth()) / tw);
   if (maxX >= this.layer.virtualColumns)
      maxX = this.layer.virtualColumns - 1;
   var maxXEdge = Math.floor((Math.floor(this.x) + this.getSolidWidth() - 1) / tw);
   for (var yidx = Math.floor((Math.floor(this.y) - 1) / th); yidx <= maxY; yidx++) {
      var isYEdge = !((yidx >= minYEdge) && (yidx <= maxYEdge));
      for (var xidx = (isYEdge ? minXEdge : minX);
         xidx <= (isYEdge ? maxXEdge : maxX);
         xidx++)
      {
         if (category.isTileMember(this.layer.tileset, this.layer.getTile(xidx, yidx))) {
            var wasTouching;
            var oldPixelX = Math.floor(this.oldX);
            var oldPixelY = Math.floor(this.oldY);

            if ((oldPixelX <= xidx * tw + tw) &&
               (oldPixelX + this.getSolidWidth() >= xidx * tw) &&
               (oldPixelY <= yidx * th + th) &&
               (oldPixelY + this.getSolidHeight() >= yidx * th))
            {
               var edgeX = (oldPixelX + this.getSolidWidth() == xidx * tw) ||
                  (oldPixelX == xidx * tw + tw);
               var edgeY = (oldPixelY + this.getSolidHeight() == yidx * th) ||
                  (oldPixelY == yidx * th + th);
               if (edgeX && edgeY)
                  wasTouching = false;
               else
                  wasTouching = true;
            }
            else
               wasTouching = false;
            
            if (this.touchedTiles == null)
               this.touchedTiles = [];
            this.touchedTiles.push({x:xidx, y:yidx, tileValue:this.layer.getTile(xidx, yidx), initial:!wasTouching, processed:false});
         }
      }
   }
   if (this.touchedTiles == null)
      return false;
   return this.touchedTiles.length > 0;
};

Sprite.prototype.tileTake = function(tileValue, counter, newValue) {
   if (this.touchedTiles == null)
      return 0;

   var result = 0;

   for (var i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if ((tt.tileValue == tileValue) && (!tt.processed)) {
         if (counter.value < counter.max) {
            counter.value++;
            this.layer.setTile(tt.x, tt.y, tt.tileValue = newValue);
            tt.processed = true;
            result++;
         }
         else
            break;
      }
   }
   return result;
};

Sprite.prototype.tileAddSprite = function (touchingIndex, spriteDefinition) {
   var tt = this.touchedTiles[touchingIndex];
   var spriteParams = "{\"~1\":\"" + spriteDefinition + "\", \"x\":" +
   tt.x * this.layer.tileset.tileWidth + ",\"y\":" + tt.y * this.layer.tileset.tileHeight +
   ",\"dx\":0,\"dy\":0,\"state\":0,\"frame\":0,\"active\":true,\"priority\":0,\"solidityName\":\"" +
   solidity.getSolidityName(this.solidity) + "\"}";
   GeneralRules.lastCreatedSprite = Sprite.deserialize(this.layer, spriteParams);
   GeneralRules.lastCreatedSprite.isDynamic = true;
   GeneralRules.lastCreatedSprite.clearParameters();

   this.layer.sprites.push(GeneralRules.lastCreatedSprite);
   for(var categoryKey in spriteDefinitions[spriteDefinition].prototype.categories) {
      var category = spriteDefinitions[spriteDefinition].prototype.categories[categoryKey];
      if (this.layer.spriteCategories[category] == null)
         this.layer.spriteCategories[category] = [];
      this.layer.spriteCategories[category].push(GeneralRules.lastCreatedSprite);
   }
};

Sprite.prototype.tileActivateSprite = function(touchingIndex, category, clearParameters) {
   for (var i = 0; i < category.length; i++) {
      if (!category[i].isActive) {
         category[i].isActive = true;
         var tt = this.touchedTiles[touchingIndex];
         category[i].x = tt.x * this.layer.tileset.tileWidth;
         category[i].y = tt.y * this.layer.tileset.tileHeight;
         if (clearParameters) {
            category[i].frame = 0;
            category[i].state = 0;
            category[i].clearParameters();
         }
         category[i].processRules();
         return i;
      }
   }
   return -1;
};

Sprite.prototype.clearParameters = function() {
   if (this.constructor.userParams == null) return;
   for(i in this.constructor.userParams) {
      this[this.constructor.userParams[i]] = 0;
   }
};

Sprite.prototype.setSolidity = function(solidity) {
   this.solidity = solidity;
};

Sprite.prototype.testCollisionRect = function(targets) {
   if (!this.isActive)
      return -1;
   if (targets == null)
      return -1;
   for(var idx = 0; idx < targets.length; idx++) {
      var targetSprite = targets[idx];
      if ((targetSprite == this) || (!targetSprite.isActive))
         continue;
      var x1 = Math.floor(this.x);
      var w1 = this.getSolidWidth();
      var x2 = Math.floor(targetSprite.x);
      var w2 = targetSprite.getSolidWidth();
      var y1 = Math.floor(this.y);
      var h1 = this.getSolidHeight();
      var y2 = Math.floor(targetSprite.y);
      var h2 = targetSprite.getSolidHeight();

      if ((x1 + w1 > x2) && (x2 + w2 > x1) && (y1 + h1 > y2) && (y2 + h2 > y1))
         return idx;
   }
   return -1;
};

Sprite.prototype.getNearestSpriteIndex = function(target) {
   var minDist = 999999999;
   var result = -1;
   if (target == null) return -1;
   for (var i = 0; i < target.length; i++) {
      if ((!target[i].isActive) || (target[i] == this))
         continue;
      var xOff = target[i].x - this.x;
      var yOff = target[i].y - this.y;
      var dist = xOff * xOff + yOff * yOff;
      if (dist < minDist) {
         minDist = dist;
         result = i;
      }
   }
   return result;
};

Sprite.prototype.pushTowardCategory = function(target, index, force) {
   if (index < 0)
      index = this.getNearestSpriteIndex(target);
   if (index < 0)
      return false;

   return this.pushTowardSprite(target[index], force);
};

Sprite.prototype.pushTowardSprite = function (target, force) {
   var vx = target.x - this.x + (target.getSolidWidth() - this.getSolidWidth()) / 2;
   var vy = target.y - this.y + (target.getSolidHeight() - this.getSolidHeight()) / 2;
   var dist = Math.sqrt(vx * vx + vy * vy);
   if (dist >= 1) {
      this.dx += vx * force / dist / 10.0;
      this.dy += vy * force / dist / 10.0;
      return true;
   }
   return false;
};

Sprite.prototype.setInputState = function(input, press) {
   if (press)
      this.inputs |= input;
   else
      this.inputs &= ~input;
};

Sprite.prototype.clearInputs = function(setOldInputs) {
   if (setOldInputs)
      this.oldInputs = this.inputs;
   this.inputs = 0;
};

Sprite.prototype.tileUseUp = function(tileValue, counter, newValue) {
   if (this.touchedTiles == null)
      return 0;

   var result = 0;

   for (var i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if ((tt.tileValue == tileValue) && (!tt.processed)) {
         if (counter.value > 0) {
            counter.value--;
            this.layer.setTile(tt.x, tt.y, tt.tileValue = newValue);
            tt.processed = true;
            result++;
         }
         else
            break;
      }
   }
   return result;
};

Sprite.prototype.addSpriteHere = function(spriteDefinition, location, hotSpot) {
   var spriteParams = "{\"~1\":\"" + spriteDefinition + "\", \"x\":0,\"y\":0" +
   ",\"dx\":0,\"dy\":0,\"state\":0,\"frame\":0,\"active\":true,\"priority\":0,\"solidityName\":\"" +
   solidity.getSolidityName(this.solidity) + "\"}";
   GeneralRules.lastCreatedSprite = Sprite.deserialize(this.layer, spriteParams);

   ptLocation = this.getRelativePosition(location);
   ptHotSpot = GeneralRules.lastCreatedSprite.getRelativePosition(hotSpot);
   GeneralRules.lastCreatedSprite.x = GeneralRules.lastCreatedSprite.oldX = ptLocation.x - ptHotSpot.x;
   GeneralRules.lastCreatedSprite.y = GeneralRules.lastCreatedSprite.oldY = ptLocation.y - ptHotSpot.y;

   GeneralRules.lastCreatedSprite.isDynamic = true;
   GeneralRules.lastCreatedSprite.clearParameters();

   this.layer.sprites.push(GeneralRules.lastCreatedSprite);
   for(var categoryKey in spriteDefinitions[spriteDefinition].prototype.categories) {
      var category = spriteDefinitions[spriteDefinition].prototype.categories[categoryKey];
      if (this.layer.spriteCategories[category] == null)
         this.layer.spriteCategories[category] = [];
      this.layer.spriteCategories[category].push(GeneralRules.lastCreatedSprite);
   }
};

Sprite.prototype.tileChange = function(oldTileValue, newTileValue, initialOnly) {
   if (this.touchedTiles == null)
      return 0;

   var result = 0;

   for (var i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if ((tt.tileValue == oldTileValue) && (!tt.processed) && (!initialOnly || tt.initial)) {
         tt.processed = true;
         this.layer.setTile(tt.x, tt.y, tt.tileValue = newTileValue);
         result++;
      }
   }
   return result;
};

Sprite.prototype.tileChangeTouched = function(touchingIndex, newTileValue) {
   if ((this.touchedTiles == null) || (this.touchedTiles.length <= touchingIndex))
      return;

   var tt = this.touchedTiles[touchingIndex];
   tt.tileValue =  newTileValue;
   this.layer.setTile(tt.x, tt.y, tt.tileValue);
};

Sprite.prototype.tileTouchingIndex = function(tileValue, initialOnly, markAsProcessed) {
   if (this.touchedTiles == null)
      return -1;

   for (var i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if ((tt.tileValue == tileValue) && (!tt.processed) && (!initialOnly || tt.initial)) {
         tt.processed = markAsProcessed;
         return i;
      }
   }

   return -1;
};

Sprite.prototype.mapMouseToSprite = function(instantMove, hotSpot) {
   var pos = {x:mouseInfo.x - this.layer.currentX, y:mouseInfo.y - this.layer.currentY};
   var rp = this.getRelativePosition(hotSpot);
   if (instantMove) {
      this.oldX = this.x;
      this.oldY = this.y;
      this.x = pos.x + this.x - rp.x;
      this.y = pos.y + this.y - rp.y;
   } else {
      this.dx = pos.x - rp.x;
      this.dy = pos.y - rp.y;
   }
   this.oldinputs = this.inputs;
   this.inputs = 0;
   if (mouseInfo.pressed)
      this.inputs |= Sprite.inputBits.button1;
};

Sprite.prototype.setInputsTowardSprite = function(target) {
   var targetCenter = target.x + target.getSolidWidth() / 2;
   var myCenter = this.x + this.getSolidWidth() / 2;

   if (targetCenter < myCenter)
      this.inputs |= Sprite.inputBits.left;
   else if (targetCenter > myCenter)
      this.inputs |= Sprite.inputBits.right;
   else
      this.inputs &= ~(Sprite.inputBits.left | Sprite.inputBits.right);

   targetCenter = target.y + target.getSolidHeight() / 2;
   myCenter = this.y + this.getSolidHeight() / 2;
   if (targetCenter < myCenter)
      this.inputs |= Sprite.inputBits.up;
   else if (targetCenter > myCenter)
      this.inputs |= Sprite.inputBits.down;
   else
      this.inputs &= ~(Sprite.inputBits.up | Sprite.inputBits.down);
};

Sprite.prototype.setInputsTowardCategory = function(target, index) {
   if (index < 0)
      index = this.getNearestSpriteIndex(target);
   if (index < 0)
   {
      this.inputs &= ~(Sprite.inputBits.left | Sprite.inputBits.right | Sprite.inputBits.up | Sprite.inputBits.down);
      return;
   }

   this.setInputsTowardSprite(target[index]);
};

var spriteDefinitions = new Object();
function TileShape()
{
}

TileShape.maxValue = 32767;
TileShape.minValue = -32768;

TileShape.empty = new TileShape();
TileShape.empty.getTopSolidPixel = function(width, height, min, max) { return TileShape.maxValue; };
TileShape.empty.getLeftSolidPixel = function(width, height, min, max) { return TileShape.maxValue; };
TileShape.empty.getRightSolidPixel = function(width, height, min, max) { return TileShape.minValue; };
TileShape.empty.getBottomSolidPixel = function(width, height, min, max) { return TileShape.minValue; };

TileShape.solid = new TileShape();
TileShape.prototype.getTopSolidPixel = function(width, height, min, max) { return 0; };
TileShape.prototype.getLeftSolidPixel = function(width, height, min, max) { return 0; };
TileShape.prototype.getRightSolidPixel = function(width, height, min, max) { return width - 1; };
TileShape.prototype.getBottomSolidPixel = function(width, height, min, max) { return height - 1; };

TileShape.uphill = new TileShape();
TileShape.uphill.getTopSolidPixel = function(width, height, min, max) { return Math.floor(height * (width-max-1) / width); };
TileShape.uphill.getLeftSolidPixel = function(width, height, min, max) { return Math.floor(width * (height-max-1) / height); };

TileShape.downhill = new TileShape();
TileShape.downhill.getTopSolidPixel = function(width, height, min, max) { return Math.floor(min * height / width); };
TileShape.downhill.getRightSolidPixel = function(width, height, min, max) { return Math.floor(width - (height - max - 1) * width / height - 1); };

TileShape.upCeiling = new TileShape();
TileShape.upCeiling.getRightSolidPixel = function(width, height, min, max) { return Math.floor(((height - min) * width - 1) / height); };
TileShape.upCeiling.getBottomSolidPixel = function(width, height, min, max) { return Math.floor(((width - min) * height - 1) / width); };

TileShape.downCeiling = new TileShape();
TileShape.downCeiling.getLeftSolidPixel = function(width, height, min, max) { return Math.floor(min * width / height); };
TileShape.downCeiling.getBottomSolidPixel = function(width, height, min, max) { return Math.floor(height - (width - max - 1) * height / width - 1); };

TileShape.uphillRight = new TileShape();
TileShape.uphillRight.getTopSolidPixel = function(width, height, min, max) { return Math.floor(height * (width - max - 1) / width / 2); };
TileShape.uphillRight.getLeftSolidPixel = function(width, height, min, max) { return Math.floor((max * 2 >= height - 2) ? 0 : width * (height - max * 2 - 2) / height); };

TileShape.uphillLeft = new TileShape();
TileShape.uphillLeft.getTopSolidPixel = function(width, height, min, max) { return Math.floor(height * (width - max - 1) / width / 2 + height / 2); };
TileShape.uphillLeft.getLeftSolidPixel = function(width, height, min, max) { return Math.floor(((max + 1) * 2 <= height)?TileShape.maxValue:width * (height - max - 1) * 2 / height); };
TileShape.uphillLeft.getRightSolidPixel = function(width, height, min, max) { return Math.floor(((max + 1) * 2 <= height)?TileShape.minValue:width - 1); };

TileShape.downhillLeft = new TileShape();
TileShape.downhillLeft.getTopSolidPixel = function(width, height, min, max) { return Math.floor(min * height / width / 2); };
TileShape.downhillLeft.getRightSolidPixel = function(width, height, min, max) { return Math.floor(((max + 1) * 2 > height) ? width - 1 : width * 2 - (height - max - 1) * width * 2 / height - 1); };

TileShape.downhillRight = new TileShape();
TileShape.downhillRight.getTopSolidPixel = function(width, height, min, max) { return Math.floor((height + min * height / width) / 2); };
TileShape.downhillRight.getLeftSolidPixel = function(width, height, min, max) { return Math.floor(((min + 1) * 2 <= height) ? TileShape.maxValue : 0); };
TileShape.downhillRight.getRightSolidPixel = function(width, height, min, max) { return Math.floor(((max + 1) * 2 <= height) ? TileShape.minValue : width - (height - max - 1) * 2 * width / height - 1); };

TileShape.topSolid = new TileShape();
TileShape.topSolid.getLeftSolidPixel = TileShape.empty.getLeftSolidPixel;
TileShape.topSolid.getRightSolidPixel = TileShape.empty.getRightSolidPixel;
TileShape.topSolid.getBottomSolidPixel = TileShape.empty.getBottomSolidPixel;

function TileCategory(tilesetMembership) {
   this.membership = new Object();
   for(var tsIndex = 0; tsIndex < tilesetMembership.length; tsIndex++) {
      var tsMemberLookup = new Array();
      var tsMemberList = tilesetMembership[tsIndex].membership;
      this.membership[tilesetMembership[tsIndex].tileset.name] = tsMemberLookup;
      for(var tileIndex = 0; tileIndex < tsMemberList.length; tileIndex++) {
         if (typeof tsMemberList[tileIndex] == 'number')
            tsMemberLookup[tsMemberList[tileIndex]] = true;
         else
            tsMemberLookup[tsMemberList[tileIndex].tileIndex] = tsMemberList[tileIndex].frames;
      }
   }
}

TileCategory.prototype.isTileMember = function(tileset, tileIndex) {
   var membership = this.membership[tileset.name];
   if (membership == null)
      return false;
   var member = membership[tileIndex];
   if (member == true) return true;
   if (member == null) return false;
   return member.indexOf(tileset.tiles[tileIndex].getCurFrameIndex()) > -1;
};

function Solidity(mapping) {
   this.mapping = mapping;
};

Solidity.prototype.getCurrentTileShape = function(tileset, tileIndex) {
   for(var i = 0; i < this.mapping.length; i++) {
      if (this.mapping[i].tileCategory.isTileMember(tileset, tileIndex))
         return this.mapping[i].tileShape;
   }
   return TileShape.empty;
};

var tileCategories = new Object();
var solidity = new Object();
solidity.getSolidityName = function(solid) {
   for(var key in solidity) {
      if (solidity[key] === solid) return key;
   }
   return null;
}
function initTileCategories() {
   tileCategories.AffectBots = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[66,67]}]);
   tileCategories.Biohazard = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[66,67]}]);
   tileCategories.Burning = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[29,31]}]);
   tileCategories.Checkpoint = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[85]}]);
   tileCategories.Climbable = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[35,36,37,39,41,61,62]}]);
   tileCategories.ConveyorLeft = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[54]}]);
   tileCategories.ConveyorRight = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[53]}]);
   tileCategories.DownCeiling = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[79,81,83]}]);
   tileCategories.Downhill = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[3,11,21]}]);
   tileCategories.Faucet = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[59,60]}]);
   tileCategories.HalfDownLeft = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[6,14,24]}]);
   tileCategories.HalfDownRight = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[7,15,25]}]);
   tileCategories.HalfUpLeft = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[4,12,22]}]);
   tileCategories.HalfUpRight = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[5,13,23]}]);
   tileCategories.Ignitable = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[28,30,27,57]}]);
   tileCategories.Igniting = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[32,33]}]);
   tileCategories.InstantDeath = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[63,64,65]}]);
   tileCategories.Perilous = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[29]}]);
   tileCategories.PlayerMeltable = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[58]}]);
   tileCategories.Solid = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[1,9,19,53,54,27,57,59,60,63,64,65,67,89]},
      {tileset:tilesets.WorldMapTiles,membership:[1,2,3,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,24,25,26,27,28,29,30,31,32,33,34,35,36,37,58,59,60,61,62,63,64,65,66,67,68,69,70,71]},
      {tileset:tilesets.UsableInventory,membership:[101]}]);
   tileCategories.TopSolid = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[8,16,26,62]}]);
   tileCategories.TopSolidClimbing = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[8,16,26]}]);
   tileCategories.TopSolidMid = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[39]}]);
   tileCategories.Touchable = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[52,50,51,29,31,58,59,60,63,64,65,56,55,77,78,85,89]}]);
   tileCategories.UpCeiling = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[80,82,84]}]);
   tileCategories.Uphill = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[2,10,20]}]);
   tileCategories.WormDiggable = new TileCategory([
      {tileset:tilesets.MainTiles,membership:[9]}]);
   solidity.Climbing_solidity = new Solidity([
      {tileCategory:tileCategories.Solid, tileShape:TileShape.solid},
      {tileCategory:tileCategories.Uphill, tileShape:TileShape.uphill},
      {tileCategory:tileCategories.Downhill, tileShape:TileShape.downhill},
      {tileCategory:tileCategories.HalfUpLeft, tileShape:TileShape.uphillLeft},
      {tileCategory:tileCategories.HalfUpRight, tileShape:TileShape.uphillRight},
      {tileCategory:tileCategories.HalfDownLeft, tileShape:TileShape.downhillLeft},
      {tileCategory:tileCategories.HalfDownRight, tileShape:TileShape.downhillRight},
      {tileCategory:tileCategories.TopSolidClimbing, tileShape:TileShape.topSolid}]);
   solidity.Standard = new Solidity([
      {tileCategory:tileCategories.Solid, tileShape:TileShape.solid},
      {tileCategory:tileCategories.Uphill, tileShape:TileShape.uphill},
      {tileCategory:tileCategories.Downhill, tileShape:TileShape.downhill},
      {tileCategory:tileCategories.HalfUpLeft, tileShape:TileShape.uphillLeft},
      {tileCategory:tileCategories.HalfUpRight, tileShape:TileShape.uphillRight},
      {tileCategory:tileCategories.HalfDownLeft, tileShape:TileShape.downhillLeft},
      {tileCategory:tileCategories.HalfDownRight, tileShape:TileShape.downhillRight},
      {tileCategory:tileCategories.TopSolid, tileShape:TileShape.topSolid},
      {tileCategory:tileCategories.TopSolidMid, tileShape:TileShape.topSolidMid},
      {tileCategory:tileCategories.UpCeiling, tileShape:TileShape.upCeiling},
      {tileCategory:tileCategories.DownCeiling, tileShape:TileShape.downCeiling}]);
}
// DecodeData1 = Cardinality 1-89
// DecodeData2 = Cardinality 90-7921
var dataDigits = ' 1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^*()_+-=[]{}|:;,./?`~';

function Map(scrollWidth, scrollHeight, scrollMarginLeft, scrollMarginTop, scrollMarginRight, scrollMarginBottom) {
   this.scrollX = 0;
   this.scrollY = 0;
   this.scrollWidth = scrollWidth;
   this.scrollHeight = scrollHeight;
   this.scrollMarginLeft = scrollMarginLeft;
   this.scrollMarginTop = scrollMarginTop;
   this.scrollMarginRight = scrollMarginRight;
   this.scrollMarginBottom = scrollMarginBottom;
   this.layers = {};
}

function getMapName(map) {
   for(var key in maps) {
      if (maps[key] === map)
         return key;
   }
   return null;
}

Map.prototype.scroll = function(x, y) {
   if(x < viewWidth - this.scrollWidth) x = viewWidth - this.scrollWidth;
   if(x > 0) x = 0;
   if(y < viewHeight - this.scrollHeight) y = viewHeight - this.scrollHeight;
   if(y > 0) y = 0;
   this.scrollX = x;
   this.scrollY = y;
   for(var key in this.layers) {
      this.layers[key].currentX = this.layers[key].offsetX + Math.floor(x * this.layers[key].scrollRateX);
      this.layers[key].currentY = this.layers[key].offsetY + Math.floor(y * this.layers[key].scrollRateY);
   }
};

Map.prototype.draw = function(ctx) {
   for(var key in this.layers)
      this.layers[key].draw(ctx);
};

Map.prototype.getState = function() {
   var result = {layers:{},cameFromMapName:this.cameFromMapName,mapFlags:this.mapFlags};
   for(var key in this.layers)
      result.layers[key] = this.layers[key].getState();
   return result;
};

Map.prototype.setState = function(data) {
   for(var key in this.layers)
      this.layers[key].setState(data.layers[key]);
   // These are probably correct, but the C# implementation doesn't do this
   // this.cameFromMapName = data.cameFromMapName;
   // this.mapFlags = data.mapFlags;
};

Map.prototype.executeRules = function() {
   for(var key in this.layers)
      this.layers[key].executeRules();
};
function decodeData1(data) {
   var result = new Array();
   for(var i = 0; i < data.length; i++) {
      result[i] = dataDigits.indexOf(data[i]);
   }
   return result;
}

function decodeData2(data) {
   var result = new Array();
   for(var i = 0; i < data.length/2; i++) {
      result[i] = dataDigits.indexOf(data[i*2]) * dataDigits.length + dataDigits.indexOf(data[i*2+1]);
   }
   return result;
}

function MapLayer(map, tileset, columns, rows, virtualColumns, virtualRows, offsetX, offsetY, scrollRateX, scrollRateY, priority, tileData) {
   this.map = map;
   this.tileset = tileset;
   this.columns = columns;
   this.rows = rows;
   this.offsetX = offsetX;
   this.offsetY = offsetY;
   this.currentX = offsetX;
   this.currentY = offsetY;
   this.scrollRateX = scrollRateX;
   this.scrollRateY = scrollRateY;
   this.priority = priority;
   if (tileData != null)
   {
      if(tileData.length < columns * rows * 2)
         this.tiles = decodeData1(tileData);
      else
         this.tiles = decodeData2(tileData);
   } else {
      this.tiles = [];
   }
   this.virtualColumns = virtualColumns ? virtualColumns : columns;
   this.virtualRows = virtualRows ? virtualRows : rows;
   this.sprites = [];
}

MapLayer.prototype.encodeTileData2 = function() {
   var result = '';
   for(var i = 0; i < this.tiles.length; i++) {
      result += dataDigits[Math.floor(this.tiles[i] / dataDigits.length)] + dataDigits[this.tiles[i] % dataDigits.length];
   }
   return result;
};

MapLayer.prototype.getState = function() {
   var result = {currentX:this.currentX,currentY:this.currentY,tiles:this.encodeTileData2()};
   var staticSpriteIndices = [];
   for(var key in this)
   {
      if(this[key] instanceof Sprite)
      {
         result["~1" + key] = this[key].serialize();
         var staticIndex = this.sprites.indexOf(this[key]);
         if (staticIndex >= 0)
            staticSpriteIndices[staticIndex] = true;
      }
   }
   var dynamicSprites = [];
   for(spriteIndex = 0; spriteIndex < this.sprites.length; spriteIndex++)
   {
      if (staticSpriteIndices[spriteIndex] !== true)
      {
         dynamicSprites.push("\"" + this.sprites[spriteIndex].serialize().replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"");
      }
   }
   result.dynamicSprites = "[" + dynamicSprites.join(",") + "]";
   return result;
};

MapLayer.prototype.setState = function(source) {
   this.tiles = decodeData2(source.tiles);
   this.sprites.length = 0;
   for(var key in source) {
      if (key.substr(0,2) == "~1") {
         var s = Sprite.deserialize(this,source[key]);
         this[key.substr(2)] = s;
         this.sprites.push(s);
      }
   }
   if (source["dynamicSprites"] != null) {
      var dynamicSprites = JSON.parse(source["dynamicSprites"]);
      for(s in dynamicSprites) {
         this.sprites.push(Sprite.deserialize(this,dynamicSprites[s]));
      }
   }
   this.spriteCategories = Sprite.categorize(this.sprites);
   this.currentX = source.currentX;
   this.currentY = source.currentY;
};

MapLayer.prototype.getTile = function(x, y) {
   return this.tiles[(y % this.rows) * this.columns + (x % this.columns)];
};

MapLayer.prototype.setTile = function(x, y, value) {
   this.tiles[(y % this.rows) * this.columns + (x % this.columns)] = value;
}

MapLayer.prototype.draw = function(ctx) {
   var tileWidth = this.tileset.tileWidth;
   var tileHeight = this.tileset.tileHeight;
   var lastRow = Math.floor((viewHeight - this.currentY - 1) / tileHeight);
   if (lastRow >= this.virtualRows) lastRow = this.virtualRows - 1;
   var lastCol = Math.floor((viewWidth - this.currentX - 1) / tileWidth);
   if (lastCol >= this.virtualColumns) lastCol = this.virtualColumns - 1;
   for(y = Math.floor(-this.currentY / tileHeight), y = y < 0 ? 0 : y; y <= lastRow; y++) {
      for(x = Math.floor(-this.currentX / tileWidth), x = x < 0 ? 0 : x; x <= lastCol; x++) {
         var tile = this.tileset.tiles[this.getTile(x, y)];
         if (tile == null) continue;
         var drx = x * tileWidth + this.currentX;
         var dry = y * tileHeight + this.currentY;
         if (typeof tile == 'number')
            this.tileset.frameSet.frames[tile % this.tileset.frameSet.frames.length].draw(ctx, drx, dry);
         else {
            var frames;
            if (tile instanceof AnimTile)
               frames = tile.getCurFrames();
            else
               frames = tile;
            if (typeof frames == 'number')
               this.tileset.frameSet.frames[frames % this.tileset.frameSet.frames.length].draw(ctx, drx, dry);
            else
               for(var fi = 0; fi < frames.length; fi++)
                  this.tileset.frameSet.frames[frames[fi] % this.tileset.frameSet.frames.length].draw(ctx, drx, dry);
         }
      }
   }
   for(si = 0; si < this.sprites.length; si++) {
      var curSprite = this.sprites[si];
      if (!curSprite.isActive) continue;
      var frames = curSprite.getCurFrames();
      if (frames == null) continue;
      var frameSet = frameSets[curSprite.states[curSprite.state].frameSetName];
      if (typeof frames == 'number')
         frameSet.frames[frames % frameSet.frames.length].draw(ctx, curSprite.x + this.currentX, curSprite.y + this.currentY);
      else
         for(var fi = 0; fi < frames.length; fi++)
            frameSet.frames[frames[fi] % frameSet.frames.length].draw(ctx, curSprite.x + this.currentX, curSprite.y + this.currentY);
   }
};

MapLayer.noSolid = -2000000000;

MapLayer.prototype.getTopSolidPixel = function(areaX, areaY, areaWidth, areaHeight, solidity) {
   var topTile = Math.floor(areaY / this.tileset.tileHeight);
   var bottomTile = Math.floor((areaY + areaHeight - 1) / this.tileset.tileHeight);
   var leftTile = Math.floor(areaX / this.tileset.tileWidth);
   var rightTile = Math.floor((areaX + areaWidth - 1) / this.tileset.tileWidth);
   var outOfBounds = false;
   if ((topTile < 0) || (topTile >= this.virtualRows) || (bottomTile < 0) || (bottomTile >= this.virtualRows)
      || (leftTile < 0) || (leftTile >= this.virtualColumns) || (rightTile < 0) || (rightTile >= this.virtualColumns))
      outOfBounds = true;
   var minTileTop = (areaY+this.tileset.tileHeight) % this.tileset.tileHeight;
   var tileLeft = leftTile * this.tileset.tileWidth;
   for (var y = topTile; y <= bottomTile; y++) {
      if (rightTile == leftTile) {
         var topMost;
         if (outOfBounds && ((leftTile < 0) || (leftTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            topMost = 0;
         else
            topMost = solidity.getCurrentTileShape(this.tileset, this.getTile(leftTile,y)).getTopSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaX - tileLeft,
               areaX + areaWidth - 1 - tileLeft);
         if ((topMost != TileShape.maxValue) && ((y > topTile) || (topMost >= minTileTop))) {
            var result = topMost + y * this.tileset.tileHeight;
            if (result < areaY + areaHeight)
               return result;
            else
               return MapLayer.noSolid;
         }
      } else {
         var topMost;
         if (outOfBounds && ((leftTile < 0) || (leftTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            topMost = 0;
         else
            topMost = solidity.getCurrentTileShape(this.tileset, this.getTile(leftTile, y)).getTopSolidPixel(
                this.tileset.tileWidth, this.tileset.tileHeight, areaX - tileLeft, this.tileset.tileWidth - 1);
         if ((y == topTile) && (topMost < minTileTop))
            topMost = TileShape.maxValue;
         var top;
         for (var x = leftTile + 1; x < rightTile; x++) {
            if (outOfBounds && ((x < 0) || (x >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
               top = 0;
            else
               top = solidity.getCurrentTileShape(this.tileset, this.getTile(x,y)).getTopSolidPixel(
                  this.tileset.tileWidth, this.tileset.tileHeight, 0, this.tileset.tileWidth - 1);
            if ((top < topMost) && ((y > topTile) || (top >= minTileTop)))
               topMost = top;
         }
         if (outOfBounds && ((rightTile < 0) || (rightTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            top = 0;
         else
            top = solidity.getCurrentTileShape(this.tileset, this.getTile(rightTile,y)).getTopSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, 0, (areaX + areaWidth - 1) % this.tileset.tileWidth);
         if ((top < topMost) && ((y > topTile) || (top >= minTileTop)))
            topMost = top;
         if (topMost != TileShape.maxValue) {
            var result = topMost + y * this.tileset.tileHeight;
            if (result < areaY + areaHeight)
               return result;
            else
               return MapLayer.noSolid;
         }
      }
   }
   return MapLayer.noSolid;
};

MapLayer.prototype.getBottomSolidPixel = function(areaX, areaY, areaWidth, areaHeight, solidity) {
   var topTile = Math.floor(areaY / this.tileset.tileHeight);
   var bottomTile = Math.floor((areaY + areaHeight - 1) / this.tileset.tileHeight);
   var leftTile = Math.floor(areaX / this.tileset.tileWidth);
   var rightTile = Math.floor((areaX + areaWidth - 1) / this.tileset.tileWidth);
   var outOfBounds = false;
   if ((topTile < 0) || (topTile >= this.virtualRows) || (bottomTile < 0) || (bottomTile >= this.virtualRows)
      || (leftTile < 0) || (leftTile >= this.virtualColumns) || (rightTile < 0) || (rightTile >= this.virtualColumns))
      outOfBounds = true;
   var maxTileBottom = (areaY + areaHeight - 1 + this.tileset.tileHeight) % this.tileset.tileHeight;
   var tileLeft = leftTile * this.tileset.tileWidth;
   for (var y = bottomTile; y >= topTile; y--) {
      if (rightTile == leftTile) {
         var bottomMost;
         if (outOfBounds && ((leftTile < 0) || (leftTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            bottomMost = this.tileset.tileHeight - 1;
         else
            bottomMost = solidity.getCurrentTileShape(this.tileset, this.getTile(leftTile,y)).getBottomSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaX - tileLeft,
               areaX + areaWidth - 1 - tileLeft);
         if ((bottomMost != TileShape.minValue) && ((y < bottomTile) || (bottomMost <= maxTileBottom))) {
            var result = bottomMost + y * this.tileset.tileHeight;
            if (result >= areaY)
               return result;
            else
               return MapLayer.noSolid;
         }
      } else {
         var bottomMost;
         if (outOfBounds && ((leftTile < 0) || (leftTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            bottomMost = this.tileset.tileHeight - 1;
         else
            bottomMost = solidity.getCurrentTileShape(this.tileset, this.getTile(leftTile, y)).getBottomSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaX - tileLeft, this.tileset.tileWidth - 1);
         if ((y == bottomTile) && (bottomMost > maxTileBottom))
            bottomMost = TileShape.minValue;
         var bottom;
         for (var x = leftTile + 1; x < rightTile; x++) {
            if (outOfBounds && ((x < 0) || (x >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
               bottom = this.tileset.tileHeight - 1;
            else
               bottom = solidity.getCurrentTileShape(this.tileset, this.getTile(x,y)).getBottomSolidPixel(
                  this.tileset.tileWidth, this.tileset.tileHeight, 0, this.tileset.tileWidth - 1);
            if ((bottom > bottomMost) && ((y < bottomTile) || (bottom <= maxTileBottom)))
               bottomMost = bottom;
         }
         if (outOfBounds && ((rightTile < 0) || (rightTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            bottom = this.tileset.tileHeight - 1;
         else
            bottom = solidity.getCurrentTileShape(this.tileset, this.getTile(rightTile,y)).getBottomSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, 0, (areaX + areaWidth - 1) % this.tileset.tileWidth);
         if ((bottom > bottomMost) && ((y < bottomTile) || (bottom <= maxTileBottom)))
            bottomMost = bottom;
         if (bottomMost != TileShape.minValue) {
            var result = bottomMost + y * this.tileset.tileHeight;
            if (result >= areaY)
               return result;
            else
               return MapLayer.noSolid;
         }
      }
   }
   return MapLayer.noSolid;
};

MapLayer.prototype.getLeftSolidPixel = function(areaX, areaY, areaWidth, areaHeight, solidity) {
   var topTile = Math.floor(areaY / this.tileset.tileHeight);
   var bottomTile = Math.floor((areaY + areaHeight - 1) / this.tileset.tileHeight);
   var leftTile = Math.floor(areaX / this.tileset.tileWidth);
   var rightTile = Math.floor((areaX + areaWidth - 1) / this.tileset.tileWidth);
   var outOfBounds = false;
   if ((topTile < 0) || (topTile >= this.virtualRows) || (bottomTile < 0) || (bottomTile >= this.virtualRows)
      || (leftTile < 0) || (leftTile >= this.virtualColumns) || (rightTile < 0) || (rightTile >= this.virtualColumns))
      outOfBounds = true;
   var minTileLeft = (areaX + this.tileset.tileWidth) % this.tileset.tileWidth;
   var tileTop = topTile * this.tileset.tileHeight;
   for (var x = leftTile; x <= rightTile; x++) {
      if (bottomTile == topTile){
         var leftMost;
         if (outOfBounds && ((topTile < 0) || (topTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            leftMost = 0;
         else
            leftMost = solidity.getCurrentTileShape(this.tileset, this.getTile(x, topTile)).getLeftSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaY - tileTop,
               areaY + areaHeight - 1 - tileTop);
         if ((leftMost != TileShape.maxValue) && ((x > leftTile) || (leftMost >= minTileLeft))) {
            var result = leftMost + x * this.tileset.tileWidth;
            if (result < areaX + areaWidth)
               return result;
            else
               return MapLayer.noSolid;
         }
      } else {
         var leftMost;
         if (outOfBounds && ((topTile < 0) || (topTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            leftMost = 0;
         else
            leftMost = solidity.getCurrentTileShape(this.tileset, this.getTile(x, topTile)).getLeftSolidPixel(
                this.tileset.tileWidth, this.tileset.tileHeight, areaY - tileTop, this.tileset.tileHeight - 1);
         if ((x == leftTile) && (leftMost < minTileLeft))
            leftMost = TileShape.maxValue;
         var left;
         for (var y = topTile + 1; y < bottomTile; y++) {
            if (outOfBounds && ((x < 0) || (x >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
               left = 0;
            else
               left = solidity.getCurrentTileShape(this.tileset, this.getTile(x,y)).getLeftSolidPixel(
                  this.tileset.tileWidth, this.tileset.tileHeight, 0, this.tileset.tileHeight - 1);
            if ((left < leftMost) && ((x > leftTile) || (left >= minTileLeft)))
               leftMost = left;
         }
         if (outOfBounds && ((bottomTile < 0) || (bottomTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            left = 0;
         else
            left = solidity.getCurrentTileShape(this.tileset, this.getTile(x, bottomTile)).getLeftSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, 0, (areaY + areaHeight - 1) % this.tileset.tileHeight);
         if ((left < leftMost) && ((x > leftTile) || (left >= minTileLeft)))
            leftMost = left;
         if (leftMost != TileShape.maxValue) {
            var result = leftMost + x * this.tileset.tileWidth;
            if (result < areaX + areaWidth)
               return result;
            else
               return MapLayer.noSolid;
         }
      }
   }
   return MapLayer.noSolid;
};

MapLayer.prototype.getRightSolidPixel = function(areaX, areaY, areaWidth, areaHeight, solidity) {
   var topTile = Math.floor(areaY / this.tileset.tileHeight);
   var bottomTile = Math.floor((areaY + areaHeight - 1) / this.tileset.tileHeight);
   var leftTile = Math.floor(areaX / this.tileset.tileWidth);
   var rightTile = Math.floor((areaX + areaWidth - 1) / this.tileset.tileWidth);
   var outOfBounds = false;
   if ((topTile < 0) || (topTile >= this.virtualRows) || (bottomTile < 0) || (bottomTile >= this.virtualRows)
      || (leftTile < 0) || (leftTile >= this.virtualColumns) || (rightTile < 0) || (rightTile >= this.virtualColumns))
      outOfBounds = true;
   var maxTileRight = (areaX + areaWidth - 1 + this.tileset.tileWidth) % this.tileset.tileWidth;
   var tileTop = topTile * this.tileset.tileHeight;
   for (var x = rightTile; x >= leftTile; x--) {
      if (bottomTile == topTile){
         var rightMost;
         if (outOfBounds && ((topTile < 0) || (topTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            rightMost = this.tileset.tileWidth - 1;
         else
            rightMost = solidity.getCurrentTileShape(this.tileset, this.getTile(x, topTile)).getRightSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaY - tileTop,
               areaY + areaHeight - 1 - tileTop);
         if ((rightMost != TileShape.minValue) && ((x < rightTile) || (rightMost <= maxTileRight))) {
            var result = rightMost + x * this.tileset.tileWidth;
            if (result >= areaX)
               return result;
            else
               return MapLayer.noSolid;
         }
      } else {
         var rightMost;
         if (outOfBounds && ((topTile < 0) || (topTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            rightMost = this.tileset.tileWidth - 1;
         else
            rightMost = solidity.getCurrentTileShape(this.tileset, this.getTile(x, topTile)).getRightSolidPixel(
                this.tileset.tileWidth, this.tileset.tileHeight, areaY - tileTop, this.tileset.tileHeight - 1);
         if ((x == rightTile) && (rightMost > maxTileRight))
            rightMost = TileShape.minValue;
         var right;
         for (var y = topTile + 1; y < bottomTile; y++) {
            if (outOfBounds && ((x < 0) || (x >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
               right = this.tileset.tileWidth - 1;
            else
               right = solidity.getCurrentTileShape(this.tileset, this.getTile(x,y)).getRightSolidPixel(
                  this.tileset.tileWidth, this.tileset.tileHeight, 0, this.tileset.tileHeight - 1);
            if ((right > rightMost) && ((x < rightTile) || (right <= maxTileRight)))
               rightMost = right;
         }
         if (outOfBounds && ((bottomTile < 0) || (bottomTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            right = this.tileset.tileWidth - 1;
         else
            right = solidity.getCurrentTileShape(this.tileset, this.getTile(x, bottomTile)).getRightSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, 0, (areaY + areaHeight - 1) % this.tileset.tileHeight);
         if ((right > rightMost) && ((x < rightTile) || (right <= maxTileRight)))
            rightMost = right;
         if (rightMost != TileShape.minValue) {
            var result = rightMost + x * this.tileset.tileWidth;
            if (result >= areaX)
               return result;
            else
               return MapLayer.noSolid;
         }
      }
   }
   return MapLayer.noSolid;
};

MapLayer.prototype.scrollSpriteIntoView = function(sprite, useScrollMargins)
{
   var newX = null;
   var newY = null;
   var marginLeft;
   var marginTop;
   var marginRight;
   var marginBottom;
   if (useScrollMargins)
   {
      marginLeft = this.map.scrollMarginLeft;
      marginTop = this.map.scrollMarginTop;
      marginRight = this.map.scrollMarginRight;
      marginBottom = this.map.scrollMarginBottom;
   }
   else
   {
      marginLeft = 0;
      marginTop = 0;
      marginRight = 0;
      marginBottom = 0;
   }
   if (sprite.x + this.currentX < marginLeft)
   {
      if (this.scrollRateX > 0)
         newX = Math.floor((-sprite.x + marginLeft - this.offsetX) / this.scrollRateX);
      else
         this.currentX = -sprite.x + marginLeft;
   }
   else if (sprite.x + sprite.getSolidWidth() - 1 + this.currentX > viewWidth - marginRight)
   {
      if (this.scrollRateX > 0)
         newX = Math.floor((-sprite.x - sprite.getSolidWidth() + 1 + viewWidth - marginRight - this.offsetX) / this.scrollRateX);
      else
         this.currentX = -sprite.x - sprite.getSolidWidth() + 1 + viewWidth - marginRight;
   }

   if (sprite.y + this.currentY < marginTop)
   {
      if (this.scrollRateY > 0)
         newY = Math.floor((-sprite.y + marginTop - this.offsetY) / this.scrollRateY);
      else
         this.currentY = -sprite.y + marginTop;
   }
   else if (sprite.y + sprite.getSolidHeight() - 1 + this.currentY > viewHeight - marginBottom)
   {
      if (this.scrollRateY > 0)
         newY = Math.floor((-sprite.y - sprite.getSolidHeight() + 1 + viewHeight - marginBottom - this.offsetY) / this.scrollRateY);
      else
         this.currentY = -sprite.Y - sprite.getSolidHeight() + 1 + viewHeight - marginBottom;
   }
   if ((newX != null) || (newY != null))
   {
      if (newX == null) newX = this.currentX;
      if (newY == null) newY = this.currentY;
      this.map.scroll(newX, newY);
   }
}

MapLayer.prototype.processSprites = function() {
   for(var si = 0; si < this.sprites.length; si++)
      this.sprites[si].processed = false;
   for(var si = 0; si < this.sprites.length; si++)
      if (this.sprites[si].isActive)
         this.sprites[si].processRules();
   for(var si = 0; si < this.sprites.length; si++) {
      var sprite = this.sprites[si];
      if (sprite.isDynamic && !sprite.isActive) {
         for(var categoryKey in sprite.categories) {
            for(var spriteKey in this.spriteCategories[categoryKey]) {
               if (this.spriteCategories[categoryKey][spriteKey] === sprite)
                  this.spriteCategories[categoryKey].splice(spriteKey, 1);
            }
         }
         this.sprites.splice(si, 1);
      }
   }   
}

function PlanBase() {
   this.targetDistance = 5;
}

PlanBase.prototype = new GeneralRules();
PlanBase.prototype.constructor = PlanBase;

PlanBase.prototype.isSpriteActive = function(sprite) {
   return sprite.isActive;
};

PlanBase.prototype.mapPlayerToInputs = function(playerNumber, target)
{
   target.mapPlayerToInputs(playerNumber);
};

PlanBase.prototype.followPath = function(sprite, coordinateIndexMember, waitCounterMember) {
   if (sprite.isActive) {
      if (sprite[waitCounterMember] == 0)
         this.pushSpriteTowardCoordinate(sprite, sprite[coordinateIndexMember], 10);
      else
         this.stopSprite(sprite);
      sprite[coordinateIndexMember] = this.checkNextCoordinate(sprite, sprite[coordinateIndexMember], waitCounterMember);
   }
};

PlanBase.prototype.pushSpriteTowardCoordinate = function(sprite, coordinateIndex, force) {
   this.pushSpriteTowardPoint(sprite, this[coordinateIndex], force);
};

PlanBase.prototype.pushSpriteTowardPoint = function(sprite, target, force) {
   var dx = target.x - sprite.x;
   var dy = target.y - sprite.y;

   // Normalize target vector to magnitude of Force parameter
   var dist = Math.sqrt(dx * dx + dy * dy);
   if (dist > 0) {
      dx = dx * force / dist / 10;
      dy = dy * force / dist / 10;

      // Push sprite
      sprite.dx += dx;
      sprite.dy += dy;
   }
};

PlanBase.prototype.checkNextCoordinate = function(sprite, coordinateIndex, waitCounterMember) {
   if (sprite[waitCounterMember] > 0)
   {
      if (++sprite[waitCounterMember] > this[coordinateIndex].weight)
      {
         sprite[waitCounterMember] = 0;
         return (coordinateIndex + 1) % this.m_Coords.length;
      }
      else
         return coordinateIndex;
   }
   var dx = this[coordinateIndex].x - sprite.x;
   var dy = this[coordinateIndex].y - sprite.y;
   if (Math.sqrt(dx * dx + dy * dy) <= this.targetDistance)
   {
      if (this[coordinateIndex].weight > 0)
         sprite[waitCounterMember]++;
      else
         return (coordinateIndex + 1) % this.m_Coords.length;
   }
   return coordinateIndex;
};

PlanBase.prototype.isSpriteTouching = function(sprite) {
   if (!sprite.isActive)
      return false;

   if ((Math.floor(sprite.x) <= this.left + this.width) && (Math.floor(sprite.x) + sprite.getSolidWidth() >= this.left) &&
      (Math.floor(sprite.y) < this.top + this.height) && (Math.floor(sprite.y) + sprite.getSolidHeight() > this.top))
      return true;
   if ((Math.floor(sprite.x) < this.left + this.width) && (Math.floor(sprite.x) + sprite.getSolidWidth() > this.left) &&
      (Math.floor(sprite.y) <= this.top + this.height) && (Math.floor(sprite.y) + sprite.getSolidHeight() >= this.top))
      return true;
   return false;
};

PlanBase.prototype.wasSpriteTouching = function(sprite) {
   if ((Math.floor(sprite.oldX) <= this.left + this.width) && (Math.floor(sprite.oldX) + sprite.getSolidWidth() >= this.left) &&
      (Math.floor(sprite.oldY) < this.top + this.height) && (Math.floor(sprite.oldY) + sprite.getSolidHeight() > this.top))
      return true;
   if ((Math.floor(sprite.oldX) < this.left + this.width) && (Math.floor(sprite.oldX) + sprite.getSolidWidth() > this.left) &&
      (Math.floor(sprite.oldY) <= this.top + this.height) && (Math.floor(sprite.oldY) + sprite.getSolidHeight() >= this.top))
      return true;
   return false;
};

PlanBase.prototype.stopSprite = function(sprite) {
   sprite.dx = sprite.dy = 0;
};

PlanBase.prototype.isInputPressed = function(sprite, input, initialOnly)
{
   return sprite.isInputPressed(input, initialOnly);
};

PlanBase.prototype.drawCounterAsTile = function(tileIndex, counter, style) {
   if (this.left == null)
      return;
   if (counter.currentValue == 0)
      return;
   var map = this.layer.map;
   ts = this.layer.tileset;
   fr = ts.frameSet;
   var disp = gameViewContext;

   var frames = ts.tiles[tileIndex];
   if (typeof frames == "number") {
      frames = [frames];
   } else {
      if (frames instanceof AnimTile)
         frames = frames.getCurFrames();
      if (typeof frames == "number") {
         frames = [frames];
      }
   }

   switch(style)
   {
      case "ClipRightToCounter":
         disp.save();
         disp.beginPath();
         disp.rect(this.left + this.layer.currentX,
            this.top + this.layer.currentY,
            this.width * counter.value / counter.max,
            this.height);
         disp.clip();
         for(var frameIndex in frames)
            fr.frames[frameIndex % fr.frames.length].draw(disp, this.left, this.top);
         disp.restore();
         break;
      case "StretchRightToCounter":
         throw "Not Implemented";
         break;
      case "RepeatRightToCounter":
         for(var i in frames) {
            var frameIndex = frames[i];
            var fillWidth = this.width * counter.value / counter.max;
            for (var repeat = 0; repeat < Math.ceil(fillWidth / ts.tileWidth); repeat++)
               fr.frames[frameIndex % fr.frames.length].draw(disp, this.left + repeat * ts.tileWidth, this.top);
         }
         break;
      case "ClipTopToCounter":
         throw "Not Implemented";
         break;
      case "StretchTopToCounter":
         throw "Not Implemented";
         break;
      case "RepeatUpToCounter":
         for(var i in frames) {
            var frameIndex = frames[i];
            var fillHeight = this.height * counter.value / counter.max;
            for (var repeat = 0; repeat < Math.ceil(fillHeight / ts.tileHeight); repeat++)
               fr.frames[frameIndex % fr.frames.length].draw(disp, this.left + repeat * ts.tileWidth, this.top - repeat * ts.tileHeight - ts.tileHeight);
         }
         break;
   }
};

function drawText(text, x, y) {
   var charWidth = 13;
   var charHeight = 18;
   var font = graphicSheets.CoolFont;
   if (font == null)
      throw "In order to use DrawText, the project must have a Graphic Sheet named \"CoolFont\"";
   var origX = x;
   for (var charIdx = 0; charIdx < text.length; charIdx++) {
      var curChar = text.charCodeAt(charIdx);
      if (curChar > 32) {
         var col = (curChar - 33) % 24;
         var row = Math.floor((curChar - 33) / 24);
         gameViewContext.drawImage(font.image, col * font.cellWidth, row * font.cellHeight,
            font.cellWidth, font.cellHeight, x, y, font.cellWidth, font.cellHeight);
         x += charWidth;
      }
      else if (curChar == 10)
      {
         x = origX;
         y += charHeight;
      }
   }
}

PlanBase.prototype.drawCounterWithLabel = function(label, counter) {
   if (this.left == null)
      return;   
   drawText(label.toString() + counter.value.toString(), this.left, this.top);
};

PlanBase.prototype.isSpriteWithin = function(sprite, relativePosition) {
   var rp = sprite.getRelativePosition(relativePosition);
   return ((rp.x >= this.left) && (rp.y >= this.top) && (rp.x < this.left + this.width) && (rp.y < this.top + this.height));
};

PlanBase.prototype.copyInputsToOld = function(sprite) {
   sprite.oldInputs = sprite.inputs;
};

PlanBase.prototype.transportToPlan = function(sprite, plan, alignment) {
   if (plan.left == null)
      return;

   switch(alignment) {
      case "TopLeft":
      case "TopCenter":
      case "TopRight":
         sprite.y = plan.top;
         break;
      case "LeftMiddle":
      case "CenterMiddle":
      case "RightMiddle":
         sprite.y = plan.top + Math.floor((plan.height - sprite.getSolidHeight())/2);
         break;
      default:
         sprite.y = plan.top + plan.height - sprite.getSolidHeight();
         break;
   }
   switch(alignment)
   {
      case "TopLeft":
      case "LeftMiddle":
      case "BottomLeft":
         sprite.x = plan.left;
         break;
      case "TopCenter":
      case "CenterMiddle":
      case "BottomCenter":
         sprite.x = plan.left + Math.floor((plan.width - sprite.getSolidWidth())/2);
         break;
      default:
         sprite.x = plan.left + plan.width - sprite.getSolidWidth();
         break;
   }
};

PlanBase.prototype.door = function(target, sprites, trigger) {
   var result = -1;
   for (var i=0; i<sprites.length; i++) {
      if (sprites[i].isActive) {
         var outDoor;
         if (this.isSpriteWithin(sprites[i], "CenterMiddle"))
            outDoor = target;
         else if (target.isSpriteWithin(sprites[i], "CenterMiddle"))
            outDoor = this;
         else
            continue;
         if (((trigger & sprites[i].inputs) == trigger) &&
            ((sprites[i].inputs & trigger) != (sprites[i].oldInputs & trigger)))
         {
            result = i;
            this.transportToPlan(sprites[i], outDoor, "BottomCenter");
         }
      }
   }
   return result;
};

PlanBase.prototype.activateSprite = function(target) {
   target.isActive = true;
};


PlanBase.prototype.copyTiles = function(source, target, relativePosition) {
   var src_left = Math.floor(source.left / source.layer.tileset.tileWidth);
   var src_top = Math.floor(source.top / source.layer.tileset.tileHeight);
   var src_right = Math.floor((source.left + source.width - 1) / source.layer.tileset.tileWidth);
   var src_bottom = Math.floor((source.top + source.height - 1) / source.layer.tileset.tileHeight);

   var dst_left = Math.floor(target.left / target.layer.tileset.tileWidth);
   var dst_top = Math.floor(target.top / target.layer.tileset.tileHeight);
   var dst_right = Math.floor((target.left + target.width - 1) / target.layer.tileset.tileWidth);
   var dst_bottom = Math.floor((target.top + target.height - 1) / target.layer.tileset.tileHeight);

   for (var y = src_top; y <= src_bottom; y++) {
      var targety;
      switch(relativePosition) {
         case "TopLeft":
         case "TopCenter":
         case "TopRight":
            targety = dst_top + y - src_top;
            break;
         case "LeftMiddle":
         case "CenterMiddle":
         case "RightMiddle":
            targety = y + Math.floor((dst_top + dst_bottom - src_top - src_bottom) / 2);
            break;
         default:
            targety = dst_bottom + y - src_bottom;
            break;
      }
      if (targety < 0)
         continue;
      if (targety >= target.layer.virtualRows)
         break;
      for (var x = src_left; x <= src_right; x++) {
         var targetx;
         switch(relativePosition) {
            case "TopLeft":
            case "LeftMiddle":
            case "BottomLeft":
               targetx = dst_left + x - src_left;
               break;
            case "TopCenter":
            case "CenterMiddle":
            case "BottomCenter":
               targetx = x + Math.floor((dst_left + dst_right - src_left - src_right) / 2);
               break;
            default:
               targetx = dst_right + x - src_right;
               break;
         }
         if (targetx < 0)
            continue;
         if (targetx >= target.layer.virtualColumns)
            break;
            
         target.layer.setTile(targetx,targety,source.layer.getTile(x,y));
      }
   }
};

PlanBase.prototype.copyTo = function(target, relativePosition) {
   this.copyTiles(this, target, relativePosition);
};

PlanBase.prototype.copyFrom = function(source, relativePosition) {
   this.copyTiles(source, this, relativePosition);
};

PlanBase.prototype.deactivateSprite = function(target) {
   target.isActive = false;
};

PlanBase.prototype.matchSpritePosition = function(target, source) {
   target.oldX = target.x;
   target.oldY = target.y;
   target.x = source.x;
   target.y = source.y;
};

PlanBase.prototype.isSpriteWithin = function(sprite, relativePosition) {
   var rp = sprite.getRelativePosition(relativePosition);
   if ((rp.x >= this.left) && (rp.y >= this.top) && (rp.x < this.left + this.width) && (rp.y < this.top + this.height)) {
      return true;
   }
   return false;
};

PlanBase.prototype.scrollSpriteIntoView = function(sprite, useScrollMargins) {
   this.layer.scrollSpriteIntoView(sprite, useScrollMargins);
};

PlanBase.prototype.testCollisionRect = function(sourceSprite, targets) {
   sourceSprite.testCollisionRect(targets);
};

PlanBase.prototype.addSpriteAtPlan = function(spriteDefinition, relativePosition) {
   var spriteParams = "{\"~1\":\"" + spriteDefinition + "\", \"x\":0,\"y\":0" +
   ",\"dx\":0,\"dy\":0,\"state\":0,\"frame\":0,\"active\":true,\"priority\":0,\"solidityName\":\"\"}";
   
   GeneralRules.lastCreatedSprite = Sprite.deserialize(this.layer, spriteParams);

   if ((this.m_Coords != null) && (this.m_Coords.length > 0))
   {
      offset = lastCreatedSprite.getRelativePosition(relativePosition);
      GeneralRules.lastCreatedSprite.x = this[0].x - offset.x;
      GeneralRules.lastCreatedSprite.y = this[0].y - offset.y ;
   }

   this.layer.sprites.push(GeneralRules.lastCreatedSprite);
   for(var categoryKey in spriteDefinitions[spriteDefinition].prototype.categories) {
      var category = spriteDefinitions[spriteDefinition].prototype.categories[categoryKey];
      if (this.layer.spriteCategories[category] == null)
         this.layer.spriteCategories[category] = [];
      this.layer.spriteCategories[category].push(GeneralRules.lastCreatedSprite);
   }
}

PlanBase.prototype.mapMouseToSprite = function(target, instantMove, hotSpot) {
   target.mapMouseToSprite(instantMove, hotSpot);
}
var maps = {};
var mapInitializers = {};
window.onload = startGame;
