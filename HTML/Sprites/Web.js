spriteDefinitions.Web = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, DeactivateHeight) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.DeactivateHeight = DeactivateHeight
};
spriteDefinitions.Web.prototype = new Sprite();
spriteDefinitions.Web.prototype.constructor = spriteDefinitions.Web;
spriteDefinitions.Web.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Web(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.DeactivateHeight);
}
spriteDefinitions.Web.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Web.prototype.toJSON = function() {
   return {"~1":"Web",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),DeactivateHeight:this.DeactivateHeight};
}
spriteDefinitions.Web.userParams = ["DeactivateHeight"];
spriteDefinitions.Web.prototype.states = new Array();
spriteDefinitions.Web.prototype.categories = ["Web"];
spriteDefinitions.Web.prototype.states[0] = new SpriteState(32,32,"SpiderFrames",{x:0,y:0,width:32,height:32},[new TileFrame(1,0)]);
spriteDefinitions.Web.statesEnum = {Main: 0};
spriteDefinitions.Web.prototype.executeRules = function() {
   // If need to deactivate
   if ((((this.DeactivateHeight) <= (this.y)) 
            && ((this.DeactivateHeight) > (0)))) {
      // Deactivate
      this.deactivate();
   }
   
};
