// Begin TileCustom.js

TileShape.topSolidMid = new TileShape();
TileShape.topSolidMid.getTopSolidPixel = function(width, height, min, max) { return Math.floor(height /2); };
TileShape.topSolidMid.getLeftSolidPixel = TileShape.empty.getLeftSolidPixel;
TileShape.topSolidMid.getRightSolidPixel = TileShape.empty.getRightSolidPixel;
TileShape.topSolidMid.getBottomSolidPixel = TileShape.empty.getBottomSolidPixel;

