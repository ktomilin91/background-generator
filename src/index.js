import "./main.scss";
import Canvas from "./components/canvas.html";
import UI from "./components/ui.html";
import hexToRgb from "./utils/hex-to-rgb";
import animateCanvas from "./utils/animate-canvas";

// Default settings
const settings = {
  bgColor1: "#2c0849",
  bgColor2: "#2d0629",
  lnColor: "#ff8800",
  color: hexToRgb("#ff8800"),
  gradient: true,
  angle: 0,
  fps: 20,
  numberOfDots: 50
}

// Once page has loaded...
window.addEventListener("load", () => {

  // Changing the body background collor to blend better with gradient of the canvas
  document.body.style.backgroundColor = settings.bgColor1;

  // Injecting HTML modules to the DOM
  document.getElementById("root").innerHTML = Canvas + UI;

  // Getting Body height and width
  settings.width = parseInt(window.getComputedStyle(document.body).width);
  settings.height = parseInt(window.getComputedStyle(document.body).height);
  
  // Running the canvas animation
  const canvas = document.getElementById("canvas");
  let animation = animateCanvas(canvas, settings);

  // Handling window resize event
  let resize;
  window.addEventListener("resize", () => {
    // Stopping animation if the window is being resized
    clearInterval(animation);
    // Starting new animation if the window hasn't been resized for 1 second
    clearTimeout(resize);
    resize = setTimeout(() => {
      settings.width = parseInt(window.getComputedStyle(document.body).width);
      settings.height = parseInt(window.getComputedStyle(document.body).height);
      animation = animateCanvas(canvas, settings);
    }, 1000);
  });
  
  // Getting UI elements and giving them initial values
  const backgroundColor1Input = document.getElementById("background-1");
  backgroundColor1Input.value = settings.bgColor1;
  const backgroundColor2Input = document.getElementById("background-2");
  backgroundColor2Input.value = settings.bgColor2;
  const gradientSwitch = document.getElementById("gradient");
  const lineColor = document.getElementById("line-color");
  lineColor.value = settings.lnColor;
  const angleDial = document.getElementById("angle");
  const refresh = document.getElementById("refresh");
  const download = document.getElementById("download");
  
  // Adding listeners for UI events
  // Switch between single-color background and gradient
  // Hiding or showing the second color picker and gradient angle control
  gradientSwitch.addEventListener("change", event => {
    settings.gradient = event.target.checked;
    if(settings.gradient) {
      backgroundColor2Input.style.display = "block";
      angleDial.parentElement.style.display = "block";
      return;
    } 
    backgroundColor2Input.style.display = "none";
    angleDial.parentElement.style.display = "none";
  });
  
  // First color input
  backgroundColor1Input.addEventListener("input", event => {
    settings.bgColor1 = event.target.value;
    // Changing background color of the body so it blends in better
    document.body.style.backgroundColor = settings.bgColor1;
  });
  
  // Second color input
  backgroundColor2Input.addEventListener("input", event => settings.bgColor2 = event.target.value);
  
  // Line color input
  lineColor.addEventListener("input", event => settings.color = hexToRgb(event.target.value));
  
  // Re-draw button
  refresh.addEventListener("click", () => {
    clearInterval(animation);
    animation = animateCanvas(canvas, settings);
  });
  
  // Download button
  // Generates a PNG file from canvas and triggers a download
  download.addEventListener("click", () => {
    const image = canvas.toDataURL("image/png");
    const a = document.createElement('a');
    a.href = image;
    a.download = "output.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  
  // Angle controls
  angleDial.addEventListener("input", event => settings.angle = Number(event.target.value) / 180 * Math.PI);
  
});