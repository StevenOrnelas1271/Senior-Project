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

Character.prototype.getSprite = function(characterSpriteType)
{
	var type;
	var tempCharacter;
	
	switch (characterSpriteType)
	{
		case "Idle":
			type = "Idle";
			tempCharacter = this.pool.borrowIdleSprite();
			break;
		
		case "Jump":
			type = "Jump";
			tempCharacter = this.pool.borrowJumpSprite();
			break;
			
		case "Run":
			type = "Run";
			tempCharacter = this.pool.borrowRunSprite();
			break;
		
		case "Slide":
			type = "Slide";
			tempCharacter = this.pool.borrowSlideSprite();
			break;
	}
	
	if (this.spriteReturned == false)
	{
		//set this.character to tempCharacter sprite and set the positioning
		this.character = tempCharacter;
		this.character.scale.x = 0.25;
		this.character.scale.y = 0.25;
		this.character.position.y = 198;
		this.character.position.x = 205;
		
		//return the temp character to the pool
		this.pool.returnSprite(tempCharacter, type);
		
		this.frameTime = this.FRAMERATE;
		
		//return this.character to Main.js.update() for rendering
		this.spriteReturned = true;
		return this.character;		
	}
	
	this.currTime = new Date().getTime();
	this.delta = (this.currTime - this.lastTime) / 1000;
	this.frameTime -= this.delta;
	
	if (this.frameTime <= 0)
	{
		//set this.character to tempCharacter sprite and set the positioning
		this.character = tempCharacter;
		this.character.scale.x = 0.25;
		this.character.scale.y = 0.25;
		this.character.position.y = 198;
		this.character.position.x = 205;
		//console.log(this.character);
		
		//return the temp character to the pool
		
		this.frameTime = this.FRAMERATE;
		this.lastTime = this.currTime;
		
		this.pool.returnSprite(tempCharacter, type);
		//return this.character to Main.js.update() for rendering
		return this.character;
	}
	
	else
	{
		//console.log("else statement");
		
		//return unused sprite
		this.pool.returnSprite(tempCharacter, type);
		return this.character;		
	}
};
