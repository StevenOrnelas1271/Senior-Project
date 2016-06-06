//Remove child function
	
function deletePiece(index) {
	stage.removeChild(pieces[index]);
}

function restorePiece (index) {
	console.log("Restoring piece: " + index );
	if (index < 0)
		return;
	stage.addChild(pieces[index]);
}

function validMove(piece, capture, pieceType)
{	
	var pieceCol = piece.colNum;
	var pieceRow = piece.rowNum;			
	var captureCol = capture.colNum;
	var captureRow = capture.rowNum;
	var pieceColor = buttons[pieceCol * 12 + pieceRow].pieceColor;
	var oldColor = buttons[captureCol * 12 + captureRow].pieceColor;
	var oldPosition = captureCol * 12 + captureRow;
	var moveValid = true;
			
	oldColor == white ? kingButton = whiteKingButton : kingButton = blackKingButton;

	switch (pieceType){
		
		case "pawn":
			//Check if the pawn is actually moving 1 spot instead of 2 when a piece is in front it
			if (checkPawn(piece, capture))
			{
				moveValid = true;
				//After the pawn function has decided that the pawn's move is valid
				//Go ahead and delete the previous button and assign the pawn to the new button
				
				//We need pieceColor? because all the other cases assume the move is valid and 
				//use oldColor, refering to the spot the piece is capturing
				//Since the pawn hasn't changed any button values we need to use the spot the pawn
				//was previously at to check the color
				pieceColor == white ? kingButton = whiteKingButton : kingButton = blackKingButton;
				tempButton = tempButtonSetup (capture, prevButton);
				temporaryClear(prevButton);
			}
			else
			{
				moveValid = false;
				return moveValid;
			}
			
			//in these cases we want to check if moving puts the king in check
			//console.log("Old color: " + pieceColor);
			checkedKing = pieceUnderAttack(pieceColor, kingButton);
			//console.log(checkedKing);
			if (checkedKing[0] == true && checkedKing[1] == pieceColor)
			{
				moveValid = false;
			}

			return moveValid;
			break;
			
		case "rook":
			//If it's not the same row then the piece is moving vertically
			if (pieceRow - captureRow != 0)
			{
				if (checkVertical(piece, capture))
					moveValid = true;
				else
					moveValid = false;
			} else {
				if (checkHorizontal(piece, capture))
					moveValid = true;
				else 
					moveValid = false;
			}
				
			//check if a king is in check, else return false
			checkedKing = pieceUnderAttack(oldColor, kingButton);
			if (checkedKing[0] == true && checkedKing[1] == oldColor)
			{
				moveValid = false;
			}

			return moveValid;
			break;

		case "bishop":
			if (checkDiagonal(piece, capture))
				moveValid = true;
			else
				moveValid = false;
			
			//for the purposes of testing if the king is in check, logically at this point the move is still validMove
			//so assuming the piece does move check if the king is in check with the new piece position
			//If the king that is being checked is of the same color as the piece being moved the move is invalid
			checkedKing = pieceUnderAttack(oldColor, kingButton);
			if (checkedKing[0] == true && checkedKing[1] == oldColor)
			{
				moveValid = false;
			}

			return moveValid;
			break;
					
		case "queen":
			//check horizontal squares if the queen is moving horizontally
			if (pieceRow - captureRow == 0)
			{
				if (checkHorizontal(piece, capture))
					moveValid = true;
				else
					moveValid = false
			}
					
			//check vertical squares if the queen is moving vertically
			else if (pieceCol - captureCol == 0)
			{
				if (checkVertical(piece, capture))
					moveValid = true;
				else 
					moveValid = false;			
			}
					
			//check diagonal squares if the queen is moving diagonally
			else
			{
				if (checkDiagonal(piece, capture))
					moveValid = true;
				else
					moveValid = false;
			}
			
			//before checking if the king is in check assume the move is valid for now
			
			//console.log("Queen calling kingChecked with color: " + oldColor);
			checkedKing = pieceUnderAttack(oldColor, kingButton);
			if (checkedKing[0] == true && checkedKing[1] == oldColor)
			{
				moveValid = false;
			}

			return moveValid;
			break;
			
		case "knight":
			checkedKing = pieceUnderAttack(oldColor, kingButton);
			if (checkedKing[0] == true && checkedKing[1] == oldColor)
			{
				moveValid = false;
			}

			return moveValid;
			break;
			
		case "king":
			//check horizontal squares when castling
			if (pieceRow - captureRow == 0)
			{
				if (checkHorizontal(piece, capture))
					moveValid = true;
				else
					moveValid = false;
			}
			
			checkedKing = pieceUnderAttack(oldColor, kingButton);
			if (checkedKing[0] == true && checkedKing[1] == oldColor)
			{
				moveValid = false;
			}

			return moveValid;
			break;
	}
}
		
		
function checkHorizontal (piece, capture)
{
	var pieceCol = piece.colNum;
	var pieceRow = piece.rowNum;			
	var captureCol = capture.colNum;
	var startCol;
	var endCol;
	var buttonPosition;
	
	if (pieceCol > captureCol)
	{
		startCol = captureCol;
		endCol = pieceCol;
	} else {
		startCol = pieceCol;
		endCol = captureCol;
	}
	
	for (var i = startCol + 1; i < endCol; i++)
	{
		//calculate starting button position to check
		buttonPosition = (i * 12) + pieceRow;
		
		if (buttons[buttonPosition].status != 0)
		{
			return false;
		}
	}

	return true;
}
		
function checkVertical (piece, capture)
{
	var pieceRow = piece.rowNum;
	var pieceCol = piece.colNum;
	var captureRow = capture.rowNum;
	var startRow;
	var endRow;
	var buttonPosition;
	
	if ((pieceRow - captureRow) > 0)
	{
		startRow = captureRow;
		endRow = pieceRow;
	} else {
		startRow = pieceRow;
		endRow = captureRow;
	}
	
	//scan only the squares in between the pieces, not the squares the pieces occupy
	for (var i = startRow; i < endRow - 1; i++)
	{
		//calculate starting button position to check
		buttonPosition = (pieceCol * 12) + i + 1;
		
		if (buttons[buttonPosition].status != 0)
		{
			return false;
		}
	}
	
	return true;
}
		
function checkDiagonal (piece, capture)
{
	var pieceRow = piece.rowNum;
	var pieceCol = piece.colNum;
	var captureRow = capture.rowNum;
	var captureCol = capture.colNum;
	var startRow;
	var endRow;
	var startCol;
	var endCol;
	var buttonPosition;
	var horizontalMovement;
	var verticalMovement;
	
	//the bishop is capturing a square to the left
	if (pieceCol - captureCol > 0)
	{					
		horizontalMovement = "left";
		startCol = captureCol;
		endCol = pieceCol;						
		startRow = captureRow;
	} else {
		//the bishop is capturing a square to the right
		horizontalMovement = "right";
		startCol = pieceCol;
		endCol = captureCol;
		startRow = pieceRow;
	}
		

	//the bishop is capturing a square upwards

	if (pieceRow - captureRow > 0)
	{
		verticalMovement = "up";
	} else {
		verticalMovement = "down";
	}
			
	//begin j at the starting row for scanning
	var j = startRow;
	for (var i = startCol + 1; i < endCol; i++)
	{	
		//because j represents the row currently being checked and the scanner works by going left to right, top to bottom,
		//j needs to decremented to check the square 1 up
		if ((horizontalMovement == "left" && verticalMovement == "down") ||
			(horizontalMovement == "right" && verticalMovement == "up"))
			j--;
		//in all other cases the scanner will look 1 square right and 1 square down
		//so j needs to be incremented instead of decremented
		else
			j++;
			
		buttonPosition = (i*12) + j;		
		if (buttons[buttonPosition].status != 0)
		{
			return false;
		}
	}
	return true;
}

