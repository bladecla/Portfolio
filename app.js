const leftEye = document.getElementById("left-eye");
const rightEye = document.getElementById("right-eye");
const eyes = Array.from(document.getElementsByClassName("eyes"));
const minX = -7;
const maxX = 7;
const minY = -5;
const maxY = 3;
const eyeWidth = Math.abs(minX) + maxX;
const eyeHeight = Math.abs(minY) + maxY;
let px = 0, py = 0; 
let h, w, yOffset;


document.addEventListener("mousemove", function(e){
    eyes.forEach(eye => {
        h = window.innerHeight;
        w = window.innerWidth;
        yOffset = h / 2;
        px = (e.clientX / w) * eyeWidth - eyeWidth / 2;
        py = (((e.clientY) / h) * eyeHeight - eyeHeight / 2);
        console.log(py)
        eye.style.transform = `translate(${px}%, ${py}%)`
    });
}, true);