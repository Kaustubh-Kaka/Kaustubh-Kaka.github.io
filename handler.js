let contentID = "animation";

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
    let prop = 0.001;
    let eccentricity = 0;
    let origin = [canvas.width / 2, canvas.height / 2];
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
          Math.pow(
            (1 - this.epsilon) / (this.a * (1 + this.epsilon)) ** 3,
            0.5
          );
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

    document
      .querySelector("#guide-toggle-check")
      .addEventListener("click", function(e) {
        disabled = !this.checked;
      });

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
        eslider.style.left = clamp(e.x - 20, -10, 190);
        eccentricity = (0.999 * (parseFloat(eslider.style.left) + 10)) / 200;
        curOrbit.epsilon = eccentricity;
        p1.epsilon = eccentricity;
        p2.epsilon = eccentricity;
      }
    });

    document.querySelector("body").addEventListener("mouseup", function(e) {
      e.preventDefault();
      sliderEnable = false;
    });

    document
      .querySelector("#sliding-bar")
      .addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector("#slider").style.left = e.x - 30;
        eccentricity = (0.999 * (parseFloat(e.x - 30) + 10)) / 200;
        curOrbit.epsilon = eccentricity;
        p1.epsilon = eccentricity;
        p2.epsilon = eccentricity;
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
      drawText("Eccentricity: " + roundN(eccentricity, 3), 75);

      requestAnimationFrame(animate);
    };

    animate();
  } else {
    document.querySelector("#content-area").innerHTML = `
      <h1>Hello I am Kaustubh kaka</h1>
    `;
  }
}

renderMainContent();

let navitem = document.querySelectorAll(".navitem");

for (let i = 0; i < navitem.length; i++) {
  navitem[i].addEventListener("click", function(e) {
    e.preventDefault();
    contentID = navitem[i].dataset.content;
    console.log(contentID);
    renderMainContent();
  });
}