function checkPawn (piece, capture)
{
	var pieceRow = piece.rowNum;
	var pieceCol = piece.colNum;
	var captureRow = capture.rowNum;
	var captureCol = capture.colNum;
	var pieceIndex = piece.status - 1;
	var movement = pieceRow - captureRow;
	var pieceColor = buttons[pieceCol * 12 + pieceRow].pieceColor;
	var currentPosition = pieceCol * 12 + pieceRow;
	var nextPosition = captureCol * 12 + captureRow;

	if (pieceColor == white && movement < 0)
	{
		console.log("White pawn tried moving backwards");
		return false;
	}
	
	if (pieceColor == black && movement > 0)
	{
		console.log("black pawn tried moving backwards");
		return false;
	}
	
	//If movement passes the first check get the abs value of movement for math reasons
	if (pieceColor == black)
	{
		
		movement = Math.abs(movement);
	}
	
	if (movement > 2 || Math.abs(pieceCol - captureCol) > 1)
	{
		console.log("Returning false in pawn");
		return false;
	}
	
	if (pieceRow == captureRow)
		return false;
	
	if (movement == 2 && pieceType[currentPiece-1].firstMove == false)
		return false;
	
	//Check if there is a piece in between the pawns double move
	if (movement == 2)
	{
		checkPosition = captureCol * 12 +  captureRow;
		pieceColor == black ? checkPosition -= 1 : checkPosition += 1;
		
		if (buttons[checkPosition].status != 0)
			return false;
	}

	movement = Math.abs(movement);
	
	//En passant rules
	
	if (typeof pieceType[buttons[currentPosition-12].status - 1] != "undefined")
	{
		console.log("Rule 6: " + moveCount + " - " + pieceType[buttons[currentPosition-12].status - 1].doubleMoveTurn);
	}
	if ((pieceType[currentPiece-1].rowNum == 5
	||  pieceType[currentPiece-1].rowNum == 6)	
	&& buttons[currentPosition-12].type  == 'pawn'
	|| buttons[currentPosition+12].type  == 'pawn'
	)
	{
		if(buttons[currentPosition-12].type == 'pawn')
		{
			
			//if (pieceColor == white)
			{
				if (pieceType[buttons[currentPosition-12].status - 1].doubleMove == true
				&& captureRow == pieceRow - movement && captureCol == pieceCol - movement
				&& buttons[currentPosition-12].pieceColor != pieceColor
				&& ((moveCount - (pieceType[buttons[currentPosition-12].status - 1].doubleMoveTurn)) == 1))
				{
					console.log("currentPosition-12 color" + buttons[currentPosition-12].pieceColor);
					console.log("first if ");
					deletePiece(buttons[currentPosition-12].status -1);
					return true;
				}
			}
		
			//else
			{
				if (pieceType[buttons[currentPosition-12].status - 1].doubleMove == true
				&& captureRow == pieceRow + movement && captureCol == pieceCol - movement
				&& buttons[currentPosition-12].pieceColor != pieceColor
				&& ((moveCount - (pieceType[buttons[currentPosition-12].status - 1].doubleMoveTurn)) == 1))
				{
					deletePiece(buttons[currentPosition-12].status - 1);
					console.log("second if ");
					return true;
				}
			}
			
		}
		
		if (buttons[currentPosition+12].type == 'pawn')
		{
			//if (pieceColor == white)
			{
				if (pieceType[buttons[currentPosition+12].status - 1].doubleMove == true
					&& captureRow == pieceRow - movement && captureCol == pieceCol + movement
					&& buttons[currentPosition+12].pieceColor != pieceColor
					&& ((moveCount - (pieceType[buttons[currentPosition+12].status - 1].doubleMoveTurn)) == 1))
					{
						console.log("third if ");
						deletePiece(buttons[currentPosition+12].status-1);
						return true;
					}
			}
			
			//else 
			{
				if (pieceType[buttons[currentPosition+12].status - 1].doubleMove == true
				&& captureRow == pieceRow + movement && captureCol == pieceCol + movement
				&& buttons[currentPosition+12].pieceColor != pieceColor
				&& ((moveCount - (pieceType[buttons[currentPosition+12].status - 1].doubleMoveTurn)) == 1))
				{
					deletePiece(buttons[currentPosition+12].status-1);
					console.log("fourth if ");
					return true;
				}
			}
		}	
		console.log("487");
	}
		
	//If color is black we need movement negative to move down the board
	if (pieceColor == black)
		movement = -(movement);
	
	//Disallow moving 1 diag left or right if no piece to capture
	if (Math.abs(captureCol - pieceCol) == 1)
	{
		console.log("Pawn capture color: " + capture.pieceColor);
		console.log("Piece color: " + pieceColor);
		if (capture.status == 0 || capture.pieceColor == pieceColor)
		{
			console.log("NO DIAG MOVEMENT ALLOWED!");
			return false;
		}
	}
	if (pieceType[currentPiece-1].firstMove == true)
		pieceType[currentPiece-1].firstMove = false;
	
	if (Math.abs(movement) == 2)
	{
		pieceType[currentPiece-1].doubleMove = true;
		pieceType[currentPiece-1].doubleMoveTurn = moveCount;
	}
	
	//If the pawn is moving up or down 1 row in the same column 
	if (Math.abs(pieceRow - captureRow) == 1 && pieceCol == captureCol)
	{
		if (capture.status != 0)
		{
			console.log("Can't move up");
			return false;			
		}
	}
	
	
	if (pieceColor == white && captureRow == 2)
	{
		console.log("upgrading pawn");
		deletePiece(pieces[pieceIndex].status-1);	
		pieces[pieceIndex] = new PIXI.Sprite(wQueenTexture);
		pieces[pieceIndex].type = 'queen';
		pieces[pieceIndex].scale.x = 1.25;
		pieces[pieceIndex].scale.y = 1.25;								
		pieces[pieceIndex].anchor.x = 0.5;
		pieces[pieceIndex].anchor.y = 0.75;
		pieces[pieceIndex].pieceColor = white;
		pieces[pieceIndex].rowNum = pieceRow;
		pieces[pieceIndex].colNum = pieceCol;
		
		stage.addChild (pieceType[pieceIndex]);
								//pieces.push(pieceType[pieceIndex]);
								//console.log(pieces);
	
	}

	if (pieceColor == black && captureRow == 9)
	{
		deletePiece(pieces[pieceIndex].status-1);
		this.status = currentPiece;
		
		pieces[pieceIndex] = new PIXI.Sprite(bQueenTexture);
		pieces[pieceIndex].type = 'queen';
		pieces[pieceIndex].scale.x = 1.25;
		pieces[pieceIndex].scale.y = 1.25;								
		pieces[pieceIndex].anchor.x = 0.5;
		pieces[pieceIndex].anchor.y = 0.75;
		pieces[pieceIndex].pieceColor = black;
		pieces[pieceIndex].rowNum = pieceRow;
		pieces[pieceIndex].colNum = pieceCol;

		
		stage.addChild (pieceType[pieceIndex]);
		//pieces.push(pieceType[pieceIndex]);	
	}									
	console.log("Returning true in pawn");
	return true;
}

