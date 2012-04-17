// Begin SpriteCustom.js
Sprite.prototype.getPolarStateByVector = function(firstState, stateCount) {
   var useDX;
   if (this.localDX == null)
      useDX = this.dx;
   else
      useDX = this.localDX;
   return firstState + Math.round(stateCount + Math.atan2(-this.dy, useDX) * stateCount / Math.PI / 2) % stateCount;
};

Sprite.prototype.tileCategoryTouched = function(category, initialOnly) {
   if (this.touchedTiles == null)
      return false;

   for (i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if (!tt.processed && category.isTileMember(this.layer.tileset, this.layer.getTile(tt.x, tt.y))
         && (!initialOnly || tt.initial))
      {
         this.TouchIndex = i;
         tt.processed = true;
         return true;
      }
   }
   return false;
};

Sprite.prototype.isCollisionRectWith = function(targetSprite) {
   if (!this.isActive)
      return false;
   if (targetSprite == null)
      return false;
   if (!targetSprite.isActive)
      return false;
   if (targetSprite == this)
      return false;

   var x1 = Math.floor(this.x);
   var w1 = this.getSolidWidth();
   var x2 = Math.floor(targetSprite.x);
   var w2 = targetSprite.getSolidWidth();
   var y1 = Math.floor(this.y);
   var h1 = this.getSolidHeight();
   var y2 = Math.floor(targetSprite.y);
   var h2 = targetSprite.getSolidHeight();

   return ((x1 + w1 > x2) && (x2 + w2 > x1) && (y1 + h1 > y2) && (y2 + h2 > y1));
};

Sprite.prototype.reactToPush = function(pushers) {
   if (!this.isActive)
      return false;
   var result = false;
   for (var idx = 0; idx < pushers.length; idx++)
   {
      var targetSprite = pushers[idx];
      if ((targetSprite == this) || (!targetSprite.isActive))
         continue;
      if (targetSprite.processed)
         result |= targetSprite.pushSprite(this);
   }
   return result;
};


Sprite.prototype.reactToPushback = function(pushers) {
   if (!this.isActive)
      return false;
   if (pushers == null)
      return false;
   var result = false;
   for (var idx = 0; idx < pushers.length; idx++) {
      var targetSprite = pushers[idx];
      if (!targetSprite.isActive || targetSprite.processed || targetSprite == this)
         continue;
      if (this.isCollisionRectWith(targetSprite)) {
         targetSprite.processRules();
         result |= targetSprite.pushSprite(this);
      }
   }

   return result;
};

Sprite.prototype.pushSprite = function(targetSprite) {
   var x1 = Math.floor(this.x + this.dx);
   var w1 = this.getSolidWidth();
   var x2 = Math.floor(targetSprite.x + targetSprite.dx);
   var w2 = targetSprite.getSolidWidth();
   var y1 = Math.floor(this.y + this.dy);
   var h1 = this.getSolidHeight();
   var y2 = Math.floor(targetSprite.y + targetSprite.dy);
   var h2 = targetSprite.getSolidHeight();

   var pushright = x1 + w1 - x2;
   var pushleft = x2 + w2 - x1;
   if ((pushright > 0) && (pushleft > 0)) {
      var pushx;
      pushx = (pushright < pushleft) ? pushright : -pushleft;
      var pushdown = y1 + h1 - y2;
      var pushup = y2 + h2 - y1;
      if ((pushup > 0) && (pushdown > 0)) {
         var pushy = (pushdown < pushup) ? pushdown : -pushup;
         if (Math.abs(pushx) > Math.abs(pushy)) {
            targetSprite.dy += pushy;
         } else {
            if (targetSprite.localDX != null)
               targetSprite.localDX += pushx;
            targetSprite.dx += pushx;
         }
         return true;
      }
   }
   return false;
}


Sprite.prototype.findNearestFreeBot = function(target, attachments, maxDistance) {
   var minDist = maxDistance * maxDistance;
   var index = -1;
   for (var i = 0; i < target.length; i++)
   {
      if ((!target[i].isActive) || (target[i] == this))
         continue;
      var xOff = target[i].x - this.x;
      var yOff = target[i].y - this.y;
      var dist = xOff * xOff + yOff * yOff;
      if ((dist < minDist) && (this.getTargetAttachment(target, i, attachments) < 0))
      {
         minDist = dist;
         index = i;
      }
   }

   return index;
};

Sprite.prototype.getTargetAttachment = function(targets, index, attachments) {
   if (index < 0)
      index = this.getNearestSpriteIndex(targets);
   if (index < 0)
      return -1;
   for(var i = 0; i < attachments.length; i++)
      if (attachments[i].ridingOn == targets[index])
         return i;
   return -1;
};

Sprite.prototype.landOnConveyor = function(speed) {
   // If on rightward conveyor
   if (this.isAgainstTile(tileCategories.ConveyorRight, "BottomLeft", "Down") ||
       this.isAgainstTile(tileCategories.ConveyorRight, "BottomRight", "Down")) {
      // If not already on a conveyor belt (right)
      if ((this.onConveyorBelt == 0) || (this.onConveyorBelt == null)) {
         // Set rightward conveyor local velocity
         this.localDX = this.dx - speed;
         // Set rightward conveyor belt
         this.onConveyorBelt = 1;
      }
   } else {
      // Else if on leftward conveyor
      if (this.isAgainstTile(tileCategories.ConveyorLeft, "BottomLeft", "Down") ||
          this.isAgainstTile(tileCategories.ConveyorLeft, "BottomRight", "Down")) {
         // If not already on a conveyor (left)
         if ((this.onConveyorBelt == 0) || (this.onConveyorBelt == null)) {
            // Set local leftward conveyor local velocity
            this.localDX = this.dx + speed;
            // Set leftward conveyor belt
            this.onConveyorBelt = 2;
         }
      } else {
         // Else if was on a conveyor (and no longer is)
         if (this.onConveyorBelt != 0) {
            // Stop riding conveyor
            this.stopRiding();
            this.onConveyorBelt = 0;
         }
      }
   }
};

