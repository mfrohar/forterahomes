/* ============================================================
   FORTERA HOMES — main.js
   ============================================================ */

/* ---- Mobile menu ------------------------------------------ */
const menuBtn    = document.getElementById('menuBtn');
const navMobile  = document.getElementById('navMobile');

menuBtn.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  navMobile.setAttribute('aria-hidden', !open);
});

navMobile.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    navMobile.setAttribute('aria-hidden', 'true');
  });
});

/* ---- Subnav: show/hide based on hero visibility ----------- */
const heroSection = document.getElementById('hero');

const heroObserver = new IntersectionObserver(
  ([entry]) => {
    document.body.classList.toggle('subnav-visible', !entry.isIntersecting);
    document.getElementById('subnav').setAttribute('aria-hidden', entry.isIntersecting);
  },
  { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
);

heroObserver.observe(heroSection);

/* ---- Subnav: active section highlight --------------------- */
const subnavLinks = document.querySelectorAll('.subnav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        subnavLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: '-72px 0px 0px 0px' }
);

['development', 'neighbourhood', 'about', 'contact'].forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ---- Unit filter tabs ------------------------------------- */
document.querySelectorAll('.unit-filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.unit-filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Flash effect on cards
    const grid = document.querySelector('.units-grid');
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(8px)';
    grid.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => {
      const floor = tab.dataset.filter;
      document.querySelectorAll('.unit-card').forEach(card => {
        card.style.display = card.dataset.floor === floor ? 'flex' : 'none';
      });
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }, 150);
  });
});

/* ---- Photo grid lightbox ---------------------------------- */
const photoSrcs = [
  'assets/kitchen.jpg',
  'assets/Bed1.jpg',
  'assets/Bath1.jpg',
  'assets/living2.jpg',
  'assets/Bed2.jpg',
  'assets/Bath2.jpg'
];

let lightboxIndex = 0;
const lightbox = document.getElementById('photoLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');

function openLightbox(index) {
  lightboxIndex = index;
  lightboxImg.src = photoSrcs[lightboxIndex];
  lightboxCounter.textContent = `${lightboxIndex + 1} of ${photoSrcs.length}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.photo-grid-item').forEach(item => {
  item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
});

document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);

document.getElementById('lightboxNext')?.addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % photoSrcs.length;
  lightboxImg.src = photoSrcs[lightboxIndex];
  lightboxCounter.textContent = `${lightboxIndex + 1} of ${photoSrcs.length}`;
});

document.getElementById('lightboxPrev')?.addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + photoSrcs.length) % photoSrcs.length;
  lightboxImg.src = photoSrcs[lightboxIndex];
  lightboxCounter.textContent = `${lightboxIndex + 1} of ${photoSrcs.length}`;
});

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
});

/* ---- Neighbourhood accordion ------------------------------ */
document.querySelectorAll('.accordion-item').forEach(item => {
  item.querySelector('.accordion-trigger').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- Reveal scroll animations ----------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Hero image tap-to-swap ------------------------------- */
const heroTapViewer = document.getElementById('heroTapViewer');
const heroImg1 = document.getElementById('heroImg1');
const heroImg2 = document.getElementById('heroImg2');
const heroTapHint = document.getElementById('heroTapHint');
let heroActive = 1;

heroTapViewer?.addEventListener('click', () => {
  if (heroActive === 1) {
    heroImg1.classList.remove('active');
    heroImg2.classList.add('active');
    heroActive = 2;
  } else {
    heroImg2.classList.remove('active');
    heroImg1.classList.add('active');
    heroActive = 1;
  }
  // Hide hint permanently on first tap
  if (heroTapHint && heroTapHint.style.visibility !== 'hidden') {
    heroTapHint.style.opacity = '0';
    heroTapHint.style.visibility = 'hidden';
  }
});

let tapStartX = 0;
heroTapViewer?.addEventListener('touchstart', e => {
  tapStartX = e.touches[0].clientX;
}, { passive: true });

heroTapViewer?.addEventListener('touchend', e => {
  const diff = Math.abs(tapStartX - e.changedTouches[0].clientX);
  if (diff < 10) heroTapViewer.click();
}, { passive: true });

/* ---- Form validation -------------------------------------- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const nameInput   = document.getElementById('fname');
const emailInput  = document.getElementById('femail');
const nameError   = document.getElementById('nameError');
const emailError  = document.getElementById('emailError');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  nameError.textContent  = '';
  emailError.textContent = '';

  if (!nameInput.value.trim()) {
    nameError.textContent = 'Name is required.';
    valid = false;
  }

  const emailVal = emailInput.value.trim();
  if (!emailVal) {
    emailError.textContent = 'Email is required.';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    emailError.textContent = 'Please enter a valid email address.';
    valid = false;
  }

  if (valid) {
    contactForm.hidden = true;
    formSuccess.hidden = false;
  }
});

