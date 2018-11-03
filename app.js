//try to avoid declaring variables at 60fps
const blake = document.getElementById("employable-hunk");
const pt = blake.createSVGPoint();
const anchor = document.getElementById("anchor");
const eyes = Array.from(document.getElementsByClassName("eyes"));
const eyeWidth = 10;
const eyeHeight = 5;
let px = 0, py = 0, h, w, screenPt, mouseX, mouseY; 

//(re)initialize anchor point for eye movement

const getAnchorScreenCoordinates = function(){
    pt.x = anchor.getAttribute("cx");
    pt.y = anchor.getAttribute("cy");
    return pt.matrixTransform(blake.getScreenCTM());
}

const setScreenPoint = () => screenPt = getAnchorScreenCoordinates();

//calculate and apply eye transform
const moveEyes = function(e){
    eyes.forEach(eye => {
        h = window.innerHeight;
        w = window.innerWidth;
        if(e){
            mouseY = e.clientY;
            mouseX = e.clientX;
        }
        px = (mouseX / w) * eyeWidth - (eyeWidth / 2);
        py = ((mouseY - screenPt.y) / h) * eyeHeight;
        eye.style.transform = `translate(${px}%, ${py}%)`
    });
}

blake.onload = window.onresize = setScreenPoint;
document.onmousemove = moveEyes;
window.onscroll = function(){
    setScreenPoint();
    moveEyes(null)
}