"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	// body...

	var Random = (function () {
		function Random() {
			_classCallCheck(this, Random);
		}

		_createClass(Random, null, [{
			key: "get",
			value: function get(inicio, final) {
				return Math.floor(Math.random() * final) + inicio;
			}
		}]);

		return Random;
	})();

	// fin random

	var food = (function () {
		function food(x, y) {
			_classCallCheck(this, food);

			this.x = x;
			this.y = y;
			this.width = 10;
			this.height = 10;
		}

		_createClass(food, [{
			key: "draw",
			// fin constructor

			value: function draw() {
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}
		}], [{
			key: "generate",
			// fin draw

			value: function generate() {
				return new food(Random.get(0, 490), Random.get(0, 290));
			} // fin generate

		}]);

		return food;
	})();

	// fin Food

	var Square = (function () {
		function Square(x, y) {
			_classCallCheck(this, Square);

			this.x = x;
			this.y = y;
			this.width = 10;
			this.height = 10;
			this.back = null //ultimo cuadrado
			;
		}

		_createClass(Square, [{
			key: "draw",
			//fin constructor

			value: function draw() {
				ctx.fillRect(this.x, this.y, this.width, this.height);
				if (this.hasBack()) {
					this.back.draw();
				}
			}
		}, {
			key: "add",
			// fin draw

			value: function add() {
				if (this.hasBack()) return this.back.add();

				this.back = new Square(this.x, this.y);
			}
		}, {
			key: "hasBack",
			// fin add

			value: function hasBack() {
				return this.back !== null;
			}
		}, {
			key: "copy",
			// fin hasBack

			value: function copy() {
				if (this.hasBack()) {
					this.back.copy();
					this.back.x = this.x;
					this.back.y = this.y;
				}
			}
		}, {
			key: "right",
			//fin copy

			value: function right() {
				this.copy();
				this.x += 10;
			}
		}, {
			key: "left",
			// fin right
			value: function left() {
				this.copy();
				this.x -= 10;
			}
		}, {
			key: "up",
			// fin left
			value: function up() {
				this.copy();
				this.y -= 10;
			}
		}, {
			key: "down",
			// fin up
			value: function down() {
				this.copy();
				this.y += 10;
			}
		}, {
			key: "hit",
			// fin down

			value: function hit(head) {
				var segundo = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

				if (this === head && !this.hasBack()) return false;
				if (this === head) return this.back.hit(head);
				if (segundo && !this.hasBack()) return false;
				if (segundo) return this.back.hit(head);
				//no es cabeza ni segundo
				if (this.hasBack()) {
					return squareHit(this, head) || this.back.hit(head);
				}
				// no es la cabeza ni el segundo y soy el ultimo
				return squareHit(this, head);
			}
		}, {
			key: "hitBorder",
			// fin Hit

			value: function hitBorder() {
				return this.x > 490 || this.x < 0 || this.y > 290 || this.y < 0;
			}
		}]);

		return Square;
	})();

	// fin Square

	var Snake = (function () {
		function Snake() {
			_classCallCheck(this, Snake);

			this.head = new Square(100, 0);
			this.draw();
			this.direction = "right";
			this.head.add();
			this.head.add();
			this.head.add();
			this.head.add();
		}

		_createClass(Snake, [{
			key: "draw",
			value: function draw() {
				this.head.draw();
			}
		}, {
			key: "right",

			//movimientos

			value: function right() {
				if (this.direction === "left") return;
				this.direction = "right";
			}
		}, {
			key: "left",
			value: function left() {
				if (this.direction === "right") return;
				this.direction = "left";
			}
		}, {
			key: "up",
			value: function up() {
				if (this.direction === "down") return;
				this.direction = "up";
			}
		}, {
			key: "down",
			value: function down() {
				if (this.direction === "up") return;
				this.direction = "down";
			}
		}, {
			key: "move",
			value: function move() {
				if (this.direction === "up") return this.head.up();
				if (this.direction === "down") return this.head.down();
				if (this.direction === "left") return this.head.left();
				if (this.direction === "right") return this.head.right();
			}
		}, {
			key: "eat",
			value: function eat() {
				puntos++;
				this.head.add();
			}
		}, {
			key: "dead",
			value: function dead() {
				return this.head.hitBorder() || this.head.hit(this.head);
			}
		}]);

		return Snake;
	})();

	// fin Snake

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d"); //el contexto del dibujo
	var puntos = 0;

	var snake = new Snake();
	var foods = []; //arreglo de comidas

	//document.getElementById('puntuacion').innerHTML=puntos;	

	//eventos

	window.addEventListener("keydown", function (event) {
		//console.log(event.keyCode) Obtener el número de las teclas

		if (event.keyCode > 36 && event.keyCode < 41) event.preventDefault(); // desactivar lso eventor por default del navegador

		if (event.keyCode === 40) return snake.down();
		if (event.keyCode === 39) return snake.right();
		if (event.keyCode === 38) return snake.up();
		if (event.keyCode === 37) return snake.left();

		return false;
	});

	//intervalo de tiempo

	var animacion = setInterval(function () {
		snake.move();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		snake.draw();
		drawFood();

		if (snake.dead()) {
			console.log("Se acabo");
			window.clearInterval(animacion);
			ctx.font = "20px serif";
			ctx.fillText("Hello world", 150, 50);
			//alert("Su puntuacion fue: "+puntos)
		}
	}, 1000 / 5);

	// intervalo de tiempo para crear la comida
	setInterval(function () {
		var Food = food.generate();
		foods.push(Food);

		setTimeout(function () {
			//Elimina la comida luego de 10 segundos
			removeFromFoods(Food);
		}, 10000);
	}, 4000);

	//Funcion para dibujar la comida
	function drawFood() {
		for (var index in foods) {
			var Food = foods[index];
			if (typeof Food !== "undefined") {
				Food.draw();
				if (hit(Food, snake.head)) {
					snake.eat();
					removeFromFoods(Food);
				}
			}
		}
	}

	// eliminar la comida
	function removeFromFoods(Food) {
		foods = foods.filter(function (f) {
			return Food !== f;
		});
	}

	function squareHit(cuadrado_Uno, cuandrado_Dos) {
		return cuadrado_Uno.x == cuandrado_Dos.x && cuadrado_Uno.y == cuandrado_Dos.y;
	}

	function hit(a, b) {
		var hit = false;
		//Colsiones horizontales
		if (b.x + b.width >= a.x && b.x < a.x + a.width) {
			//Colisiones verticales
			if (b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
		}
		//Colisión de a con b
		if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
			if (b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
		}
		//Colisión b con a
		if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
			if (a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
		}
		return hit;
	}

	//ctx.fillRect(0,0,50,50) //Primera y segunda coor es X y Y, las dos sgtes son el ancho y el largo del dibujo
})();