Sprite.prototype.isAgainstTile = function(category, relativePosition, direction) {
   var rp = this.getRelativePosition(relativePosition);
   switch(direction)
   {
      case "Up":
         rp.y -= 1;
         break;
      case "Right":
         rp.x += 1;
         break;
      case "Down":
         rp.y += 1;
         break;
      case "Left":
         rp.x -= 1;
         break;
      }
   return category.isTileMember(this.layer.tileset, this.layer.getTile(Math.floor(rp.x / this.layer.tileset.tileWidth),
      Math.floor(rp.y / this.layer.tileset.tileHeight)));
};

Sprite.prototype.reactToConveyor = function(speed) {
   // If riding rightward conveyor
   if (this.onConveyorBelt == 1) {
      // React to rightward conveyor
      this.dx = this.localDX + speed;
   } else {
      // Else if riding leftward conveyor
      if (this.onConveyorBelt == 2) {
         // React to leftward conveyor
         this.dx = this.localDX - speed;
      }
   }
};

Sprite.prototype.isOnTileValue = function(tileValue, relativePosition) {
   var rp = this.getRelativePosition(relativePosition);
   return this.layer.getTile(Math.floor(rp.x / this.layer.tileset.tileWidth),
      Math.floor(rp.y / this.layer.tileset.tileHeight)) == tileValue;
};

Sprite.prototype.tileGetValue = function(relativePosition) {
   var rp = this.getRelativePosition(relativePosition);
   return this.layer.getTile(Math.floor(rp.x / this.layer.tileset.tileWidth),
      Math.floor(rp.y / this.layer.tileset.tileHeight));
};

Sprite.prototype.attachToNearest = function(parentList) {
   if (this.ridingOn != null)
      return true;
   var nearest = this.getNearestSpriteIndex(parentList);
   if (nearest >= 0)
      this.ridingOn = parentList[nearest];
   else
      return false;
   return true;
};

Sprite.prototype.stickToAttached = function(parentPoint, myPoint) {
   if (this.ridingOn == null)
      return;
   if (!this.ridingOn.processed)
      this.ridingOn.processRules();
   if (this.ridingOn.isActive == false)
   {
      this.ridingOn = null;
      return;
   }
   var ptParent = this.ridingOn.getRelativePosition(parentPoint);
   var ptSelf = this.getRelativePosition(myPoint);
   this.oldX = this.x;
   this.oldY = this.y;
   this.x += ptParent.x - ptSelf.x;
   this.y += ptParent.y - ptSelf.y;      
};

Sprite.prototype.isVisible = function() {
   return this.isActive && this.layer.isSpriteVisible(this);
};

Sprite.prototype.unCrouch = function() {
   // If crouching left
   if (this.isInState(spriteDefinitions.Player.statesEnum.Crouch_left, spriteDefinitions.Player.statesEnum.Crouch_left)) {
      // Stand left
      return this.switchToState(spriteDefinitions.Player.statesEnum.Left, "BottomCenter");
   }
   // If crouching right
   if (this.isInState(spriteDefinitions.Player.statesEnum.Crouch_right, spriteDefinitions.Player.statesEnum.Crouch_right)) {
      // Stand right
      return this.switchToState(spriteDefinitions.Player.statesEnum.Right, "BottomCenter");
   }

   return this.isInState(spriteDefinitions.Player.statesEnum.Right, spriteDefinitions.Player.statesEnum.Left);
};

Sprite.prototype.tileSetValue = function(newTileValue, relativePosition) {
   var rp = this.getRelativePosition(relativePosition);
   this.layer.setTile(Math.floor(rp.x / this.layer.tileset.tileWidth), Math.floor(rp.y / this.layer.tileset.tileHeight), newTileValue);
};

Sprite.prototype.moveOverTiles = function(direction, count) {
   switch(direction)
   {
      case "Up":
         this.y -= this.layer.tileset.tileHeight * count;
         break;
      case "Right":
         this.x += this.layer.tileset.tileWidth * count;
         break;
      case "Down":
         this.y += this.layer.tileset.tileHeight * count;
         break;
      case "Left":
         this.x -= this.layer.tileset.tileWidth * count;
         break;
   }
};

Sprite.prototype.wasInputPressed = function(input) {
   return (0 != (this.oldInputs & input));
}

Sprite.prototype.testCollisionRectMargin = function(targets, margin) {
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

      if ((x1 + w1 > x2 + margin) && (x2 + w2 > x1 + margin) && (y1 + h1 > y2 + margin) && (y2 + h2 > y1 + margin))
         return idx;
   }
   return -1;
};

Sprite.prototype.snapToTile = function() {
   this.x = Math.floor((this.x + this.layer.tileset.tileWidth / 2) / this.layer.tileset.tileWidth) * this.layer.tileset.tileWidth;
   this.y = Math.floor((this.y + this.layer.tileset.tileHeight / 2) / this.layer.tileset.tileHeight) * this.layer.tileset.tileHeight;
};

Sprite.prototype.removeDigit = function(value) {
   return Math.floor(value / 10);
};

Sprite.prototype.isTargetDirection = function(direction) {
   var target = this.getSelectedTargetFor("");
   if (target == null)
      return false;

   switch(direction)
   {
      case "Up":
         return target.y < this.y;
      case "Left":
         return target.x < this.x;
      case "Right":
         return target.x > this.x;
      case "Down":
         return target.y > this.y;
   }
   return false;
}