//Check if a piece is currently capturable
function pieceUnderAttack(pieceColor, piecePosition)
{	
	var nearbySquares;
	var capturable = [];
	var pieceIsKing = false;
	kingCheckedBy = [];
	
	//Find out if the piece we are checking is a king to save data in case the king is actually in check
	if (buttons[piecePosition].type == 'king')
		pieceIsKing = true;
	
	nearbySquares = findNearbySquares(piecePosition);
	
	//Now that we have the empty squares around the king simply follow them
	var opponentColor;
	pieceColor == white ? opponentColor = black : opponentColor = white;
	//console.log("pUA pieceColor: " + pieceColor);
	//console.log("pUA opp color: " + opponentColor);
	for (i = 0; i < nearbySquares.length; i++)
	{
		//console.log(buttons[nearbySquares[i][0]].status);
		if (nearbySquares[i][1] == "Diagonal left up")
		{
			//If a pawn is on the square 1 diagonal left from the king then it can capture the king
			//Get the button position saved in the nearbySquares squares array and use that to check
			//The buttons array to see if the status is equal to a black pawn
			if (buttons[nearbySquares[i][0]].status >= (bp1) && buttons[nearbySquares[i][0]].status <= (bp8) && pieceColor == white)
			{
				log("Attacked by blackpawn, diag left up");
				capturable.push(true);
				capturable.push(pieceColor);
				capturable.push(piecePosition);
				if (pieceIsKing)
				{
					kingCheckedBy.push("pawn");					
					kingCheckedBy.push(nearbySquares[i][0]);
					kingCheckedBy.push(nearbySquares[i][1]);
				}
				
				return capturable;
			}

			//14  is top left corner
			for (j = piecePosition - 13; j > 0; j -= 13)
			{
				if (buttons[nearbySquares[i][0]].status == wKing && pieceColor != white
		 		 || buttons[nearbySquares[i][0]].status == bKing && pieceColor != black)
				{
					console.log("King up left");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					capturable.push('king');
					if (pieceIsKing)
					{
						kingCheckedBy.push("king");
						kingCheckedBy.push(j);
						kingCheckedBy.push("Left");
					}
					
					return capturable;
				}
				
				//If the first piece diagonal to the left is the same color then it is blocking the king from being checked
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'bishop' && buttons[j].type != 'queen')
				{
					break;
				}
				
				
				
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				//else
				{
					capturable.push(true);
					pieceColor == white ? pieceColor = white : pieceColor = black;
					capturable.push(pieceColor);
					capturable.push(j);
					log("Attacked by bishop || queen, diagonal left up");
					
					if (pieceIsKing)
					{
						buttons[j].type == 'bishop' ? type = 'bishop' : type = 'queen';
						kingCheckedBy.push(type);
						kingCheckedBy.push(j);
						kingCheckedBy.push("Diagonal left up");
					}
					
					return capturable;
				}
			}
		}
				
		//The pieces that can capture from the left are: rook and queen
		if (nearbySquares[i][1] == "Left")
		{
			//Disallow a king from moving next to a king
			for (j = piecePosition - 12; j > 0 ; j -= 12)
			{
				if (buttons[nearbySquares[i][0]].status == wKing && pieceColor != white
		 		 || buttons[nearbySquares[i][0]].status == bKing && pieceColor != black)
				{
					console.log("King left");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					capturable.push('king');
					if (pieceIsKing)
					{
						kingCheckedBy.push("king");
						kingCheckedBy.push(j);
						kingCheckedBy.push("Left");
					}
					
					return capturable;
				}
				
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					console.log("Left 1 break");
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					console.log("left 2 break");
					break;
				}
				
				
				
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				{
					log("Attacked by Rook || Queen, left");
					capturable.push(true);
					pieceColor == white ? pieceColor = white : pieceColor = black;
					capturable.push(pieceColor);
					capturable.push(j);
					if(pieceIsKing)
					{						
						buttons[j].type == 'rook' ? type = 'rook' : type = 'queen';
						kingCheckedBy.push(type);
						kingCheckedBy.push(j);
						kingCheckedBy.push("Left");
					}
					
					return capturable;
				}
			}
		}
		
		if (nearbySquares[i][1] == "Diagonal left down")
		{
			//If a pawn is on the square 1 diagonal left from the king then it can capture the king
			//Get the button position saved in the nearbySquares squares array and use that to check
			//The buttons array to see if the status is equal to a black pawn
			
			if (buttons[nearbySquares[i][0]].status >= (wp1) && buttons[nearbySquares[i][0]].status <= (wp8) && pieceColor == black)
			{
				console.log("Attacked by white pawn, diag left down");
				//console.log(buttons[nearbySquares[i][0]].status);
				capturable.push(true);
				capturable.push(pieceColor);
				capturable.push(piecePosition);
				if (pieceIsKing)
				{
					kingCheckedBy.push("pawn");
					kingCheckedBy.push(nearbySquares[i][0]);
					kingCheckedBy.push(nearbySquares[i][1]);
				}
				
				return capturable;
			}
			
			//At most 7 iterations of -= 11
			for (j = piecePosition - 11; j > 0; j -= 11)
			{
				if (buttons[nearbySquares[i][0]].status == wKing && pieceColor != white
		 		 || buttons[nearbySquares[i][0]].status == bKing && pieceColor != black)
				{
					console.log("King down left");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					capturable.push('king');
					if (pieceIsKing)
					{
						kingCheckedBy.push("king");
						kingCheckedBy.push(j);
						kingCheckedBy.push("Left");
					}
					
					return capturable;
				}
				
				//If the first piece diagonal to the left is the same color then it is blocking the king from being checked
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'bishop' && buttons[j].type != 'queen')
				{
					break;
				}
				
				
				
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				//else
				{
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					log("Attacked by Bishop || Queen, diag left down");
					
					if (pieceIsKing)
					{
						buttons[j].type == 'bishop' ? type = 'bishop' : type = 'queen';
						kingCheckedBy.push(type);
						kingCheckedBy.push(j);
						kingCheckedBy.push("Diagonal left down");
					}
					
					return capturable;
				}
			}
		}
		
		//The pieces that can capture up are: rook and queen
		if (nearbySquares[i][1] == "Up")
		{			
			for (j = piecePosition - 1; j > 0; j -= 1)
			{
				if (buttons[nearbySquares[i][0]].status == wKing && pieceColor != white
		 		 || buttons[nearbySquares[i][0]].status == bKing && pieceColor != black)
				{
					console.log("King up");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					capturable.push('king');
					if (pieceIsKing)
					{
						kingCheckedBy.push("king");
						kingCheckedBy.push(j);
						kingCheckedBy.push("Left");
					}
					
					return capturable;
				}
				
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
		
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}

				
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				{
					log("UP ROOK || QUEEN");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					if (pieceIsKing)
					{
						buttons[j].type == 'rook' ? type = 'rook' : type = 'queen';
						kingCheckedBy.push(type);
						kingCheckedBy.push(j);
						kingCheckedBy.push("Up");
					}
					
					return capturable;
				}
			}
		}
		
		//The pieces that can capture down are: rook and queen
		if (nearbySquares[i][1] == "Down")
		{
			for (j = piecePosition + 1; j < 105; j += 1)
			{
				if (buttons[nearbySquares[i][0]].status == wKing && pieceColor != white
		 		 || buttons[nearbySquares[i][0]].status == bKing && pieceColor != black)
				{
					console.log("King down");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					capturable.push('king');
					if (pieceIsKing)
					{
						kingCheckedBy.push("king");
						kingCheckedBy.push(j);
						kingCheckedBy.push("Down");
					}
					
					return capturable;
				}

				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				

				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				{
					log("DOWN ROOK || QUEEN");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					if (pieceIsKing)
					{
						buttons[j].type == 'rook' ? type = 'rook' : type = 'queen';
						kingCheckedBy.push(type);
						kingCheckedBy.push(j);
						kingCheckedBy.push("Down");
					}
					return capturable;
				}
			}
		}
		
		if (nearbySquares[i][1] == "Diagonal right up")
		{
			
			if (buttons[nearbySquares[i][0]].status >= (bp1) && buttons[nearbySquares[i][0]].status <= (bp8) && pieceColor == white)
			{
				log("white piece attacked by a blackpawn, diag right up");
				capturable.push(true);
				capturable.push(pieceColor);
				capturable.push(nearbySquares[i][0]);
				if (pieceIsKing)
				{
					kingCheckedBy.push("pawn");					
					kingCheckedBy.push(nearbySquares[i][0]);
					kingCheckedBy.push(nearbySquares[i][1]);
				}
				return capturable;
			}

			for (j = piecePosition + 11; j < 105; j += 11)
			{
				if (buttons[nearbySquares[i][0]].status == wKing && pieceColor != white
		 		 || buttons[nearbySquares[i][0]].status == bKing && pieceColor != black)
				{
					console.log("King diag right up");
					capturable.push(true);
					capturable.push(pieceColor);
					
					capturable.push(j);
					if (pieceIsKing)
					{
						kingCheckedBy.push("king");
						kingCheckedBy.push(j);
						kingCheckedBy.push("Diagonal right up");
					}
					
					return capturable;
				}

				//If the first piece diagonal to the left is the same color then it is blocking the king from being checked
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'bishop' && buttons[j].type != 'queen')
				{
					break;
				}
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				{
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					log("DIAGRIGHT BISHOP || QUEEN");
					
					if (pieceIsKing)
					{
						buttons[j].type == 'bishop' ? type = 'bishop' : type = 'queen';
						kingCheckedBy.push(type);
						kingCheckedBy.push(j);
						kingCheckedBy.push("Diagonal right up");
					}
					return capturable;
				}
			}			
		}

		if (nearbySquares[i][1] == "Right")
		{
			for (j = piecePosition + 12; j < 105; j += 12)
			{
				if (buttons[nearbySquares[i][0]].status == wKing && pieceColor != white
		 		 || buttons[nearbySquares[i][0]].status == bKing && pieceColor != black)
				{
					console.log("King right");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					capturable.push('king');
					if (pieceIsKing)
					{
						kingCheckedBy.push("king");
						kingCheckedBy.push(j);
						kingCheckedBy.push("Right");
					}
					
					return capturable;
				}
				
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					console.log("Right 1 break");
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					console.log("Right 2 break");
					break;
				}
				
				
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				{
					log("LEFT ROOK || QUEEN");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					if (pieceIsKing)
					{						
						buttons[j].type == 'rook' ? type = 'rook' : type = 'queen';
						kingCheckedBy.push(type);
						kingCheckedBy.push(j);
						kingCheckedBy.push("Right");
					}
					
					return capturable;
				}
			}
		}
		
		if (nearbySquares[i][1] == "Diagonal right down")
		{
			if (buttons[nearbySquares[i][0]].status >= (wp1) && buttons[nearbySquares[i][0]].status <= (wp8) && pieceColor == black)
			{
				log("black king checked by a blackpawn, diag right down");
				capturable.push(true);
				capturable.push(pieceColor);
				capturable.push(piecePosition);
				if (pieceIsKing)
				{
					kingCheckedBy.push('pawn');
					kingCheckedBy.push(nearbySquares[i][0]);
					kingCheckedBy.push(nearbySquares[i][1]);
				}
				return capturable;
			}
			for (j = piecePosition + 13; j < 105; j += 13)
			{
				//If the first piece diagonal to the left is the same color then it is blocking the king from being checked
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'bishop' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if (buttons[nearbySquares[i][0]].status == wKing && pieceColor != white
		 		 || buttons[nearbySquares[i][0]].status == bKing && pieceColor != black)
				{
					console.log("King down right");
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					capturable.push('king');
					if (pieceIsKing)
					{
						kingCheckedBy.push("king");
						kingCheckedBy.push(j);
						kingCheckedBy.push("Diagonal right down");
					}
					
					return capturable;
				}
				
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				{
					capturable.push(true);
					capturable.push(pieceColor);
					capturable.push(j);
					log("DIAGRIGHT BISHOP || QUEEN");
					
					if (pieceIsKing)
					{
						buttons[j].type == 'bishop' ? type = 'bishop' : type = 'queen';
						kingCheckedBy.push(type);
						kingCheckedBy.push(j);
						kingCheckedBy.push("Diagonal right down");
					}
					return capturable;
				}
			}			
		}
	}

	var knightSquares = [piecePosition-14, piecePosition-25, piecePosition-23, piecePosition-10,
						 piecePosition+14, piecePosition+25, piecePosition+23, piecePosition+10];
						 
	for (i = 0; i < knightSquares.length; i++)
	{
		if (buttons[knightSquares[i]] === undefined)
			continue;
		if (buttons[knightSquares[i]].type == 'knight' && buttons[knightSquares[i]].pieceColor != pieceColor)
		{
			capturable.push(true);
			log("CHECKED BY KNIGHT");
			capturable.push(pieceColor);
			capturable.push(j);		
			if (pieceIsKing)
			{
				kingCheckedBy.push('knight');
				kingCheckedBy.push(knightSquares[i]);
				kingCheckedBy.push("Knight");
			}
			return capturable;
		}
	}
	
	//console.log("restoring button, king passed all checks");
	capturable[0] = (false);
	pieceColor == white ? capturable[1] = black : capturable[1] = white;
	return capturable;
}
		
