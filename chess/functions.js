//Remove child function
		
function deletePiece(index) {
	stage.removeChild(pieces[index]);
}
		
function validMove(piece, capture, pieceType)
{	
	var pieceCol = piece.colNum;
	var pieceRow = piece.rowNum;			
	var captureCol = capture.colNum;
	var captureRow = capture.rowNum;
	var pieceColor = buttons[pieceCol * 12 + pieceRow].pieceColor;
	var oldColor = buttons[captureCol * 12 + captureRow].pieceColor;
	var moveValid = true;
			
	switch (pieceType){
		
		case "pawn":
			//Check if the pawn is actually moving 1 spot instead of 2 when a piece is in front it
			if (checkVertical(piece, capture))
				moveValid = true;
			else
				moveValid = false;
			
			checkedKing = kingChecked(oldColor);
			if (checkedKing[0] == true && checkedKing[1] == oldColor)
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
			checkedKing = kingChecked(oldColor);
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
			checkedKing = kingChecked(oldColor);
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
			
			console.log("Queen calling kingChecked with color: " + oldColor);
			checkedKing = kingChecked(oldColor);
			if (checkedKing[0] == true && checkedKing[1] == oldColor)
			{
				moveValid = false;
			}

			return moveValid;
			break;
			
		case "knight":
			checkedKing = kingChecked(oldColor);
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
			
			checkedKing = kingChecked(oldColor);
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
		
//Check if a king is in check
function kingChecked(pieceColor)
{	
	//In order to check if a king is in check, for most pieces we only need to check
	//the open spots near a king. If the only open spot by a king is 1 square above it
	//then we only need to check if a piece is attacking from there, while also checking
	//knights since they can jump pieces
	
	
	pieceColor == white ? kingButton = whiteKingButton : kingButton = blackKingButton;

	//var tempKingButton = tempButtonSetup(buttons[kingButton], prevKingButton);
	//temporaryClear(prevKingButton);
	var nearbySquares;
	var kingInCheck = [];
	pieceColor == white ? nearbySquares = findNearbySquares(whiteKingButton) : nearbySquares = findNearbySquares(blackKingButton);
	//Now that we have the empty squares around the king simply follow them


	console.log("kingbutton: " + kingButton);
	for (i = 0; i < nearbySquares.length; i++)
	{
		if (nearbySquares[i][1] == "Diagonal left up")
		{
			//If a pawn is on the square 1 diagonal left from the king then it can capture the king
			//Get the button position saved in the nearbySquares squares array and use that to check
			//The buttons array to see if the status is equal to a black pawn
			if (buttons[nearbySquares[i][0]].status >= (bp1) && buttons[nearbySquares[i][0]].status <= (bp8-1))
			{
				log("white king checked by a blackpawn, diag left up");
				kingInCheck.push(true);
				pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
				//restoreButton(tempButton, prevKingButton);
				return kingInCheck;
			}
			
			//14  is top left corner
			for (j = kingButton - 13; j > 0; j -= 13)
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
				
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[kingButton].pieceColor != buttons[j].pieceColor)
				//else
				{
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					log("bishop || queen");
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
			}
		}
				
		//The pieces that can capture from the left are: rook and queen
		if (nearbySquares[i][1] == "Left")
		{
			for (j = kingButton - 12; j > 0 ; j -= 12)
			{
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[kingButton].pieceColor != buttons[j].pieceColor)
				{
					log("LEFT ROOK || QUEEN");
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
			}
		}
		
		if (nearbySquares[i][1] == "Diagonal left down")
		{
			//If a pawn is on the square 1 diagonal left from the king then it can capture the king
			//Get the button position saved in the nearbySquares squares array and use that to check
			//The buttons array to see if the status is equal to a black pawn
			
			if (buttons[nearbySquares[i][0]].status >= (wp1) && buttons[nearbySquares[i][0]].status <= (wp8-1))
			{
				log("black king checked by a blackpawn, diag left down");
				kingInCheck.push(true);
				pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
				//restoreButton(tempButton, prevKingButton);
				return kingInCheck;
			}
			//At most 7 iterations of -= 11
			for (j = kingButton - 11; j > 0; j -= 11)
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
				
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[kingButton].pieceColor != buttons[j].pieceColor)
				//else
				{
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					log("bishop || queen");
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
			}
		}
		
		//The pieces that can capture up are: rook and queen
		if (nearbySquares[i][1] == "Up")
		{
			for (j = kingButton - 1; j > 0; j -= 1)
			{
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
		
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[kingButton].pieceColor != buttons[j].pieceColor)
				{
					log("UP ROOK || QUEEN");
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
			}
		}
		
		//The pieces that can capture down are: rook and queen
		if (nearbySquares[i][1] == "Down")
		{
			for (j = kingButton + 1; j < 105; j += 1)
			{
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[kingButton].pieceColor != buttons[j].pieceColor)
				{
					log("DOWN ROOK || QUEEN");
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
			}
		}
		
		if (nearbySquares[i][1] == "Diagonal right up")
		{
			if (buttons[nearbySquares[i][0]].status >= (bp1) && buttons[nearbySquares[i][0]].status <= (bp8-1))
			{
				log("white king checked by a blackpawn, diag right up");
				kingInCheck.push(true);
				pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
				//restoreButton(tempButton, prevKingButton);
				return kingInCheck;
			}

			for (j = kingButton + 11; j < 105; j += 11)
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
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[kingButton].pieceColor != buttons[j].pieceColor)
				{
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					log("DIAGRIGHT BISHOP || QUEEN");
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
			}			
		}

		if (nearbySquares[i][1] == "Right")
		{
			for (j = kingButton + 12; j < 105; j += 12)
			{
				if (buttons[j].pieceColor == pieceColor || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[kingButton].pieceColor != buttons[j].pieceColor)
				{
					log("LEFT ROOK || QUEEN");
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
			}
		}
		
		if (nearbySquares[i][1] == "Diagonal right down")
		{
			if (buttons[nearbySquares[i][0]].status >= (wp1) && buttons[nearbySquares[i][0]].status <= (wp8))
			{
				log("black king checked by a blackpawn, diag left down");
				kingInCheck.push(true);
				pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
				//restoreButton(tempButton, prevKingButton);
				return kingInCheck;
			}
			for (j = kingButton + 13; j < 105; j += 13)
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
				
				//If the first spot is occupied by an enemy pawn the king is checked
				if (j == kingButton + 13 && buttons[j].type == 'pawn' && buttons[kingButton].pieceColor != buttons[j].pieceColor)
				{
					console.log("checked by pawn");
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[kingButton].pieceColor != buttons[j].pieceColor)
				{
					kingInCheck.push(true);
					pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
					log("DIAGRIGHT BISHOP || QUEEN");
					//restoreButton(tempButton, prevKingButton);
					return kingInCheck;
				}
			}			
		}
	}

	var knightSquares = [kingButton-14, kingButton-25, kingButton-23, kingButton-10,
						 kingButton+14, kingButton+25, kingButton+23, kingButton+10];
						 
	for (i = 0; i < knightSquares.length; i++)
	{
		if (buttons[knightSquares[i]] === undefined)
			continue;
		if (buttons[knightSquares[i]].type == 'knight' && buttons[knightSquares[i]].pieceColor != pieceColor)
			{
			kingInCheck.push(true);
			pieceColor == white ? kingInCheck.push(white) : kingInCheck.push(black);
			log("CHECKED BYKNIGHT");
			//restoreButton(tempButton, prevKingButton);
			return kingInCheck;
		}
	}
	
	console.log("restoring button, king passed all checks");
	//restoreButton(tempKingButton, prevKingButton);
	kingInCheck[0] = (false);
	pieceColor == white ? kingInCheck[1] = black : kingInCheck[1] = white;
	return kingInCheck;
}
		
