const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
addEventListener('resize',()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

let colorArray = ["#003547", "#005E54", "#C2BB00", "#E1523D", "#ED8B16"];

function Circle(x, y ,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.vx = Math.random() - 0.5;
    this.vy = Math.random() -  0.5;
}

let circleArray

function DrawCircle(){
    for(let i = 0; i < circleArray.length; i++){
        c.beginPath();
        c.arc(circleArray[i].x, circleArray[i].y, circleArray[i].radius, 0, Math.PI * 2, false);
        c.fillStyle = circleArray[i].color;
        c.fill();
    }
    
}
function makeCircle(){
    circleArray = [];
    for(let i = 0; i < 800; i++){
        let radius = Math.random()*10 + 2;
        let x = (canvas.width - 2 * radius ) * Math.random() + radius;
        let y = (canvas.height - 2 * radius) * Math.random() + radius;
        circleArray.push(new Circle(x, y, radius));
    }
}

function doAnimate(){
    // requestAnimationFrame(doAnimate);
    c.clearRect(0, 0, canvas.width, canvas.height)
    DrawCircle();
    for(let i = 0; i <  circleArray.length; i++){
        if(circleArray[i].x + circleArray[i].radius >= canvas.width || circleArray[i].x - circleArray[i].radius <= 0)
            circleArray[i].vx = -circleArray[i].vx;
        
        if(circleArray[i].y + circleArray[i].radius >= canvas.height || circleArray[i].y - circleArray[i].radius <= 0)
            circleArray[i].vy = -circleArray[i].vy;
        
        circleArray[i].x += circleArray[i].vx;
        circleArray[i].y += circleArray[i].vy;
    }
}

makeCircle();
doAnimate();



