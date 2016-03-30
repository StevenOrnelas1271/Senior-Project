function Main()
{
	this.stage = new PIXI.Container();
	this.renderer = PIXI.autoDetectRenderer (512, 384, {view:document.getElementById("game-canvas")}
											);
	this.loadSpriteSheet();
	this.i = 0;
	this.characterSpriteType = "Idle"
	this.jumpCounter = 0;
	this.slideCounter = 0;
	
	window.addEventListener('keydown', this.keyPressed.bind(this), false);
}

//Static scrolling speed
//fast scrolling = 7
Main.SCROLL_SPEED = 5;

//dynamic scrolling speed
/*
Main.MIN_SCROLL_SPEED = 5;
Main.MAX_SCROLL_SPEED = 15;
Main.SCROLL_ACCELERATION = 0.005;
*/

Main.prototype.keyPressed = function (event)
{
	//if space bar is pressed
	if (event.keyCode == 32)
	{
		this.characterSpriteType = "Jump";
	}
	
	//Right arrow key pressed
	if (event.keyCode == 39)
	{
		this.characterSpriteType = "Run";
	}
	
	//Down arrow key pressed
	if (event.keyCode == 40)
	{
		this.characterSpriteType = "Slide";
	}
	
	//P key pressed for pause
	if (event.keyCode == 80)
	{
		this.characterSpriteType = "Idle";
	}
	
	if (event.keyCode == 107)
	{
		this.character.FRAMERATE -= .001;
		console.log(this.character.FRAMERATE);
	}
	
	if (event.keyCode == 109)
	{
		this.character.FRAMERATE += .001;
		console.log(this.character.FRAMERATE);
	}
	
};

Main.prototype.update = function()
{
	if (this.characterSpriteType == "Idle")
	{
		this.sprite = this.character.getSprite(this.characterSpriteType, 205);
		this.scroller.moveViewportXBy(0);
	}
	else
	{
		//this.characterYPosition = this.scroller.getWallYPosition();
		this.scroller.moveViewportXBy(Main.SCROLL_SPEED);
		
		//hard coded for now, will be dynamic later
		//this.sprite = this.character.getSprite(this.characterSpriteType, this.characterYPosition);
		this.sprite = this.character.getSprite(this.characterSpriteType, 205);
	
		// if character is jumping and we actually got a new jump sprite increment sprite counter
		if (this.characterSpriteType == "Jump" && this.oldSprite != this.sprite)
		{
			this.jumpCounter++;
		}
		// if counter exceeds number of jump sprites reset to 0 and set character to running
		if (this.jumpCounter > 9)
		{
			this.characterSpriteType = "Run";
			this.jumpCounter = 0;
		}
		
		//same concept as jump but for sliding
		if (this.characterSpriteType == "Slide" && this.oldSprite != this.sprite)
		{
			this.slideCounter++;
		}
		
		if (this.slideCounter > 9)
		{
			this.characterSpriteType = "Run";
			this.slideCounter = 0;
		}
		//used to compare if the sprite has changed since last update
		this.oldSprite = this.sprite;
	}
	
	//Get a new character sprite and add it to the stage to render
	this.stage.addChild(this.sprite);
	this.renderer.render(this.stage);
	//As soon as the sprite has been rendered remove it from the stage so it doesn't stick around
	this.stage.removeChild(this.sprite);
	
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
	
	this.character = new Character();
	this.characterSprites = [];
};