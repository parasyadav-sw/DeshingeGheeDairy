// ============================================
// DESHINGE DAIRY FARM | Website Interactivity
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar Scroll ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links-desktop .nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
        });
        drawerLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---- Mobile Drawer ----
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const navLinksDesktop = document.getElementById('navLinksDesktop');

  // Ensure desktop nav is hidden on mobile via JS (backup for CSS caching)
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

  const openDrawer = () => {
    mobileToggle.classList.add('active');
    mobileDrawer.classList.add('open');
    mobileDrawer.style.transform = 'translateX(0)';
    mobileOverlay.classList.add('show');
    mobileOverlay.style.opacity = '1';
    mobileOverlay.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileToggle.classList.remove('active');
    mobileDrawer.classList.remove('open');
    mobileDrawer.style.transform = 'translateX(-100%)';
    mobileOverlay.classList.remove('show');
    mobileOverlay.style.opacity = '0';
    mobileOverlay.style.visibility = 'hidden';
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  mobileOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ---- Product Variants & Image Mapping ----
  const variantButtons = document.querySelectorAll('.variant-btn');
  const priceCurrentEl = document.getElementById('priceCurrent');
  const priceOriginalEl = document.getElementById('priceOriginal');
  const priceSaveEl = document.getElementById('priceSave');
  const stickyPriceEl = document.getElementById('stickyPrice');
  const mainProductImage = document.getElementById('mainProductImage');
  const productThumbs = document.querySelectorAll('#productThumbnails .thumb');
  let currentPrice = 935;
  let currentVariant = '500ml';

  const productImages = {
    "250ml":   { src: "images/250.png",  alt: "Deshinge A2 Gir Cow Ghee, 250 ml" },
    "500ml":   { src: "images/500.png",  alt: "Deshinge A2 Gir Cow Ghee, 500 ml" },
    "1000ml":  { src: "images/1L.png",   alt: "Deshinge A2 Gir Cow Ghee, 1 Litre" },
    "5000ml":  { src: "images/product image.png", alt: "Deshinge A2 Gir Cow Ghee, 5 Litre" }
  };

  const preloadImages = () => {
    Object.values(productImages).forEach(img => {
      const preloader = new Image();
      preloader.src = img.src;
    });
  };
  preloadImages();

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
    priceCurrentEl.textContent = `₹${price.toLocaleString('en-IN')}`;
    priceOriginalEl.textContent = `₹${original.toLocaleString('en-IN')}`;
    priceSaveEl.textContent = `Save ${save}%`;
    stickyPriceEl.textContent = `₹${price.toLocaleString('en-IN')}`;
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
      updateCartTotal();
    });
  });

  productThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const variant = thumb.dataset.variant;
      variantButtons.forEach(b => {
        b.classList.remove('active');
        if (b.dataset.variant === variant) b.classList.add('active');
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
      updateCartTotal();
    });
  });

  // ---- Quantity Selector ----
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyValue = document.getElementById('qtyValue');
  let quantity = 1;

  qtyMinus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyValue.textContent = quantity;
    }
  });

  qtyPlus.addEventListener('click', () => {
    if (quantity < 10) {
      quantity++;
      qtyValue.textContent = quantity;
    }
  });

  // ---- Cart Functionality ----
  const cartToggle = document.getElementById('cartToggle');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartBody = document.getElementById('cartBody');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const cartShopBtn = document.getElementById('cartShopBtn');

  let cart = [];

  const openCart = () => {
    cartSidebar.classList.add('show');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartSidebar.classList.remove('show');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  cartShopBtn.addEventListener('click', closeCart);

  const showToast = (msg) => {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  };

  const renderCart = () => {
    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Your cart is empty</p>
          <a href="#ghee" class="btn btn-secondary" id="cartShopBtn2">Shop Now</a>
        </div>`;
      cartFooter.style.display = 'none';
      cartCountEl.classList.remove('show');
      document.getElementById('cartShopBtn2')?.addEventListener('click', closeCart);
      return;
    }

    cartFooter.style.display = 'block';
    cartCountEl.classList.add('show');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

    cartBody.innerHTML = cart.map((item, i) => {
      const cartImg = productImages[item.variant]?.src || 'images/500.png';
      return `
      <div class="cart-item">
        <img src="${cartImg}" alt="Deshinge Ghee ${item.variant}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">Deshinge A2 Gir Cow Ghee</div>
          <div class="cart-item-variant">${item.variant}</div>
          <div class="cart-item-bottom">
            <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
            <div class="cart-item-qty">
              <button onclick="updateCartItemQty(${i}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="updateCartItemQty(${i}, 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${i})">Remove</button>
        </div>
      </div>`;
    }).join('');

    cartTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  };

  window.updateCartItemQty = (index, delta) => {
    if (cart[index]) {
      cart[index].qty += delta;
      if (cart[index].qty <= 0) {
        cart.splice(index, 1);
      }
      renderCart();
    }
  };

  window.removeCartItem = (index) => {
    cart.splice(index, 1);
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

  document.getElementById('addToCart').addEventListener('click', addToCart);
  document.getElementById('stickyAddToCart').addEventListener('click', addToCart);

  document.getElementById('buyNow').addEventListener('click', () => {
    addToCart();
    openWhatsAppCheckout();
  });

  // ---- WhatsApp Checkout ----
  const WHATSAPP_PHONE = '919762950684';

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
      if (i < cart.length - 1) {
        itemsText += `\n`;
      }
    });

    const message = `\uD83D\uDED2 New Order Request\n\nHello Deshinge Dairy Farm,\n\nI would like to place the following order:\n\n${itemsText}\n-----------------------------\nTotal Amount: \u20B9${total.toLocaleString('en-IN')}\n-----------------------------\n\nPlease confirm my order. Thank you!`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  document.getElementById('whatsappCheckout').addEventListener('click', openWhatsAppCheckout);

  const updateCartTotal = () => {
    // Update cart items if variant price changed
    cart.forEach(item => {
      if (item.variant === currentVariant) {
        item.price = currentPrice;
      }
    });
    renderCart();
  };

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('open'));

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ---- Reviews Carousel ----
  const carousel = document.getElementById('reviewsCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

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
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thanks for subscribing!');
    e.target.reset();
  });

  document.getElementById('footerNewsletter')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thanks for subscribing!');
    e.target.reset();
  });

  // ---- Contact Form ----
  document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you soon.');
    e.target.reset();
  });

  // ---- Scroll Animations (Intersection Observer) ----
  const animateElements = document.querySelectorAll(
    '.section-header, .detail-card, .benefit-card, .process-step, .cert-card, .review-card, .faq-item, .farm-images, .farm-content, .comparison-table, .product-showcase, .contact-grid'
  );

  animateElements.forEach(el => el.classList.add('animate-in'));

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

  // ---- Smooth Scroll for all anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Sticky Cart Visibility ----
  const stickyCart = document.getElementById('stickyCart');
  const productSection = document.getElementById('ghee');

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

    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(() => updateStickyCart());
    }, { threshold: 0 });

    stickyObserver.observe(productSection);
    window.addEventListener('scroll', updateStickyCart, { passive: true });
    window.addEventListener('resize', updateStickyCart);
  }

  // ---- Add transition to product image ----
  if (mainProductImage) {
    mainProductImage.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  }

  // ---- YouTube Skeleton Loaders ----
  document.querySelectorAll('.youtube-card iframe').forEach(iframe => {
    const skeleton = iframe.parentElement.querySelector('.youtube-skeleton');
    if (!skeleton) return;
    iframe.addEventListener('load', () => {
      skeleton.classList.add('hidden');
    });
  });

});
