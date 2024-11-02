let contentID = "TRS";

function renderMainContent() {
  if (contentID == "animation") {
    document.querySelector("#content-area").innerHTML = document.querySelector(
      "#animation-content"
    ).innerHTML;

    canvas = document.querySelector("#mycanvas");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let disabled = false;
    let sliderEnable = false;
    let isUpdating = true;
    let eccentricityScale = 0.6;
    let prop = 0.001;
    let eccentricity = 0.6;
    let origin = [canvas.width / 2, canvas.height / 2];
    let eotPoints = [];
    let eotGraphOrigin = [40, 650];
    let eotGraphScale = [0.06, 90];
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

    let clamp = function(x, a, b) {
      if (x < a) return a;
      else if (x > b) return b;
      else return x;
    };

    let drawEOTGraph = function() {
      console.log("working");
      ctx.beginPath();
      ctx.strokeStyle = "#fff";
      ctx.setLineDash([]);
      for (let i = 0; i < eotPoints.length - 1; i++) {
        ctx.moveTo(
          eotGraphOrigin[0] + eotGraphScale[0] * eotPoints[i][0],
          eotGraphOrigin[1] - eotGraphScale[1] * eotPoints[i][1]
        );
        ctx.lineTo(
          eotGraphOrigin[0] + eotGraphScale[0] * eotPoints[i + 1][0],
          eotGraphOrigin[1] - eotGraphScale[1] * eotPoints[i + 1][1]
        );
      }
      ctx.stroke();
    };

    class orbit {
      constructor(a, epsilon, lineStyle = []) {
        this.a = a;
        this.epsilon = epsilon;
        this.lineStyle = lineStyle;
      }

      draw() {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.setLineDash(this.lineStyle);
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
        ctx.setLineDash([]);
      }
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
        this.updateN = 0;
        this.idealOrbit = new orbit(this.a, 0, [5, 5]);
        this.bodyOrbit = new orbit(this.a, this.epsilon);
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

        let r = this.a;
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

      drawIdealOrbit() {
        this.idealOrbit.draw();
      }

      drawBodyOrbit() {
        this.bodyOrbit.draw();
      }

      drawIdeal() {
        ctx.beginPath();
        ctx.strokeStyle = "#f00";
        ctx.fillStyle = "#f00";
        ctx.arc(
          origin[0] + this.a * Math.cos(2 * Math.PI * this.updateN * prop),
          origin[1] - this.a * Math.sin(2 * Math.PI * this.updateN * prop),
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
          this.a
        );
        ctx.beginPath();
        ctx.moveTo(origin[0], origin[1]);
        ctx.lineTo(
          origin[0] + r * Math.cos(this.theta),
          origin[1] - r * Math.sin(this.theta)
        );
        ctx.stroke();
      }

      updatePhysicallyCorrect(internalUpdate = false) {
        if (!internalUpdate) this.updateN += 1;
        this.updateN %= parseInt(1 / prop);

        let omegaAtApoapsis =
          2 *
          Math.PI *
          0.9999974904 *
          Math.pow(
            (1 - this.epsilon) / (this.a * (1 + this.epsilon)) ** 3,
            0.5
          );
        let curOmega =
          omegaAtApoapsis *
          ((1 - this.epsilon * Math.cos(this.theta)) / (1 - this.epsilon)) ** 2;

        this.theta += curOmega * prop * this.T;
        while (this.theta > 2 * Math.PI) this.theta -= 2 * Math.PI;

        let equationOfTime = this.theta - 2 * this.updateN * prop * Math.PI;
        if (eotPoints.length < parseInt(1 / prop) - 1)
          eotPoints.push([this.updateN * prop * this.T, equationOfTime]);

        drawText(
          "Equation of time: " + roundN((180 * equationOfTime) / Math.PI, 3),
          40
        );
      }

      recompute() {
        if (this.updateN > parseInt(1 / prop) / 2) {
          this.theta = Math.PI;
          for (let i = 500; i < this.updateN; i++)
            this.updatePhysicallyCorrect(true);
        } else {
          this.theta = 0;
          for (let i = 0; i < this.updateN; i++)
            this.updatePhysicallyCorrect(true);
        }
      }
    }

    let p2 = new circularBody(350, eccentricity, 0, 0, 0, 10, "#0f0");

    let star = new circularBody(0, 0, 0, 0, 0, 30, "#ff0");

    document
      .querySelector("#guide-toggle-check")
      .addEventListener("click", function(e) {
        disabled = !this.checked;
      });

    document.querySelector("#slider").style.left =
      (eccentricity * 200) / eccentricityScale - 10;

    document
      .querySelector("#slider")
      .addEventListener("mousedown", function(e) {
        e.preventDefault();
        sliderEnable = true;
      });

    document.querySelector("body").addEventListener("mousemove", function(e) {
      e.preventDefault();
      if (sliderEnable) {
        let eslider = document.querySelector("#slider");
        eslider.style.left = clamp(e.x - 30, -10, 190);
        eccentricity =
          (eccentricityScale * (parseFloat(eslider.style.left) + 10)) / 200;
        p2.bodyOrbit.epsilon = eccentricity;
        p2.epsilon = eccentricity;
        p2.recompute();
      }
    });

    document.querySelector("body").addEventListener("mouseup", function(e) {
      e.preventDefault();
      sliderEnable = false;
    });

    document
      .querySelector("#animation-toggle")
      .addEventListener("click", function(e) {
        e.preventDefault();
        isUpdating = !isUpdating;
        if (isUpdating) this.innerHTML = "Pause";
        else this.innerHTML = "Play";
      });

    document
      .querySelector("#sliding-bar")
      .addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector("#slider").style.left = e.x - 30;
        eccentricity = (eccentricityScale * (parseFloat(e.x - 30) + 10)) / 200;
        p2.bodyOrbit.epsilon = eccentricity;
        p2.epsilon = eccentricity;
        p2.recompute();
      });

    let animate = function() {
      //ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawReference();
      drawEOTGraph();
      p2.drawBodyOrbit();
      if (!disabled) {
        p2.drawIdealOrbit();
        //p2.drawRay();
        p2.drawImage();
      }

      star.draw();
      p2.draw();
      p2.drawIdeal();
      if (isUpdating) {
        p2.updatePhysicallyCorrect();
      }
      drawText("Eccentricity: " + roundN(eccentricity, 3), 75);

      requestAnimationFrame(animate);
    };

    animate();
  } else if (contentID == "logo") {
    document.querySelector("#content-area").innerHTML = `
      <h1>Hello I am Kaustubh kaka</h1>
    `;
  } else if (contentID == "blog") {
    document.querySelector("#content-area").innerHTML = ``;
  } else if (contentID == "TRS") {
    document.querySelector("#content-area").innerHTML = document.querySelector(
      "#content-area"
    ).innerHTML = document.querySelector("#TRS-content").innerHTML;
  }
}

renderMainContent();

let navitem = document.querySelectorAll(".navitem");

for (let i = 0; i < navitem.length; i++) {
  navitem[i].addEventListener("click", function(e) {
    e.preventDefault();
    contentID = navitem[i].dataset.content;
    renderMainContent();
  });
}
