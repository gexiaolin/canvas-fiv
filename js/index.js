window.onload = function(){
	var win = document.querySelector('#win');
	var yes = document.querySelector('.yes');
	var no = document.querySelector('.no');
	var vic = document.querySelector('.vic');
	var canvas = document.querySelector('#canvas1');
	var ctx = canvas.getContext('2d');
	var canvasup = document.querySelector('#canvas2');
	var ctxup = canvasup.getContext('2d');
	var stop = document.querySelector('#stop');
	var regret = document.querySelector('#regret');
	//边框
	ctx.beginPath();
	ctx.strokeStyle = '#333';
	ctx.lineWidth = 3;
	ctx.lineCap = 'square';
	ctx.moveTo(26.5,26.5);
	ctx.lineTo(26.5,573.5);
	ctx.lineTo(573.5,573.5);
	ctx.lineTo(573.5,26.5);
	ctx.lineTo(26.5,26.5);
	ctx.stroke();
	//棋盘线
	var numx = 65.5,numy = 65.5;
	ctx.lineWidth = 1;
	for(var i = 0;i < 13;i++){
		//棋盘横线
		ctx.beginPath();
		ctx.moveTo(26.5,numy);
		ctx.lineTo(573.5,numy);
		ctx.stroke();
		numy += 39;
		//棋盘竖线
		ctx.beginPath();
		ctx.moveTo(numx,26.5);
		ctx.lineTo(numx,573.5);
		ctx.stroke();
		numx += 39;
	}
	//天元
	ctx.beginPath();
	ctx.fillStyle = '#333';
	ctx.arc(300,300,5,0,Math.PI*2);
	ctx.fill();
	//星
	ctx.beginPath();
	ctx.arc(143.5,143.5,4,0,Math.PI*2);
	ctx.moveTo(145.5,456.5);
	ctx.arc(143.5,456.5,4,0,Math.PI*2);
	ctx.moveTo(458.5,456.5);
	ctx.arc(456.5,456.5,4,0,Math.PI*2);
	ctx.moveTo(458.5,143.5);
	ctx.arc(456.5,143.5,4,0,Math.PI*2);
	ctx.fill();

	//落子function
	var key = true;
	//x/y number 落子X/Y轴    
	var down = function(x,y){
		//渐变色
		var black = ctxup.createRadialGradient(24.5+39*x,24.5+39*y,4,26.5+39*x,26.5+39*y,14);
			black.addColorStop(0.1,'#555');
			black.addColorStop(1,'#333');
		var white = ctxup.createRadialGradient(24.5+39*x,24.5+39*y,4,26.5+39*x,26.5+39*y,14);
			white.addColorStop(0.1,'#fff');
			white.addColorStop(1,'#ddd');
		color = key?black:white;
		key = !key;
		ctxup.beginPath();
		ctxup.fillStyle = color;
		ctxup.arc(26.5+39*x,26.5+39*y,14,0,Math.PI*2);
		ctxup.fill();
	}

	//点击落子
	var list = {},x,y;
	canvasup.onclick = function(ev){
		x = Math.round((ev.offsetX - 26.5)/39);
		y = Math.round((ev.offsetY - 26.5)/39);
		if(list[x+'-'+y] != undefined){
			return;
		}else{
			list[x+'-'+y] = key?1:2;
			down(x,y);
			if(key){
				if(judge(x,y,2)){
					win.style.display = 'block';
					vic.innerHTML = '白子胜！'
					stop.style.display = 'block';
				}
			}else{
				if(judge(x,y,1)){
					win.style.display = 'block';
					vic.innerHTML = '黑子胜！'
					stop.style.display = 'block';
				}
			}
		}
		localStorage.data = JSON.stringify(list);
	}

	//输赢判断
	var judge = function(x,y,col){
		var singleCol = {};
		for(var i in list){
			if(list[i] == col){
				singleCol[i] = list[i];
			}
		}
		var tx,ty,lR = 1,uD = 1,luRd =1,ruLd = 1;
		//横向
		tx = x;
		ty = y;
		while(singleCol[(tx-1)+'-'+ty]){tx--;lR++;}
		tx = x;
		ty = y;
		while(singleCol[(tx+1)+'-'+ty]){tx++;lR++;}
		if(lR >= 5){return true;}
		//纵向
		tx = x;
		ty = y;
		while(singleCol[tx+'-'+(ty-1)]){ty--;uD++;}
		tx = x;
		ty = y;
		while(singleCol[tx+'-'+(ty+1)]){ty++;uD++;}
		if(uD >= 5){return true;}
		//左上-右下
		tx = x;
		ty = y;
		while(singleCol[(tx-1)+'-'+(ty-1)]){tx--;ty--;luRd++;}
		tx = x;
		ty = y;
		while(singleCol[(tx+1)+'-'+(ty+1)]){tx++;ty++;luRd++;}
		if(luRd >= 5){return true;}
		//右上-左下
		tx = x;
		ty = y;
		while(singleCol[(tx-1)+'-'+(ty+1)]){tx--;ty++;ruLd++;}
		tx = x;
		ty = y;
		while(singleCol[(tx+1)+'-'+(ty-1)]){tx++;ty--;ruLd++;}
		if(ruLd >= 5){return true;}
	}
	yes.onclick = function(){
		localStorage.clear();
		ctxup.clearRect(0,0,600,600);
		list = {};
		key = true;
		win.style.display = 'none';
		stop.style.display = 'none';
	}
	no.onclick = function(){
		stop.style.display = 'block';
		win.style.display = 'none';
		regret.onclick = null;
	}

	//悔棋
	regret.onclick = function(){
		var newlist= {};
		for(var i in list){
			if(i != (x+'-'+y)){
				newlist[i] = list[i];
			}
		}
		list = newlist;
		ctxup.clearRect(0,0,600,600);
		for(var i in list){
			var x1 = i.split('-')[0];
			var y1 = i.split('-')[1];
			key = (list[i] == 1)?true:false;
			down(x1,y1);
		}
	}

	//读取数据并绘制到页面中
<<<<<<< HEAD
	// if(localStorage.data){
	// 	list = JSON.parse(localStorage.data);
	// 	for(var i in list){
	// 		var x1 = i.split('-')[0];
	// 		var y1 = i.split('-')[1];
	// 		key = (list[i] == 1)?true:false;
	// 		down(x1,y1);
	// 	}
	// }
=======
	//if(localStorage.data){
		//list = JSON.parse(localStorage.data);
		//for(var i in list){
			//var x1 = i.split('-')[0];
			//var y1 = i.split('-')[1];
			//key = (list[i] == 1)?true:false;
			//down(x1,y1);
		//}
	//}
>>>>>>> origin/gh-pages

	//重置棋盘，并清除localStorage
	var reset = document.querySelector('#reset');
	reset.onclick = function(){
		localStorage.clear();
		ctxup.clearRect(0,0,600,600);
		location.reload();
	}
}
