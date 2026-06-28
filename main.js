/* ==========================================================================
   INITIALIZATION & SETUP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCustomCursor();
  initMagneticButtons();
  initHeroParticles();
  initGsapAnimations();
  initBeforeAfterSlider();
  initPortfolioFilters();
  initReviewsSlider();
  initServiceAreaMap();
  initMobileMenu();
});

/* ==========================================================================
   NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   CUSTOM CURSOR LOGIC
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customCursorFollower');
  
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lagging loop for cursor elements
  function animateCursor() {
    // Quick dot cursor
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Slower trailing circle cursor
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states
  const interactiveElements = document.querySelectorAll('a, button, .btn, .filter-btn, .city-item, .map-hotspot');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });

  // Slider dragging state
  const sliderWrapper = document.getElementById('sliderWrapper');
  if (sliderWrapper) {
    sliderWrapper.addEventListener('mouseenter', () => {
      cursor.classList.add('dragging');
      follower.classList.add('dragging');
    });
    sliderWrapper.addEventListener('mouseleave', () => {
      cursor.classList.remove('dragging');
      follower.classList.remove('dragging');
    });
  }
}

/* ==========================================================================
   MAGNETIC BUTTONS EFFECT
   ========================================================================== */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const position = btn.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;
      
      // Pull button towards cursor position
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    btn.addEventListener('mouseleave', function() {
      // Ease button back to initial origin
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });
}

/* ==========================================================================
   HERO DUST PARTICLES (Canvas)
   ========================================================================== */
function initHeroParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 50;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeRate = Math.random() * 0.002 + 0.001;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Slow fade-out as they float up
      if (this.y < 100) {
        this.opacity -= this.fadeRate;
      }
      
      // Reset if particle dies or drifts out
      if (this.opacity <= 0 || this.y < 0 || this.x < 0 || this.x > canvas.width) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228, 106, 43, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Populate particles
  const particleCount = Math.min(60, Math.floor(canvas.width / 20));
  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    // Pre-distribute them vertically so they don't all start at the bottom
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   GSAP & SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initGsapAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Hero Parallax and Scale-Down Scrub
  gsap.to('#heroBg', {
    scale: 1,
    y: 80,
    ease: "none",
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('#heroBadge, #heroTitle, #heroSubtitle, .hero-actions, #heroTrust', {
    y: -50,
    opacity: 0.1,
    ease: "none",
    scrollTrigger: {
      trigger: '#hero',
      start: '30% top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Hero Initial Load Fades
  const heroTL = gsap.timeline({ defaults: { ease: "power4.out" } });
  heroTL.fromTo('#heroBg', { scale: 1.15, opacity: 0 }, { scale: 1.05, opacity: 1, duration: 1.8 })
        .fromTo('#heroBadge', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=1.2")
        .fromTo('#heroTitle', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=1.0")
        .fromTo('#heroSubtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.9")
        .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.8")
        .fromTo('#heroTrust', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.7");

  // 2. Trust Counters Trigger
  const counterElements = document.querySelectorAll('.trust-number');
  counterElements.forEach(counter => {
    const countTarget = parseInt(counter.getAttribute('data-count'), 10);
    
    gsap.fromTo(counter, { innerText: 0 }, {
      innerText: countTarget,
      duration: 2.2,
      ease: "power2.out",
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: counter,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: function () {
        const val = Math.floor(counter.innerText);
        if (countTarget >= 1000) {
          counter.innerText = val.toLocaleString() + '+';
        } else if (countTarget === 35) {
          counter.innerText = val + '+';
        } else if (countTarget === 5) {
          counter.innerText = parseFloat(counter.innerText).toFixed(1);
        } else {
          counter.innerText = val + '%';
        }
      }
    });
  });

  // 3. Staggered reveals on scroll (General section-padding cards & headers)
  const fadeElements = document.querySelectorAll('[data-scroll]');
  fadeElements.forEach(element => {
    gsap.from(element, {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    });
  });

  // Why choose us Timeline Item Line Trigger
  const timelineDotElements = document.querySelectorAll('.timeline-dot');
  timelineDotElements.forEach(dot => {
    gsap.from(dot, {
      scale: 0.1,
      boxShadow: "none",
      duration: 0.6,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: dot,
        start: "top 80%"
      }
    });
  });

  // 4. Pinned Full-Screen CTA Section
  if (window.innerWidth > 992) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#inspection',
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1
      }
    })
    .fromTo('.cta-panel', { scale: 0.9, opacity: 0.8 }, { scale: 1, opacity: 1, ease: "power1.inOut" });
  }
}

/* ==========================================================================
   BEFORE & AFTER SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const slider = document.getElementById('sliderWrapper');
  const beforeContainer = document.getElementById('beforeContainer');
  const line = document.getElementById('sliderHandleLine');
  const knob = document.getElementById('sliderKnob');
  
  if (!slider || !beforeContainer || !line || !knob) return;

  let isDragging = false;

  function updateSlider(xPos) {
    const rect = slider.getBoundingClientRect();
    let x = xPos - rect.left;
    
    // Bounds check
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    
    const percentage = (x / rect.width) * 100;
    
    // Set line & knob locations
    line.style.left = `${percentage}%`;
    knob.style.left = `${percentage}%`;
    
    // Clip the top image (Before)
    beforeContainer.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
  }

  // Desktop events
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Mobile events (Touch support)
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   PORTFOLIO FILTERS LOGIC
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const showcaseItems = document.querySelectorAll('.showcase-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from others
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      showcaseItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          gsap.fromTo(item, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   GOOGLE REVIEWS SLIDER
   ========================================================================== */
function initReviewsSlider() {
  const slider = document.getElementById('reviewsSlider');
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');
  const cards = document.querySelectorAll('.review-card');
  
  if (!slider || !prevBtn || !nextBtn || cards.length === 0) return;

  let index = 0;

  function getCardWidth() {
    const card = cards[0];
    const margin = parseInt(window.getComputedStyle(card).marginRight || 0) || 32; // Default Gap is 2rem (32px)
    return card.offsetWidth + margin;
  }

  function getMaxIndex() {
    let visibleCards = 3;
    if (window.innerWidth <= 768) visibleCards = 1;
    else if (window.innerWidth <= 992) visibleCards = 2;
    
    return Math.max(0, cards.length - visibleCards);
  }

  function updateSlider() {
    const width = getCardWidth();
    const maxIndex = getMaxIndex();
    
    if (index > maxIndex) index = maxIndex;
    if (index < 0) index = 0;
    
    gsap.to(slider, {
      x: -index * width,
      duration: 0.6,
      ease: "power3.out"
    });
  }

  nextBtn.addEventListener('click', () => {
    const maxIndex = getMaxIndex();
    if (index < maxIndex) {
      index++;
    } else {
      index = 0; // Wrap around
    }
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
    } else {
      index = getMaxIndex(); // Wrap back to end
    }
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);
}

/* ==========================================================================
   INTERACTIVE TEXAS SVG MAP & SERVICE AREA
   ========================================================================== */
function initServiceAreaMap() {
  const hotspots = document.querySelectorAll('.map-hotspot');
  const cityItems = document.querySelectorAll('.city-item');
  const popover = document.getElementById('mapPopover');
  const popoverTitle = document.getElementById('popoverTitle');
  const popoverDesc = document.getElementById('popoverDesc');
  const mapSvg = document.getElementById('texasMapSvg');
  
  if (!popover || !popoverTitle || !popoverDesc || hotspots.length === 0) return;

  const cityData = {
    austin: {
      title: "Austin & Central TX",
      desc: "Architectural metal workshops, copper roofing, and designer tile services for Austin, Westlake, Round Rock, and surrounding areas."
    },
    dallas: {
      title: "Dallas-FW Metroplex",
      desc: "Emergency storm damage response, comprehensive roof repairs, replacement siding, and commercial building envelopes."
    },
    houston: {
      title: "Houston & Gulf Coast",
      desc: "High-efficiency TPO membranes for warehousing hubs, wind-resistant shingles, and industrial flat roof coatings."
    },
    'san-antonio': {
      title: "San Antonio & Hill Country",
      desc: "Traditional barrel tile repair, Spanish slate options, and modern commercial standing seam metal installations."
    }
  };

  function activateCity(cityKey, clientX = null, clientY = null) {
    // 1. Update Map Hotspots
    hotspots.forEach(hs => {
      if (hs.getAttribute('data-city') === cityKey) {
        hs.classList.add('active');
      } else {
        hs.classList.remove('active');
      }
    });

    // 2. Update City Items List
    cityItems.forEach(item => {
      if (item.getAttribute('data-city') === cityKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 3. Update Popover
    const data = cityData[cityKey];
    popoverTitle.innerText = data.title;
    popoverDesc.innerText = data.desc;
    popover.classList.add('active');

    // Place popover over maps on desktop
    if (clientX && clientY && window.innerWidth > 768) {
      const mapRect = mapSvg.getBoundingClientRect();
      const relativeX = clientX - mapRect.left + 20;
      const relativeY = clientY - mapRect.top - 20;
      popover.style.left = `${relativeX}px`;
      popover.style.top = `${relativeY}px`;
    } else {
      // Default positions
      popover.style.left = '5%';
      popover.style.top = '10%';
    }
  }

  // Hotspot listeners
  hotspots.forEach(hs => {
    hs.addEventListener('mouseenter', (e) => {
      const city = hs.getAttribute('data-city');
      activateCity(city, e.clientX, e.clientY);
    });
    hs.addEventListener('mousemove', (e) => {
      const mapRect = mapSvg.getBoundingClientRect();
      const relativeX = e.clientX - mapRect.left + 20;
      const relativeY = e.clientY - mapRect.top - 20;
      popover.style.left = `${relativeX}px`;
      popover.style.top = `${relativeY}px`;
    });
  });

  // City items click/hover listeners
  cityItems.forEach(item => {
    item.addEventListener('click', () => {
      const city = item.getAttribute('data-city');
      activateCity(city);
    });
    item.addEventListener('mouseenter', () => {
      const city = item.getAttribute('data-city');
      activateCity(city);
    });
  });

  // Hide popover if we leave the map container
  mapSvg.addEventListener('mouseleave', () => {
    // Keep active map item, just hide popover display
    popover.classList.remove('active');
  });
}

/* ==========================================================================
   MOBILE BURGER MENU OVERLAY
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById('burgerMenu');
  const navbar = document.getElementById('navbar');
  const menuLinks = document.querySelectorAll('.nav-link');
  
  if (!burger || !navbar) return;

  burger.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
    if (navbar.classList.contains('menu-open')) {
      document.body.style.overflow = 'hidden'; // Lock scrolling
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking link
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });
}
