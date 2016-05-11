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
	console.log("OLDCOLOR IN VALID MOVE: " + oldColor);
	switch (pieceType){
		
		case "pawn":
			//Check if the pawn is actually moving 1 spot instead of 2 when a piece is in front it
			if (checkPawn(piece, capture))
				moveValid = true;
			else
				moveValid = false;
			
			//in these cases we want to check if moving puts the king in check
			console.log("Old color: " + pieceColor);
			checkedKing = pieceUnderAttack(oldColor, kingButton);
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
			
			console.log("Queen calling kingChecked with color: " + oldColor);
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
	//If it is the pawns first move it can move 2 spots
	/*if (pieceType[pieceIndex].firstMove == true)
	{
		maxMovement = 2;
	}
	*/
	//If it's a black pawn moving down we need to subtract

	
	console.log("movement: " + (movement));
	console.log("First move: " + pieceType[currentPiece-1].firstMove);
	console.log("pieceRow: " + pieceRow);
	console.log("captureRow: " + captureRow);
	console.log("pieceColor: " + pieceColor);
	
		
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
	console.log("Movement before en passant: "+ movement);
	
	//En passant rules
	
	console.log("Rule 4: " + piece.rowNum + " " + movement);
	console.log("captureCol: " + captureCol);
	console.log("piece.col: " + piece.colNum);
	console.log("Rule 5: " + (piece.colNum + movement));
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
	
		
	console.log("New movement: " + movement);
	console.log("capture status: " + capture.status);
	if (capture.rowNum == pieceType[currentPiece-1].rowNum - movement && capture.colNum == pieceType[currentPiece-1].colNum - movement && capture.status == 0
	|| (capture.rowNum == pieceType[currentPiece-1].rowNum - movement && capture.colNum == pieceType[currentPiece-1].colNum + movement && capture.status == 0))
	{
		console.log("long rule: " );
		return false;
	}
	if (pieceRow == (captureRow - movement) && capture.status != pieceType[currentPiece-1].status)
	{
		console.log("cannot move there");
		return false;
	}

	
	if (pieceType[currentPiece-1].firstMove == true)
		pieceType[currentPiece-1].firstMove = false;
	
	if (Math.abs(movement) == 2)
	{
		pieceType[currentPiece-1].doubleMove = true;
		pieceType[currentPiece-1].doubleMoveTurn = moveCount;
	}
	
	console.log("currnetPiece.doubleMove: " + pieceType[currentPiece-1].doubleMove);
	console.log("Returning true in pawn");
	return true;
}

//Check if a piece is currently capturable
function pieceUnderAttack(pieceColor, piecePosition)
{	
	//In order to check if a king is in check, for most pieces we only need to check
	//the open spots near a king. If the only open spot by a king is 1 square above it
	//then we only need to check if a piece is attacking from there, while also checking
	//knights since they can jump pieces
	
	
	//pieceColor == white ? piecePosition = whitepiecePosition : piecePosition = blackpiecePosition;
	
	var nearbySquares;
	var capturable = [];
	var pieceIsKing = false;
	kingCheckedBy = [];
	
	console.log(piecePosition);
	if (buttons[piecePosition].type == 'king')
		pieceIsKing = true;
	//console.log(buttons[piecePosition].type);
	//pieceColor == white ? nearbySquares = findNearbySquares(whitepiecePosition) : nearbySquares = findNearbySquares(blackpiecePosition);
	nearbySquares = findNearbySquares(piecePosition);
	
	//Now that we have the empty squares around the king simply follow them
	var opponentColor;
	pieceColor == white ? opponentColor = black : opponentColor = white;
	console.log("pUA pieceColor: " + pieceColor);
	console.log("pUA opp color: " + opponentColor);
	//console.log("piecePosition: " + piecePosition);
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
				log("white king checked by a blackpawn, diag left up");
				capturable.push(true);
				capturable.push(pieceColor);
				
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
					
					log("bishop || queen");
					
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
					log("LEFT ROOK || QUEEN");
					capturable.push(true);
					pieceColor == white ? pieceColor = white : pieceColor = black;
					capturable.push(pieceColor);

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
				console.log("black king checked by a blackpawn, diag left down");
				console.log(buttons[nearbySquares[i][0]].status);
				capturable.push(true);
				capturable.push(pieceColor);
				
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
					log("bishop || queen");
					
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
				log("white king checked by a blackpawn, diag right up");
				capturable.push(true);
				capturable.push(pieceColor);
				
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
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[piecePosition].pieceColor != buttons[j].pieceColor)
				{
					log("LEFT ROOK || QUEEN");
					capturable.push(true);
					capturable.push(pieceColor);

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
}