function findNearbySquares(kingPosition)
{
	var nearbySquares = [];
	var i = 0;
	
	//These checks work by checking where the king is GOING to move and finding what squares to check from there
	//The checks will see where the king is moving from and flag that square as empty
	
	//square 1 left 1 up
	if (buttons[kingPosition - 13].status == 0 || buttons[kingPosition-13].pieceColor != buttons[kingPosition].pieceColor
	    || ((kingPosition - 13) == prevKingButton))
	{	
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 13;
		nearbySquares[i][1] = "Diagonal left up";
		i++;
	}	
			
	//square 1 left of current piece
	if (buttons[kingPosition - 12].status == 0 || buttons[kingPosition-12].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition - 12) == prevKingButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 12;
		nearbySquares[i][1] = "Left";
		i++;
	}
	
	//square 1 left 1 down
	if (buttons[kingPosition - 11].status == 0 || buttons[kingPosition-11].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition - 11) == prevKingButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 11;
		nearbySquares[i][1] = "Diagonal left down";
		i++;
	}
	
	//square 1 above current piece
	if (buttons[kingPosition - 1].status == 0 || buttons[kingPosition-1].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition - 1) == prevKingButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 1;
		nearbySquares[i][1] = "Up";
		i++;
	}
	
	//square 1 below current piece
	if (buttons[kingPosition + 1].status == 0 || buttons[kingPosition+1].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition + 1) == prevKingButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 1;
		nearbySquares[i][1] = "Down";
		i++;
	}
	
	//square 1 right 1 up
	if (buttons[kingPosition + 11].status == 0 || buttons[kingPosition+11].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition + 11) == prevKingButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 11;
		nearbySquares[i][1] = "Diagonal right up";
		i++;
	}
	
	//square 1 right of current piece
	if (buttons[kingPosition + 12].status == 0 || buttons[kingPosition+12].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition + 12) == prevKingButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 12;
		nearbySquares[i][1] = "Right";
		i++;
	}

	//square 1 right 1 down
	if (buttons[kingPosition + 13].status == 0 || buttons[kingPosition+13].pieceColor != buttons[kingPosition].pieceColor
		|| ((kingPosition + 13) == prevKingButton))
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 13;
		nearbySquares[i][1] = "Diagonal right down";
		i++;
	}
	console.log(nearbySquares);
	return nearbySquares;
}

