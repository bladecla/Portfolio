//try to avoid declaring variables at 60fps
const blake = document.getElementById("employable-hunk");
const pt = blake.createSVGPoint();
const anchor = document.getElementById("anchor");
const eyes = Array.from(document.getElementsByClassName("eyes"));
const eyeWidth = 10;
const eyeHeight = 5;
let px = 0, py = 0, h, w, screenPt, mouseX, mouseY; 
let anim = true;
console.log(anim)

//(re)initialize anchor point for eye movement and star animations
const getAnchorScreenCoordinates = function(){
    pt.x = anchor.getAttribute("cx");
    pt.y = anchor.getAttribute("cy");
    return pt.matrixTransform(blake.getScreenCTM());
}

const setScreenPoint = () => {
    screenPt = getAnchorScreenCoordinates();
    console.log(anim)
}

["webkit", "moz"].forEach((prefix) => blake.addEventListener(prefix + "AnimationEnd", 
() => anim = false));
blake.onanimationend = () => anim = false;


//calculate and apply eye transform
const moveEyes = function(e){
    eyes.forEach(eye => {
        h = window.innerHeight;
        w = window.innerWidth;
        if(anim){
            setScreenPoint();
        }
        
        if(e){
            mouseY = e.clientY;
            mouseX = e.clientX;
        }
        px = (mouseX / w) * eyeWidth - (eyeWidth / 2);
        py = ((mouseY - screenPt.y) / h) * eyeHeight;
        eye.style.transform = `translate(${px}%, ${py}%)`
    });
}

document.onmousemove = moveEyes;
blake.onload = window.onresize = setScreenPoint;

window.onscroll = function(){
    setScreenPoint();
    moveEyes(null)
    console.log(anim)
}

// raise brows on navbar hover
const toggleBrows = () => document.getElementById("brows").classList.toggle("raised");
const nav = document.getElementById("navbar");
nav.onmouseenter = nav.onmouseleave = toggleBrows;


// populate sky
const starCount = 500;
const sky = document.getElementById("nightsky");
const populateSky = function(){
    for(let i = 0; i < starCount; i++){
        let star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        
        // if sky loads before blake
        if(!screenPt) {
            setScreenPoint();
            console.log("corrected");
        }
        let attributes = {
            cx: `${Math.random() * 200}%`,
            cy: `${(Math.random() * 200)}%`,
            r: `${(Math.floor(Math.random() * 4)) + 2}`,
            fill: "#fff",
            style: `transform-origin: ${screenPt.x}px ${screenPt.y}px`
        }
        for (let key in attributes){
            star.setAttributeNS(null, key, attributes[key]);
        }
        star.classList.add("star");
        sky.appendChild(star);
    }
}
sky.onload = populateSky;

// make sure anchor point loads before dependent animations