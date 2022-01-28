// Returns a random number between min and max (inclusive)
export default (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};