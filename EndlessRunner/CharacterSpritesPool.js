function CharacterSpritesPool()
{
	this.createDead();
	this.createIdle();
	this.createJump();
	this.createRun();
	this.createSlide();
}

/*-----------------------------------Dead Sprites--------------------------------*/
CharacterSpritesPool.prototype.createDead = function()
{
	this.deadSprites = [];
	
	for (i = 0; i < 10; i++)
	{
		var resourceString = "resources/Dead__00" + i + ".png";
		
		var sprite = PIXI.Sprite.fromImage(resourceString);
		this.deadSprites.push(sprite);
	}
};

CharacterSpritesPool.prototype.borrowDeadSprites = function()
{
	return this.deadSprites.shift();
};

CharacterSpritesPool.prototype.returnDeadSprites = function(sprite)
{
	this.deadSprites.push(sprite);	
};

/*--------------------------------Idle Sprites--------------------------------*/
CharacterSpritesPool.prototype.createIdle = function()
{
	this.idleSprites = [];
	
	for (i = 0; i < 10; i++)
	{
		var resourceString = "resources/Idle__00" + i + ".png";
		
		var sprite = PIXI.Sprite.fromImage(resourceString);
		this.idleSprites.push(sprite);
	}
};

CharacterSpritesPool.prototype.borrowIdleSprites = function()
{
	return this.idleSprites.shift();
};

CharacterSpritesPool.prototype.returnIdleSprites = function(sprite)
{
	this.idleSprites.push(sprite);	
};

/*--------------------------------Jump Sprites--------------------------------*/
CharacterSpritesPool.prototype.createJump = function()
{
	this.jumpSprites = [];
	
	for (i = 0; i < 10; i++)
	{
		var resourceString = "resources/Jump__00" + i + ".png";
		
		var sprite = PIXI.Sprite.fromImage(resourceString);
		this.jumpSprites.push(sprite);
	}
};

CharacterSpritesPool.prototype.borrowJumpSprites = function()
{
	return this.jumpSprites.shift();
};

CharacterSpritesPool.prototype.returnJumpSprites = function(sprite)
{
	this.jumpSprites.push(sprite);	
};

/*------------------------------------Run Sprites--------------------------------*/
CharacterSpritesPool.prototype.createRun = function()
{
	this.runSprites = [];
	
	for (i = 0; i < 10; i++)
	{
		var resourceString = "resources/Run__00" + i + ".png";
		
		var sprite = PIXI.Sprite.fromImage(resourceString);
		this.runSprites.push(sprite);
	}
};

CharacterSpritesPool.prototype.borrowRunSprites = function()
{
	return this.runSprites.shift();
};

CharacterSpritesPool.prototype.returnRunSprites = function(sprite)
{
	this.runSprites.push(sprite);	
};

/*----------------------------------Slide Sprites--------------------------------*/
CharacterSpritesPool.prototype.createSlide = function()
{
	this.slideSprites = [];
	
	for (i = 0; i < 10; i++)
	{
		var resourceString = "resources/Slide__00" + i + ".png";
		
		var sprite = PIXI.Sprite.fromImage(resourceString);
		this.slideSprites.push(sprite);
	}
};

CharacterSpritesPool.prototype.borrowSlideSprites = function()
{
	return this.slideSprites.shift();
};

CharacterSpritesPool.prototype.returnSlideSprites = function(sprite)
{
	this.slideSprites.push(sprite);	
};
