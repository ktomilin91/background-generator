// Reducer returning absolute delta of two values
export default g => (s, v, i) => s + Math.abs(v - g[i]);