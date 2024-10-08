canvas = document.querySelector("#mycanvas");
ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let prop = 0.001;
let eccentricity = 0.1;
let origin = [canvas.width / 2, canvas.height / 2];
ctx.strokeStyle = "#fff";
ctx.fillStyle = "#fff";

function roundN(x, n) {
  return Math.round(x * 10 ** n) / 10 ** n;
}

function drawReference() {
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(0, origin[1]);
  ctx.lineTo(2 * origin[0], origin[1]);
  ctx.stroke();
}

function drawText(inputText, distanceFromTop) {
  ctx.fillStyle = "#fff";
  ctx.font = "25px Arial";
  ctx.fillText(inputText, 10, distanceFromTop);
}

class circularBody {
  constructor(
    a,
    epsilon,
    theta,
    argumentOfPeriapsis = 0,
    orbitalInclination = 0,
    radius,
    color = "#fff"
  ) {
    this.a = a;
    this.T = 1.00000250961 * Math.pow(a, 1.5);
    this.epsilon = epsilon;
    this.theta = theta;
    this.argumentOfPeriapsis = argumentOfPeriapsis;
    this.orbitalInclination = orbitalInclination;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    let r =
      (this.a * (1 - this.epsilon ** 2)) /
      (1 - this.epsilon * Math.cos(this.theta));
    ctx.beginPath();
    ctx.arc(
      origin[0] + r * Math.cos(this.theta),
      origin[1] - r * Math.sin(this.theta),
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.fill();
  }

  update() {
    let wrongConstantOmega = (2 * Math.PI) / this.T;
    this.theta += prop * this.T * wrongConstantOmega;
  }

  updatePhysicallyCorrect() {
    let wrongConstantOmega = (2 * Math.PI) / this.T;
    let omegaAtApoapsis =
      2 *
      Math.PI *
      0.9999974904 *
      Math.pow((1 - this.epsilon) / (this.a * (1 + this.epsilon)) ** 3, 0.5);
    let curOmega =
      omegaAtApoapsis *
      ((1 - this.epsilon * Math.cos(this.theta)) / (1 - this.epsilon)) ** 2;
    this.theta += curOmega * prop * this.T;
    drawText(
      "Ratio of actual and constant omega: " +
        roundN(curOmega / wrongConstantOmega, 3),
      40
    );
  }
}

class orbit {
  constructor(a, epsilon) {
    this.a = a;
    this.epsilon = epsilon;
    this.pointList = [];
    for (let i = 0.0; i < 2 * Math.PI; i += 0.05) {
      let r =
        (this.a * (1 - this.epsilon ** 2)) / (1 - this.epsilon * Math.cos(i));
      this.pointList.push([r * Math.cos(i), r * Math.sin(i)]);
    }
  }

  draw() {
    ctx.strokeStyle = "#fff";
    for (let i = 0; i < this.pointList.length; i++) {
      ctx.beginPath(this.pointList[i][0], this.pointList[i][1]);
      ctx.moveTo(
        origin[0] + this.pointList[i][0],
        origin[1] - this.pointList[i][1]
      );
      ctx.lineTo(
        origin[0] + this.pointList[(i + 1) % this.pointList.length][0],
        origin[1] - this.pointList[(i + 1) % this.pointList.length][1]
      );
      ctx.stroke();
    }
  }
}

let p1 = new circularBody(350, eccentricity, 0, 0, 0, 10, "#f00");
let p2 = new circularBody(350, eccentricity, 0, 0, 0, 10, "#0f0");
let curOrbit = new orbit(350, eccentricity);

let star = new circularBody(0, 0, 0, 0, 0, 30, "#ff0");

console.log(curOrbit);

document
  .querySelector("#eccentricity-input")
  .addEventListener("keyup", function(e) {
    e.preventDefault();
    if (e.key == "Enter") {
      if (!isNaN(this.value)) {
        let ne = parseFloat(this.value);
        if (ne < 1 && ne >= 0) {
          p1.theta = 0;
          p2.theta = 0;
          p1.epsilon = ne;
          p2.epsilon = ne;
          curOrbit = new orbit(350, ne);
          eccentricity = ne;
        }
      }
    }
  });

function animate() {
  //ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  curOrbit.draw();
  drawReference();
  star.draw();
  p1.draw();
  p1.update();
  p2.draw();
  p2.updatePhysicallyCorrect();
  drawText("Eccentricity: " + eccentricity, 75);

  requestAnimationFrame(animate);
}

animate();
