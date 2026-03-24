/**
 * Site configuration for CI tests.
 * Update this file when sections, nav links, assets, or counts change.
 * The test files themselves should not need to change for routine content updates.
 */

module.exports = {
  // Page
  titlePattern: /Fortera Homes/,

  // Section IDs that must exist in the DOM
  sections: [
    'hero',
    'development',
    'neighbourhood',
    'timeline',
    'about',
    'contact',
  ],

  // Interactive element IDs required by main.js
  interactiveIds: [
    'nav',
    'scrollProgress',
    'menuBtn',
    'mobileMenu',
    'contactForm',
    'formSuccess',
  ],

  // Nav links: { href, text }
  navLinks: [
    { href: '#development', text: 'The Development' },
    { href: '#neighbourhood', text: 'Neighbourhood' },
    { href: '#about', text: 'About Us' },
    { href: '#contact', text: 'Register Interest' },
  ],

  // Static assets that must exist on disk and respond 200
  assets: [
    'assets/FORTERAHOMES.svg',
    'assets/FORTERA.svg',
    'assets/rendering.jpg',
  ],

  // CNAME record
  cname: 'forterahomes.ca',

  // Expected element counts (update if layout changes)
  counts: {
    devStats: 3,
    scoreCards: 3,
    timelineSteps: 4,
    pillars: 4,
  },

  // main.js must export/define these identifiers (guards against accidental deletion)
  jsIdentifiers: [
    'contactForm',
    'menuBtn',
    'animateCounter',
    'revealObserver',
    'scrollProgress',
  ],
};
