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
	var moveValid = true;
			
	switch (pieceType){
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
			checkedKing = kingChecked();
			if (checkedKing[0] == true && checkedKing[1] == pieceColor)
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
			checkedKing = kingChecked();
			//If the king that is being checked is of the same color as the piece being moved the move is invalid
			if (checkedKing[0] == true && checkedKing[1] == pieceColor)
			{
				moveValid = false;
			}
			
			log(checkedKing);
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
			
			checkedKing = kingChecked();
			if (checkedKing[0] == true && checkedKing[1] == pieceColor)
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
			
			checkedKing = kingChecked();
			log(checkedKing);
			if (checkedKing[0] == true && checkedKing[1] == pieceColor)
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
function kingChecked()
{	
	//In order to check if a king is in check, for most pieces we only need to check
	//the open spots near a king. If the only open spot by a king is 1 square above it
	//then we only need to check if a piece is attacking from there, while also checking
	//knights since they can jump pieces
	var whiteKingNearbySquares = findNearbySquares(whiteKingButton);
	var blackKingNearbySquares = findNearbySquares(blackKingButton);
	
	//So we need to check from that spot if it puts a king in check
	log(whiteKingButton);
	log(blackKingButton);
	var kingInCheck = [];

	//Now that we have the empty squares around the king simply follow them

	for (i = 0; i < whiteKingNearbySquares.length; i++)
	{
		if (whiteKingNearbySquares[i][1] == "Diagonal left up")
		{
			console.log("checking diagonal left up");
			//If a pawn is on the square 1 diagonal left from the king then it can capture the king
			//Get the button position saved in the whiteKingNearbySquares squares array and use that to check
			//The buttons array to see if the status is equal to a black pawn
			if (buttons[whiteKingNearbySquares[i][0]].status >= (bp1) && buttons[whiteKingNearbySquares[i][0]].status <= (bp8-1))
			{
				log("white king checked by a blackpawn, diag left up");
				kingInCheck.push(true);
				kingInCheck.push(white);
				log(kingInCheck);
				return kingInCheck;
			}
			
			//14  is top left corner
			for (j = whiteKingButton - 13; j > 0; j -= 13)
			{
				//If the first piece diagonal to the left is the same color then it is blocking the king from being checked
				console.log("DLU J: " + j);
				if (buttons[j].pieceColor == white || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'bishop' && buttons[j].type != 'queen')
				{
					break;
				}
				
				//Or else if there is a bishop or queen checking the king
				log("colors for king buttons: " + buttons[whiteKingButton].pieceColor);
				log("Colors for buttons[j]: " + buttons[j].pieceColor);
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[whiteKingButton].pieceColor != buttons[j].pieceColor)
				//else
				{
					kingInCheck.push(true);
					kingInCheck.push(white);
					log("bishop || queen");
					return kingInCheck;
				}
			}
		}
				
		//The pieces that can capture from the left are: rook and queen
		if (whiteKingNearbySquares[i][1] == "Left")
		{
			log("CHECKING LEFT");
			for (j = whiteKingButton - 12; j > 0 ; j -= 12)
			{
				if (buttons[j].pieceColor == white || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[whiteKingButton].pieceColor != buttons[j].pieceColor)
				{
					log("LEFT ROOK || QUEEN");
					kingInCheck.push(true);
					kingInCheck.push(white);
					return kingInCheck;
				}
			}
		}
		
		if (whiteKingNearbySquares[i][1] == "Diagonal left down")
		{
			console.log("checking diagonal left down");
			//If a pawn is on the square 1 diagonal left from the king then it can capture the king
			//Get the button position saved in the whiteKingNearbySquares squares array and use that to check
			//The buttons array to see if the status is equal to a black pawn
			
			//At most 7 iterations of -= 11
			for (j = whiteKingButton - 11; j > 0; j -= 11)
			{
				//If the first piece diagonal to the left is the same color then it is blocking the king from being checked
				if (buttons[j].pieceColor == white || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'bishop' && buttons[j].type != 'queen')
				{
					break;
				}
				
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[whiteKingButton].pieceColor != buttons[j].pieceColor)
				//else
				{
					kingInCheck.push(true);
					kingInCheck.push(white);
					log("bishop || queen");
					return kingInCheck;
				}
			}
		}
		
		//The pieces that can capture up are: rook and queen
		if (whiteKingNearbySquares[i][1] == "Up")
		{
			log("CHECKING UP");
			for (j = whiteKingButton - 1; j > 0; j -= 1)
			{
				if (buttons[j].pieceColor == white || buttons[j].status == -1)
				{
					break;
				}
		
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[whiteKingButton].pieceColor != buttons[j].pieceColor)
				{
					log("UP ROOK || QUEEN");
					kingInCheck.push(true);
					kingInCheck.push(white);
					return kingInCheck;
				}
			}
		}
		
		//The pieces that can capture down are: rook and queen
		if (whiteKingNearbySquares[i][1] == "Down")
		{
			log("CHECKING down");
			for (j = whiteKingButton + 1; j < 105; j += 1)
			{
				if (buttons[j].pieceColor == white || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[whiteKingButton].pieceColor != buttons[j].pieceColor)
				{
					log("DOWN ROOK || QUEEN");
					kingInCheck.push(true);
					kingInCheck.push(white);
					return kingInCheck;
				}
			}
		}
		
		if (whiteKingNearbySquares[i][1] == "Diagonal right up")
		{
			log("checkeing diag right");
			if (buttons[whiteKingNearbySquares[i][0]].status >= (bp1) && buttons[whiteKingNearbySquares[i][0]].status <= (bp8-1))
			{
				log("white king checked by a blackpawn, diag right up");
				kingInCheck.push(true);
				kingInCheck.push(white);
				return kingInCheck;
			}

			for (j = whiteKingButton + 11; j < 105; j += 11)
			{
				log("diag right type: " +  buttons[j].type);
				log("diagright j : " + j);
				//If the first piece diagonal to the left is the same color then it is blocking the king from being checked
				if (buttons[j].pieceColor == white || buttons[j].status == -1)
				{
					log("white break");
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'bishop' && buttons[j].type != 'queen')
				{
					log("status  break");
					break;
				}
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[whiteKingButton].pieceColor != buttons[j].pieceColor)
				{
					kingInCheck.push(true);
					kingInCheck.push(white);
					log("DIAGRIGHT BISHOP || QUEEN");
					return kingInCheck;
				}
			}			
		}

		if (whiteKingNearbySquares[i][1] == "Right")
		{
			log("CHECKING RIGHT");
			for (j = whiteKingButton + 12; j < 105; j += 12)
			{
				if (buttons[j].pieceColor == white || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'rook' && buttons[j].type != 'queen')
				{
					break;
				}
				
				if ((buttons[j].type == 'rook' || buttons[j].type == 'queen') &&  buttons[whiteKingButton].pieceColor != buttons[j].pieceColor)
				{
					log("LEFT ROOK || QUEEN");
					kingInCheck.push(true);
					kingInCheck.push(white);
					return kingInCheck;
				}
			}
		}
		
		if (whiteKingNearbySquares[i][1] == "Diagonal right down")
		{
			for (j = whiteKingButton + 13; j < 105; j += 13)
			{
				//If the first piece diagonal to the left is the same color then it is blocking the king from being checked
				if (buttons[j].pieceColor == white || buttons[j].status == -1)
				{
					break;
				}
				
				if (buttons[j].status > 0 && buttons[j].type != 'bishop' && buttons[j].type != 'queen')
				{
					break;
				}
				//Or else if there is a bishop or queen checking the king
				if ((buttons[j].type == 'bishop' || buttons[j].type == 'queen') && buttons[whiteKingButton].pieceColor != buttons[j].pieceColor)
				{
					kingInCheck.push(true);
					kingInCheck.push(white);
					log("DIAGRIGHT BISHOP || QUEEN");
					return kingInCheck;
				}
			}			
		}
	}

	var knightSquares = [whiteKingButton-14, whiteKingButton-25, whiteKingButton-23, whiteKingButton-10,
						 whiteKingButton+14, whiteKingButton+25, whiteKingButton+23, whiteKingButton+10];
						 
	for (i = 0; i < knightSquares.length; i++)
	{
		if (buttons[knightSquares[i]] === undefined)
			continue;
		if (buttons[knightSquares[i]].type == 'knight' && buttons[knightSquares[i]].pieceColor != 0)
			{
			kingInCheck.push(true);
			kingInCheck.push(white);
			log("CHECKED BYKNIGHT");
			return kingInCheck;
		}
	}

	kingInCheck.push(false);
	kingInCheck.push(white);
	return kingInCheck;
}
		
