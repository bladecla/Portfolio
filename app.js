(function(){
    // try to avoid declaring variables at 60fps
    const blake = document.querySelector("#employable-hunk");
    const pt = blake.createSVGPoint();
    const anchor = document.querySelector("#anchor");
    const eyes = Array.from(document.querySelectorAll(".eyes"));
    const eyeWidth = 10, eyeHeight = 5;
    let px = 0, py = 0, screenPt, mouseX, mouseY; 
    let animIsPlaying = true;
    let animationStack = {}, scrollDuration = 600, scrollTarget;

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
    return function eyeStep(){     
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
        document.querySelector(".navbutton.red").style.width = window.pageYOffset ? "100%" : "0%"
    }

    // smooth scroll
    const smoothScroll = function(e){
        e.preventDefault();
        let id = e.target.getAttribute("href");
        let target = document.querySelector(id);
        let startPosition = window.pageYOffset;

        // cap target scroll position at max scrollable position
        let maxScrollY = document.documentElement.scrollHeight - startPosition - window.innerHeight;
        let targetPosition = Math.min(target.getBoundingClientRect().top, maxScrollY);
        let amt, elapsed, startTime = null;
        
        if (animationStack.hasOwnProperty("scrollLoop") && scrollTarget !== id) delete animationStack.scrollLoop;
        scrollTarget = id;
        target.focus();
        
        return function scrollLoop(time){
            if (startTime === null) startTime = time;
            elapsed = time - startTime;
            amt = easeInOutCubic(elapsed, startPosition, targetPosition, scrollDuration);
            window.scrollTo(0, amt)
            return elapsed < scrollDuration;
        }
        
    };
    
    Array.from(document.querySelectorAll(".navlink")).forEach(btn => {
        btn.onclick = e => scheduleAnimation(smoothScroll(e));
    });
    
    // easing function for smooth scroll
    const easeInOutCubic = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    };
    

    // schedule animations
        // animations with parameters should use closures!
    const scheduleAnimation = function(animation){
        if (typeof animation === "function"){
            if (!animationStack.hasOwnProperty(animation.name)){
                animationStack[animation.name] = animation;
                // console.log("scheduled ", animation.name)
            }
        }
        if(animationStack) window.requestAnimationFrame(loop);
    }

    // run animations
        // animations should return true for loops
    const loop = function(timestamp){
        if (animationStack) for (task in animationStack){
            if (animationStack[task](timestamp)){
                scheduleAnimation(animationStack[task])
            } else delete animationStack[task];
            // console.log("ran ", task)
        }
    }

    ////* CSS animations *////

    

    // raise brows on navbar hover
    const nav = document.querySelector("#navbar");
    nav.onmouseenter = nav.onmouseleave = () => document.getElementById("brows").classList.toggle("raised");;

    // populate sky with stars
    const starCount = 200;
    const sky = document.querySelector("#nightsky");
    const populateSky = function(){
        for(let i = 0; i < starCount; i++){
            let star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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