function findNearbySquares(kingPosition)
{
	console.log("Nearby squares position: " + kingPosition);
	var nearbySquares = [];
	var i = 0;
	
	//These checks work by checking where the king is GOING to move and finding what squares to check from there
	//The checks will see where the king is moving from and flag that square as empty
	
	//square 1 left 1 up
	if (!(buttons[kingPosition - 13] === undefined))
	{
	if (buttons[kingPosition - 13].status == 0 || buttons[kingPosition-13].pieceColor != buttons[kingPosition].pieceColor
	    || ((kingPosition - 13) == prevButton))
	{	
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 13;
		nearbySquares[i][1] = "Diagonal left up";
		i++;
	}	
	}		
	//square 1 left of current piece
	if (buttons[kingPosition - 12].status == 0 || buttons[kingPosition-12].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition - 12) == prevButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 12;
		nearbySquares[i][1] = "Left";
		i++;
	}
	
	//square 1 left 1 down
	if (buttons[kingPosition - 11].status == 0 || buttons[kingPosition-11].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition - 11) == prevButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 11;
		nearbySquares[i][1] = "Diagonal left down";
		i++;
	}
	
	//square 1 above current piece
	if (buttons[kingPosition - 1].status == 0 || buttons[kingPosition-1].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition - 1) == prevButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 1;
		nearbySquares[i][1] = "Up";
		i++;
	}
	
	//square 1 below current piece
	if (buttons[kingPosition + 1].status == 0 || buttons[kingPosition+1].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition + 1) == prevButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 1;
		nearbySquares[i][1] = "Down";
		i++;
	}
	
	//square 1 right 1 up
	if (buttons[kingPosition + 11].status == 0 || buttons[kingPosition+11].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition + 11) == prevButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 11;
		nearbySquares[i][1] = "Diagonal right up";
		i++;
	}
	
	//square 1 right of current piece
	if (buttons[kingPosition + 12].status == 0 || buttons[kingPosition+12].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition + 12) == prevButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 12;
		nearbySquares[i][1] = "Right";
		i++;
	}

	//square 1 right 1 down
	if (buttons[kingPosition + 13].status == 0 || buttons[kingPosition+13].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition + 13) == prevButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 13;
		nearbySquares[i][1] = "Diagonal right down";
		i++;
	}
	//console.log(nearbySquares);
	return nearbySquares;
}

