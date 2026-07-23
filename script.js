// ============================================
// DESHINGE DAIRY FARM | Website Interactivity
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Helper: safe element getter ----
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, ctx) => (ctx || document).querySelectorAll(sel);

  // ---- Navbar Scroll ----
  const navbar = $('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ---- Active Nav Link on Scroll ----
  const sections = $$('section[id]');
  const desktopLinks = $$('.nav-links-desktop .nav-link');
  const drawerLinks = $$('.drawer-link');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        drawerLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---- Mobile Drawer ----
  const mobileToggle = $('mobileToggle');
  const mobileDrawer = $('mobileDrawer');
  const mobileOverlay = $('mobileOverlay');
  const drawerClose = $('drawerClose');
  const navLinksDesktop = $('navLinksDesktop');

  const closeDrawer = () => {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.style.transform = 'translateX(-100%)';
    }
    if (mobileOverlay) {
      mobileOverlay.classList.remove('show');
      mobileOverlay.style.opacity = '0';
      mobileOverlay.style.visibility = 'hidden';
    }
    document.body.style.overflow = '';
  };

  const openDrawer = () => {
    if (mobileToggle) mobileToggle.classList.add('active');
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.style.transform = 'translateX(0)';
    }
    if (mobileOverlay) {
      mobileOverlay.classList.add('show');
      mobileOverlay.style.opacity = '1';
      mobileOverlay.style.visibility = 'visible';
    }
    document.body.style.overflow = 'hidden';
  };

  const handleResponsiveNav = () => {
    if (window.innerWidth <= 768) {
      if (navLinksDesktop) navLinksDesktop.style.display = 'none';
      if (mobileToggle) mobileToggle.style.display = 'flex';
    } else {
      if (navLinksDesktop) navLinksDesktop.style.display = '';
      if (mobileToggle) mobileToggle.style.display = '';
      closeDrawer();
    }
  };
  handleResponsiveNav();
  window.addEventListener('resize', handleResponsiveNav);

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ---- Product Variants & Image Mapping ----
  const variantButtons = $$('.variant-btn');
  const priceCurrentEl = $('priceCurrent');
  const priceOriginalEl = $('priceOriginal');
  const priceSaveEl = $('priceSave');
  const stickyPriceEl = $('stickyPrice');
  const mainProductImage = $('mainProductImage');
  const productThumbs = $$('#productThumbnails .thumb');
  let currentPrice = 935;
  let currentVariant = '500ml';

  const productImages = {
    "250ml":  { src: "images/250.png", alt: "Deshinge A2 Gir Cow Ghee, 250 ml" },
    "500ml":  { src: "images/500.png", alt: "Deshinge A2 Gir Cow Ghee, 500 ml" },
    "1000ml": { src: "images/1L.png",  alt: "Deshinge A2 Gir Cow Ghee, 1 Litre" },
    "5000ml": { src: "images/product image.png", alt: "Deshinge A2 Gir Cow Ghee, 5 Litre" }
  };

  // Preload images
  Object.values(productImages).forEach(img => {
    const preloader = new Image();
    preloader.src = img.src;
  });

  const updateProductImage = (variant) => {
    const imgData = productImages[variant];
    if (!imgData || !mainProductImage) return;

    mainProductImage.style.opacity = '0';
    mainProductImage.style.transform = 'scale(0.97)';

    setTimeout(() => {
      mainProductImage.src = imgData.src;
      mainProductImage.alt = imgData.alt;
      mainProductImage.style.opacity = '1';
      mainProductImage.style.transform = 'scale(1)';
    }, 200);

    productThumbs.forEach(t => {
      t.classList.toggle('active', t.dataset.variant === variant);
    });
  };

  const updatePriceDisplay = (price, original, save) => {
    if (priceCurrentEl) priceCurrentEl.textContent = `\u20B9${price.toLocaleString('en-IN')}`;
    if (priceOriginalEl) priceOriginalEl.textContent = `\u20B9${original.toLocaleString('en-IN')}`;
    if (priceSaveEl) priceSaveEl.textContent = `Save ${save}%`;
    if (stickyPriceEl) stickyPriceEl.textContent = `\u20B9${price.toLocaleString('en-IN')}`;
  };

  variantButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      variantButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPrice = parseInt(btn.dataset.price);
      currentVariant = btn.dataset.variant;
      const originalPrice = parseInt(btn.dataset.original);
      const savePercent = parseInt(btn.dataset.save);
      updatePriceDisplay(currentPrice, originalPrice, savePercent);
      updateProductImage(currentVariant);
      syncCartPrices();
    });
  });

  productThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const variant = thumb.dataset.variant;
      variantButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.variant === variant);
      });
      const matchedBtn = document.querySelector(`.variant-btn[data-variant="${variant}"]`);
      if (matchedBtn) {
        currentPrice = parseInt(matchedBtn.dataset.price);
        currentVariant = matchedBtn.dataset.variant;
        const originalPrice = parseInt(matchedBtn.dataset.original);
        const savePercent = parseInt(matchedBtn.dataset.save);
        updatePriceDisplay(currentPrice, originalPrice, savePercent);
      }
      updateProductImage(variant);
      syncCartPrices();
    });
  });

  // ---- Quantity Selector ----
  const qtyMinus = $('qtyMinus');
  const qtyPlus = $('qtyPlus');
  const qtyValue = $('qtyValue');
  let quantity = 1;

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        if (qtyValue) qtyValue.textContent = quantity;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      if (quantity < 10) {
        quantity++;
        if (qtyValue) qtyValue.textContent = quantity;
      }
    });
  }

  // ---- Cart ----
  const cartToggle = $('cartToggle');
  const cartSidebar = $('cartSidebar');
  const cartOverlay = $('cartOverlay');
  const cartClose = $('cartClose');
  const cartBody = $('cartBody');
  const cartFooter = $('cartFooter');
  const cartTotalEl = $('cartTotal');
  const cartCountEl = $('cartCount');
  const whatsappCheckout = $('whatsappCheckout');
  const WHATSAPP_PHONE = '919762950684';

  let cart = [];

  const openCart = () => {
    if (cartSidebar) cartSidebar.classList.add('show');
    if (cartOverlay) cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    if (cartSidebar) cartSidebar.classList.remove('show');
    if (cartOverlay) cartOverlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  const showToast = (msg) => {
    const toast = $('toast');
    const toastMsg = $('toastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }
  };

  const renderCart = () => {
    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Your cart is empty</p>
          <a href="#ghee" class="btn btn-secondary cart-shop-btn-empty">Shop Now</a>
        </div>`;
      if (cartFooter) cartFooter.style.display = 'none';
      if (cartCountEl) {
        cartCountEl.classList.remove('show');
        cartCountEl.textContent = '0';
      }
      // Attach close to the newly rendered shop now link
      const shopBtn = cartBody.querySelector('.cart-shop-btn-empty');
      if (shopBtn) shopBtn.addEventListener('click', closeCart);
      return;
    }

    if (cartFooter) cartFooter.style.display = 'block';
    if (cartCountEl) {
      cartCountEl.classList.add('show');
      cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartBody.innerHTML = cart.map((item, i) => {
      const cartImg = productImages[item.variant] ? productImages[item.variant].src : 'images/500.png';
      return `
      <div class="cart-item" data-index="${i}">
        <img src="${cartImg}" alt="Deshinge Ghee ${item.variant}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">Deshinge A2 Gir Cow Ghee</div>
          <div class="cart-item-variant">${item.variant}</div>
          <div class="cart-item-bottom">
            <span class="cart-item-price">\u20B9${(item.price * item.qty).toLocaleString('en-IN')}</span>
            <div class="cart-item-qty">
              <button class="cart-qty-btn" data-action="decrease" data-index="${i}">\u2212</button>
              <span>${item.qty}</span>
              <button class="cart-qty-btn" data-action="increase" data-index="${i}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-action="remove" data-index="${i}">Remove</button>
        </div>
      </div>`;
    }).join('');

    if (cartTotalEl) cartTotalEl.textContent = `\u20B9${total.toLocaleString('en-IN')}`;
  };

  // Event delegation for cart item buttons (works after innerHTML replacement)
  if (cartBody) {
    cartBody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const index = parseInt(btn.dataset.index);
      const action = btn.dataset.action;

      if (action === 'increase') {
        if (cart[index]) {
          cart[index].qty++;
          renderCart();
        }
      } else if (action === 'decrease') {
        if (cart[index]) {
          cart[index].qty--;
          if (cart[index].qty <= 0) {
            cart.splice(index, 1);
          }
          renderCart();
        }
      } else if (action === 'remove') {
        cart.splice(index, 1);
        renderCart();
      }
    });
  }

  const syncCartPrices = () => {
    cart.forEach(item => {
      const imgData = productImages[item.variant];
      if (imgData) {
        // find matching variant button to get current price
        const btn = document.querySelector(`.variant-btn[data-variant="${item.variant}"]`);
        if (btn) item.price = parseInt(btn.dataset.price);
      }
    });
    renderCart();
  };

  const addToCart = () => {
    const existing = cart.find(item => item.variant === currentVariant);
    if (existing) {
      existing.qty += quantity;
    } else {
      cart.push({
        variant: currentVariant,
        price: currentPrice,
        qty: quantity
      });
    }
    renderCart();
    openCart();
    showToast('Added to cart!');
  };

  // ---- Attach product button handlers ----
  const addToCartBtn = $('addToCart');
  const stickyAddToCartBtn = $('stickyAddToCart');
  const buyNowBtn = $('buyNow');

  if (addToCartBtn) addToCartBtn.addEventListener('click', addToCart);
  if (stickyAddToCartBtn) stickyAddToCartBtn.addEventListener('click', addToCart);

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      addToCart();
      openWhatsAppCheckout();
    });
  }

  // ---- WhatsApp Checkout ----
  const openWhatsAppCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    let itemsText = '';
    cart.forEach((item, i) => {
      itemsText += `\u2022 Product: Deshinge A2 Gir Cow Ghee\n`;
      itemsText += `\u2022 Size: ${item.variant}\n`;
      itemsText += `\u2022 Quantity: ${item.qty}\n`;
      itemsText += `\u2022 Price: \u20B9${item.price.toLocaleString('en-IN')} each\n`;
      if (i < cart.length - 1) itemsText += `\n`;
    });

    const message = `\uD83D\uDED2 New Order Request\n\nHello Deshinge Dairy Farm,\n\nI would like to place the following order:\n\n${itemsText}\n-----------------------------\nTotal Amount: \u20B9${total.toLocaleString('en-IN')}\n-----------------------------\n\nPlease confirm my order. Thank you!`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (whatsappCheckout) whatsappCheckout.addEventListener('click', openWhatsAppCheckout);

  // ---- FAQ Accordion ----
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');

      // Close all
      $$('.faq-item').forEach(faq => faq.classList.remove('open'));

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ---- Reviews Carousel ----
  const carousel = $('reviewsCarousel');
  const prevBtn = $('carouselPrev');
  const nextBtn = $('carouselNext');

  if (carousel && prevBtn && nextBtn) {
    const scrollAmount = 364;
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ---- Newsletter Form ----
  const newsletterForm = $('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thanks for subscribing!');
      e.target.reset();
    });
  }

  const footerNewsletter = $('footerNewsletter');
  if (footerNewsletter) {
    footerNewsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thanks for subscribing!');
      e.target.reset();
    });
  }

  // ---- Contact Form ----
  const contactForm = $('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Message sent! We'll get back to you soon.");
      e.target.reset();
    });
  }

  // ---- Scroll Animations (Intersection Observer) ----
  const animateElements = $$(
    '.section-header, .detail-card, .benefit-card, .process-step, .cert-card, .review-card, .faq-item, .farm-images, .farm-content, .comparison-table, .product-showcase, .contact-grid'
  );

  animateElements.forEach(el => el.classList.add('animate-in'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: make everything visible immediately
    animateElements.forEach(el => el.classList.add('visible'));
  }

  // ---- Smooth Scroll for all anchor links ----
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Sticky Cart Visibility ----
  const stickyCart = $('stickyCart');
  const productSection = $('ghee');

  if (stickyCart && productSection) {
    const updateStickyCart = () => {
      if (window.innerWidth <= 768) {
        const rect = productSection.getBoundingClientRect();
        const isProductVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isProductVisible) {
          stickyCart.style.display = 'none';
        } else {
          stickyCart.style.display = 'flex';
          stickyCart.style.transform = 'translateY(0)';
        }
      } else {
        stickyCart.style.display = 'none';
      }
    };

    if ('IntersectionObserver' in window) {
      const stickyObserver = new IntersectionObserver((entries) => {
        entries.forEach(() => updateStickyCart());
      }, { threshold: 0 });
      stickyObserver.observe(productSection);
    }
    window.addEventListener('scroll', updateStickyCart, { passive: true });
    window.addEventListener('resize', updateStickyCart);
  }

  // ---- Product image transition ----
  if (mainProductImage) {
    mainProductImage.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  }

  // ---- YouTube Skeleton Loaders ----
  $$('.youtube-card iframe').forEach(iframe => {
    const skeleton = iframe.parentElement ? iframe.parentElement.querySelector('.youtube-skeleton') : null;
    if (!skeleton) return;
    iframe.addEventListener('load', () => {
      skeleton.classList.add('hidden');
    });
  });

});
