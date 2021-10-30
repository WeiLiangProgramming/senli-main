function initPlayerBullet(){
	timerList.addPlayerBulletTimer = setInterval(function(){
		addPlayerBullet();
	}, 150);
	
	if(timerList.movePlayerBulletTimer == null){
		timerList.movePlayerBulletTimer = setInterval(function(){
			movePlayerBullet();
		}, 15);
	}
}

var playerBulletCount = 0;
function addPlayerBullet(){
	playerBulletCount++;
	player.bullet.push({
		x: player.x + player.size/2 - 5,
		y: player.y - 15,
		size: 10,
		border: "grey",
		bg: "white",
		xSpeed: 0,
		ySpeed: 7,
		damage: 3,
	});
	
	if(playerBulletCount % 3 == 0){
		player.bullet.push({
			x: player.x + player.size/2 - 20,
			y: player.y - 15,
			size: 5,
			border: "grey",
			bg: "white",
			xSpeed: 0.5,
			ySpeed: 8,
			damage:1,
		});
		
		player.bullet.push({
			x: player.x + player.size/2 + 10,
			y: player.y - 15,
			size: 5,
			border: "grey",
			bg: "white",
			xSpeed: -0.5,
			ySpeed: 8,
			damage:1,
		});
	}
}

function movePlayerBullet(){
	for(x = 0; x < player.bullet.length; x++){
		player.bullet[x].y = player.bullet[x].y - player.bullet[x].ySpeed;
		player.bullet[x].x = player.bullet[x].x - player.bullet[x].xSpeed;
		
		if(checkPlayerBulletHitEnemy(x)){
			enemyTakeDamage(player.bullet[x].damage);
			player.bullet.splice(x, 1);
		}else if(checkPlayerBulletOutOfBound(x)){
				player.bullet.splice(x, 1);
		}
	}
}

function checkPlayerBulletHitEnemy(x){	
	if(checkCollision(enemy.x, enemy.y, enemy.radius, player.bullet[x].x, player.bullet[x].y, player.bullet[x].size, true, false)){	
		return true;
	}
	return false;
}

function checkPlayerBulletOutOfBound(x){
	if(player.bullet[x].y - player.bullet[x].ySpeed <= - player.bullet[x].size || 
	player.bullet[x].x - player.bullet[x].xSpeed <= - player.bullet[x].size ||
	player.bullet[x].x - player.bullet[x].xSpeed >= $(c).width() + player.bullet[x].size){
		return true;
	}
	return false;
}

function drawPlayerBullet(){
	$.each(player.bullet, function(index, value){	
		ctx.beginPath();
		ctx.strokeStyle = value.border;
		ctx.strokeRect(value.x, value.y, value.size, value.size);	
		ctx.closePath();
		ctx.stroke();
	});
}