//print error messages for debugging
function log(msg) {
	//console.log(msg);
}
		
function keyPressed (event)
{	
	//if d is pressed
	if (event.keyCode == 68)
	{
		(debugMode == true) ? debugMode = false : debugMode = true;
		(debugMode == true) ? log("Debugging enabled, turns are disabled.") : log("Debugging disabled"); 
	}
	// if 'q' is pressed
	if (event.keyCode == 81)
	{
		pieces[currentPiece-1].type = 'queen';
		deletePiece(pieces[currentPiece-1].status-1);
		this.status = currentPiece;
		
		pieces[currentPiece-1] = new PIXI.Sprite(wQueenTexture);
		pieces[currentPiece-1].type = 'queen';
		pieces[currentPiece-1].anchor.x = 0.5;
		pieces[currentPiece-1].anchor.y = 0.75;
		pieces[currentPiece-1].pieceColor = white;
		
		stage.addChild(pieceType[currentPiece-1]);
		pieces.push(pieceType[currentPiece-1]);
	}
	//if 'r' is pressed
	//rotate the game board
	var xShift = 480, yShift = 576;
	if (event.keyCode == 82){
		if (boardRotate == false){
			stage.rotation += Math.PI;
			stage.position.x += xShift;
			stage.position.y += yShift;
			boardRotate = true;
			//rotate game pieces
			for (var i = 0; i < numPieces; i++){
				pieces[i].rotation += Math.PI;
			}
			//rotate grid markers
			for (var i = 0; i < 16; i++){
				gridMarks[i].rotation += Math.PI;
			}
			return;
		}
		if (boardRotate == true){
			stage.rotation += Math.PI;
			stage.position.x -= xShift;
			stage.position.y -= yShift;
			boardRotate = false;
			for (var i = 0; i < numPieces; i++){
				pieces[i].rotation += Math.PI;
			}
			for (var i = 0; i < 16; i++){
				gridMarks[i].rotation += Math.PI;
			}
		}
	}
	
	if (event.keyCode == 46)
	{
		var pos = pieces[currentPiece-1].colNum*12 + pieces[currentPiece-1].rowNum;
		temporaryClear(pos);
		deletePiece(pieces[currentPiece-1].status-1);
		currentPiece = 0;
	}
}

function boardRotation(){
	//rotate the game board
	var xShift = 480, yShift = 576;
	//if (event.keyCode == 82){
		if (boardRotate == false){
			stage.rotation += Math.PI;
			stage.position.x += xShift;
			stage.position.y += yShift;
			boardRotate = true;
			//rotate game pieces
			for (var i = 0; i < numPieces; i++){
				pieces[i].rotation += Math.PI;
			}
			//rotate grid markers
			for (var i = 0; i < 16; i++){
				gridMarks[i].rotation += Math.PI;
			}
			return;
		}
		if (boardRotate == true){
			stage.rotation += Math.PI;
			stage.position.x -= xShift;
			stage.position.y -= yShift;
			boardRotate = false;
			for (var i = 0; i < numPieces; i++){
				pieces[i].rotation += Math.PI;
			}
			for (var i = 0; i < 16; i++){
				gridMarks[i].rotation += Math.PI;
			}
		}
	//}
	
}

function quitGame(){
	return 0;
}
		
function updatePosition (buttonSelected, prevButton)
{
	pieceMoved = true;
	buttonSelected.status = currentPiece;
	buttonSelected.type = pieces[currentPiece-1].type;
	buttons[prevButton].status = 0;
	buttons[prevButton].type = 'none';
	buttons[prevButton].pieceColor = 2;
	pieces[currentPiece-1].firstMove = false;
	moveCount += 1;
	textUpdate(buttonSelected);
	turnUpdate();
}

function textUpdate(buttonSelected){
	if (richText.length > 15)
	{
		UIstage.removeChild(richText[0]);
		richText.shift();
		
		for (var i = 0; i < richText.length; i++)
		{
			richText[i].position.y -= 16;
		}
		
		//yText = 248;
		//Don't know why but it works :)
		yText -= 16;
	}
	
	var Col;
	if (typeof richText != "undefined") {
		stage.removeChild(richText);
	}
	
	var style = {
		font : 'bold 16px Arial',
		fill : '#F7EDCA',
		stroke : '#4a1850',
		strokeThickness : 2,
		dropShadow : false,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : 6,
		wordWrap : true,
		wordWrapWidth : 440
	};
	if (pieces[currentPiece-1].pieceColor == 0){
		color = "White";
	}
	else{
		color = "Black";
	}
	if (pieces[currentPiece-1].colNum == 1){Col1 = 'A';}
	if (pieces[currentPiece-1].colNum == 2){Col1 = 'B';}
	if (pieces[currentPiece-1].colNum == 3){Col1 = 'C';}
	if (pieces[currentPiece-1].colNum == 4){Col1 = 'D';}
	if (pieces[currentPiece-1].colNum == 5){Col1 = 'E';}
	if (pieces[currentPiece-1].colNum == 6){Col1 = 'F';}
	if (pieces[currentPiece-1].colNum == 7){Col1 = 'G';}
	if (pieces[currentPiece-1].colNum == 8){Col1 = 'H';}
	
	if (buttonSelected.colNum == 1){Col2 = 'A';}
	if (buttonSelected.colNum == 2){Col2 = 'B';}
	if (buttonSelected.colNum == 3){Col2 = 'C';}
	if (buttonSelected.colNum == 4){Col2 = 'D';}
	if (buttonSelected.colNum == 5){Col2 = 'E';}
	if (buttonSelected.colNum == 6){Col2 = 'F';}
	if (buttonSelected.colNum == 7){Col2 = 'G';}
	if (buttonSelected.colNum == 8){Col2 = 'H';}
	
	rText = new PIXI.Text(color  + ' '  + pieces[currentPiece-1].type
								+ ' '   + Col1 + (10-pieces[currentPiece-1].rowNum)
								+' to ' + Col2 +	(10-buttonSelected.rowNum),style);
	rText.x = 8;
	rText.y = yText;
	yText+= 16;
	richText.push(rText);
	UIstage.addChild(rText);
	
}

