function Character ()
{
	PIXI.Container.call(this);
	
	this.pool = new CharacterSpritesPool();
	
	//Animation speed variables
	this.i = 0;
	this.lastTime = new Date().getTime();
	this.FRAMERATE = .03;
	this.frameTime = this.FRAMERATE;
	this.spriteReturned = false;
	
	/*window.addEventListener('keydown', this.addFrameRate.bind(this), false);
	
	Main.addEventListener('keydown', function(event)
	{
		if (event.keyCode == 107)
		{
			console.log(characterEvent);
			characterEvent.FRAMERATE += .01;
			console.log("+ pressed");
		}
	});
	*/
	
	
	//Implement event listener
	//this.addEventListener("onkeydown",this);
}

Character.constructor = Character;
Character.prototype = Object.create(PIXI.Container.prototype);

Character.prototype.addFrameRate = function()
{
	this.FRAMERATE -= .001;
};

Character.prototype.getSprite = function()
{
	if (this.spriteReturned == false)
	{
		if (this.i >= this.pool.runSprites.length)
		{
			//console.log("i set to 0");
			this.i = 0;
		}
		//Use a temp character so I can borrow and return that temp
		tempCharacter = this.pool.borrowRunSprites();
		//Increment this.i so we get the next sprite
		this.i++;
		
		//set this.character to tempCharacter sprite and set the positioning
		this.character = tempCharacter;
		this.character.scale.x = 0.25;
		this.character.scale.y = 0.25;
		this.character.position.y = 198;
		this.character.position.x = 205;
		
		//return the temp character to the pool
		this.pool.returnRunSprites(tempCharacter);
		this.frameTime = this.FRAMERATE;
		//return this.character to Main.js.update() for rendering
		this.spriteReturned = true;
		return this.character;		
	}
	
	this.currTime = new Date().getTime();
	this.delta = (this.currTime - this.lastTime) / 1000;
	this.frameTime -= this.delta;
	//console.log(this.frameTime - this.delta);
	if (this.frameTime <= 0)
	{
		//console.log("frameTime <= 0");
		if (this.i >= this.pool.runSprites.length)
		{
			//console.log("i set to 0");
			this.i = 0;
		}
		
		//Use a temp character so I can borrow and return that temp
		tempCharacter = this.pool.borrowRunSprites();
		//Increment this.i so we get the next sprite
		this.i++;
		
		//set this.character to tempCharacter sprite and set the positioning
		this.character = tempCharacter;
		this.character.scale.x = 0.25;
		this.character.scale.y = 0.25;
		this.character.position.y = 198;
		this.character.position.x = 205;
		
		//return the temp character to the pool
		this.pool.returnRunSprites(tempCharacter);
		this.frameTime = this.FRAMERATE;
		this.lastTime = this.currTime;
		//return this.character to Main.js.update() for rendering
		return this.character;
	}
	
	else
	{
		/*
		if (this.i >= this.pool.runSprites.length)
		{
			//console.log("i set to 0");
			this.i = 0;
		}
		//Use a temp character so I can borrow and return that temp
		tempCharacter = this.pool.borrowRunSprites();
		//Increment this.i so we get the next sprite
		this.i++;
		
		//set this.character to tempCharacter sprite and set the positioning
		this.character = tempCharacter;
		this.character.scale.x = 0.25;
		this.character.scale.y = 0.25;
		this.character.position.y = 198;
		this.character.position.x = 232;
		
		//return the temp character to the pool
		this.pool.returnRunSprites(tempCharacter);
		this.frameTime = this.FRAMERATE;
		//return this.character to Main.js.update() for rendering
		//this.spriteReturned = true;
		*/
		return this.character;		
	}
};
