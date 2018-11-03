//try to avoid declaring variables at 60fps
const blake = document.getElementById("employable-hunk");
const pt = blake.createSVGPoint();
const anchor = document.getElementById("anchor");
const eyes = Array.from(document.getElementsByClassName("eyes"));
const minX = -7; // eyeball boundaries
const maxX = 7;
const minY = -5;
const maxY = 3;
const eyeWidth = Math.abs(minX) + maxX;
const eyeHeight = Math.abs(minY) + maxY;
let px = 0, py = 0; 
let h, w, yOffset, screenPt, mouseX, mouseY;


//(re)initialize anchor point for eye movement

const getAnchorScreenCoordinates = function(){
    pt.x = anchor.getAttribute("cx");
    pt.y = anchor.getAttribute("cy");
    return pt.matrixTransform(blake.getScreenCTM());
}

const setScreenPoint = function(){ screenPt = getAnchorScreenCoordinates(); }
blake.onload = window.onresize = setScreenPoint;

//calculate and apply eye transform
const moveEyes = function(e){
    eyes.forEach(eye => {
        h = window.innerHeight;
        w = window.innerWidth;
        yOffset = h / 2;
        if(e){
            mouseY = e.clientY;
            mouseX = e.clientX;
        }
            px = (mouseX / w) * eyeWidth - (eyeWidth / 2);
            py = (((mouseY - screenPt.y) / h) * eyeHeight);
        // } else {
        //     py = ((prevClientY - screenPt.y) / (h)) * eyeHeight;
        // }
        eye.style.transform = `translate(${px}%, ${py}%)`
    });
}

document.onmousemove = moveEyes;
window.onscroll = function(){
    setScreenPoint();
    moveEyes(null)
}