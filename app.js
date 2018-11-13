// try to avoid declaring variables at 60fps
const blake = document.getElementById("employable-hunk");
const pt = blake.createSVGPoint();
const anchor = document.getElementById("anchor");
const eyes = Array.from(document.getElementsByClassName("eyes"));
const eyeWidth = 10, eyeHeight = 5;
let px = 0, py = 0, h, w, screenPt, mouseX, mouseY; 
let animIsPlaying = true;
let animationStack = {};

// (re)initialize anchor point for animations
const getAnchorScreenCoordinates = function(){
    pt.x = anchor.getAttribute("cx");
    pt.y = anchor.getAttribute("cy");
    return pt.matrixTransform(blake.getScreenCTM());
}
const setScreenPoint = () => screenPt = getAnchorScreenCoordinates();

// after initial blake head animation into view
const animationEnd = function(){
    animIsPlaying = false;
    setScreenPoint();
}
blake.onanimationend = animationEnd;
const vendorPrefixes = ["webkit", "moz"];
vendorPrefixes.forEach((prefix) => {
    blake.addEventListener(prefix + "AnimationEnd", animationEnd)
});
blake.onload = window.onresize = setScreenPoint;

// JS animations

// calculate and apply eye transform
const moveEyes = function(e){
    eyes.forEach(eye => {
        h = window.innerHeight;
        w = window.innerWidth;
        if (animIsPlaying) setScreenPoint();
        // always use last known mouse position 
        if (e){     
            mouseY = e.clientY;
            mouseX = e.clientX;
        }
        px = (mouseX / w) * eyeWidth - (eyeWidth / 2);
        py = ((mouseY - screenPt.y) / h) * eyeHeight;
        eye.style.transform = `translate(${px}%, ${py}%)`
    });
}
document.onmousemove = e => scheduleAnimation(moveEyes, e);
// document.onmousemove = moveEyes;
window.onscroll = function(){
    setScreenPoint();
    scheduleAnimation(moveEyes, null)
}

// smooth scroll


// schedule animations
const scheduleAnimation = function(animation, ...animParams){
    const name = animation.name;
    if (animParams != false || !animationStack.hasOwnProperty(name)){
        animationStack[name] = {
            func: animation,
            params: animParams
        };
    }
        // console.log("scheduled: ", animationStack[name].params)
}

// run animations
const loop = function(){
    if (animationStack) for (task in animationStack){
       const {func, params} = animationStack[task];
    //    console.log("ran: ", params)
       func(...params);
    }
    animationStack = {};
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);

//CSS animations

// raise brows on navbar hover
const toggleBrows = () => document.getElementById("brows").classList.toggle("raised");
const nav = document.getElementById("navbar");
nav.onmouseenter = nav.onmouseleave = toggleBrows;


// populate sky with stars
const starCount = 200;
const sky = document.getElementById("nightsky");
const populateSky = function(){
    for(let i = 0; i < starCount; i++){
        let star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        
        // if sky loads before blake
        if(!screenPt) {
            setScreenPoint();
        }
        let attributes = {
            cx: `${Math.random() * 100}%`,
            cy: `${(Math.random() * 90) + 10}%`,
            r: `${(Math.random() * 3) + 1}`,
            fill: "#fff",    
        }
        let style = `transform-origin: ${attributes.cx} ${attributes.cy}; animation-delay: ${Math.random() * 5}s`;
        attributes.style = style;
        for (let key in attributes){
            star.setAttributeNS(null, key, attributes[key]);
        }
        star.classList.add("star");
        sky.appendChild(star);
    }
}
sky.onload = populateSky;