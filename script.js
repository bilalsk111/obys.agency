function locomotiveAnimation(){
  const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true,
    lerp: 0.5, // Adjust smoothness (0 to 1)
    });

}
locomotiveAnimation();

function loaderAnimation() {
  var tl = gsap.timeline();

  tl.from(".line h1", {
    y: 150,
    stagger: 0.2,
    duration: 0.5,
    delay: 0.3
  })
    .from("#loader p", {
      y: 0,
      duration: 0.6,
      delay: 0.5,
      ease: "power4.out",
      opacity: 0
    })
    .from("#line1-part1", {
      opacity: 0,
      onStart: function () {
        var h5timer = document.querySelector("#line1-part1 h5");
        var grow = 0;
        setInterval(function () {
          if (grow < 100) {
            h5timer.innerHTML = grow++;
          } else {
            h5timer.innerHTML = grow;
          }
        }, 27);
      },
    })
    .to(".line h2", {
      animationName: "loaderAnime",
      opacity: 1,
    })
  tl.to("#loader", {
    opacity: 0,
    duration: 0.2,
    delay: 2,
  });
  tl.from("#hero-section", {
    delay: 0.1,
    y: 1500,
    duration: 0.5,
    ease: "power4"
  });
  tl.to("#loader", {
    display: "none",
  });
tl.from(".navbar",{
  opacity: 0
})
tl.from(".hero #num_head",{
  opacity: 0,
  y: 10
})

tl.from(".main-text h1",{
    y: 110,
    duration: 0.5,
    stagger: 0.25,
    ease: "power4",
  })
}
function cursorAnimation(){
  Shery.mouseFollower({
    skew: true,
  });
  Shery.makeMagnet(".menu");
  Shery.makeMagnet(".nav-links a");
}

var flagElement = document.querySelector("#main-text3");
flagElement.addEventListener("mouseenter", function () {
  flagElement.addEventListener("mousemove", function (dets) {
    gsap.to(".mousefollower", {
      opacity: 0
    });
    // The rest is handled by our Three.js implementation in flagWave.js
  });
  
});
flagElement.addEventListener("mouseleave", function (dets) {
  gsap.to(".mousefollower", {
    opacity: 1
  });
  // The rest is handled by our Three.js implementation in flagWave.js
});

var videoContainer = document.querySelector(".video-container");
var video = document.querySelector(".video-container video");
var videoCursor = document.querySelector("#video-cursor");
var flag = 0;

function handleVideoInteraction() {
  if (flag === 0) {
    video.play();
    video.style.opacity = 1;
    videoContainer.style.backgroundImage = "none";
    videoCursor.innerHTML = `<i class="ri-pause-line"></i>`;
    gsap.to(videoCursor, {
      scale: 0.5,
    });
    flag = 1;
  } else {
    video.pause();
    video.style.opacity = 0;
    videoContainer.style.backgroundImage = "url(./assets/Showreel-2022-preview-1.jpg)";
    videoCursor.innerHTML = `<i class="ri-play-mini-fill"></i>`;
    gsap.to(videoCursor, {
      scale: 1,
    });
    flag = 0;
  }
}

if ('ontouchstart' in window || navigator.maxTouchPoints) {
  // Mobile devices
  videoContainer.addEventListener("click", handleVideoInteraction);
} else {
  // Desktop devices
  videoContainer.addEventListener("mouseenter", function () {
    gsap.to(".mousefollower", {
      opacity: 0
    });
    
    function handleMouseMove(event) {
      const rect = videoContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      gsap.to(videoCursor, {
        left: x + "px",
        top: y + "px",
        duration: 0.1
      });
    }
    
    videoContainer.addEventListener("mousemove", handleMouseMove);
    
    videoContainer.addEventListener("mouseleave", function () {
      gsap.to(".mousefollower", {
        opacity: 1
      });
      gsap.to(videoCursor, {
        left: "70%",
        top: "-15%",
        transform: "translate(116px, -11px)",
      });
      videoContainer.removeEventListener("mousemove", handleMouseMove);
    });
  });
  
  videoContainer.addEventListener("click", handleVideoInteraction);
}


function sheryAnimation() {
  if (!('ontouchstart' in window || navigator.maxTouchPoints)) {
    // Only apply the effect on desktop devices
    Shery.imageEffect(".project_image", {
      style: 5,
      gooey: true,
      // debug:true,
      config:{"a":{"value":4.35,"range":[0,30]},"b":{"value":0.33,"range":[-1,1]},"zindex":{"value":"-999999","range":[-9999999,9999999]},"aspect":{"value":0.9611173320748952},"ignoreShapeAspect":{"value":true},"shapePosition":{"value":{"x":0,"y":0}},"shapeScale":{"value":{"x":0.5,"y":0.5}},"shapeEdgeSoftness":{"value":0,"range":[0,0.5]},"shapeRadius":{"value":0,"range":[0,2]},"currentScroll":{"value":0},"scrollLerp":{"value":0.07},"gooey":{"value":true},"infiniteGooey":{"value":false},"growSize":{"value":4,"range":[1,15]},"durationOut":{"value":1,"range":[0.1,5]},"durationIn":{"value":1.5,"range":[0.1,5]},"displaceAmount":{"value":0.5},"masker":{"value":true},"maskVal":{"value":1,"range":[1,5]},"scrollType":{"value":0},"geoVertex":{"range":[1,64],"value":1},"noEffectGooey":{"value":true},"onMouse":{"value":1},"noise_speed":{"value":0.5,"range":[0,10]},"metaball":{"value":0.33,"range":[0,2]},"discard_threshold":{"value":0.5,"range":[0,1]},"antialias_threshold":{"value":0.01,"range":[0,0.1]},"noise_height":{"value":0.5,"range":[0,2]},"noise_scale":{"value":10,"range":[0,100]}}
    });
  }
}


cursorAnimation();
loaderAnimation();
sheryAnimation();