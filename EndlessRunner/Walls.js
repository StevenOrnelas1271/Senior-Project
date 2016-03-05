function Walls()
{
	PIXI.Container.call(this);
	
	this.pool = new WallSpritesPool();
	this.createLookupTables();
	
	this.slices = [];
	
	this.viewportX = 0;
	this.viewportSliceX = 0;
	
	this.removedSlices = 0;
}

Walls.constructor = Walls;
Walls.prototype = Object.create(PIXI.Container.prototype);

Walls.VIEWPORT_WIDTH = 512;
Walls.VIEWPORT_NUM_SLICES = Math.ceil(Walls.VIEWPORT_WIDTH/WallSlice.WIDTH) + 1;

Walls.prototype.setViewportX = function(viewportX)
{
	this.viewportX = this.checkViewportXBounds(viewportX);
	
	var prevViewportSliceX = this.viewportSliceX;
	this.viewportSliceX = Math.floor(this.viewportX/WallSlice.WIDTH);
	
	this.removeOldSlices(prevViewportSliceX);
	this.addNewSlices();
};

Walls.prototype.removeOldSlices = function(prevViewportSliceX)
{
	var numOldSlices = this.viewportSliceX - prevViewportSliceX;
	
	if (numOldSlices > Walls.VIEWPORT_NUM_SLICES)
	{
		numOldSlices = Walls.VIEWPORT_NUM_SLICES;
	}
	
	for (var i = prevViewportSliceX; i < prevViewportSliceX + numOldSlices; i++)
	{
		var slice = this.slices[i - this.removedSlices];
		if (slice.sprite != null)
		{
			this.returnWallSprite(slice.type, slice.sprite);
			this.removeChild(slice.sprite);
			slice.sprite = null;
			//this.removedSlices++; // stops when length - removed = 30
			//this.slices.shift();
		}
			//this.removedSlices++; // stop when length - removed = 20
			//this.slices.shift();
	}
};

Walls.prototype.addNewSlices = function()
{
	var firstX = -(this.viewportX % WallSlice.WIDTH);
	for (var i = this.viewportSliceX, sliceIndex = 0;
		 i < this.viewportSliceX + Walls.VIEWPORT_NUM_SLICES;
		 i++, sliceIndex++
		)
	{
		//console.log("removedSlices: " + this.removedSlices + "i: " + i);
		if (i - this.removedSlices < 0)
			console.log("i: " + i + "removedslices: " + this.removedSlices);
		var slice = this.slices[i - this.removedSlices];
		//The slice does not have a sprite so link a sprite to this slice.
		if (slice.sprite == null && slice.type != SliceType.GAP)
		{
			slice.sprite = this.borrowWallSprite(slice.type);
			
			slice.sprite.position.x = firstX + (sliceIndex * WallSlice.WIDTH);
			slice.sprite.position.y = slice.y;
			
			this.addChild(slice.sprite);
		}
		//The slice already has a sprite to it so just update the position of the sprite.
		else if (slice.sprite != null)
		{
			slice.sprite.position.x = firstX + (sliceIndex * WallSlice.WIDTH);
		}	
	}
};

Walls.prototype.addSlice = function(SliceType, y)
{
	var slice = new WallSlice(SliceType, y);
	this.slices.push(slice);
};

Walls.prototype.checkViewportXBounds = function(viewportX)
{
	var maxViewportX = (this.slices.length - Walls.VIEWPORT_NUM_SLICES) * WallSlice.WIDTH;
	if (viewportX < 0)
	{
		viewportX = 0;
	}
	else if (viewportX > maxViewportX)
	{
		viewportX = maxViewportX;
	}
	
	return viewportX;
};

Walls.prototype.createLookupTables = function()
{
	this.borrowWallSpriteLookup = [];
	
	this.borrowWallSpriteLookup[SliceType.FRONT] 	  = this.pool.borrowFrontEdge;
	this.borrowWallSpriteLookup[SliceType.BACK]  	  = this.pool.borrowBackEdge;
	this.borrowWallSpriteLookup[SliceType.STEP]  	  = this.pool.borrowStep;
	this.borrowWallSpriteLookup[SliceType.DECORATION] = this.pool.borrowDecoration;
	this.borrowWallSpriteLookup[SliceType.WINDOW] 	  = this.pool.borrowWindow;
	
	this.returnWallSpriteLookup = [];
	this.returnWallSpriteLookup[SliceType.FRONT] 	  = this.pool.returnFrontEdge;
	this.returnWallSpriteLookup[SliceType.BACK] 	  = this.pool.returnBackEdge;
	this.returnWallSpriteLookup[SliceType.STEP] 	  = this.pool.returnStep;
	this.returnWallSpriteLookup[SliceType.DECORATION] = this.pool.returnDecoration;
	this.returnWallSpriteLookup[SliceType.WINDOW] 	  = this.pool.returnWindow;
};

Walls.prototype.borrowWallSprite = function(SliceType)
{
	return this.borrowWallSpriteLookup[SliceType].call(this.pool);
};

Walls.prototype.returnWallSprite = function(SliceType, SliceSprite)
{
	return this.returnWallSpriteLookup[SliceType].call(this.pool, SliceSprite);
};

Walls.prototype.slicesAreLow = function()
{
	//console.log("slices.length: " + this.slices.length);
	return this.slices.length < 100;
};