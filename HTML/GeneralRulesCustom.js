// Begin GeneralRulesCustom.js
GeneralRules.selectedSprites = {};

GeneralRules.prototype.getSelectedTargetFor = function(targetName) {
   return GeneralRules.selectedSprites[targetName];
}


GeneralRules.prototype.selectLastCreatedSprite = function() {
   this.selectLastCreatedSpriteFor("");
};

GeneralRules.prototype.selectLastCreatedSpriteFor = function(targetName) {
   GeneralRules.selectedSprites[targetName] = GeneralRules.lastCreatedSprite;
};

GeneralRules.prototype.setTargetParameter = function(parameterName, value) {
   this.setTargetParameterFor(parameterName, value, "");
};

GeneralRules.prototype.setTargetParameterFor = function(parameterName, value, targetName) {
   GeneralRules.selectedSprites[targetName][parameterName] = value;
};

GeneralRules.prototype.selectTargetSpriteFor = function(sprites, index, targetName) {
   if ((index >= 0) && (sprites.length > index))
   {
      GeneralRules.selectedSprites[targetName] = sprites[index];
      return true;
   }
   else
   {
      GeneralRules.selectedSprites[targetName] = null;
      return false;
   }
};

GeneralRules.prototype.selectTargetSprite = function(sprites, index) {
   return this.selectTargetSpriteFor(sprites, index, "");
}

GeneralRules.prototype.isSpriteForTargetOfType = function(targetName, spriteDefinition) {
   if (GeneralRules.selectedSprites[targetName] == null)
      return false;
   return GeneralRules.selectedSprites[targetName] instanceof spriteDefinitions[spriteDefinition];
}

GeneralRules.prototype.deactivateTargetSpriteFor = function(targetName) {
   var s = GeneralRules.selectedSprites[targetName];
   if (s == null)
      return false;
   var result;
   result = s.isActive;
   s.deactivate();
   delete GeneralRules.selectedSprites[targetName];
   return result;
};



