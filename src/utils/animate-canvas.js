import getRandom from "./get-random";
import findClosestDot from "./find-closest-dots";
import randomDots from "./random-dots";

// Generates a random pattern and returns animation
export default (canvas, settings) => {
    canvas.width = settings.width;
    canvas.height = settings.height;
    const ctx = canvas.getContext("2d");
    const dots = randomDots(settings.numberOfDots, settings.width, settings.height, settings.fps);
    return setInterval(() => {
        ctx.clearRect(0, 0, settings.width, settings.height);
        if(settings.gradient) {
          // Gradient angle and colors
          const length = Math.hypot(settings.width / 2, settings.height / 2);
          const x1 = settings.width / 2 + Math.cos(settings.angle) * length;
          const y1 = settings.height / 2 + Math.sin(settings.angle) * length;
          const reverseAngle = settings.angle > 180 ? settings.angle - 180 : settings.angle + 180;
          const x2 = settings.width / 2 + Math.cos(reverseAngle) * length;
          const y2 = settings.height / 2 + Math.sin(reverseAngle) * length;
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, settings.bgColor1);
          gradient.addColorStop(1, settings.bgColor2);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, settings.width, settings.height);
        } else {
          ctx.fillStyle = settings.bgColor1;
          ctx.fillRect(0, 0, settings.width, settings.height);
        }
        for(let i = 0; i < dots.length; i++) {
          // Drawing the dots
          const dot = dots[i];
          ctx.beginPath();
          ctx.arc(dot.position[0], dot.position[1], dot.diameter, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, ${dot.opacity})`;
          ctx.fill();
          ctx.closePath();
          // Connecting the dot with the closest dots
          for(let j = 0; j < dot.linesTo.length; j++) {
              const closestDot = dot.linesTo[j].dot;
              ctx.beginPath();
              ctx.moveTo(dot.position[0], dot.position[1]);
              ctx.lineTo(closestDot.position[0], closestDot.position[1]);
              ctx.strokeStyle = `rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, ${dot.linesTo[j].opacity})`;
              ctx.stroke();
              ctx.closePath();
              // Increasing opacity of new connections
              if(!dot.linesTo[j].initiated) {
              dot.linesTo[j].opacity += 1 / settings.fps;
              if(dot.linesTo[j].opacity >= 1) {
                  dot.linesTo[j].opacity = 1;
                  dot.linesTo[j].initiated = true;
              }
              continue;
              }
              // Redusing the lifespan of the connections
              dot.linesTo[j].lineLifespan --;
              // Reducing the opacity
              if(dot.linesTo[j].lineLifespan > 0) {
              dot.linesTo[j].opacity = (dot.linesTo[j].lineLifespan / dot.linesTo[j].totalLineLifespan).toFixed(2);
              continue;
            }
            // Removing connections that reached the end of life
            dot.linesTo[j].dot.connectedDots.splice(dot.linesTo[j].dot.connectedDots.indexOf(dot), 1);
            const newClosestDot = findClosestDot(dots, dot);
            const lifespan = settings.fps * getRandom(5, 15);
            dot.linesTo.splice(j, 1, {
              dot: newClosestDot,
              initiated: false,
              opacity: 1 / settings.fps,
              lineLifespan: lifespan,
              totalLineLifespan: lifespan
            });
            newClosestDot.connectedDots.push(dot);
          }
          // Updating the dot's position
          if(dot.position[0] + dot.diameter / 2 <= 20 || dot.position[0] + dot.diameter / 2 >= canvas.width - 20) dot.speed[0] *= -1;
          if(dot.position[1] + dot.diameter / 2 <= 20 || dot.position[1] + dot.diameter / 2 >= canvas.height - 20) dot.speed[1] *= -1;
          dot.position[0] += dot.speed[0];
          dot.position[1] += dot.speed[1];
      }
    }, Math.round(1000 / settings.fps));
};