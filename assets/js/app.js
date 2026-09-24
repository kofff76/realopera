(()=>{
  "use strict";
  const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Decorative motion layer
  const progress=document.createElement('div'); progress.className='scroll-progress'; document.body.appendChild(progress);
  const cursor=document.createElement('div'); cursor.className='lux-cursor'; document.body.appendChild(cursor);
  const glow=document.createElement('div'); glow.className='ambient-glow'; document.body.appendChild(glow);
  document.body.classList.add('motion-ready');

  const preloader=qs('#preloader');
  window.addEventListener('load',()=>{
    if(window.gsap && preloader && !reduce){
      gsap.timeline()
        .fromTo('.preloader-mark',{letterSpacing:'.28em',opacity:0},{letterSpacing:'.08em',opacity:1,duration:1.05,ease:'power3.out'})
        .fromTo('.preloader-line',{scaleX:0},{scaleX:1,duration:.8,ease:'power3.inOut'},'-=.55')
        .fromTo('.preloader-sub',{opacity:0,y:8},{opacity:1,y:0,duration:.55},'-=.35')
        .to('.preloader-mark',{opacity:0,y:-18,duration:.6,delay:.35,ease:'power3.inOut'})
        .to('.preloader-line,.preloader-sub',{opacity:0,duration:.35},'<')
        .to(preloader,{clipPath:'inset(0 0 100% 0)',duration:1.05,ease:'power4.inOut',onComplete:()=>preloader.remove()})
        .add(()=>heroIntro(),'-=.35');
    } else { preloader?.remove(); heroIntro(); }
  });

  const menu=qs('#siteMenu'), open=qs('#menuOpen'), close=qs('#menuClose');
  const setMenu=v=>{menu?.classList.toggle('is-open',v);menu?.setAttribute('aria-hidden',v?'false':'true');document.body.style.overflow=v?'hidden':''; if(window.gsap&&!reduce){gsap.fromTo('.menu-inner nav a',{opacity:0,y:24},{opacity:1,y:0,stagger:.07,duration:.55,ease:'power3.out'});}};
  open?.addEventListener('click',()=>setMenu(true)); close?.addEventListener('click',()=>setMenu(false)); qsa('a',menu).forEach(a=>a.addEventListener('click',()=>setMenu(false))); window.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

  function splitText(el){
    if(!el || el.dataset.split) return;
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(!node.nodeValue.trim()) return;
      const frag=document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(part=>{
        if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part)); return;}
        const span=document.createElement('span'); span.className='motion-word'; span.textContent=part; frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag,node);
    });
    el.dataset.split='1';
  }

  qsa('.concept-copy h2,.artist-copy h2,.program-head h2,.experience-copy h2,.video-head h2,.booking-content h2').forEach(splitText);

  function heroIntro(){
    if(!window.gsap || reduce) return;
    gsap.timeline({defaults:{ease:'power4.out'}})
      .fromTo('.hero-photo--maxim',{clipPath:'inset(0 100% 0 0)',scale:1.12},{clipPath:'inset(0 0% 0 0)',scale:1.02,duration:1.6})
      .fromTo('.hero-photo--khachatur',{clipPath:'inset(0 0 0 100%)',scale:1.12},{clipPath:'inset(0 0 0 0%)',scale:1.02,duration:1.6},'-=1.45')
      .fromTo('.eyebrow',{opacity:0,y:18,letterSpacing:'.6em'},{opacity:1,y:0,letterSpacing:'.38em',duration:.9},'-=.7')
      .fromTo('.hero h1 span',{opacity:0,yPercent:80,rotateX:-25},{opacity:1,yPercent:0,rotateX:0,duration:1.1},'-=.55')
      .fromTo('.hero h1 em',{opacity:0,yPercent:80,rotateX:-25},{opacity:1,yPercent:0,rotateX:0,duration:1.1},'-=.86')
      .fromTo('.hero-lead',{opacity:0,y:24},{opacity:1,y:0,duration:.85},'-=.5')
      .fromTo('.hero-names span',{opacity:0,y:12},{opacity:1,y:0,stagger:.12,duration:.6},'-=.45')
      .fromTo('.hero-scroll',{opacity:0,y:-15},{opacity:1,y:0,duration:.6},'-=.3');
  }

  if(window.gsap && window.ScrollTrigger && !reduce){
    gsap.registerPlugin(ScrollTrigger);
    let lenis;
    if(window.Lenis){lenis=new Lenis({lerp:.075,smoothWheel:true,wheelMultiplier:.92});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}

    // scroll progress + topbar behaviour
    ScrollTrigger.create({start:0,end:'max',onUpdate:self=>gsap.set(progress,{scaleX:self.progress})});
    let last=0; ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{const y=self.scroll(); const down=y>last; gsap.to('.topbar',{y:down&&y>120?-90:0,duration:.45,ease:'power3.out'}); last=y;}});

    // Hero depth
    gsap.to('.hero-photo--maxim',{yPercent:10,scale:1.08,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}});
    gsap.to('.hero-photo--khachatur',{yPercent:-8,scale:1.06,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}});
    gsap.to('.hero-content',{yPercent:18,opacity:.2,ease:'none',scrollTrigger:{trigger:'.hero',start:'20% top',end:'bottom top',scrub:1}});
    gsap.to('.hero-shade',{opacity:.82,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});

    // Every section gets a subtle entrance line
    qsa('section').forEach(section=>{
      const line=document.createElement('i'); line.className='section-sweep'; section.appendChild(line);
      gsap.fromTo(line,{scaleX:0},{scaleX:1,duration:1.3,ease:'power3.inOut',scrollTrigger:{trigger:section,start:'top 82%',once:true}});
    });

    // Headline word choreography
    qsa('[data-split="1"]').forEach(h=>{
      const words=qsa('.motion-word',h);
      gsap.fromTo(words,{opacity:0,yPercent:120,rotate:2},{opacity:1,yPercent:0,rotate:0,stagger:.035,duration:.85,ease:'power4.out',scrollTrigger:{trigger:h,start:'top 84%',once:true}});
    });

    qsa('.reveal-up').forEach(el=>{
      if(el.querySelector('.motion-word')) return;
      gsap.fromTo(el,{opacity:0,y:58,filter:'blur(7px)'},{opacity:1,y:0,filter:'blur(0px)',duration:1.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}});
    });

    qsa('.section-index').forEach(el=>gsap.fromTo(el,{opacity:0,x:-30,letterSpacing:'.42em'},{opacity:1,x:0,letterSpacing:'.28em',duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));

    // Fine details stagger
    gsap.fromTo('.concept-note span',{opacity:0,x:18},{opacity:1,x:0,stagger:.11,duration:.55,scrollTrigger:{trigger:'.concept-note',start:'top 84%',once:true}});
    qsa('.credits').forEach(el=>gsap.fromTo(el,{opacity:0,scaleX:.93,transformOrigin:'left center'},{opacity:1,scaleX:1,duration:.9,scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
    gsap.fromTo('.program-tags span',{opacity:0,y:16,scale:.92},{opacity:1,y:0,scale:1,stagger:.07,duration:.5,ease:'back.out(1.6)',scrollTrigger:{trigger:'.program-tags',start:'top 88%',once:true}});
    gsap.fromTo('.program-details>div',{opacity:0,x:34},{opacity:1,x:0,stagger:.1,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'.program-details',start:'top 84%',once:true}});

    // Image masks + parallax
    qsa('.artist-image,.experience-photo').forEach(box=>{
      gsap.fromTo(box,{clipPath:'inset(8% 8% 8% 8%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.25,ease:'power3.inOut',scrollTrigger:{trigger:box,start:'top 82%',once:true}});
      const img=qs('img',box); if(img) gsap.fromTo(img,{scale:1.13,yPercent:-3},{scale:1.025,yPercent:4,ease:'none',scrollTrigger:{trigger:box,start:'top bottom',end:'bottom top',scrub:1.2}});
    });

    // Artist text drifts opposite to portrait
    qsa('.artist-copy').forEach((copy,i)=>gsap.fromTo(copy,{x:i%2?45:-45},{x:0,ease:'none',scrollTrigger:{trigger:copy,start:'top bottom',end:'center center',scrub:1.4}}));

    // Wine section cinematic background movement
    gsap.to('.program',{backgroundPosition:'50% 100%',ease:'none',scrollTrigger:{trigger:'.program',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.fromTo('.program-number',{opacity:.15,scale:.7},{opacity:1,scale:1,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.program-number',start:'top 88%',once:true}});

    // Video cards reveal from opposite sides
    qsa('.video-card').forEach((card,i)=>{
      gsap.fromTo(card,{opacity:0,x:i?70:-70,rotateY:i?-4:4},{opacity:1,x:0,rotateY:0,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:card,start:'top 84%',once:true}});
      gsap.to(qs('img',card),{yPercent:7,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:1}});
    });

    gsap.to('.booking-bg',{xPercent:-8,scale:1.12,ease:'none',scrollTrigger:{trigger:'.booking',start:'top bottom',end:'bottom top',scrub:1.2}});
    gsap.fromTo('.booking-btn',{boxShadow:'0 0 0 rgba(198,164,107,0)'},{boxShadow:'0 0 42px rgba(198,164,107,.22)',duration:1.8,repeat:-1,yoyo:true,ease:'sine.inOut'});

    // Marquee reacts to scroll speed/direction slightly
    gsap.to('.marquee div',{xPercent:-12,ease:'none',scrollTrigger:{trigger:'.marquee',start:'top bottom',end:'bottom top',scrub:.7}});
  }

  // Premium pointer, glow and card micro-interactions
  if(matchMedia('(pointer:fine)').matches && !reduce){
    let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
    window.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY; gsap.to(glow,{x:e.clientX-180,y:e.clientY-180,duration:1.1,ease:'power3.out'});});
    gsap.ticker.add(()=>{cx+=(mx-cx)*.18;cy+=(my-cy)*.18;gsap.set(cursor,{x:cx,y:cy});});
    qsa('a,button,.video-card').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('is-active'));el.addEventListener('mouseleave',()=>cursor.classList.remove('is-active'));});
    qsa('.video-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(card,{rotateY:x*4,rotateX:-y*4,transformPerspective:1000,duration:.5,ease:'power2.out'});});
      card.addEventListener('pointerleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.7,ease:'power3.out'}));
    });
    const mag=qs('.booking-btn');
    mag?.addEventListener('pointermove',e=>{const r=mag.getBoundingClientRect();gsap.to(mag,{x:(e.clientX-r.left-r.width/2)*.13,y:(e.clientY-r.top-r.height/2)*.18,duration:.35});});
    mag?.addEventListener('pointerleave',()=>gsap.to(mag,{x:0,y:0,duration:.7,ease:'elastic.out(1,.4)'}));
  }

  const modal=qs('#videoModal'), modalInner=qs('#videoModalInner'), modalClose=qs('#videoModalClose');
  function closeModal(){modal?.classList.remove('is-open');modal?.setAttribute('aria-hidden','true');if(modalInner) modalInner.innerHTML='';document.body.style.overflow='';}
  modalClose?.addEventListener('click',closeModal); modal?.addEventListener('click',e=>{if(e.target===modal) closeModal()});
  qsa('.video-card').forEach(card=>card.addEventListener('click',()=>{
    const url=card.dataset.video?.trim(); if(!url) return;
    let content='';
    if(/\.mp4($|\?)/i.test(url)) content=`<video src="${url}" controls autoplay playsinline></video>`;
    else {let embed=url;if(url.includes('youtube.com/watch?v=')) embed='https://www.youtube.com/embed/'+url.split('v=')[1].split('&')[0];if(url.includes('youtu.be/')) embed='https://www.youtube.com/embed/'+url.split('youtu.be/')[1].split('?')[0];content=`<iframe src="${embed}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;}
    modalInner.innerHTML=content; modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
    if(window.gsap&&!reduce) gsap.fromTo(modalInner,{scale:.9,opacity:0},{scale:1,opacity:1,duration:.6,ease:'power4.out'});
  }));
})();
