const { test, expect } = require('@playwright/test');
const site = require('./site.config');

test.describe('Fortera Homes – Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ─── Page fundamentals ────────────────────────────────────────────────────

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(site.titlePattern);
  });

  test('loads without uncaught JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('/');
    expect(errors, `Uncaught errors: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('main stylesheet responds 200', async ({ page }) => {
    expect((await page.request.get('/styles.css')).status()).toBe(200);
  });

  test('main script responds 200', async ({ page }) => {
    expect((await page.request.get('/main.js')).status()).toBe(200);
  });

  // ─── Required sections ────────────────────────────────────────────────────

  for (const id of site.sections) {
    test(`section #${id} exists`, async ({ page }) => {
      await expect(page.locator(`#${id}`)).toBeAttached();
    });
  }

  // ─── Required interactive element IDs ────────────────────────────────────

  for (const id of site.interactiveIds) {
    test(`element #${id} exists`, async ({ page }) => {
      await expect(page.locator(`#${id}`)).toBeAttached();
    });
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  test('nav logo links to #hero', async ({ page }) => {
    await expect(page.locator('nav a[href="#hero"]')).toBeVisible();
  });

  test('nav logo image renders', async ({ page }) => {
    const logo = page.locator('nav .nav-logo-img');
    await expect(logo).toBeVisible();
    expect(await logo.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  });

  test(`desktop nav has ${site.navLinks.length} links`, async ({ page }) => {
    await expect(page.locator('nav ul.nav-links li a')).toHaveCount(site.navLinks.length);
  });

  for (const { href, text } of site.navLinks) {
    test(`desktop nav link "${text}" points to ${href}`, async ({ page }) => {
      await expect(
        page.locator('nav ul.nav-links a').filter({ hasText: text })
      ).toHaveAttribute('href', href);
    });
  }

  test('mobile menu button has correct ARIA defaults', async ({ page }) => {
    const btn = page.locator('#menuBtn');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(btn).toHaveAttribute('aria-label');
  });

  test('mobile menu opens and closes on button click', async ({ page }) => {
    const btn = page.locator('#menuBtn');
    const menu = page.locator('#mobileMenu');

    await expect(menu).not.toHaveClass(/open/);

    await btn.click();
    await expect(menu).toHaveClass(/open/);
    await expect(btn).toHaveAttribute('aria-expanded', 'true');

    await btn.click();
    await expect(menu).not.toHaveClass(/open/);
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  for (const { href, text } of site.navLinks) {
    test(`mobile nav link "${text}" points to ${href}`, async ({ page }) => {
      await expect(
        page.locator('#mobileMenu a').filter({ hasText: text })
      ).toHaveAttribute('href', href);
    });
  }

  test('mobile menu closes when a link is clicked', async ({ page }) => {
    await page.locator('#menuBtn').click();
    await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
    await page.locator('#mobileMenu a').first().click();
    await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
    await expect(page.locator('#menuBtn')).toHaveAttribute('aria-expanded', 'false');
  });

  // ─── Hero ─────────────────────────────────────────────────────────────────

  test('hero section has a heading', async ({ page }) => {
    await expect(page.locator('#hero h1')).toBeVisible();
  });

  test('hero has CTA links to #contact and #development', async ({ page }) => {
    await expect(page.locator('.hero-actions a[href="#contact"]')).toBeVisible();
    await expect(page.locator('.hero-actions a[href="#development"]')).toBeVisible();
  });

  // ─── Development stats ────────────────────────────────────────────────────

  test(`development section has ${site.counts.devStats} stat blocks`, async ({ page }) => {
    await expect(page.locator('.dev-stat')).toHaveCount(site.counts.devStats);
  });

  test('each dev stat has a data-target attribute', async ({ page }) => {
    const stats = await page.locator('.stat-num[data-target]').all();
    expect(stats.length).toBe(site.counts.devStats);
  });

  // ─── Neighbourhood scores ─────────────────────────────────────────────────

  test(`neighbourhood has ${site.counts.scoreCards} score cards`, async ({ page }) => {
    await expect(page.locator('.score-card')).toHaveCount(site.counts.scoreCards);
  });

  test('each score card has a data-target attribute', async ({ page }) => {
    const scoreNums = await page.locator('.score-num[data-target]').all();
    expect(scoreNums.length).toBe(site.counts.scoreCards);
  });

  // ─── Timeline ─────────────────────────────────────────────────────────────

  test(`timeline has ${site.counts.timelineSteps} steps`, async ({ page }) => {
    await expect(page.locator('.timeline-step')).toHaveCount(site.counts.timelineSteps);
  });

  test('first timeline step has active class', async ({ page }) => {
    await expect(page.locator('.timeline-step').first()).toHaveClass(/active/);
  });

  test('each timeline step has a phase label', async ({ page }) => {
    await expect(page.locator('.timeline-phase')).toHaveCount(site.counts.timelineSteps);
  });

  // ─── About pillars ────────────────────────────────────────────────────────

  test(`about section has ${site.counts.pillars} pillars`, async ({ page }) => {
    await expect(page.locator('.pillar')).toHaveCount(site.counts.pillars);
  });

  test('each pillar has a title and body', async ({ page }) => {
    await expect(page.locator('.pillar-title')).toHaveCount(site.counts.pillars);
    await expect(page.locator('.pillar-body')).toHaveCount(site.counts.pillars);
  });

  // ─── Contact form ─────────────────────────────────────────────────────────

  test('contact form is visible on load and success is hidden', async ({ page }) => {
    await expect(page.locator('#contactForm')).toBeVisible();
    await expect(page.locator('#formSuccess')).toBeHidden();
  });

  test('name and email fields are marked required', async ({ page }) => {
    await expect(page.locator('#name[required]')).toBeAttached();
    await expect(page.locator('#email[required]')).toBeAttached();
  });

  test('empty submit marks required fields as error', async ({ page }) => {
    await page.locator('#contactForm button[type="submit"]').click();
    await expect(page.locator('#name')).toHaveClass(/error/);
    await expect(page.locator('#email')).toHaveClass(/error/);
    await expect(page.locator('#formSuccess')).toBeHidden();
  });

  test('invalid email marks email field as error', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('not-a-valid-email');
    await page.locator('#contactForm button[type="submit"]').click();
    await expect(page.locator('#email')).toHaveClass(/error/);
    await expect(page.locator('#formSuccess')).toBeHidden();
  });

  test('typing clears the error state on a field', async ({ page }) => {
    await page.locator('#contactForm button[type="submit"]').click();
    await expect(page.locator('#name')).toHaveClass(/error/);
    await page.locator('#name').fill('A');
    await expect(page.locator('#name')).not.toHaveClass(/error/);
  });

  test('valid submission hides the form and shows success', async ({ page }) => {
    await page.locator('#name').fill('Jane Doe');
    await page.locator('#email').fill('jane@example.com');
    await page.locator('#contactForm button[type="submit"]').click();
    await expect(page.locator('#contactForm')).toBeHidden();
    await expect(page.locator('#formSuccess')).toBeVisible();
  });

  // ─── Assets ───────────────────────────────────────────────────────────────

  for (const asset of site.assets) {
    test(`asset /${asset} responds 200`, async ({ page }) => {
      expect((await page.request.get(`/${asset}`)).status()).toBe(200);
    });
  }

  test('all images have non-empty alt attributes', async ({ page }) => {
    for (const img of await page.locator('img').all()) {
      const alt = await img.getAttribute('alt');
      expect(alt, 'Image missing alt attribute').not.toBeNull();
      expect(alt.trim(), 'Image has empty alt text').not.toBe('');
    }
  });

  // ─── Footer ───────────────────────────────────────────────────────────────

  test('footer logo links to #hero', async ({ page }) => {
    await expect(page.locator('footer a[href="#hero"]')).toBeAttached();
  });

  for (const { href } of site.navLinks) {
    test(`footer has nav link to ${href}`, async ({ page }) => {
      await expect(page.locator(`footer nav a[href="${href}"]`)).toBeAttached();
    });
  }
});
