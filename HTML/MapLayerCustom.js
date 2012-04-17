// Begin MapLayerCustom.js

MapLayer.prototype.isSpriteVisible = function(sprite) {
   if (!sprite.isActive)
      return -1;
   var x1 = Math.floor(sprite.x);
   var w1 = sprite.getSolidWidth();
   var x2 = -this.currentX;
   var w2 = viewWidth;
   var y1 = Math.floor(sprite.y);
   var h1 = sprite.getSolidHeight();
   var y2 = -this.currentY;
   var h2 = viewHeight;

   if ((x1 + w1 > x2) && (x2 + w2 > x1) && (y1 + h1 > y2) && (y2 + h2 > y1))
      return true;
   return false;
}