function textUpdate(buttonSelected){
	var Col;
	if (typeof richText != "undefined") {
		stage.removeChild(richText);
	}
	var style = {
		font : 'bold 18px Arial',
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
	rText.x = 360;
	rText.y = yText;
	yText+= 16;
	richText.push(rText);
	stage.addChild(rText);	
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
	console.log(kingCheckedBy);
	savedKingCheckedBy = kingCheckedBy;
	//kingCheckedBy stores the piece type, position, and color of the piece that is attacking the king
	//From that spot we need to see if it's possible to either: block the attacking piece, capture it, or move the king
	
	var kingPosition;
	pieceColor == white ? kingPosition = whiteKingButton : kingPosition = blackKingButton;
	//set the opponentColor so we know what side the attacking piece is on
	var opponentColor;
	pieceColor == white ? opponentColor = black : opponentColor = white;
	console.log("Opponent Color: " + opponentColor);
	var subtractValue = 0;
	//kingCheckedBy[2] contains the direction the attacking piece is in relation to the king
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
			var knightSquares = [piecePosition-14, piecePosition-25, piecePosition-23, piecePosition-10,
								 piecePosition+14, piecePosition+25, piecePosition+23, piecePosition+10];
	}
	
	//First check if a piece can capture the attacking piece
	//savedKingCheckedBy[1] contains the position of the piece attacking the king
	var capturable = pieceUnderAttack(opponentColor, savedKingCheckedBy[1]);
	console.log("capturable returns: " + capturable[0] + "  " + capturable[1]);
	if (capturable[0] == true)
	{
		kingCapturable = pieceUnderAttack(pieceColor, savedKingCheckedBy[1]);
		
		//If taking the attacking piece does NOT result in putting yourself in check
		//return false to indicate checkmate is equal to false
		if (kingCapturable[0] == false)
			return false;
		else
			console.log("Piece is NOT capturable safely");
	}

	//If we are using the king as the starting point for our for loop just use piecePosition
	var i;
	//Or else use the position of the attacking piece stored in savedKingCheckedBy[1]
	scanStart == "King Piece" ? i = kingPosition : i = savedKingCheckedBy[1];
	scanStart == "King Piece" ? scanEnd = savedKingCheckedBy[1] : scanEnd = kingPosition;
	
	//-------------CAPTURABLE DONE---------------------//
	//-------------NEED SQUARES BLOCKABLE---------------//
	//-------------KING MOVABLE DONE----------//
	//-----------NEED MULTIPLE KingCheckedBy for each piece putting the king in check
	
	if (kingCanMove(pieceColor, kingPosition))
	{
		console.log("King can move out of check safely");
		return false;
	}
	else
	{
		console.log("King can NOT move out of check safely");
	}
	
	//By using subtractValue we will only check squares in between the king and the attacking piece
	for (i -= subtractValue; i > scanEnd; i -= subtractValue)
	{
		//i is now the first button in between the king and the attacking piece
		//for each square in between the king and the attacking piece check if the king can move a piece there
		console.log("square " + i + " in between king and attacking piece");
		
		//Call pieceUnderAttack with opponentColor to see if a piece of the opposite color can 
		//move to square i
		squareBlockable = pieceUnderAttack(opponentColor, i);
		if (squareBlockable[0] && !pieceUnderAttack(pieceColor, i))
		{
			console.log("King can move a piece to square " + i + " to get out of check");
			return false;
		}
		else
		{
			console.log("King cannot move a piece to block");
		}
		//From here we need to check if the king has a piece that can move to this square
	}
	return true;
}

function kingCanMove (pieceColor, kingPosition)
{
	var kingCapturable;
	var oldData = [];
	console.log("King can move color: " + pieceColor);
	console.log("*     *    *  position: " + kingPosition);
	oldData.push(buttons[kingPosition].status);
	oldData.push(buttons[kingPosition].pieceColor);
	oldData.push(buttons[kingPosition].type);
	
	//tempButton = tempButtonSetup (buttons[kingPosition], prevButton);
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

function buttonBlockable(pieceColor, buttonPosition)
{
	//call pieceUnderAttack with opposite color?
	//If I want to see if white can move a piece to buttonPosition - 1;
	//I should be able to call pieceUnderAttack(black) to use its logically
	//to see if a white piece can move to that square and it will return true
	//if possible
}