function findNearbySquares(kingPosition)
{
	var nearbySquares = [];
	var i = 0;
	
	//square 1 left 1 up
	if (buttons[kingPosition - 13].status == 0 || buttons[kingPosition-13].pieceColor != buttons[kingPosition].pieceColor)
	{	
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 13;
		nearbySquares[i][1] = "Diagonal left up";
		i++;
	}	
			
	//square 1 left of current piece
	if (buttons[kingPosition - 12].status == 0 || buttons[kingPosition-12].pieceColor != buttons[kingPosition].pieceColor)
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 12;
		nearbySquares[i][1] = "Left";
		i++;
	}		

	//square 1 left 1 down
	if (buttons[kingPosition - 11].status == 0 || buttons[kingPosition-11].pieceColor != buttons[kingPosition].pieceColor)
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 11;
		nearbySquares[i][1] = "Diagonal left down";
		i++;
	}
	
	//square 1 above current piece
	if (buttons[kingPosition - 1].status == 0 || buttons[kingPosition-1].pieceColor != buttons[kingPosition].pieceColor)
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition - 1;
		nearbySquares[i][1] = "Up";
		i++;
	}
	
	//square 1 below current piece
	if (buttons[kingPosition + 1].status == 0 || buttons[kingPosition+1].pieceColor != buttons[kingPosition].pieceColor)
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 1;
		nearbySquares[i][1] = "Down";
		i++;
	}
	
	//square 1 right 1 up
	if (buttons[kingPosition + 11].status == 0 || buttons[kingPosition+11].pieceColor != buttons[kingPosition].pieceColor)
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 11;
		nearbySquares[i][1] = "Diagonal right up";
		i++;
	}
	
	//square 1 right of current piece
	if (buttons[kingPosition + 12].status == 0 || buttons[kingPosition+12].pieceColor != buttons[kingPosition].pieceColor)
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 12;
		nearbySquares[i][1] = "Right";
		i++;
	}

	//square 1 right 1 down
	if (buttons[kingPosition + 13].status == 0 || buttons[kingPosition+13].pieceColor != buttons[kingPosition].pieceColor)
	{
		nearbySquares.push([]);
		nearbySquares[i][0] = kingPosition + 13;
		nearbySquares[i][1] = "Diagonal right down";
		i++;
	}
	
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

function doNothing(){
}

























