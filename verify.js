import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = '/Users/rexmupas/.gemini/antigravity/brain/a17a6508-58ff-4e74-a1be-d3ddb84cc704';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('🚀 Starting standard Chrome verification...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const results = {
    loginPage: false,
    loggedIn: false,
    logoVerification: {},
    mobileLogoVerification: {},
    actionButtonsVerification: {},
    errors: [],
  };

  try {
    // 1. Navigate to admin login/dashboard
    console.log('Navigating to http://localhost:3000/admin...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });

    // Wait for hydration/rendering to settle
    await page.waitForTimeout?.(5000) || new Promise(r => setTimeout(r, 5000));

    // Take initial screenshot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot-1-initial.png') });
    console.log('Saved screenshot-1-initial.png');

    // 2. Check if we are on login page or dashboard
    let isLoginPage = await page.evaluate(() => {
      return !!document.querySelector('form input[type="password"]') || document.body.innerText.includes('Log in');
    });

    results.loginPage = isLoginPage;

    if (isLoginPage) {
      console.log('Login form detected. Attempting login...');
      
      // Type credentials
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', 'admin@jway.com');
      await page.type('input[type="password"]', 'Password123!');
      
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot-2-before-login.png') });
      console.log('Saved screenshot-2-before-login.png');

      // Click submit
      await page.click('button[type="submit"]');
      
      // Wait for navigation / dashboard load
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout?.(5000) || new Promise(r => setTimeout(r, 5000));
      
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot-3-after-login.png') });
      console.log('Saved screenshot-3-after-login.png');
    } else {
      console.log('Already logged in or bypassed to dashboard.');
    }

    results.loggedIn = await page.evaluate(() => {
      return !document.body.innerText.includes('Log in') && !document.querySelector('form input[type="password"]');
    });

    // Wait for navigation sidebar or header to load
    console.log('Waiting for admin UI navigation/sidebar to render...');
    await page.waitForSelector('nav, aside, [class*="sidebar"], [class*="nav"], .logo, .brand', { timeout: 15000 }).catch(() => {
      console.log('Warning: Timeout waiting for navigation container selectors.');
    });

    // 3. Verify JWay Logo in sidebar/containers (Desktop)
    console.log('Verifying logo inside sidebar (Desktop)...');
    
    // Let's inspect the DOM for logo elements
    const desktopLogoData = await page.evaluate(() => {
      // Find logo image or SVG
      const img = document.querySelector('img[src*="logo" i], img[src*="Logo" i], svg[class*="logo" i], .sidebar__logo, .logo, .brand');
      
      if (!img) {
        return { found: false, html: document.body.innerHTML.substring(0, 1000) };
      }

      // If it is a container, find img or svg inside it
      let targetImg = img;
      if (img.tagName !== 'IMG' && img.tagName !== 'svg') {
        targetImg = img.querySelector('img, svg') || img;
      }
      
      const container = targetImg.parentElement || img;
      const imgRect = targetImg.getBoundingClientRect();
      const containerRect = container ? container.getBoundingClientRect() : null;
      const computedStyle = window.getComputedStyle(targetImg);
      const containerStyle = container ? window.getComputedStyle(container) : null;
      
      return {
        found: true,
        tagName: targetImg.tagName,
        src: targetImg.src || null,
        className: targetImg.className,
        rect: {
          width: imgRect.width,
          height: imgRect.height,
          left: imgRect.left,
          top: imgRect.top
        },
        containerRect: containerRect ? {
          width: containerRect.width,
          height: containerRect.height,
          className: container.className
        } : null,
        styles: {
          maxWidth: computedStyle.maxWidth,
          maxHeight: computedStyle.maxHeight,
          objectFit: computedStyle.objectFit,
          display: computedStyle.display,
          width: computedStyle.width,
          height: computedStyle.height,
        },
        containerStyles: containerStyle ? {
          display: containerStyle.display,
          alignItems: containerStyle.alignItems,
          justifyContent: containerStyle.justifyContent,
          overflow: containerStyle.overflow
        } : null
      };
    });

    results.logoVerification = desktopLogoData;
    console.log('Desktop logo verification results:', JSON.stringify(desktopLogoData, null, 2));

    // 4. Verify JWay Logo on Mobile
    console.log('Resizing to mobile viewport (375x812)...');
    await page.setViewport({ width: 375, height: 812 });
    await page.waitForTimeout?.(2000) || new Promise(r => setTimeout(r, 2000));
    
    // Take mobile screenshot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot-4-mobile.png') });
    console.log('Saved screenshot-4-mobile.png');

    const mobileLogoData = await page.evaluate(() => {
      const img = document.querySelector('img[src*="logo" i], img[src*="Logo" i], svg[class*="logo" i], .sidebar__logo, .logo, .brand');
      
      if (!img) {
        return { found: false };
      }

      let targetImg = img;
      if (img.tagName !== 'IMG' && img.tagName !== 'svg') {
        targetImg = img.querySelector('img, svg') || img;
      }
      
      const container = targetImg.parentElement || img;
      const imgRect = targetImg.getBoundingClientRect();
      const containerRect = container ? container.getBoundingClientRect() : null;
      const computedStyle = window.getComputedStyle(targetImg);
      
      return {
        found: true,
        tagName: targetImg.tagName,
        rect: {
          width: imgRect.width,
          height: imgRect.height,
          left: imgRect.left,
          top: imgRect.top
        },
        containerRect: containerRect ? {
          width: containerRect.width,
          height: containerRect.height
        } : null,
        styles: {
          maxWidth: computedStyle.maxWidth,
          maxHeight: computedStyle.maxHeight,
          objectFit: computedStyle.objectFit,
        }
      };
    });

    results.mobileLogoVerification = mobileLogoData;
    console.log('Mobile logo verification results:', JSON.stringify(mobileLogoData, null, 2));

    // Restore desktop view
    await page.setViewport({ width: 1280, height: 800 });

    // 5. Verify action buttons on collections (Posts page)
    console.log('Navigating to Posts collection page...');
    await page.goto('http://localhost:3000/admin/collections/posts', { waitUntil: 'networkidle2' });
    
    // Wait for list to load
    await page.waitForSelector('table, .collection__list, .list-controls, [class*="list"]', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout?.(3000) || new Promise(r => setTimeout(r, 3000));

    // Take collections screenshot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot-5-collections.png') });
    console.log('Saved screenshot-5-collections.png');

    const actionButtonsData = await page.evaluate(() => {
      // Find all buttons, links that act as buttons or action containers
      const buttons = Array.from(document.querySelectorAll('button, a.btn, button.btn, .btn, [class*="btn"], [class*="button"]'));
      const visibleButtons = buttons.filter(b => {
        const rect = b.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (b.innerText || b.getAttribute('aria-label') || b.className);
      });

      // Let's check coordinates and check overlap
      const buttonRects = visibleButtons.map((b, idx) => {
        const rect = b.getBoundingClientRect();
        return {
          id: idx,
          text: b.innerText?.trim() || b.getAttribute('aria-label') || b.className || 'element',
          rect: {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height
          }
        };
      });

      // Check for overlaps
      const overlaps = [];
      for (let i = 0; i < buttonRects.length; i++) {
        for (let j = i + 1; j < buttonRects.length; j++) {
          const b1 = buttonRects[i].rect;
          const b2 = buttonRects[j].rect;
          
          // Check overlap
          const hasOverlap = !(b1.right <= b2.left || 
                               b1.left >= b2.right || 
                               b1.bottom <= b2.top || 
                               b1.top >= b2.bottom);
          if (hasOverlap) {
            overlaps.push({
              btn1: buttonRects[i].text,
              btn2: buttonRects[j].text
            });
          }
        }
      }

      // Check grid gaps of layout sections
      const containerStyles = Array.from(document.querySelectorAll('.collection__header, .gutter, .list-controls, .form-submit, .btn-group, .controls, .collection-actions'))
        .map(c => {
          const s = window.getComputedStyle(c);
          return {
            element: c.className,
            display: s.display,
            gap: s.gap,
            gridGap: s.gridGap,
            columnGap: s.columnGap
          };
        });

      return {
        totalButtonsDetected: buttonRects.length,
        buttons: buttonRects.slice(0, 15), // return top 15 for analysis
        overlapsDetected: overlaps.length,
        overlaps,
        containerStyles
      };
    });

    results.actionButtonsVerification = actionButtonsData;
    console.log('Action buttons verification results:', JSON.stringify(actionButtonsData, null, 2));

  } catch (err) {
    console.error('Error during execution:', err);
    results.errors.push(err.message);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }

  // Save report JSON
  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'verification-results.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('Saved verification-results.json');
}

run();