function turnUpdate(){
	if (turnText.length >= 1){
		UIstage.removeChild(turnText[0]);
		turnText.shift();
	}
	var teamColor;
	var style = {
		font : 'bold 20px Arial',
		fill : '#F7EDCA',
		stroke : '#4a1850',
		strokeThickness : 2,
		dropShadow : true,
		dropShadowColor : '#00000b',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : 6,
		wordWrap : true,
		wordWrapWidth : 440
	};
	if (playerTurn == 1 || moveCount == 0) {
		teamColor = "WHITE";
		p1Icon.alpha = 1;
		p2Icon.alpha = 0;
		}
	if (playerTurn == 0 && moveCount != 0) {
		teamColor = "BLACK";
		p1Icon.alpha = 0;
		p2Icon.alpha = 1;
		}
	//Player turn update
	tText = new PIXI.Text( teamColor + "'s Move",style);
	tText.x = UIscalex/2;
	tText.y = UIscaley-UIscaley/2.5;
	tText.anchor.x = 0.5;
	turnText.push(tText);
	UIstage.addChild(tText);
}

function Timer()
	{		
		// Property: Frequency of elapse event of the timer in millisecond
		this.Interval = 1000;
		
		// Property: Whether the timer is enable or not
		this.Enable = new Boolean(false);
		
		// Event: Timer tick
		this.Tick;
		
		// Member variable: Hold interval id of the timer
		var timerId = 0;
		
		// Member variable: Hold instance of this class
		var thisObject;
		
		// Function: Start the timer
		this.Start = function(playerTurn)
		{
			this.Enable = new Boolean(true);
	
			thisObject = this;
			if (thisObject.Enable)
			{
				thisObject.timerId = setInterval(
				function()
				{
					thisObject.Tick(playerTurn); 
				}, thisObject.Interval);
			}
		};
		
		// Function: Stops the timer
		this.Stop = function()
		{	
			thisObject = this;
			thisObject.Enable = new Boolean(false);
			clearInterval(thisObject.timerId);
		};
	
	};
	
function timer_tick(playerTurn)
{
	if (playerTurn == 0)
	{
		console.log("Decrementing white seconds");
		secondsW  -= 1;
	}

	if (playerTurn == 1)
	{
		secondsB  -= 1;
	}
	//document.getElementById("div1").innerHTML =index;
	//timerUpdate();

	if (minutesW <= 0 && secondsW <= 0)
	{
		timerUpdate();
		this.Stop();
		gameOverScreen(black);
		return;
	}
		
	if (minutesB <= 0 && secondsB <= 0)
	{
		timerUpdate();
		this.Stop();
		gameOverScreen(white);
		return;
	}
	
	if (secondsW < 1) 
	{
		secondsW = 59;
		minutesW--;
	}

	if (secondsB < 1)
	{
		secondsB = 59;
		minutesB--;
	}
		
	timerUpdate();
}
	
function timerUpdate()
{
	var style = {
		font : 'bold 20px Arial',
		fill : '#F7EDCA',
		stroke : '#4a1850',
		strokeThickness : 4,
		dropShadow : true,
		dropShadowColor : '#00000c',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : 6,
		wordWrap : true,
		wordWrapWidth : 440
	};

	//Player timer update
	//seconds
	if (playerTurn == 0)
	{
		if (secondsW < 10){
			wtText = new PIXI.Text( minutesW + ":0" +secondsW,style);
		}
		else{
			wtText = new PIXI.Text( minutesW + ":" +secondsW,style);
		}
		wtText.x = UIscalex/3;
		wtText.y = UIscaley-UIscaley/4;
		wtText.anchor.x = 0.5;
		timerTextW.push(wtText);
		UIstage.addChild(wtText);
	}
	if (playerTurn == 1 || moveCount == 0)
	{
		if (secondsB < 10){
			btText = new PIXI.Text( minutesB + ":0" + secondsB,style);
		}
		else{
			btText = new PIXI.Text( minutesB + ":" + secondsB,style);
		}
		btText.x = UIscalex -UIscalex/3;
		btText.y = UIscaley-UIscaley/4;
		btText.anchor.x = 0.5;
		timerTextB.push(btText);
		UIstage.addChild(btText);
	}
	
	//minutes
	
	if (timerTextW.length > 1){
		UIstage.removeChild(timerTextW[0]);
		timerTextW.shift();
	}
	if (timerTextB.length > 1){
		UIstage.removeChild(timerTextB[0]);
		timerTextB.shift();
	}
		
}

function addCoordinateMarkers(){


	//Gridspace indicators	
	var markerStyle = {
		font : 'bold 18px Calibri',
		fill : '#F7EDCA',
		stroke : '#000000',
		strokeThickness : 5,
		dropShadow : true,
		dropShadowColor :'#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : 6,
		wordWrap : true,
		wordWrapWidth : 440
	};
	// Lettered Rows
	gridMark = new PIXI.Text('A',markerStyle);
	gridMark.x = buttons[22].position.x;
	gridMark.y = buttons[22].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('B',markerStyle);
	gridMark.x = buttons[34].position.x;
	gridMark.y = buttons[34].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
		
	var gridMark = new PIXI.Text('C',markerStyle);
	gridMark.x = buttons[46].position.x;
	gridMark.y = buttons[46].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('D',markerStyle);
	gridMark.x = buttons[58].position.x;
	gridMark.y = buttons[58].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('E',markerStyle);
	gridMark.x = buttons[70].position.x;
	gridMark.y = buttons[70].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('F',markerStyle);
	gridMark.x = buttons[82].position.x;
	gridMark.y = buttons[82].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('G',markerStyle);
	gridMark.x = buttons[94].position.x;
	gridMark.y = buttons[94].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('H',markerStyle);
	gridMark.x = buttons[106].position.x;
	gridMark.y = buttons[106].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	//Numbered Columns
	var gridMark = new PIXI.Text('1',markerStyle);
	gridMark.x = buttons[9].position.x;
	gridMark.y = buttons[9].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('2',markerStyle);
	gridMark.x = buttons[8].position.x;
	gridMark.y = buttons[8].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('3',markerStyle);
	gridMark.x = buttons[7].position.x;
	gridMark.y = buttons[7].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('4',markerStyle);
	gridMark.x = buttons[6].position.x;
	gridMark.y = buttons[6].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('5',markerStyle);
	gridMark.x = buttons[5].position.x;
	gridMark.y = buttons[5].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('6',markerStyle);
	gridMark.x = buttons[4].position.x;
	gridMark.y = buttons[4].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('7',markerStyle);
	gridMark.x = buttons[3].position.x;
	gridMark.y = buttons[3].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
	
	var gridMark = new PIXI.Text('8',markerStyle);
	gridMark.x = buttons[2].position.x;
	gridMark.y = buttons[2].position.y;
	gridMark.anchor.set(0.5);
	gridMarks.push(gridMark);
	stage.addChild(gridMark);
}

