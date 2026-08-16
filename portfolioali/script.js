// Vanilla JavaScript for Portfolio Operations

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // CANVAS BACKGROUND CONSTELATION WITH INTERACTIVE MOUSE PHYSICS
  // -------------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const mouse = { x: null, y: null, radius: 180 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const techItems = [
      { label: 'Next.js', icon: '⚡' },
      { label: 'React', icon: '⚛️' },
      { label: 'Node.js', icon: '🚀' },
      { label: 'Chrome Ext', icon: '🧩' },
      { label: 'JavaScript', icon: '📜' },
      { label: 'HTML5', icon: '🎨' },
      { label: 'CSS3', icon: '💎' },
      { label: 'REST API', icon: '🛠️' },
      { label: 'MongoDB', icon: '🗄️' },
      { label: 'Git', icon: '🐙' }
    ];

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(65, Math.floor((canvas.width * canvas.height) / 18000));
      for (let i = 0; i < particleCount; i++) {
        const isTech = i % 4 === 0;
        const tech = isTech ? techItems[Math.floor(Math.random() * techItems.length)] : null;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() * 0.6 - 0.3),
          vy: (Math.random() * 0.6 - 0.3),
          radius: isTech ? 4 : 2,
          isTech,
          label: tech ? tech.label : '',
          icon: tech ? tech.icon : '',
          pulsePhase: Math.random() * Math.PI
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Connection lines between particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.14;
            ctx.strokeStyle = `rgba(244, 108, 56, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connection to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.2;
            ctx.strokeStyle = `rgba(244, 108, 56, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            
            // Magnetic attraction physics
            p1.x -= dx * 0.005;
            p1.y -= dy * 0.005;
          }
        }

        p1.x += p1.vx;
        p1.y += p1.vy;
        p1.pulsePhase += 0.02;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        const baseAlpha = 0.25 + Math.sin(p1.pulsePhase) * 0.15;
        ctx.fillStyle = `rgba(244, 108, 56, ${baseAlpha})`;
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        if (p1.isTech) {
          ctx.fillStyle = `rgba(244, 108, 56, ${baseAlpha + 0.15})`;
          ctx.font = '800 11px Inter, sans-serif';
          ctx.fillText(`${p1.icon} ${p1.label}`, p1.x + 8, p1.y + 4);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  // -------------------------------------------------------------
  // ACTIVE NAVIGATION DOCK & SCROLL SPY
  // -------------------------------------------------------------
  const navButtons = document.querySelectorAll('.nav-icon-btn');
  const sections = document.querySelectorAll('section');

  const updateActiveSection = () => {
    let currentId = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop - 180;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    navButtons.forEach(btn => {
      btn.classList.remove('active');
      const href = btn.getAttribute('data-target');
      if (href === currentId) {
        btn.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // -------------------------------------------------------------
  // PROJECT FILTERING
  // -------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-pill-btn');
  const projectCards = document.querySelectorAll('.project-card-sawad');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'All' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------
  // MODALS & DETAILED VIEWS
  // -------------------------------------------------------------
  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDesc = document.getElementById('modal-desc');
  const modalLive = document.getElementById('modal-live');
  const modalGithub = document.getElementById('modal-github');

  const projectsData = {
    1: {
      badge: 'Chrome Extension (MV3)',
      title: 'AdGuard Pro - Chrome Extension',
      image: './images/chrome_ext.jpg',
      desc: 'AdGuard Pro is a production Manifest V3 Chrome extension developed with modern JavaScript ES6+ and Chrome WebRequest APIs. It blocks intrusive scripts, tracks real-time blocked ad analytics, and lets users inject custom filtering rules.',
      live: 'https://chrome.google.com',
      github: 'https://github.com'
    },
    2: {
      badge: 'Next.js 14 & Node.js',
      title: 'LeadFlow SaaS & Automation Platform',
      image: './images/saas_app.jpg',
      desc: 'LeadFlow is an end-to-end web application built with Next.js, React, Node.js, Express, and MongoDB. It allows users to track lead pipelines, visualize marketing metrics with glowing glassmorphic charts, and automate email follow-ups.',
      live: 'https://nextjs.org',
      github: 'https://github.com'
    },
    3: {
      badge: 'Chrome Extension + AI',
      title: 'Smart Form Filler & AI Assistant',
      image: './images/chrome_ext.jpg',
      desc: 'This extension streamlines job applications and web forms by extracting field structures dynamically and auto-filling details using local storage and AI API endpoints.',
      live: 'https://chrome.google.com',
      github: 'https://github.com'
    },
    4: {
      badge: 'React & Node.js Software',
      title: 'Enterprise Payroll & HRMS Software',
      image: './images/custom_software.jpg',
      desc: 'A custom software solution engineered for mid-sized organizations. Built with React frontend components and Node.js backend logic, it simplifies payroll processing and exports automated PDF reports.',
      live: 'https://react.dev',
      github: 'https://github.com'
    }
  };

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const data = projectsData[id];
      if (data && modalBackdrop) {
        modalBadge.textContent = data.badge;
        modalTitle.textContent = data.title;
        modalImage.src = data.image;
        modalDesc.textContent = data.desc;
        modalLive.href = data.live;
        modalGithub.href = data.github;
        modalBackdrop.style.display = 'flex';
      }
    });
  });

  // Thoughts modal
  const thoughtsModal = document.getElementById('thoughts-modal');
  const thoughtsClose = document.getElementById('thoughts-modal-close');
  const thoughtsMeta = document.getElementById('thoughts-modal-meta');
  const thoughtsTitle = document.getElementById('thoughts-modal-title');
  const thoughtsDesc = document.getElementById('thoughts-modal-desc');
  const thoughtsCards = document.querySelectorAll('.thoughts-card');

  const thoughtsData = {
    1: {
      meta: 'Aug 14, 2026 • 5 min read',
      title: 'Building Production Manifest V3 Chrome Extensions',
      content: 'Manifest V3 brought significant changes to browser extension development. Over 2 years of building production extensions, I have developed patterns for managing chrome.storage API state, background message passing, and WebRequest rulesets.'
    },
    2: {
      meta: 'Jul 28, 2026 • 6 min read',
      title: 'Next.js App Router vs Page Router: Software Engineer Guide',
      content: 'When building high-speed web apps, choosing between Next.js App Router and Page Router comes down to data fetching requirements and layout persistence.'
    }
  };

  thoughtsCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const data = thoughtsData[id];
      if (data && thoughtsModal) {
        thoughtsMeta.textContent = data.meta;
        thoughtsTitle.textContent = data.title;
        thoughtsDesc.textContent = data.content;
        thoughtsModal.style.display = 'flex';
      }
    });
  });

  const closeModal = () => {
    if (modalBackdrop) modalBackdrop.style.display = 'none';
    if (thoughtsModal) thoughtsModal.style.display = 'none';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (thoughtsClose) thoughtsClose.addEventListener('click', closeModal);
  
  window.addEventListener('click', (e) => {
    if (e.target === modalBackdrop || e.target === thoughtsModal) {
      closeModal();
    }
  });

  // -------------------------------------------------------------
  // DEV TOOLS CLICK POPUP WITTY FEEDBACK
  // -------------------------------------------------------------
  const toolCards = document.querySelectorAll('.funny-tool-card');
  toolCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove any existing badge pops
      const existing = card.querySelector('.click-badge-pop');
      if (existing) existing.remove();
      
      const badge = document.createElement('span');
      badge.className = 'click-badge-pop';
      badge.textContent = '⚡ Max Mastery!';
      card.appendChild(badge);
      
      setTimeout(() => badge.remove(), 2000);
    });
  });

  // -------------------------------------------------------------
  // SIMPLIFIED CONTACT FORM SUBMIT HANDLER
  // -------------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  const successToast = document.getElementById('success-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (successToast) {
        successToast.style.display = 'flex';
        contactForm.reset();
        setTimeout(() => {
          successToast.style.display = 'none';
        }, 5000);
      }
    });
  }
});
