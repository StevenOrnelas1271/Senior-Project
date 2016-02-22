function Main()
{
	this.stage = new PIXI.Container();
	this.renderer = PIXI.autoDetectRenderer (512, 384, {view:document.getElementById("game-canvas")}
											);
	this.loadSpriteSheet();
}

//Static scrolling speed
Main.SCROLL_SPEED = 3;

//dynamic scrolling speed
/*Main.MIN_SCROLL_SPEED = 5;
Main.MAX_SCROLL_SPEED = 15;
Main.SCROLL_ACCELERATION = 0.005;
*/
Main.prototype.update = function()
{
	this.scroller.moveViewportXBy(Main.SCROLL_SPEED);
	this.renderer.render(this.stage);
	requestAnimationFrame(this.update.bind(this));
};

Main.prototype.loadSpriteSheet = function()
{
	//list every texture or json file to load
	var assetsToLoad = ['resources/wall.json', 'resources/bg-mid.png', 'resources/bg-far.png'];
	PIXI.loader
		.add(assetsToLoad)
		//once all the assets are loaded bind the stage to the spriteSheetLoaded function
		.once('complete', this.spriteSheetLoaded.bind(this)) 
		.load();
};

Main.prototype.spriteSheetLoaded = function()
{
	this.scroller = new Scroller(this.stage);
	requestAnimationFrame(this.update.bind(this));
	
	this.pool = new WallSpritesPool();
	this.wallSlices = [];
};

Main.prototype.generateTestWallSpan = function()
{
	var lookupTable = [
		this.pool.borrowFrontEdge,  //1st wall slice
		this.pool.borrowWindow,	    //2nd wall slice
		this.pool.borrowDecoration, //3rd wall slice
		this.pool.borrowStep,		//4th wall slice
		this.pool.borrowWindow,     //5th wall slice
		this.pool.borrowBackEdge	//6th wall slice
	];
	
	var yPos = [
		128, //1st slice
		128, //2nd slice
		128, //3rd slice
		192, //4th slice
		192, //5th slice
		192  //6th slice
	];
	
	for (i = 0; i < lookupTable.length; i++)
	{
		var func = lookupTable[i];
		
		//use the function in lookupTable[i] to borrow from the object pool
		var sprite = func.call(this.pool);
		
		sprite.position.x = 32 + (i*64);
		sprite.position.y = yPos[i];
		
		this.wallSlices.push(sprite);
		
		this.stage.addChild(sprite);
	}
};

Main.prototype.clearTestWallSpan = function()
{
	var lookupTable = [
		this.pool.returnFrontEdge,  //1st wall slice
		this.pool.returnWindow,	    //2nd wall slice
		this.pool.returnDecoration, //3rd wall slice
		this.pool.returnStep,		//4th wall slice
		this.pool.returnWindow,     //5th wall slice
		this.pool.returnBackEdge	//6th wall slice
	];
	
	for (i = 0; i < lookupTable.length; i++)
	{
		var func = lookupTable[i];
		var sprite = this.wallSlices[i];
		
		this.stage.removeChild(sprite);
		func.call(this.pool, sprite);
	}
	
	this.wallSlices = [];
};