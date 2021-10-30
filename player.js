var isKeyHold = false;
var keyCode = [];

function initPlayerMoveListener(){
	$(document).on("keydown", function(e){
		if(keyCode.indexOf(e.keyCode) < 0){
			keyCode.push(e.keyCode);
			if(e.keyCode == 16){
				player.speed = 2;
			}
			if(e.keyCode == 88){
				initializeBomb(); 
			}
		}
		isKeyHold = true;
		
		if(timerList.keyHoldInterval == null){
			timerList.keyHoldInterval = setInterval(function(){
				movePlayer();
			}, 15);
		}
	});

	$(document).on("keyup", function(e){
		if(keyCode.indexOf(e.keyCode) > -1){
			keyCode.splice(keyCode.indexOf(e.keyCode), 1);
		}
		if(e.keyCode == 16){
			player.speed = 5;
		}
		if(keyCode.length == 0){
			clearInterval(timerList.holdInterval);
			holdInterval = null;
			isKeyHold = false;
		}
	});
}


function movePlayer(){
	if(isKeyHold){
		for(x = 0; x < keyCode.length; x++){
			if(keyCode[x] == 37 || keyCode[x] == 65){
				if(!(parseFloat(player.x) - player.speed <= 0)){
					player.x = parseFloat(player.x) - player.speed;
					checkPlayerCollision();
				}
			}
			if(keyCode[x] == 38 || keyCode[x] == 87){
				if(!(parseFloat(player.y) - player.speed <= 0)){
					player.y = parseFloat(player.y) - player.speed;
					checkPlayerCollision();
				}
			}
			if(keyCode[x] == 39 || keyCode[x] == 68){
				if(!(parseFloat(player.x) + player.speed + parseFloat(player.size) >= $(c).width())){
					player.x = parseFloat(player.x) + player.speed;
					checkPlayerCollision();
				}
			}
			if(keyCode[x] == 40 || keyCode[x] == 83){
				if(!(parseFloat(player.y) + player.speed + parseFloat(player.size) >= $(c).height())){
					player.y = parseFloat(player.y) + player.speed;
					checkPlayerCollision();
				}
			}
		}
	}
}

function checkPlayerCollision(){
	if(checkCollision(enemy.x, enemy.y, enemy.radius, player.x, player.y, player.size, true, false)){
		playerTakeDamage();
		return true;
	}
	return false;
}

var playerDeadAlpha = 1;
function drawPlayer(){
	if(player.isDead){
		deadPlayerAnimation();
		ctx.globalAlpha = 0;
	}
	
	ctx.beginPath();
	ctx.strokeStyle = player.border;
	ctx.strokeRect(player.x, player.y, player.size, player.size);
	ctx.closePath();
	ctx.stroke();
	
	/*ctx.beginPath();
	ctx.fillStyle = "black"
	ctx.font = "15px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle"; 	
	ctx.fillText(player.bombCount, player.x + player.size / 2, player.y + player.size / 2);
	ctx.closePath();
	ctx.stroke();*/
	
	drawBomb();
	ctx.globalAlpha = 1;
}

var rotateCount = 0;
var deadAlpha = 1;
function deadPlayerAnimation(){
	ctx.beginPath();
	ctx.globalAlpha = deadAlpha;
	ctx.translate(player.x + ((player.size/4) * 3), player.y + ((player.size/4) * 1));
	ctx.rotate(rotateCount * Math.PI / 180);
	ctx.translate(-(player.x + ((player.size/4) * 3)), -(player.y + ((player.size/4) * 1)));
	ctx.strokeStyle = "black";
	ctx.moveTo(player.x + (player.size/2), player.y);
	ctx.lineTo(player.x + player.size, player.y);
	ctx.lineTo(player.x + player.size, player.y + (player.size/2));
	ctx.stroke();
	ctx.resetTransform();
	
	ctx.beginPath();
	ctx.globalAlpha = deadAlpha;
	ctx.translate(player.x + ((player.size/4) * 3), player.y + ((player.size/4) * 3));
	ctx.rotate(rotateCount * Math.PI / 180);
	ctx.translate(-(player.x + ((player.size/4) * 3)), -(player.y + ((player.size/4) * 3)));
	ctx.strokeStyle = "black";
	ctx.moveTo(player.x + player.size, player.y + (player.size/2));
	ctx.lineTo(player.x + player.size, player.y + player.size);
	ctx.lineTo(player.x + (player.size/2), player.y + player.size);
	ctx.stroke();
	ctx.resetTransform();
	
	ctx.beginPath();
	ctx.globalAlpha = deadAlpha;
	ctx.translate(player.x + ((player.size/4) * 1), player.y + ((player.size/4) * 3));
	ctx.rotate(rotateCount * Math.PI / 180);
	ctx.translate(-(player.x + ((player.size/4) * 1)), -(player.y + ((player.size/4) * 3)));
	ctx.strokeStyle = "black";
	ctx.moveTo(player.x + (player.size/2), player.y + player.size);
	ctx.lineTo(player.x, player.y + player.size);
	ctx.lineTo(player.x, player.y + (player.size/2));
	ctx.stroke();
	ctx.resetTransform();
	
	ctx.beginPath();
	ctx.globalAlpha = deadAlpha;
	ctx.translate(player.x + ((player.size/4) * 1), player.y + ((player.size/4) * 1));
	ctx.rotate(rotateCount * Math.PI / 180);
	ctx.translate(-(player.x + ((player.size/4) * 1)), -(player.y + ((player.size/4) * 1)));
	ctx.strokeStyle = "black";
	ctx.moveTo(player.x, player.y + (player.size/2));
	ctx.lineTo(player.x, player.y);
	ctx.lineTo(player.x + (player.size/2), player.y);
	ctx.stroke();
	ctx.resetTransform();
	
	ctx.globalAlpha = 1;
	rotateCount < 45 ? rotateCount =  rotateCount + 1: "";
	deadAlpha.toFixed(2) > 0.05 ? deadAlpha = deadAlpha - 0.05: deadAlpha = 0;
}

var bombActivated = false;
var bombExpandTimer = null;
var bombExpandSpeed = 1;
var bomb = {
	x: 0,
	y: 0,
	radius: 1,
	border: "black",
}

function initializeBomb(){
	console.log(player.bombCount, bombActivated);
	if(player.bombCount > 0 && !bombActivated){
		bombActivated = true;
		bomb.x = player.x + player.size / 2;
		bomb.y = player.y + player.size / 2;
		bomb.radius = 1;
		bombExpandSpeed = 1;
		player.bombCount--;
		$("#playerBomb").html(player.bombCount);
	}
}

function drawBomb(){
	if(bombActivated){		
		ctx.beginPath();
		ctx.strokeStyle = bomb.border;
		ctx.arc(bomb.x, bomb.y, bomb.radius, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();

		bombExpandSpeed += 0.2;
		bomb.radius += bombExpandSpeed;
		
		if(bomb.radius > $(c).height()){
			bombActivated = false;
			clearInterval(bombExpandTimer);
			bombExpandTimer = null;
		}
	}
}

function playerTakeDamage(){
	player.isDead = true;
	if(player.heart > 0){
		player.heart--;
		$("#playerLive").html(player.heart);
		player.isDead = false;
		player.bombCount += 1;
		initializeBomb();		
	}else{
		gameOver(false);
	}
}