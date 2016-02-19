function Main()
{
	this.stage = new PIXI.Container();
	this.renderer = PIXI.autoDetectRenderer (512, 384, {view:document.getElementById("game-canvas")}
											);
	this.loadSpriteSheet();
}

Main.SCROLL_SPEED = 1;

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
	
	var slice1 = PIXI.Sprite.fromFrame("edge_01");
	slice1.position.x = 32;
	slice1.position.y = 64;
	this.stage.addChild(slice1);
	
	var slice2 = new PIXI.Sprite.fromFrame("decoration_03");
	slice2.position.x = 96;
	slice2.position.y = 64;
	this.stage.addChild(slice2);
	
	//This is code that will generate an array of whatever texture is listed in .fromFrame
		/*	var slices = [];
			for (i = 0; i < 3; i++)
			{
				slices.push(new PIXI.Sprite.fromFrame("decoration_03"));
				slices[i].position.x = 160 + (i * 64);
				slices[i].position.y = 64;
				this.stage.addChild(slices[i]);
			}
		*/
};