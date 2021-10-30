var drawingPhase = false;
var drawingPhaseTick = 0;
var drawPhaseFontSize = 20;
var drawPhaseLeft = 550;
var drawPhaseTop = 20;
function drawPhase(){
	if(drawingPhase){
		if(drawingPhaseTick <30){
			drawPhaseFontSize++;
			drawPhaseLeft--;
			drawPhaseTop++;
		}else if(drawingPhaseTick < 70){
			
		}else if(drawingPhaseTick < 100){
			drawPhaseFontSize--;
			drawPhaseLeft++;
			drawPhaseTop--;
		}
		
		drawingPhaseTick++;
		if(drawingPhaseTick > 100){
			drawingPhaseTick = 0;
			drawingPhase = false; 
		}
	}
	
	ctx.beginPath();
	ctx.fillStyle = "black"
	ctx.font = drawPhaseFontSize + "px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle"; 	
	ctx.fillText(drawingPhase ? level : "Phase " + level, drawPhaseLeft, drawPhaseTop);
	ctx.closePath();
	ctx.stroke();
}

function drawHeartText(){
	ctx.beginPath();
	ctx.fillStyle = "black"
	ctx.font = "20px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle"; 	
	ctx.fillText("Hp: " + player.heart, 500, 200);
	ctx.closePath();
	ctx.stroke();
}

function drawBombText(){
	ctx.beginPath();
	ctx.fillStyle = "black"
	ctx.font = "20px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle"; 	
	ctx.fillText("Bomb: " + player.bombCount, 500, 220);
	ctx.closePath();
	ctx.stroke();
}

function drawText(){
	drawPhase();
	//drawHeartText();
	//drawBombText();
}