function checkText (color, enemyColor, check)
{
	if (richText.length > 15)
	{
		UIstage.removeChild(richText[0]);
		richText.shift();
		
		for (var i = 0; i < richText.length; i++)
		{
			richText[i].position.y -= 16;
		}
		
		//yText = 248;
		yText -= 16;
	}
	var style = {
		font : 'bold 16px Arial',
		fill : '#F7EDCA',
		stroke : '#4a1850',
		strokeThickness : 2,
		dropShadow : false,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : 6,
		wordWrap : true,
		wordWrapWidth : 440
	};
	
	if (color == white)
	{
		if (check == 'Checkmate')
			rText = new PIXI.Text('White has checkmated Black!', style);	
		else
			rText = new PIXI.Text('White has put Black in check!', style);
	}
	else
	{
		if (check == 'Checkmate')
			rText = new PIXI.Text('Black has checkmated White!', style);	
		else
			rText = new PIXI.Text('Black has put White in check!', style);
	}

	rText.x = 8;
	rText.y = yText;
	yText+= 16;
	richText.push(rText);
	UIstage.addChild(rText);
}
	
function temporaryClear (oldPosition)
{
	console.log("CLEARING BUTTON AT POSITION: " + oldPosition);
	buttons[oldPosition].status = 0;
	buttons[oldPosition].type = 'none';
	buttons[oldPosition].pieceColor = 2;
}

//Restore button restores buttons to what they were before an invalid move
//oldPosition is where the piece WAS and newPosition is where the piece TRIED to move
function restoreButton (buttonData, oldPosition)
{
	console.log("RESTORING BUTTON AT POSITION: " + oldPosition);
	buttons[oldPosition].status = buttonData[0];
	buttons[oldPosition].type = buttonData[1];
	buttons[oldPosition].pieceColor = buttonData[2];
	
	console.log("Restored data:" );
	console.log(buttons[oldPosition]);
}

//Piece is the button the piece is moving to, prevButton is where that piece was
function tempButtonSetup (piece, prevButton)
{
	var nextButton = piece.gridNum;
	var tempButton = [];
	tempButton.push(buttons[prevButton].status);
	tempButton.push(buttons[prevButton].type);
	tempButton.push(buttons[prevButton].pieceColor);
	
	if (pieceType[currentPiece-1].pieceColor == white)
	{
		buttons[nextButton].pieceColor = white;
	}
	else
	{
		buttons[nextButton].pieceColor = black;
	}	

	buttons[nextButton].status = buttons[prevButton].status;
	return tempButton;
}

function checkmate (pieceColor)
{
	pieceColor == white ? nearbySquares = findNearbySquares(whiteKingButton) : nearbySquares = findNearbySquares(blackKingButton);
	//console.log(kingCheckedBy);
	
	//We need to save the current kingCheckedBy data because subsequent calls to the pieceUnderAttack function
	//will overwrite kingCheckedBy
	savedKingCheckedBy = kingCheckedBy;
	//kingCheckedBy stores the piece type, position, and color of the piece that is attacking the king
	//From that spot we need to see if it's possible to either: block the attacking piece, capture it, or move the king
	
	//savedKingCheckedBy[0] = the piece that is attacking the king
	//savedKingCheckedBy[1] = the button that piece is on
	//savedKingCheckedBy[2] = the direction that piece is attacking rom
	
	var kingPosition;
	pieceColor == white ? kingPosition = whiteKingButton : kingPosition = blackKingButton;
	
	console.log("kingPosition: " + kingPosition);
	//set the opponentColor so we know what side the attacking piece is on
	var opponentColor;
	pieceColor == white ? opponentColor = black : opponentColor = white;
	
	var subtractValue = 0;
	var scanStart;
	
	switch(savedKingCheckedBy[2])
	{
		case "Diagonal left up":
			subtractValue = 13
			scanStart = "King Piece";
			break;
			
		case "Left":
			subtractValue = 12;
			scanStart = "King Piece";
			break;
			
		case "Diagonal left down":
			subtractValue = 11;
			scanStart = "King Piece";
			break;
			
		case "Up":
			subtractValue = 1;
			scanStart = "King Piece";
			break;
		
		case "Down":
			subtractValue = 1;
			scanStart = "Attacking Piece";
			break;
			
		case "Diagonal right up":
			subtractValue = 11;
			scanStart = "Attacking Piece";
			break;
			
		case "Right":
			subtractValue = 12;
			scanStart = "Attacking Piece";
			break;
			
		case "Diagonal right down":
			subtractValue = 13;
			scanStart = "Attacking Piece";
			break;
		
		case "Knight":
			var knightSquares = [savedKingCheckedBy[1]-14, savedKingCheckedBy[1]-25, savedKingCheckedBy[1]-23, savedKingCheckedBy[1]-10,
								 savedKingCheckedBy[1]+14, savedKingCheckedBy[1]+25, savedKingCheckedBy[1]+23, savedKingCheckedBy[1]+10];
	}
	
	//console.log("ScanStart = " + scanStart);
	//console.log("Subtract Value = " + subtractValue);
	
	//First check if a piece can capture the attacking piece
	//savedKingCheckedBy[1] contains the position of the piece attacking the king
	
	//var capturable = pieceUnderAttack(pieceColor, savedKingCheckedBy[1]);
	var capturable = pieceUnderAttack(opponentColor, savedKingCheckedBy[1]);
	console.log("capturable returns: " + capturable[0] + "  " + capturable[1] + " " + capturable[2]);
	if (capturable[0] == true)
	{
		//If taking the attacking piece does NOT result in putting yourself in check
		
		var tempButton = [];
		//squareBlockable[2] contains the spot of the piece we want to move now
		var prevButton = capturable[2];
		var attackingButton = savedKingCheckedBy[1];
		var tempAttackingButton = [];
		tempAttackingButton.push(buttons[attackingButton].status);
		tempAttackingButton.push(buttons[attackingButton].type);
		tempAttackingButton.push(buttons[attackingButton].pieceColor);
		
		//Save the data of the spot you were at
		tempButton = tempButtonSetup(buttons[attackingButton], prevButton);
		
		buttons[attackingButton].status = buttons[prevButton].status;
		buttons[attackingButton].type = buttons[prevButton].type;
		buttons[attackingButton].pieceColor = buttons[prevButton].pieceColor;
		
		kingCapturable = pieceUnderAttack(pieceColor, savedKingCheckedBy[1]);
		console.log(kingCapturable);
		console.log(tempButton);
		console.log(tempAttackingButton);
		//return false to indicate checkmate is equal to false
		if (kingCapturable[0] == false)
		{
			console.log("Piece capturable safely");
			restoreButton(tempButton, prevButton);
			restoreButton(tempAttackingButton, attackingButton);
			//restoreButton(tempAttackingButton, attackingButton);
			return false;
		}
		else
		{
			console.log("Piece is NOT capturable safely");
			restoreButton(tempAttackingButton, attackingButton);
			restoreButton(tempButton, prevButton);
		}
	}

	//If we are using the king as the starting point for our for loop just use piecePosition
	var i;
	//Or else use the position of the attacking piece stored in savedKingCheckedBy[1]
	scanStart == "King Piece" ? i = kingPosition : i = savedKingCheckedBy[1];
	scanStart == "King Piece" ? scanEnd = savedKingCheckedBy[1] : scanEnd = kingPosition;
	
	if (kingCanMove(pieceColor, kingPosition))
	{
		console.log("King can move out of check safely");
		return false;
	}
	else
	{
		console.log("King can NOT move out of check safely");
	}
	
	if (savedKingCheckedBy[2] != "Knight")
	{
	//By using subtractValue we will only check squares in between the king and the attacking piece
	for (i -= subtractValue; i >= scanEnd; i -= subtractValue)
	{
		//i is now the first button in between the king and the attacking piece
		//for each square in between the king and the attacking piece check if the king can move a piece there
		console.log("square " + i + " in between king and attacking piece. Color: " + opponentColor);
		
		//Call pieceUnderAttack with pieceColor to see if a piece can move to square i
		squareBlockable = pieceUnderAttack(opponentColor, i);
		console.log(squareBlockable);
		//Since pieceUnderAttack only checks a pieces capture rules it would never allow a pawn
		//to simply move up 1 to block a piece from attacking
		//So instead do that check here
		if (buttons[i+1].pieceColor == white && buttons[i+1].type == 'pawn'
		 || buttons[i-1].pieceColor == black && buttons[i-1].type == 'pawn')
		{
			console.log("Pawn can move to square " + i + " to get out of check");
			return false;
		}
			
		if (buttons[i-13].pieceColor == pieceColor && buttons[i-13].type == 'pawn'
	     || buttons[i+13].pieceColor == pieceColor && buttons[i+13].type == 'pawn'
		 || buttons[i-11].pieceColor == pieceColor && buttons[i-11].type == 'pawn'
		 || buttons[i+11].pieceColor == pieceColor && buttons[i+11].type == 'pawn'
		 )
			continue;
		
		//pieceUnderAttack will also think a pawn can move diagonally to block
		//so discard this move if a player tries it
		
		
		//if (squareBlockable[0] && !pieceUnderAttack(pieceColor, kingPosition))
		console.log("In blockable squareBlockable[2]: " + squareBlockable[2]);
		var test = squareBlockable[2];
		
		if (squareBlockable[0])
		{
			if (squareBlockable[3] == 'king')
				return true;
			//Now check if we do move the  piece to block, does it put us in check again?
				//First save the data at the current position we are moving from
			var tempButton = [];
			//squareBlockable[2] contains the spot of the piece we want to move now
			var prevButton = squareBlockable[2];
			
			console.log(i);
			
			//buttons[i].status = tempButton.status;
			tempButton = tempButtonSetup(buttons[i], prevButton);
			//Then clear the button where the piece was to see if moving it will put the king in check
			if (buttons[prevButton].type != 'king')
				temporaryClear(prevButton);
			if (pieceUnderAttack(pieceColor, kingPosition))
			{
				//Restore the button after checking
				restoreButton(tempButton, prevButton);
				temporaryClear(i);
				console.log("King can move a piece to square " + i + " to get out of check");
				
				return false;
			}
			restoreButton(tempButton, prevButton);
		}
		else
		{
			console.log("King cannot move a piece to block");
		}

	}
	}
	
	
	return true;
}

