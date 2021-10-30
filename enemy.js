var level = 1;
function drawEnemy(){
	if(playerWin){
		ctx.globalAlpha = 0;
	}
	
	moveEnemyLeftRight();
	
	ctx.beginPath();
	ctx.strokeStyle = enemy.isTakingDamage ? enemy.borderDamage : enemy.border;
	ctx.arc(enemy.x, enemy.y, enemy.radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();
	
	drawEnemyHpBar();
	drawText();
}

function enemyTakeDamage(damage){
	enemy.hp = enemy.hp - damage;
	if(enemy.hp < 0){
		enemy.hp = 0;
		
		if(!hasNextLevel()){
			gameOver(true);
			deadEnemyAnimation();
		}else{
			drawingPhase = true;
			enemy.hp = enemy.hpCap;
		}
	}
	
	if(!enemy.isTakingDamage){
		enemy.isTakingDamage = true;
		
		setTimeout(function(){
			enemy.isTakingDamage = false;
		}, 100);
	}
}

function hasNextLevel(){
	if(level < 4){
		level++;
		return true;
	}	
	
	return false;
}

var originalX = enemy.x;
var enemyLeftSpeed = 1;
function moveEnemyLeftRight(){
	if(level >= 2){
		if(enemy.x < originalX - 150){
			enemyLeftSpeed = 1;
		}else if(enemy.x > originalX + 150){
			enemyLeftSpeed = -1;
		}
		enemy.x += enemyLeftSpeed;
	}
}

function deadEnemyAnimation(){
	
}

function drawEnemyHpBar(){
	ctx.beginPath();
	//ctx.strokeStyle = "none";
	ctx.fillStyle = enemy.isTakingDamage ? "red" : "crimson";
	ctx.arc(enemy.x, enemy.y, enemy.radius - 1, 1.5 * Math.PI, ((enemy.hp / 200) * 2 + 1.5) * Math.PI);
	ctx.lineTo(enemy.x, enemy.y);
	ctx.lineTo(enemy.x, enemy.y - (enemy.radius - 1));
	ctx.fill();
	ctx.closePath();
	//ctx.stroke();
	
	ctx.beginPath();
	//ctx.strokeStyle = "none";
	ctx.fillStyle = "aliceblue";
	ctx.arc(enemy.x, enemy.y, enemy.radius - 10, 0 * Math.PI, 2 * Math.PI);
	ctx.lineTo(enemy.x, enemy.y);
	ctx.lineTo(enemy.x, enemy.y - (enemy.radius - 10));
	ctx.fill();
	ctx.closePath();
	//ctx.stroke();
	
	ctx.beginPath();
	ctx.fillStyle = "black"
	ctx.font = "10px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle"; 	
	ctx.fillText(enemy.hp.toString().padStart(3, " ") + "/" + enemy.hpCap, enemy.x, enemy.y);
	ctx.closePath();
	ctx.stroke();
	ctx.globalAlpha = 1;
	
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.moveTo(enemy.x - enemy.radius, $(c).height() - 4);
	ctx.lineTo(enemy.x - enemy.radius, $(c).height());
	ctx.closePath();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.moveTo(enemy.x + enemy.radius, $(c).height() - 4);
	ctx.lineTo(enemy.x + enemy.radius, $(c).height());
	ctx.closePath();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.moveTo(enemy.x - enemy.radius, $(c).height() - 2);
	ctx.lineTo(enemy.x + enemy.radius, $(c).height() - 2);
	ctx.closePath();
	ctx.stroke();
}