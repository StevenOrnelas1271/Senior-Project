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

CharacterSpritesPool.prototype.borrowDeadSprite = function()
{
	return this.deadSprites.shift();
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

CharacterSpritesPool.prototype.borrowIdleSprite = function()
{
	return this.idleSprites.shift();
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

CharacterSpritesPool.prototype.borrowJumpSprite = function()
{
	return this.jumpSprites.shift();
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

CharacterSpritesPool.prototype.borrowRunSprite = function()
{
	return this.runSprites.shift();
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

CharacterSpritesPool.prototype.borrowSlideSprite = function()
{
	return this.slideSprites.shift();
};

/*---------------------------------Return Sprites-------------------------------*/
CharacterSpritesPool.prototype.returnSprite = function(sprite, spriteType)
{
	switch (spriteType)
	{
		case "Dead":
			this.deadSprites.push(sprite);	
			break;
			
		case "Idle":
			this.idleSprites.push(sprite);
			break;
			
		case "Jump":
			this.jumpSprites.push(sprite);
			break;
			
		case "Run":
			this.runSprites.push(sprite);
			break;
			
		case "Slide":
			this.slideSprites.push(sprite);
			break;
	}
};