//print error messages for debugging
function log(msg) {
	console.log(msg);
}
		
function keyPressed (event)
{
	//if d is pressed
	if (event.keyCode == 68)
	{
		(debugMode == true) ? debugMode = false : debugMode = true;
		(debugMode == true) ? log("Debugging enabled, turns are disabled.") : log("Debugging disabled"); 
	}
	
	if (event.keyCoded == 81)
	{
		pieces[currentPiece-1].type = "queen";
		deletePiece(pieces[currentPiece-1].status-1);
		this.status = currentPiece;
		
		pieces[currentPiece-1] = new PIXI.Sprite(wQueenTexture);
		pieces[currentPiece-1].type = 'queen';
		pieces[currentPiece-1].anchor.x = 0.5;
		pieces[currentPiece-1].anchor.y = 0.5;
		pieces[currentPiece-1].pieceColor = white;
		
		stage.addChild(pieceType[currentPiece-1]);
		pieces.push(pieceType[currentPiece-1]);
	}
}
		
function updatePosition (buttonSelected)
{
	deletePiece(buttonSelected.status - 1);
	pieceMoved = true;
	buttonSelected.status = currentPiece;
	buttonSelected.type = pieces[currentPiece-1].type;
	buttons[currentPosition].status = 0;
	buttons[currentPosition].type = 'none';
	buttons[currentPosition].pieceColor = 2;
	pieces[currentPiece-1].firstMove = false;
	moveCount += 1;
}

function temporaryClear (oldPosition)
{
	console.log("CLEARING BUTTON AT POSITION: " + oldPosition);
	buttons[oldPosition].status = 0;
	buttons[oldPosition].type = 'none';
	buttons[oldPosition].pieceColor = 2;
}

function restoreButton (buttonData, position)
{
	console.log("RESTORING BUTTON AT POSITION: " + position);
	buttons[position].status = buttonData[0];
	buttons[position].type = buttonData[1];
	buttons[position].pieceColor = buttonData[2];
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

	return tempButton;
}