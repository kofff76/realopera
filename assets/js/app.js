(()=>{
  "use strict";
  const preloader=document.getElementById("preloader");
  window.addEventListener("load",()=>{
    if(window.gsap&&preloader){gsap.timeline().to(".preloader-mark",{opacity:0,y:-16,duration:.7,delay:.45,ease:"power3.inOut"}).to(".preloader-line,.preloader-sub",{opacity:0,duration:.4},"<").to(preloader,{yPercent:-100,duration:.9,ease:"power4.inOut",onComplete:()=>preloader.remove()});}
    else preloader?.remove();
  });
  const menu=document.getElementById("siteMenu"),open=document.getElementById("menuOpen"),close=document.getElementById("menuClose");
  const setMenu=v=>{menu?.classList.toggle("is-open",v);menu?.setAttribute("aria-hidden",v?"false":"true");document.body.style.overflow=v?"hidden":""};
  open?.addEventListener("click",()=>setMenu(true)); close?.addEventListener("click",()=>setMenu(false)); menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false))); window.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});

  if(window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    if(window.Lenis){const lenis=new Lenis({lerp:.09,smoothWheel:true});lenis.on("scroll",ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
    gsap.utils.toArray(".reveal-up").forEach(el=>gsap.fromTo(el,{opacity:0,y:55},{opacity:1,y:0,duration:1.05,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 84%",once:true}}));
    gsap.to(".hero-photo--maxim",{yPercent:6,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
    gsap.to(".hero-photo--khachatur",{yPercent:-6,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
    gsap.utils.toArray(".artist-image img,.experience-photo img").forEach(img=>gsap.fromTo(img,{scale:1.05},{scale:1.0,ease:"none",scrollTrigger:{trigger:img.parentElement,start:"top bottom",end:"bottom top",scrub:1}}));
  }

  const modal=document.getElementById("videoModal"),modalInner=document.getElementById("videoModalInner"),modalClose=document.getElementById("videoModalClose");
  function closeModal(){modal?.classList.remove("is-open");modal?.setAttribute("aria-hidden","true");if(modalInner)modalInner.innerHTML="";document.body.style.overflow="";}
  modalClose?.addEventListener("click",closeModal); modal?.addEventListener("click",e=>{if(e.target===modal)closeModal()});
  document.querySelectorAll(".video-card").forEach(card=>card.addEventListener("click",()=>{
    const url=card.dataset.video?.trim();
    if(!url){card.classList.add("needs-video");return;}
    let embed=url;
    if(url.includes("youtube.com/watch?v=")) embed="https://www.youtube.com/embed/"+url.split("v=")[1].split("&")[0];
    if(url.includes("youtu.be/")) embed="https://www.youtube.com/embed/"+url.split("youtu.be/")[1].split("?")[0];
    if(modalInner) modalInner.innerHTML=`<iframe src="${embed}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    modal?.classList.add("is-open");modal?.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  }));
})();
