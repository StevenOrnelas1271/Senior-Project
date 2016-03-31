function MapBuilder(walls)
{
	this.walls = walls;
	this.createRandomWall();
}

MapBuilder.WALL_HEIGHTS = [
	288, //lowest slice
	256,
	224,
	192,
	160 //highest slice
];

MapBuilder.prototype.createRandomWall = function()
{
	/*var rand = Math.floor((Math.random() * 1) + 1);
	var length = Math.floor((Math.random() * 15));
	switch (rand) {
		case 1:
			console.log("buildOne called");
			this.buildOne();
		break;
		
		case 2:
			console.log("buildTwo called");
			this.buildTwo();
		break;
		
		default:
		break;
	}
	
	*/
	this.createWallSpan(0, 100);
	/*this.createGap(1);
	this.createWallSpan(1, 10);
	this.createGap(2);
	this.createWallSpan(2, 15);
	this.createGap(2);
	this.createWallSpan(3, 10);
	this.createGap(1);
	this.createWallSpan(1, 10);
	this.createGap(3);
	this.createWallSpan(2, 15);
	this.createGap(1);
	this.createWallSpan(3, 10);
	this.createGap(1);
	this.createGap(10);
	this.createWallSpan(4, 20);
	this.createWallSpan(0, 30);
	*/
	//this.createWallSpan(0, 200);
	
};

MapBuilder.prototype.buildOne = function ()
{
	//this.createGap(1);
	this.createWallSpan(4, 10);
	//this.createWallSpan(3, 5);
	//this.createWallSpan(2, 10);
	//this.createGap(15);
	//this.createWallSpan(2,15);
	//this.createGap(1);	
};

MapBuilder.prototype.buildTwo = function()
{
	this.createWallSpan(0, 10);
	//this.createGap(2);
};

MapBuilder.prototype.createGap = function (spanLength)
{
	for (var i = 0; i < spanLength; i++)
	{
		this.walls.addSlice(SliceType.GAP);
	}
};

MapBuilder.prototype.createWallSpan = function (heightIndex, spanLength, noFront, noBack)
{
	//noFront passed as true means you do NOT want a front, same for noBack
	//by default noFront and noBack will be false so a front and a back will be included
	noFront = noFront || false;
	noBack  = noBack  || false;
	
	if (noFront == false && spanLength > 0)
	{
		this.addWallFront(heightIndex);
		spanLength--;
	}
	
	//if you do NOT want a back, use the rest of the spanLength or else reserve 1 piece for a back
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
	
};

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
	for (var i = 0;i < spanLength; i++)
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
};