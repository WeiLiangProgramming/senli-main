var c;
var ctx;
var gameOverIndicator = false;
var godMode = false;
var bulletEaten = 0;

var timerList = {
	refreshCanvasTimer: null,
	keyHoldInterval: null,
	addPlayerBulletTimer: null,
	movePlayerBulletTimer: null,
	addEnemyBulletTimer: null,
	moveEnemyBulletTimer: null
}

var player = {
	x: 285,
	y: 625,
	size: 30,
	border: "black",
	speed: 5,
	isDead: false,
	bombCount: 3,
	bullet: [],
	heart: 3,
}

var enemy = {
	x: 300,
	y: 75,
	radius: 60,
	border: "black",
	borderDamage: "red",
	speed: 0,
	hpCap: 200,
	hp: 200,
	ySpeed: 0,
	xSpeed: 0,
	isTakingDamage: false,
	bullet: [],
}

$(document).ready(function(){
	$("#god").on("click", function(){
		if($(this).hasClass("btn-danger")){
			godMode = true;
			$(this).removeClass("btn-danger").addClass("btn-success");
			$(this).html("Easy Modo &#9320");
		}else{
			godMode = false;
			$(this).removeClass("btn-success").addClass("btn-danger");
			$(this).html("Easy Modo &#9320");
		}
		$(this).blur();
	});
	
	$("#startGame").focus();
	$("#startGame").on("click", function(){
		$("#intro").fadeOut("slow", function(){
			startGame();
		});
	});
	$("#restart").on("click", function(){
		$("#cv1").fadeIn("slow", function(){
			restartGame();
		});
		$("#retry").fadeOut("slow");	
	});
	$("#difficulty").on("change", function(){
		var diff = parseFloat($(this).val());
		if(diff >= 1){
			enemyBulletAddSpeed = Math.ceil(150 * diff);
		}
		enemyBulletTickSpeed = Math.ceil(75 * diff);
	});
	$("#playerLive").html(player.heart);
	$("#playerBomb").html(player.bombCount);
});

function startGame(){
	c = $("#cv1")[0];
	ctx = c.getContext("2d");
	
	timerList.refreshCanvasTimer = setInterval(function(){
		ctx.clearRect(0, 0, $(c).width(), $(c).height());
		
		drawPlayer();
		drawPlayerBullet();
		drawEnemy();
		drawEnemyBullet();
	}, 15);
	
	initPlayerMoveListener();
	initPlayerBullet();
	initEnemyBullet();
}

function restartGame(){
	clearInterval(timerList.keyHoldInterval);
	clearInterval(timerList.addPlayerBulletTimer);
	clearInterval(timerList.addEnemyBulletTimer);
	timerList.keyHoldInterval = null;
	timerList.addPlayerBulletTimer = null;
	timerList.addEnemyBulletTimer = null;
	
	initPlayerMoveListener();
	initPlayerBullet();
	initEnemyBullet();
	
	bulletEaten = 0;
	$("#bulletEaten").html(bulletEaten);
	gameOverIndicator = false;
	playerWin = false;
	
	rotateCount = 0;
	deadAlpha = 1;
	isKeyHold = false;
	keyCode = [];
	level = 1;

	player = {
		x: 280,
		y: 625,
		size: 40,
		border: "black",
		speed: 5,
		isDead: false,
		bombCount: 3,
		bullet: [],
		heart: 3,
	};

	enemy = {
		x: 300,
		y: 75,
		radius: 60,
		border: "black",
		borderDamage: "red",
		speed: 0,
		hpCap: 200,
		hp: 200,
		ySpeed: 0,
		xSpeed: 0,
		isTakingDamage: false,
		bullet: [],
	};
	$("#playerLive").html(player.heart);
	$("#playerBomb").html(player.bombCount);
}

var playerWin = false;
function gameOver(isWin){
	clearInterval(timerList.keyHoldInterval);
	clearInterval(timerList.addPlayerBulletTimer);
	clearInterval(timerList.addEnemyBulletTimer);
	timerList.keyHoldInterval = null;
	timerList.addPlayerBulletTimer = null;
	timerList.addEnemyBulletTimer = null;
	gameOverIndicator = true;
	playerWin = isWin;
	
	$(document).off("keydown");
	$(document).off("keyup");
	
	$("#retryTitle").html(playerWin ? (bulletEaten > 0 ? "You Win o.O ?" : "You Win") : "Game Over");
	$("#retryTitle").css("color", playerWin ? (bulletEaten > 0 ? "Orange" : "Green") : "Crimson");
	$("#retryPhase").html("Current Phase: " + level);
	$("#retryCircleHp").html("Enemy Hp: " + enemy.hp + "/" + enemy.hpCap);
	$("#retry").fadeIn("slow", function(){
		$("#restart").focus();
	});
	$("#cv1").fadeOut("slow", function(){
		enemy.hp = 200;
		enemy.x=300,
		enemy.y=75,
		enemy.bullet = [];
		player.x=280;
		player.y=625;
		player.heart=3;
		player.bullet = [];
		level = 1;
	});
}

function checkCollision(targetX, targetY, targetSize, sourceX, sourceY, sourceSize, isTargetCircle, isSourceCircle){
	if(isTargetCircle && !isSourceCircle){	
		if(Math.sqrt(Math.pow(Math.abs(targetX - sourceX), 2) + Math.pow(Math.abs(targetY - sourceY), 2)) <= targetSize ||
		Math.sqrt(Math.pow(Math.abs(targetX - (sourceX + sourceSize)), 2) + Math.pow(Math.abs(targetY - sourceY), 2)) <= targetSize ||
		
		//(targetY + targetSize >= sourceY && targetX >= sourceX && targetX <= sourceX + sourceSize) ||
		
		Math.sqrt(Math.pow(Math.abs(targetX - sourceX), 2) + Math.pow(Math.abs(targetY - (sourceY + sourceSize)), 2)) <= targetSize ||
		Math.sqrt(Math.pow(Math.abs(targetX - (sourceX + sourceSize)), 2) + Math.pow(Math.abs(targetY - (sourceY + sourceSize)), 2)) <= targetSize
		){
			return true;
		}
	}else if(!isTargetCircle && !isSourceCircle){
		if((sourceX > targetX && sourceY > targetY) && 
		sourceX + sourceSize < targetX + targetSize && sourceY + sourceSize < targetY + targetSize
		){
			return true;
		}
	}
	return false;
}

function addBulletEaten(){
	bulletEaten++;
	$("#bulletEaten").html(bulletEaten);
}
