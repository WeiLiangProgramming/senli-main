var enemyBulletAddSpeed = 150;
var enemyBulletTickSpeed = 75;

function initEnemyBullet(){
	timerList.addEnemyBulletTimer = setInterval(function(){
		addEnemyBullet();
	}, enemyBulletAddSpeed);
	
	if(timerList.moveEnemyBulletTimer == null){
		timerList.moveEnemyBulletTimer = setInterval(function(){
			moveEnemyBullet();
		}, 15);
	}
}

var xDistance = 0;
var yDistance = 0;
var levelTick = 0;
function addEnemyBullet(){
	var bulletSize = 10;
	var centerBulletX = enemy.x - (bulletSize / 2);
	var centerBulletY = enemy.y + enemy.radius + (bulletSize / 2);
	calculateEnemyBullet(centerBulletX, centerBulletY, (player.x + (player.size/2) - 5), (player.y + (player.size/2)));
	
	enemy.bullet.push({
		x: centerBulletX,
		y: centerBulletY,
		size: bulletSize,
		border: "red",
		bg: "white",
		xSpeed: xDistance / enemyBulletTickSpeed,
		ySpeed: yDistance / enemyBulletTickSpeed,
		damage:1,
	});
	
	if(level >= 3 && levelTick % 3 == 0){
		var xPos = Math.random() * ($(c).width() - 20) + 10;
		
		enemy.bullet.push({
			x: xPos,
			y: 10,
			size: 5,
			border: "red",
			bg: "white",
			xSpeed: 0,
			ySpeed: $(c).height() / (enemyBulletTickSpeed * 2),
			damage:1,
		});
	}
	
	if(level >= 4 && levelTick % 6 == 0){
		enemy.bullet.push({
			x: centerBulletX - bulletSize,
			y: centerBulletY,
			size: bulletSize,
			border: "red",
			bg: "white",
			xSpeed: 0,
			ySpeed: $(c).height() / (enemyBulletTickSpeed * 2),
			damage:1,
		});
		
		enemy.bullet.push({
			x: centerBulletX - bulletSize,
			y: centerBulletY,
			size: bulletSize,
			border: "red",
			bg: "white",
			xSpeed: -1,
			ySpeed: $(c).height() / (enemyBulletTickSpeed * 2),
			damage:1,
		});
		
		enemy.bullet.push({
			x: centerBulletX - bulletSize,
			y: centerBulletY,
			size: bulletSize,
			border: "red",
			bg: "white",
			xSpeed: 1,
			ySpeed: $(c).height() / (enemyBulletTickSpeed * 2),
			damage:1,
		});
	}
	
	levelTick++;
}

function calculateEnemyBullet(sourceX, sourceY, targetX, targetY){
	var positiveX;
	var positiveY;
	var negativeX;
	var negativeY;
	var bulletOutOfBoundRadius = Math.sqrt(Math.pow($(c).width() - sourceX, 2) + Math.pow($(c).height() - sourceY, 2));
	
	var flipSourceY = $(c).height() - sourceY;
	var flipTargetY = $(c).height() - targetY;
	
	var m = (flipSourceY - flipTargetY) / (sourceX - targetX);
	
	var part1 = -(m * targetX) + flipTargetY - flipSourceY;
	var part2 = Math.pow(bulletOutOfBoundRadius, 2);
	var part3 = -(2 * sourceX) + (2 * part1 * m);
	var part4 = sourceX * sourceX + part1 * part1 - part2;
	var part5 = 1 + (m * m);
	var part6 = Math.pow(part3, 2) - (4 * part5 * part4);
	var part7 = 2 * part5;
	
	positiveX = (-part3 + Math.sqrt(Math.abs(part6))) / part7;
	positiveY = $(c).height() - (m * positiveX - m * targetX + flipTargetY);
	
	negativeX = (-part3 - Math.sqrt(Math.abs(part6))) / part7;
	negativeY = $(c).height() - (m * negativeX - m * targetX + flipTargetY);
	
	if(targetX >= sourceX){
		xDistance = positiveX - sourceX;
		yDistance = positiveY - sourceY;
	}else{
		xDistance = negativeX - sourceX;
		yDistance = negativeY - sourceY;
	}
	
	if(sourceX - targetX == 0){
		xDistance = 0;
		yDistance = 638;
	}
}

function moveEnemyBullet(){
	for(x = 0; x < enemy.bullet.length; x++){
		enemy.bullet[x].y = enemy.bullet[x].y + enemy.bullet[x].ySpeed;
		enemy.bullet[x].x = enemy.bullet[x].x + enemy.bullet[x].xSpeed;
		
		if(checkEnemyBulletHitPlayer(x)){
			if(!player.isDead){
				addBulletEaten();
			}
			if(!playerWin && !bombActivated && !godMode){
				playerTakeDamage();
			}
			enemy.bullet.splice(x, 1);
		}		
		else if(checkEnemyBulletOutOfBound(x)){
			enemy.bullet.splice(x, 1);
		}else if(bombActivated){
			if(checkCollision(bomb.x, bomb.y, bomb.radius, enemy.bullet[x].x, enemy.bullet[x].y, enemy.bullet[x].size, true, false)){
				enemy.bullet.splice(x, 1);
			}
		}
	}
}

function checkEnemyBulletHitPlayer(x){
	if(checkCollision(player.x, player.y, player.size, enemy.bullet[x].x, enemy.bullet[x].y, enemy.bullet[x].size, false, false)){	
		return true;
	}
	return false;
}

function checkEnemyBulletOutOfBound(x){
	if(enemy.bullet[x].y + enemy.bullet[x].ySpeed >= $(c).height() + enemy.bullet[x].size|| 
	enemy.bullet[x].x + enemy.bullet[x].xSpeed <= -enemy.bullet[x].size ||
	enemy.bullet[x].x + enemy.bullet[x].xSpeed >= $(c).width() + enemy.bullet[x].size){
		return true;
	}
	return false;
}

function drawEnemyBullet(){
	$.each(enemy.bullet, function(index, value){
		ctx.beginPath();
		ctx.strokeStyle = value.border;
		ctx.strokeRect(value.x, value.y, value.size, value.size);	
		ctx.closePath();
		ctx.stroke();
	});
}