function kingCanMove (pieceColor, kingPosition)
{
	var kingCapturable;
	var oldData = [];
	oldData.push(buttons[kingPosition].status);
	oldData.push(buttons[kingPosition].pieceColor);
	oldData.push(buttons[kingPosition].type);
	
	console.log(kingPosition);
	temporaryClear(kingPosition);
	
	//can king move diag left up
	if (buttons[kingPosition-13].status == 0 )
	{
		kingCapturable = pieceUnderAttack(pieceColor, kingPosition - 13);
		if (kingCapturable[0] == false)
		{
			restoreButton(oldData, kingPosition);
			return true;
		}
	}
	
	//can king move left
	if (buttons[kingPosition-12].status == 0)
	{
		kingCapturable = pieceUnderAttack(pieceColor, kingPosition - 12);
		if (kingCapturable[0] == false)
		{
			restoreButton(oldData, kingPosition);
			return true;
		}
	}
	
	//can king move diag left down
	if (buttons[kingPosition-11].status == 0)
	{
		kingCapturable = pieceUnderAttack(pieceColor, kingPosition - 11);
		if (kingCapturable[0] == false)
		{
			restoreButton(oldData, kingPosition);
			return true;
		}
	}
	//can king move up
	if (buttons[kingPosition-1].status == 0)
	{
		kingCapturable = pieceUnderAttack(pieceColor, kingPosition - 1);
		if (kingCapturable[0] == false)
		{
			restoreButton(oldData, kingPosition);
			return true;
		}
	}
	
	//can king move down 
	if (buttons[kingPosition+1].status == 0)
	{
		kingCapturable = pieceUnderAttack(pieceColor, kingPosition + 1);
		if (kingCapturable[0] == false)
		{
			restoreButton(oldData, kingPosition);
			return true;
		}
	}
	//can king move diag right up
	if (buttons[kingPosition+11].status == 0)
	{
		kingCapturable = pieceUnderAttack(pieceColor, kingPosition + 11);
		if (kingCapturable[0] == false)
		{
			restoreButton(oldData, kingPosition);
			return true;
		}
	}
	//can king move right
	if (buttons[kingPosition+12].status == 0)
	{
		kingCapturable = pieceUnderAttack(pieceColor, kingPosition + 12);
		if (kingCapturable[0] == false)
		{
			restoreButton(oldData, kingPosition);
			return true;
		}
	}
	//can king move diag right down
	if (buttons[kingPosition+13].status == 0)
	{
		kingCapturable = pieceUnderAttack(pieceColor, kingPosition + 13);
		if (kingCapturable[0] == false)
		{
			restoreButton(oldData, kingPosition);
			return true;
		}
	}
	
	//If the king cannot move restore it
	restoreButton(oldData, kingPosition);
	return false;
}


function gameOverScreen (color)
{
	if (turnText.length >= 1){
		UIstage.removeChild(turnText[0]);
		turnText.shift();
	}
	
	var style = {
		font : 'bold 20px Arial',
		fill : '#F7EDCA',
		stroke : '#4a1850',
		strokeThickness : 2,
		dropShadow : true,
		dropShadowColor : '#00000b',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : 6,
		wordWrap : true,
		wordWrapWidth : 440
	};
	
	if (color == 0) {
		teamColor = "White";
		p1Icon.alpha = 1;
		p2Icon.alpha = 0;
		}
	if (color == 1) {
		teamColor = "Black";
		p1Icon.alpha = 0;
		p2Icon.alpha = 1;
		}
	//Player turn update
	tText = new PIXI.Text( teamColor + " wins!",style);
	tText.x = UIscalex/2;
	tText.y = UIscaley-UIscaley/2.5;
	tText.anchor.x = 0.5;
	turnText.push(tText);
	UIstage.addChild(tText);
	
	bTimer.Stop();
	wTimer.Stop();
	
}