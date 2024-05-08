const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.dx = Math.random() * speed * (Math.random() < 0.5 ? -1 : 1); // Velocidad aleatoria en dirección X
        this.dy = Math.random() * speed * (Math.random() < 0.5 ? -1 : 1); // Velocidad aleatoria en dirección Y
    }

    draw(context) {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        let isColliding = false;

        // Detección de colisiones con otros círculos
        for (let circle of circles) {
            if (circle !== this) {
                let distance = getDistance(this.posX, circle.posX, this.posY, circle.posY);
                if (distance < (this.radius + circle.radius)) {
                    // Si hay colisión, el círculo más pequeño rebota
                    let smallerCircle = (this.radius < circle.radius) ? this : circle;
                    let largerCircle = (this.radius < circle.radius) ? circle : this;

                    // Se calcula el ángulo de rebote
                    let angle = Math.atan2(smallerCircle.posY - largerCircle.posY, smallerCircle.posX - largerCircle.posX);

                    // Se calcula la nueva velocidad del círculo más pequeño
                    let newDX = Math.cos(angle) * smallerCircle.speed;
                    let newDY = Math.sin(angle) * smallerCircle.speed;

                    // Se actualiza la velocidad del círculo más pequeño
                    smallerCircle.dx = newDX;
                    smallerCircle.dy = newDY;

                    // Se indica que hubo una colisión
                    isColliding = true;
                }
            }
        }

        // Actualiza la posición teniendo en cuenta el rebote en los bordes
        if ((this.posX + this.radius + this.dx) > window_width || (this.posX - this.radius + this.dx) < 0) {
            this.dx = -this.dx; // Cambiar dirección en X si toca los bordes horizontales
            isColliding = true; // Indica que hubo una colisión con los bordes
        }

        if ((this.posY - this.radius + this.dy) < 0 || (this.posY + this.radius + this.dy) > window_height) {
            this.dy = -this.dy; // Cambiar dirección en Y si toca los bordes verticales
            isColliding = true; // Indica que hubo una colisión con los bordes
        }

        // Actualiza la posición
        this.posX += this.dx;
        this.posY += this.dy;

        // Asegura que los círculos no salgan de la pantalla
        this.posX = Math.max(this.radius, Math.min(this.posX, window_width - this.radius));
        this.posY = Math.max(this.radius, Math.min(this.posY, window_height - this.radius));

        // Cambia el color dependiendo de si hubo colisión o no
        this.color = isColliding ? "red" : "blue";

        // Dibuja el círculo
        this.draw(context);
    }
}

function getDistance(x1, x2, y1, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

let circles = [];
for (let i = 0; i < 10; i++) {
    let randomX = Math.random() * window_width;
    let randomY = Math.random() * window_height;
    let randomRadius = Math.floor(Math.random() * 100 + 15);
    let randomSpeed = 5;
    circles.push(new Circle(randomX, randomY, randomRadius, "blue", (i + 1).toString(), randomSpeed));
}

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => circle.update(ctx, circles));
};

updateCircles();
