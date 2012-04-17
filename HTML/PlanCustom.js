// Begin PlanCustom.js
PlanBase.prototype.transportToPoint = function(sprite, target) {
   sprite.oldX = sprite.x;
   sprite.oldY = sprite.y;
   sprite.x = target.x;
   sprite.y = target.y;
}


PlanBase.prototype.moveSelectorLayer = function(visible) {
   if (visible) {
      if (this.layer.currentX < 80) {
         this.layer.currentX += 32;
      }
   } else if (this.layer.currentX > -512) {
      this.layer.currentX -= 32;
   }
}

PlanBase.prototype.wasInputPressed = function(sprite, input) {
   return sprite.wasInputPressed(input);
}

