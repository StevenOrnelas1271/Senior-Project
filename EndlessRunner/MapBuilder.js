function MapBuilder(walls)
{
	this.walls = walls;
	this.createRandomWall();
}

MapBuilder.WALL_HEIGHTS = [
	256, //lowest slice
	224,
	192,
	160,
	128  //highest slice
];

MapBuilder.prototype.createRandomWall = function()
{
	/*  var rand = Math.floor((Math.random() * 1) + 1);
		var length = Math.floor((Math.random() * 15));
		console.log(rand);
		switch (rand) {
			case 1:
			this.buildOne(length);
			break;
		
			default:
			break;
		}
		*/
	this.createGap(1);
	this.createWallSpan(1, 10);
	this.createGap(2);
	this.createWallSpan(2, 15);
	this.createWallSpan(3, 10);
	this.createWallSpan(1, 10);
	this.createWallSpan(2, 15);
	this.createWallSpan(3, 10);
	
	
	this.createGap(1);

};

MapBuilder.prototype.buildOne = function ()
{
	this.createWallSpan(1, 20);
	this.createGap(1);	
};

MapBuilder.prototype.createGap = function (spanLength)
{
	for (i = 0; i < spanLength; i++)
	{
		this.walls.addSlice(SliceType.GAP);
	}
};

MapBuilder.prototype.createWallSpan = function (heightIndex, spanLength, noFront, noBack)
{
	noFront = noFront || false;
	noBack  = noBack  || false;
	
	if (noFront == false && spanLength > 0)
	{
		this.addWallFront(heightIndex);
		spanLength--;
	}
	
	var midSpanLength = spanLength - (noBack ? 0 : 1);
	if (midSpanLength > 0)
	{
		this.addWallMid(heightIndex, midSpanLength);
		spanLength -= midSpanLength;
	}
	
	if (noBack == false && spanLength > 0)
	{
		this.addWallBack(heightIndex);
	}
};

MapBuilder.prototype.createSteppedWallSpan = function (heightIndex, spanALength, spanBLength)
{
	//spanALength is length of walls to the left of step, spanBLength is length of walls to the right
	if (heightIndex < 2)
	{
		heightIndex = 2;
	}
	
	this.createWallSpan(heightIndex, spanALength, false, true);
	this.addWallStep(heightIndex - 2);
	this.createWallSpan(heightIndex -2, spanBLength - 1, true, false);
	
}
MapBuilder.prototype.addWallFront = function(heightIndex)
{
	var y = MapBuilder.WALL_HEIGHTS[heightIndex];
	this.walls.addSlice(SliceType.FRONT, y);
};

MapBuilder.prototype.addWallBack = function(heightIndex)
{
	var y = MapBuilder.WALL_HEIGHTS[heightIndex];
	this.walls.addSlice(SliceType.BACK, y);
};

MapBuilder.prototype.addWallMid = function(heightIndex, spanLength)
{
	var y = MapBuilder.WALL_HEIGHTS[heightIndex];
	for (i = 0;i < spanLength; i++)
	{
		if (i % 2 == 0)
		{
			this.walls.addSlice(SliceType.WINDOW, y);
		}
		else
		{
			this.walls.addSlice(SliceType.DECORATION, y);			
		}
	}
};

MapBuilder.prototype.addWallStep = function(heightIndex)
{
	var y = MapBuilder.WALL_HEIGHTS[heightIndex];
	this.walls.addSlice(SliceType.STEP, y);	
}