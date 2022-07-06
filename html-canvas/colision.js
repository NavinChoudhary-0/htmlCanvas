const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
const mouse = {
  x: null,
  y: null
}
const colors = ['#2185C5', '#7ECEFD', '#FF7F66']

function Distance(x1, y1, x2, y2) {
  let a = Math.pow(x1 - x2, 2), b = Math.pow(y1 - y2, 2);
  // consol
  return Math.sqrt(a + b);
}

addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})
addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})
function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
    const m1 = particle.mass;
    const m2 = otherParticle.mass;
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
    const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

let particleArray
class Particle {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.mass = 1;
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    }
    this.radius = radius
    this.opacity = 0.2
   this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.save();
    c.globalAlpha = this.opacity
    c.fillStyle = this.color
    c.fill()
    c.restore()
    c.strokeStyle = this.color
    c.stroke();
    c.closePath()
  }

  update() {
    this.draw()
    for (let i = 0; i < particleArray.length; i++) {
      if (particleArray[i] != this) {
        if (Distance(this.x, this.y, particleArray[i].x, particleArray[i].y) - 2 * this.radius <= 0) {
          resolveCollision(this, particleArray[i]);
        }
      }
    }
    if(Distance(mouse.x, mouse.y, this.x, this.y) < 140 && this.opacity < 1){
      this.opacity = this.opacity +  0.02;
    }else{
      this.opacity = Math.max(0.2, this.opacity - 0.02);
    }
    // console.log(this.opacity)
    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) this.velocity.x = -this.velocity.x
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) this.velocity.y = -this.velocity.y
    this.x += this.velocity.x
    this.y += this.velocity.y
  }
}

function init() {
  particleArray = []
  let radius = 15
  for (let i = 0; i < 400; i++) {
    let x = (Math.random() * (canvas.width - 2 * radius) + radius)
    let y = (Math.random() * (canvas.height - 2 * radius) + radius)
    for(let j = 0; j < particleArray.length - 1; j++){
      if(Distance(x, y ,particleArray[j].x, particleArray[j].y) - 2 * radius < 0){
        x = (Math.random() * (canvas.width - 2 * radius) + radius)
        y = (Math.random() * (canvas.height - 2 * radius) + radius)
        j = -1;
      }
    }
    let index = Math.floor(Math.random() * colors.length)
    particleArray.push(new Particle(x, y, radius, colors[index]))
  }

}

function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  particleArray.forEach((ele, index) => {
    ele.update();
  })
}

init()
animate()