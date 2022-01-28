import addAbsDelta from "./add-abs-delta";

// Looks for closest dots in Array of dots
export default (dots, dot) => {
    return dots.filter(item => {
      if(item === dot || item.connectedDots.indexOf(dot) >= 0) return false;
      return true;
    }).reduce((a, b) => {
      return a.position.reduce(addAbsDelta(dot.position), 0) < b.position.reduce(addAbsDelta(dot.position), 0) ? a : b;
    });
};