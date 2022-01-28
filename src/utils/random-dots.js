import getRandom from "./get-random";
import findClosestDot from "./find-closest-dots";

// Generates an array with randomly positioned dots
export default (num, width, height, fps) => {
    const arr = [];
    for(let i = 0; i < num; i++) {
      const numberOfLines = getRandom(2,5);
      arr.push({
        position: [
          getRandom(20, width - 20),
          getRandom(20, height - 20)
        ],
        diameter: numberOfLines - 1,
        opacity: numberOfLines * 0.2,
        speed: [getRandom(-30,30) / 100, getRandom(-30,30) / 100],
        numberOfLines: numberOfLines,
        linesTo: [], // [{dot: dot, initiated: false, opacity: 0, lineLifespan: fps * number of seconds}]
        connectedDots: []
      });
    }
    // Connecting the closest dots
    for(let i = 0; i < arr.length; i++) {
      const dot = arr[i];
      for(let j = 0; j < dot.numberOfLines; j++) {
        const closestDot = findClosestDot(arr, dot);
        const lifespan = fps * getRandom(5, 15);
        const lifeLeft = getRandom(20, 100) / 100;
        dot.linesTo.push({ 
          dot: closestDot,
          initiated: true,
          opacity: (lifespan * lifeLeft) / lifespan,
          lineLifespan: lifespan * lifeLeft,
          totalLineLifespan: lifespan
        });
        closestDot.connectedDots.push(dot);
      }
    }
    return arr;
};