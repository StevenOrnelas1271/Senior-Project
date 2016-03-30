function Character ()
{
	PIXI.Container.call(this);
	
	this.pool = new CharacterSpritesPool();
	
	//Animation speed variables
	this.i = 0;
	this.lastTime = new Date().getTime();
	this.FRAMERATE = .098;
	this.frameTime = this.FRAMERATE;
	this.spriteReturned = false;
	this.jumpYPositions = [198, 183, 168, 153, 138, 138, 153, 168, 183, 198];
	this.jumpCounter = 0;
}

Character.constructor = Character;
Character.prototype = Object.create(PIXI.Container.prototype);

Character.prototype.addFrameRate = function()
{
	this.FRAMERATE -= .001;
};

Character.prototype.getSprite = function(characterSpriteType, yPosition)
{
	var type;
	var tempCharacter;
	
	switch (characterSpriteType)
	{
		case "Idle":
			type = "Idle";
			tempCharacter = this.pool.borrowIdleSprite();
			this.FRAMERATE = 0.65;
			break;
		
		case "Jump":
			type = "Jump";
			tempCharacter = this.pool.borrowJumpSprite();
			this.FRAMERATE = 0.25;
			break;
			
		case "Run":
			type = "Run";
			tempCharacter = this.pool.borrowRunSprite();		
			this.FRAMERATE = .098;
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
		this.character.position.x = 205;
		this.character.position.y = yPosition;

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
		this.character.position.x = 205;
		
		if (type == "Slide")
		{
			//higher y pos = lower on the screen
			//lower position that normal so character appears to be sliding on the ground
			this.character.position.y = 225;
		}
		else if (type == "Jump")
		{
			if (this.jumpCounter > 9)
			{
				this.jumpCounter = 0;
			}
			
			//go through the array of y positions that give the sprite the illusion of jumping
			this.character.position.y = this.jumpYPositions[this.jumpCounter];
			this.jumpCounter++;
		}
		else 
		{
			//default y position
			this.character.position.y = yPosition;
		}
		
		this.frameTime = this.FRAMERATE;
		this.lastTime = this.currTime;
		
		//return the temp character to the pool
		this.pool.returnSprite(tempCharacter, type);
		if (this.jumpCounter > 9)
		{
			type = "Run";
		}
		//return this.character to Main.js.update() for rendering
		return this.character;
	}
	
	else
	{
		//console.log("else statement");
		
		//return unchanged sprite
		this.pool.returnSprite(tempCharacter, type);
		return this.character;		
	}
};
