;(function(){
	// body...
	class Random{
		static get(inicio, final){
			return Math.floor(Math.random()* final) + inicio
		}
	} // fin random


	class food{
		constructor(x,y){
			this.x = x
			this.y = y
			this.width = 10
			this.height = 10
		}// fin constructor

		draw(){
			ctx.fillStyle = "rgb("+Random.get(0,255)+","+Random.get(0,255)+","+Random.get(0,255)+")";
			//ctx.fillStyle = "rgb(0, 162, 232)";
			ctx.fillRect(this.x,this.y, this.width,this.height)
			ctx.fillStyle = "rgb(0,0,0)";
		} // fin draw

		static generate(){
			return new food (Random.get(0,490), Random.get(0,290))
		}// fin generate

	}// fin Food

	class Square{
		constructor(x,y){
			this.x = x
			this.y = y
			this.width = 10
			this.height = 10
			this.back = null //ultimo cuadrado
		}//fin constructor

		draw(){
			ctx.fillRect(this.x, this.y,this.width,this.height)
			if (this.hasBack()){
				this.back.draw()
			}
		} // fin draw

		add(){
			if (this.hasBack()) return this.back.add()

			this.back = new Square(this.x,this.y)
		} // fin add

		hasBack(){
			return this.back !== null
		}// fin hasBack

		copy(){
			if (this.hasBack()) {
				this.back.copy()
				this.back.x = this.x
				this.back.y = this.y
			}
		} //fin copy

		right(){
			this.copy()
			this.x += 10
		} // fin right

		left(){
			this.copy()
			this.x -= 10
		}// fin left

		up(){
			this.copy()
			this.y -= 10
		}// fin up

		down(){
			this.copy()
			this.y += 10
		} // fin down

		hit(head, segundo=false){
			if(this === head && !this.hasBack()) return false
			if(this === head) return this.back.hit(head)
			if (segundo && !this.hasBack()) return false
			if (segundo) return this.back.hit(head)
			//no es cabeza ni segundo
			if (this.hasBack()){
				return squareHit(this,head) || this.back.hit(head)
			}
			// no es la cabeza ni el segundo y soy el ultimo
			return squareHit (this,head)
		} // fin Hit

		hitBorder(){ //Para identificar si golpea los bordes
			return this.x > 490 || this.x < 0 || this.y > 290 || this.y < 0
		}//fin hitborder

	} // fin Square


	class Snake{

		constructor(){
			this.head = new Square(100,0)
			this.draw()
			this.direction = "right"
			this.head.add()
			this.head.add()
			this.head.add()
			this.head.add()
		} //fin constructor

		draw(){
			this.head.draw()
		}

		//movimientos

		right(){
			if (this.direction === "left") return;
			this.direction = "right"
		}
		left(){
			if (this.direction === "right") return;
			this.direction = "left"
		}
		up(){
			if (this.direction === "down") return;
			this.direction = "up"
		}
		down(){
			if (this.direction === "up") return;
			this.direction = "down"
		}

		move(){
			if (this.direction === "up") return this.head.up()
			if (this.direction === "down") return this.head.down()
			if (this.direction === "left") return this.head.left()
			if (this.direction === "right") return this.head.right()
		}

		eat(){
			puntos++;
			this.head.add()
		}

		dead(){
			return this.head.hitBorder() || this.head.hit(this.head)  
		}

	} // fin Snake

	const canvas = document.getElementById('canvas')
	const ctx = canvas.getContext('2d') //el contexto del dibujo
	var puntos = 0;

	const snake = new Snake()
	let foods = [] //arreglo de comidas

	//document.getElementById('puntuacion').innerHTML=puntos;	

	//eventos

	window.addEventListener("keydown",function(event){
		//console.log(event.keyCode) Obtener el número de las teclas

		if(event.keyCode > 36 && event.keyCode < 41) event.preventDefault() // desactivar lso eventor por default del navegador

		if (event.keyCode === 40) return snake.down();
		if (event.keyCode === 39) return snake.right();
		if (event.keyCode === 38) return snake.up();
		if (event.keyCode === 37) return snake.left();

		return false
	})
	

	//intervalo de tiempo

	const animacion = setInterval(function(){
		snake.move()
		ctx.clearRect(0,0,canvas.width,canvas.height)
		snake.draw()
		drawFood()

		if (snake.dead()) {
			//console.log("Se acabo")
			window.clearInterval(animacion)
			ctx.clearRect(0,0,500,300);
			ctx.font = "20px serif";
			ctx.fillText("Su puntuacion fue de: "+puntos, 150, 50);
			//alert("Su puntuacion fue: "+puntos)
		}
	},1000/20)

	// intervalo de tiempo para crear la comida
	setInterval(function(){
		const Food = food.generate()
		foods.push(Food)

		setTimeout(function(){ //Elimina la comida luego de 10 segundos
			removeFromFoods(Food)
		},10000)

	},4000)

	//Funcion para dibujar la comida
	function drawFood(){
		for (const index in foods){
			const Food = foods[index]
			if(typeof Food !== "undefined") {
				Food.draw()
				if(hit(Food,snake.head)){
					snake.eat()
					removeFromFoods(Food)
				}
			}
		}
	}

	// eliminar la comida
	function removeFromFoods(Food){
		foods = foods.filter(function(f){
			return Food !== f
		})
	}

	function squareHit(cuadrado_Uno, cuandrado_Dos){
		return cuadrado_Uno.x == cuandrado_Dos.x && cuadrado_Uno.y == cuandrado_Dos.y 
	}


	function hit(a,b){
    var hit = false;
    //Colsiones horizontales
    if(b.x + b.width >= a.x && b.x < a.x + a.width)
    {
      //Colisiones verticales
      if(b.y + b.height >= a.y && b.y < a.y + a.height)
        hit = true;
    }
    //Colisión de a con b
    if(b.x <= a.x && b.x + b.width >= a.x + a.width)
    {
      if(b.y <= a.y && b.y + b.height >= a.y + a.height)
        hit = true;
    }
    //Colisión b con a
    if(a.x <= b.x && a.x + a.width >= b.x + b.width)
    {
      if(a.y <= b.y && a.y + a.height >= b.y + b.height)
        hit = true;
    }
    return hit;
  }


	//ctx.fillRect(0,0,50,50) //Primera y segunda coor es X y Y, las dos sgtes son el ancho y el largo del dibujo



})()