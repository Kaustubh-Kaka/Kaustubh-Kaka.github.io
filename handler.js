let contentID = 1;

if (contentID == 1) {
  document.querySelector("#content-area").insertAdjacentHTML(
    "afterbegin",
    `<canvas id="mycanvas"></canvas>
    <input
      id="eccentricity-input"
      placeholder="Enter new eccentricity value"
      style=" position:absolute; top:90px; left: 10px; width: 300px; height: 30px;font-size: 20px; border-radius: 5px; "
    />
    <div style="position: absolute; top: 125px; left: 10px; color: #fff; font-family: Arial, Helvetica, sans-serif; ">Display circle projection <input id="guide-toggle-check" type="checkbox" checked> </div>
`
  );

  canvas = document.querySelector("#mycanvas");
  ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let disabled = false;
  let prop = 0.001;
  let eccentricity = 0.1;
  let origin = [canvas.width / 2, canvas.height / 2];
  console.log(origin);
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";

  let roundN = function(x, n) {
    return Math.round(x * 10 ** n) / 10 ** n;
  };

  let drawReference = function() {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(0, origin[1]);
    ctx.lineTo(2 * origin[0], origin[1]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  let drawText = function(inputText, distanceFromTop) {
    ctx.fillStyle = "#fff";
    ctx.font = "25px Arial";
    ctx.fillText(inputText, 10, distanceFromTop);
  };

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
      ctx.lineWidth = 1;

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

    drawImage() {
      ctx.strokeStyle = this.color;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 2;

      let r = this.a / 2;
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

    drawRay() {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;

      let r = Math.max(
        (this.a * (1 - this.epsilon ** 2)) /
          (1 - this.epsilon * Math.cos(this.theta)),
        this.a / 2
      );
      ctx.beginPath();
      ctx.moveTo(origin[0], origin[1]);
      ctx.lineTo(
        origin[0] + r * Math.cos(this.theta),
        origin[1] - r * Math.sin(this.theta)
      );
      ctx.stroke();
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
        "Ratio of actual and average omega: " +
          roundN(curOmega / wrongConstantOmega, 3),
        40
      );
    }
  }

  class orbit {
    constructor(a, epsilon) {
      this.a = a;
      this.epsilon = epsilon;
    }

    draw() {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();

      ctx.ellipse(
        origin[0] + this.a * this.epsilon,
        origin[1],
        this.a,
        this.a * Math.pow(1 - this.epsilon ** 2, 0.5),
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
  }

  let p1 = new circularBody(350, eccentricity, 0, 0, 0, 10, "#f00");
  let p2 = new circularBody(350, eccentricity, 0, 0, 0, 10, "#0f0");
  let curOrbit = new orbit(350, eccentricity);
  let imageOrbit = new orbit(350 / 2, 0);

  let star = new circularBody(0, 0, 0, 0, 0, 30, "#ff0");

  console.log(ctx);

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
            curOrbit.epsilon = ne;
            eccentricity = ne;
          }
        }
      }
    });

  document
    .querySelector("#guide-toggle-check")
    .addEventListener("click", function(e) {
      disabled = !this.checked;
    });

  let animate = function() {
    //ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawReference();
    curOrbit.draw();
    if (!disabled) {
      imageOrbit.draw();
      p1.drawRay();
      p2.drawRay();
      p1.drawImage();
      p2.drawImage();
    }

    star.draw();
    p1.draw();
    p1.update();
    p2.draw();
    p2.updatePhysicallyCorrect();
    drawText("Eccentricity: " + eccentricity, 75);

    requestAnimationFrame(animate);
  };

  animate();
}
