(function(){
    // try to avoid declaring variables at 60fps
    const blake = document.getElementById("employable-hunk");
    const pt = blake.createSVGPoint();
    const anchor = document.getElementById("anchor");
    const eyes = Array.from(document.getElementsByClassName("eyes"));
    const eyeWidth = 10, eyeHeight = 5;
    let px = 0, py = 0, screenPt, mouseX, mouseY; 
    let animIsPlaying = true;
    let animationStack = {};

    // (re)initialize anchor point for animations
    const setAnchorScreenCoordinates = function(){
        pt.x = anchor.getAttribute("cx");
        pt.y = anchor.getAttribute("cy");
        screenPt = pt.matrixTransform(blake.getScreenCTM());
        return screenPt;
    }

        // after initial blake head pop-up animation
    const animationEnd = function(){
        animIsPlaying = false;
        setAnchorScreenCoordinates();
    }
    blake.onanimationend = animationEnd;
    const vendorPrefixes = ["webkit", "moz"];
    vendorPrefixes.forEach((prefix) => {
        blake.addEventListener(prefix + "AnimationEnd", animationEnd)
    });
    blake.onload = window.onresize = setAnchorScreenCoordinates;

    ////* JS animations *////

    // calculate and apply eye transform
    const moveEyes = function(e){
    return function eyeLoop(){     
            eyes.forEach(eye => {
                if (animIsPlaying) setAnchorScreenCoordinates();
                // always use last known mouse position 
                if (e){     
                    mouseY = e.clientY;
                    mouseX = e.clientX;
                }
                px = (mouseX / window.innerWidth) * eyeWidth - (eyeWidth / 2);
                py = ((mouseY - screenPt.y) / window.innerHeight) * eyeHeight;
                eye.style.transform = `translate(${px}%, ${py}%)`
            });
        }
    }
    document.onmousemove = e => scheduleAnimation(moveEyes(e));
    window.onscroll = function(){
        setAnchorScreenCoordinates();
        scheduleAnimation(moveEyes(null))
    }

    // smooth scroll


    // schedule animations
        // animations with parameters should use closures!
    const scheduleAnimation = function(animation){
        if (typeof animation === "function"){
            if (!animationStack.hasOwnProperty(animation.name)){
                animationStack[animation.name] = animation;
            }
        }
    }

    // run animations
    const loop = function(){
        if (animationStack) for (task in animationStack){
        animationStack[task]();
        }
        animationStack = {};
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);

    ////* CSS animations *////

    // raise brows on navbar hover
    const nav = document.getElementById("navbar");
    nav.onmouseenter = nav.onmouseleave = () => document.getElementById("brows").classList.toggle("raised");;

    // populate sky with stars
    const starCount = 200;
    const sky = document.getElementById("nightsky");
    const populateSky = function(){
        for(let i = 0; i < starCount; i++){
            let star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            
            // // if sky loads before blake
            // if(!screenPt) {
            //     setAnchorScreenCoordinates();
            // }
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
})();