/**
 * Loke Nath Comb Factory - Main Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNoticeBanner();
  initMobileMenu();
  initHeroSlider();
  initWeOfferSlider();
  initCounters();
  initProductFilter();
  initGalleryLightbox();
  initContactForm();
  initProductModals();
  initWhatsAppWidget();
  initProductDetailPage();
});

/* 0. Notification Bar (Under Progress) */
function initNoticeBanner() {
  const banner = document.getElementById('under-progress-banner');
  const closeBtn = document.getElementById('close-progress-banner');

  if (!banner) return;

  if (sessionStorage.getItem('progress_banner_dismissed') === 'true') {
    banner.style.display = 'none';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        banner.style.display = 'none';
        sessionStorage.setItem('progress_banner_dismissed', 'true');
      }, 300);
    });
  }
}

/* 1. Mobile Menu Drawer */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    if (overlay) overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Mobile submenu accordion
  const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const submenu = toggle.nextElementSibling;
      const icon = toggle.querySelector('.arrow-icon');
      if (submenu) {
        submenu.classList.toggle('hidden');
        if (icon) icon.classList.toggle('rotate-180');
      }
    });
  });
}

/* 2. Hero Carousel Slider */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('opacity-0', 'pointer-events-none');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-brand-primary', 'w-8');
        dot.classList.remove('bg-white/60', 'w-3');
      } else {
        dot.classList.remove('bg-brand-primary', 'w-8');
        dot.classList.add('bg-white/60', 'w-3');
      }
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      showSlide(i);
      startAutoPlay();
    });
  });

  // Touch Swipe for mobile hero
  let touchStartX = 0;
  let touchEndX = 0;
  const sliderContainer = document.getElementById('hero-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        stopAutoPlay(); nextSlide(); startAutoPlay();
      } else if (touchEndX - touchStartX > 50) {
        stopAutoPlay(); prevSlide(); startAutoPlay();
      }
    }, { passive: true });
  }

  startAutoPlay();
}

/* 3. We Offer! Infinite Auto-Scrolling Carousel Slider (5s Timer) */
function initWeOfferSlider() {
  const slider = document.getElementById('offer-slider');
  const container = document.getElementById('offer-slider-container');
  const prevBtn = document.getElementById('offer-prev');
  const nextBtn = document.getElementById('offer-next');

  if (!slider || !container) return;

  const cards = slider.querySelectorAll('.shrink-0');
  if (cards.length === 0) return;

  let currentIndex = 0;
  let timer = null;

  function getCardStep() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // flex gap-6 is 24px
    return cardWidth + gap;
  }

  function getMaxIndex() {
    const step = getCardStep();
    const visibleCards = Math.floor(container.offsetWidth / step) || 1;
    return Math.max(0, cards.length - visibleCards);
  }

  function updatePosition() {
    const step = getCardStep();
    slider.style.transform = `translateX(-${currentIndex * step}px)`;
  }

  function nextSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex >= maxIdx) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updatePosition();
  }

  function prevSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex <= 0) {
      currentIndex = maxIdx;
    } else {
      currentIndex--;
    }
    updatePosition();
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(nextSlide, 5000); // 5s Auto Scroll
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
  }

  // Button Listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopTimer();
      nextSlide();
      startTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopTimer();
      prevSlide();
      startTimer();
    });
  }

  // Pause on hover
  container.addEventListener('mouseenter', stopTimer);
  container.addEventListener('mouseleave', startTimer);

  // Touch support
  let touchStartX = 0;
  container.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    stopTimer();
  }, { passive: true });

  container.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 40) {
      nextSlide();
    } else if (touchEndX - touchStartX > 40) {
      prevSlide();
    }
    startTimer();
  }, { passive: true });

  // Handle window resize
  window.addEventListener('resize', () => {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    updatePosition();
  });

  startTimer();
}

/* 4. Animated Stat Counters */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-target'), 10);
        const suffix = target.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / countTo)) || 20;

        const timer = setInterval(() => {
          count += Math.ceil(countTo / 50);
          if (count >= countTo) {
            target.innerText = countTo + suffix;
            clearInterval(timer);
          } else {
            target.innerText = count + suffix;
          }
        }, stepTime);

        obs.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* 5. Product Category Filtering & Scrollable Navbar */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.product-filter-btn');
  const productCards = document.querySelectorAll('.product-item-card');
  const navContainer = document.getElementById('filter-tabs-nav');
  const scrollLeftBtn = document.getElementById('filter-scroll-left');
  const scrollRightBtn = document.getElementById('filter-scroll-right');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('bg-brand-primary', 'text-white', 'shadow-md', 'scale-[1.02]');
        b.classList.add('bg-white', 'text-gray-700', 'hover:bg-pink-50', 'hover:text-brand-primary', 'border', 'border-gray-200', 'shadow-sm');
      });
      btn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-pink-50', 'hover:text-brand-primary', 'border', 'border-gray-200', 'shadow-sm');
      btn.classList.add('bg-brand-primary', 'text-white', 'shadow-md', 'scale-[1.02]');

      // Smoothly scroll active button to center of view
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      // Filter grid items if grid exists
      if (productCards.length > 0) {
        productCards.forEach(card => {
          const cardCat = card.getAttribute('data-category') || card.getAttribute('data-category-name');
          if (!category || category === 'all' || cardCat === category || (cardCat && cardCat.toLowerCase().includes(category.toLowerCase()))) {
            card.classList.remove('hidden');
            card.classList.add('block', 'animate-modal');
          } else {
            card.classList.add('hidden');
            card.classList.remove('block');
          }
        });
      }
    });
  });

  // Left & Right Scroll Arrow Controls
  if (navContainer) {
    if (scrollLeftBtn) {
      scrollLeftBtn.addEventListener('click', () => {
        navContainer.scrollBy({ left: -220, behavior: 'smooth' });
      });
    }
    if (scrollRightBtn) {
      scrollRightBtn.addEventListener('click', () => {
        navContainer.scrollBy({ left: 220, behavior: 'smooth' });
      });
    }

    // Touch/Mouse drag to scroll enhancement for desktop
    let isDown = false;
    let startX, scrollLeft;
    navContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - navContainer.offsetLeft;
      scrollLeft = navContainer.scrollLeft;
    });
    navContainer.addEventListener('mouseleave', () => { isDown = false; });
    navContainer.addEventListener('mouseup', () => { isDown = false; });
    navContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - navContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      navContainer.scrollLeft = scrollLeft - walk;
    });
  }
}

/* 6. Gallery Lightbox Modal */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal || galleryItems.length === 0) return;

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = itemsArray[currentIndex];
    const imgSrc = item.getAttribute('data-src') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || 'Loke Nath Comb Factory Gallery';

    modalImg.src = imgSrc;
    if (modalTitle) modalTitle.innerText = title;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
      openLightbox(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % itemsArray.length;
      openLightbox(currentIndex);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('flex')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    }
  });
}

/* 7. Contact Form Web3Forms 100% Free Email Integration */
function initContactForm() {
  const forms = document.querySelectorAll('form[action*="web3forms.com"], #contact-form');
  const toastSuccess = document.getElementById('form-toast');
  const toastError = document.getElementById('form-error-toast');

  if (forms.length === 0) return;

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const phone = form.querySelector('[name="phone"]');
      const message = form.querySelector('[name="message"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Validation
      [name, email, phone, message].forEach(field => {
        if (field) {
          if (!field.value.trim()) {
            field.classList.add('border-red-500', 'bg-red-50');
            isValid = false;
          } else {
            field.classList.remove('border-red-500', 'bg-red-50');
          }
        }
      });

      if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          email.classList.add('border-red-500', 'bg-red-50');
          isValid = false;
        }
      }

      if (!isValid) return;

      const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending Email... ⏳';
      }

      try {
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // Send to Web3Forms Free API via JSON
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        const data = await response.json();

        if (data.success) {
          if (toastSuccess) {
            toastSuccess.classList.remove('hidden');
            toastSuccess.classList.add('flex');
            setTimeout(() => {
              toastSuccess.classList.add('hidden');
              toastSuccess.classList.remove('flex');
            }, 5000);
          } else {
            alert('Thank you! Your inquiry has been sent successfully to Loke Nath Comb Factory.');
          }
          form.reset();
        } else {
          console.error('Web3Forms Response Error:', data);
          const errorMsg = data.message || 'Form submission failed. Please try again.';

          if (toastError) {
            const errorText = toastError.querySelector('.error-msg-text');
            if (errorText) errorText.innerText = errorMsg;
            toastError.classList.remove('hidden');
            toastError.classList.add('flex');
            setTimeout(() => {
              toastError.classList.add('hidden');
              toastError.classList.remove('flex');
            }, 7000);
          } else {
            alert('Form Submission Notice: ' + errorMsg + '\n\nNote: If using a new Web3Forms access key, please check lokenathcombfactory@gmail.com inbox and click the Web3Forms activation link.');
          }
        }
      } catch (err) {
        console.error('Web3Forms Fetch Error:', err);
        alert('Network Error submitting form. Please call +91 0000000000 or email lokenathcombfactory@gmail.com directly.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      }
    });
  });
}

/* 8. Product Quick View Modal & Interactive Explore Catalog */
function initProductModals() {
  const quickBtns = document.querySelectorAll('.product-quick-view-btn');
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('product-modal-close');
  const modalTitle = document.getElementById('modal-product-title');
  const modalImg = document.getElementById('modal-product-img');
  const modalDesc = document.getElementById('modal-product-desc');
  const modalSpecs = document.getElementById('modal-product-specs');
  const modalGrid = document.getElementById('modal-product-grid');
  const tabBtns = document.querySelectorAll('.modal-tab-btn');

  if (!modal) return;

  // Category Catalog Data (Matching Reference Screenshot Layout & Loke Nath Comb Factory Branding)
  const catalogDatabase = {
    "ladies": {
      title: "9 Inch Ladies Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the Reliable <strong>9 Inch Ladies Comb Manufacturer</strong> in Bongaon, West Bengal, India. The 9-inch ladies' comb that we make is not just a functional product, it is also a necessity in your hair care toolbox this means that this comb will accentuate your grooming kit. It is easy to use and convenient for daily shaving and styling.</p><p>We are the Versatile <strong>9 Inch Ladies Comb Exporters in India</strong>. Our combs are engineered with high-grade polymer featuring smooth anti-static teeth that glide effortlessly through long or thick hair without causing breakage or scalp discomfort.</p>",
      specs: "Material: Premium Grade Polymer & Acetate | Length: 22 CM | Features: Fine & Wide Teeth Combo | Anti-Static: Yes",
      images: ["assets/uploads/Quick-ifo-cards/img3.png", "assets/uploads/Quick-ifo-cards/img1.png", "assets/uploads/Quick-ifo-cards/img4.png"],
      products: [
        { name: "Spider", size: "22 CM", weight: "14.7 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "Airline", size: "22 CM", weight: "19.7 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "Surya", size: "21 CM", weight: "16.7 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" },
        { name: "TOPLINE", size: "22 CM", weight: "19.5 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "TIK TIK", size: "21 CM", weight: "11.8 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "SURYA KIRAN", size: "20 CM", weight: "16.2 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" },
        { name: "SULTAN", size: "21 CM", weight: "17 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "APPLE", size: "21 CM", weight: "19.4 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "ROCKET", size: "22 CM", weight: "24 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" },
        { name: "MAGIC", size: "22 CM", weight: "21.7 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "GRU", size: "19 CM", weight: "21.7 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "CLASSIC", size: "22 CM", weight: "20.5 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" }
      ]
    },
    "wooden": {
      title: "Wooden Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the Premier <strong>Wooden Comb Manufacturer</strong> in Bongaon, West Bengal, India. Handcrafted from 100% natural Neem Wood to naturally condition hair and massage scalp follicles.</p>",
      specs: "Material: 100% Natural Neem Wood | Anti-Static: 100% | Teeth: Polished Smooth Rounded Tips",
      images: ["assets/uploads/Quick-ifo-cards/img2.png"],
      products: [
        { name: "Neem Handle Comb", size: "20 CM", weight: "28 Grams", img: "assets/uploads/Quick-ifo-cards/img2.png" },
        { name: "Neem Wide Tooth", size: "19 CM", weight: "25 Grams", img: "assets/uploads/Quick-ifo-cards/img2.png" },
        { name: "Pocket Wooden", size: "14 CM", weight: "18 Grams", img: "assets/uploads/Quick-ifo-cards/img2.png" }
      ]
    },
    "pocket": {
      title: "Pocket Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the Leading <strong>Pocket Comb Manufacturer</strong> in West Bengal. Compact, lightweight, and durable grooming combs designed for daily carrying.</p>",
      specs: "Size: 5 Inch Compact | Material: High Impact Polypropylene | Portability: Shirt/Pants Pocket Fit",
      images: ["assets/uploads/Quick-ifo-cards/img1.png", "assets/uploads/Quick-ifo-cards/img3.png"],
      products: [
        { name: "Mini Pocket", size: "13 CM", weight: "8.5 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "Slim Pocket", size: "14 CM", weight: "9.2 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "Dual Fine Pocket", size: "13.5 CM", weight: "8.9 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" }
      ]
    },
    "family": {
      title: "Hair Comb Family Pack Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> produces versatile multi-pack family combs featuring diverse sizes for men, women, and kids in bright vibrant colors.</p>",
      specs: "Pack Size: 4-6 Combs Per Pack | Packaging: Display Card / Box | Material: Virgin Plastic",
      images: ["assets/uploads/Quick-ifo-cards/img3.png", "assets/uploads/Quick-ifo-cards/img1.png"],
      products: [
        { name: "Family Set 5-Pcs", size: "Mixed 14-22 CM", weight: "85 Grams Pack", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "Color Burst Pack", size: "Mixed 15-20 CM", weight: "78 Grams Pack", img: "assets/uploads/Quick-ifo-cards/img1.png" }
      ]
    },
    "lice": {
      title: "Hygienic Lice Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the Trusted <strong>Lice Comb Manufacturer</strong> in India, featuring ultra-fine micro teeth designed for scalp hygiene and nit removal.</p>",
      specs: "Teeth Gap: Ultra Fine Micro-Gap | Material: Rigid Acetate | Safety: Rounded Non-Scratch Tips",
      images: ["assets/uploads/Quick-ifo-cards/img4.png"],
      products: [
        { name: "Solon Fine Lice", size: "10 CM", weight: "12 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" },
        { name: "Double Side Lice", size: "9 CM", weight: "11 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" }
      ]
    },
    "pro-brushes": {
      title: "Professional Hair Brushes Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> supplies high quality styling paddle brushes and thermal round brushes engineered for salon professional blow-drying and detangling.</p>",
      specs: "Bristles: Soft Ball-Tip Nylon | Grip: Ergonomic Non-Slip Rubberized Handle",
      images: ["assets/uploads/catalog_center_showcase.png"],
      products: [
        { name: "Vent Styling Brush", size: "24 CM", weight: "65 Grams", img: "assets/uploads/catalog_center_showcase.png" },
        { name: "Round Thermal Brush", size: "23 CM", weight: "58 Grams", img: "assets/uploads/catalog_center_showcase.png" },
        { name: "Paddle Cushion Brush", size: "25 CM", weight: "72 Grams", img: "assets/uploads/catalog_center_showcase.png" }
      ]
    },
    "brushes": {
      title: "Hair Brushes Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> manufactures lightweight everyday grooming hair brushes crafted with ball-tipped bristles for gentle scalp massaging.</p>",
      specs: "Usage: Everyday Hair Detangling | Material: Durable ABS & Soft Nylon",
      images: ["assets/uploads/catalog_center_showcase.png"],
      products: [
        { name: "Daily Detangler", size: "21 CM", weight: "45 Grams", img: "assets/uploads/catalog_center_showcase.png" },
        { name: "Travel Hair Brush", size: "16 CM", weight: "32 Grams", img: "assets/uploads/catalog_center_showcase.png" }
      ]
    },
    "hotel": {
      title: "Hotel Amenity Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the Premier <strong>Hotel Amenity Comb Supplier</strong>, manufacturing individually poly-wrapped combs for luxury hotels and resort guest kits.</p>",
      specs: "Wrap: Sealed Polybag Packaging | Material: Eco Virgin Polymer | Colors: White / Ivory / Black",
      images: ["assets/uploads/Quick-ifo-cards/img1.png"],
      products: [
        { name: "Hotel Amenity Comb", size: "18 CM", weight: "14 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "Compact Resort Comb", size: "15 CM", weight: "10 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" }
      ]
    },
    "salon": {
      title: "Barber & Salon Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> manufactures heat-resistant sectioning tail combs and barber fading combs designed for professional hair salons.</p>",
      specs: "Heat Resistance: Up to 180°C | Chemical Resistant: Yes | Usage: Barber Styling & Haircutting",
      images: ["assets/uploads/Quick-ifo-cards/img4.png"],
      products: [
        { name: "Tail Sectioning Comb", size: "21 CM", weight: "13 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" },
        { name: "Barber Clipper Comb", size: "22 CM", weight: "18 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" }
      ]
    },
    "hair-comb": {
      title: "Hair Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> produces a wide variety of robust everyday hair combs crafted with rounded teeth for scalp comfort.</p>",
      specs: "Material: High Quality Plastic | Teeth: Smooth Rounded | Colors: Multi-color options",
      images: ["assets/uploads/Quick-ifo-cards/img3.png"],
      products: [
        { name: "Standard Family Comb", size: "20 CM", weight: "16 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "Wide Tooth Styling Comb", size: "19 CM", weight: "15 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" }
      ]
    }
  };

  let imageAutoTimer = null;

  function renderCategory(catKey) {
    const data = catalogDatabase[catKey] || catalogDatabase["ladies"];

    // Title & Description
    if (modalTitle) modalTitle.innerText = data.title;
    if (modalDesc) modalDesc.innerHTML = data.desc;
    if (modalSpecs) modalSpecs.innerText = data.specs;

    // Image Auto-Slider logic
    if (imageAutoTimer) clearInterval(imageAutoTimer);
    let imgIdx = 0;
    const imgList = data.images && data.images.length > 0 ? data.images : ["assets/uploads/Quick-ifo-cards/img3.png"];
    if (modalImg) modalImg.src = imgList[0];

    if (imgList.length > 1) {
      imageAutoTimer = setInterval(() => {
        imgIdx = (imgIdx + 1) % imgList.length;
        if (modalImg) {
          modalImg.style.opacity = '0.4';
          setTimeout(() => {
            modalImg.src = imgList[imgIdx];
            modalImg.style.opacity = '1';
          }, 200);
        }
      }, 3000); // 3-second image auto scroll
    }

    // Update Left Sidebar Tabs active state (#800033)
    tabBtns.forEach(btn => {
      const btnCat = btn.getAttribute('data-category');
      if (btnCat === catKey) {
        btn.className = "modal-tab-btn w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition bg-brand-primary text-white shadow";
      } else {
        btn.className = "modal-tab-btn w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition text-gray-700 hover:bg-white hover:text-brand-primary";
      }
    });

    // Render Right Grid of Model Cards
    if (modalGrid) {
      modalGrid.innerHTML = data.products.map(p => `
        <div class="bg-gray-50 hover:bg-pink-50/60 p-3 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition text-center group flex flex-col justify-between">
          <div class="h-32 bg-white rounded-xl flex items-center justify-center p-2 mb-2 border border-gray-100 overflow-hidden">
            <img src="${p.img}" alt="${p.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300">
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-brand-primary transition">${p.name}</h4>
            <div class="text-[11px] text-gray-500 mt-1 font-medium space-y-0.5">
              <p>Size: <span class="text-gray-800 font-semibold">${p.size}</span></p>
              <p>Weight: <span class="text-gray-800 font-semibold">${p.weight}</span></p>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Bind Quick View Buttons
  quickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catName = (btn.getAttribute('data-category-name') || '').toLowerCase();
      let matchedKey = "ladies";

      if (catName.includes("wood")) matchedKey = "wooden";
      else if (catName.includes("pocket")) matchedKey = "pocket";
      else if (catName.includes("family")) matchedKey = "family";
      else if (catName.includes("lice")) matchedKey = "lice";
      else if (catName.includes("hotel")) matchedKey = "hotel";
      else if (catName.includes("salon")) matchedKey = "salon";
      else if (catName.includes("brush")) matchedKey = "brushes";
      else if (catName.includes("ladies") || catName.includes("9 inch")) matchedKey = "ladies";
      else matchedKey = "hair-comb";

      renderCategory(matchedKey);
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  // Bind Left Sidebar Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catKey = btn.getAttribute('data-category');
      renderCategory(catKey);
    });
  });

  function closeModal() {
    if (imageAutoTimer) clearInterval(imageAutoTimer);
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* 9. Floating WhatsApp Business Chat Widget */
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('whatsapp-widget-btn');
  const chatCard = document.getElementById('whatsapp-chat-card');
  const closeBtn = document.getElementById('whatsapp-card-close');

  if (!toggleBtn || !chatCard) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chatCard.classList.toggle('hidden');
    chatCard.classList.toggle('flex');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatCard.classList.add('hidden');
      chatCard.classList.remove('flex');
    });
  }

  document.addEventListener('click', (e) => {
    if (!chatCard.contains(e.target) && !toggleBtn.contains(e.target)) {
      chatCard.classList.add('hidden');
      chatCard.classList.remove('flex');
    }
  });
}

/* 10. Dedicated Product Details Page Initialization */
function initProductDetailPage() {
  const detailTitle = document.getElementById('detail-product-title');
  const detailImg = document.getElementById('detail-product-img');
  const detailDesc = document.getElementById('detail-product-desc');
  const detailSpecs = document.getElementById('detail-product-specs');
  const detailGrid = document.getElementById('detail-product-grid');
  const tabBtns = document.querySelectorAll('.detail-tab-btn');
  const breadcrumbCat = document.getElementById('page-breadcrumb-cat');

  if (!detailTitle || !detailGrid) return;

  // Shared catalog Database with exact user categories
  const catalogDb = {
    "jessore-fancy": {
      title: "Jessore New Fancy Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the leading manufacturer of <strong>Jessore New Fancy Combs</strong> in Bongaon, West Bengal. Crafted with modern aesthetic designs, vibrant dual-tone shades, and ultra-smooth polished teeth for premium hair grooming.</p><p>Browse our complete live catalog on WhatsApp (<a href='https://wa.me/c/218601520894144' target='_blank' class='text-brand-primary font-bold underline'>View WhatsApp Catalog</a>).</p>",
      specs: "Material: High-Gloss Polymer & Virgin Plastic | Style: New Fancy Designer Finish | Teeth: Anti-Static Fine & Medium Teeth",
      images: ["assets/uploads/Quick-ifo-cards/img3.png", "assets/uploads/Quick-ifo-cards/img1.png", "assets/uploads/Quick-ifo-cards/img4.png"],
      products: [
        { name: "Fancy Designer Model A", size: "22 CM", weight: "18 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "Fancy Wave Grip", size: "21 CM", weight: "16.5 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "Fancy Color Burst", size: "20 CM", weight: "15 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" }
      ]
    },
    "jessore-comb": {
      title: "Jessore Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the wholesale manufacturer of authentic <strong>Jessore Combs</strong> in Bongaon & West Bengal. Our classic Jessore collection features precision smooth teeth, high durability, and scalp massage tips.</p><p>Browse our complete live catalog on WhatsApp (<a href='https://wa.me/c/218601520894144' target='_blank' class='text-brand-primary font-bold underline'>View WhatsApp Catalog</a>).</p>",
      specs: "Material: Premium High-Density Polymer & Neem | Style: Classic Jessore Design | Live Catalog: wa.me/c/218601520894144",
      images: ["assets/uploads/Quick-ifo-cards/img3.png", "assets/uploads/Quick-ifo-cards/img1.png"],
      products: [
        { name: "Jessore Fine Comb", size: "20 CM", weight: "16 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "Jessore Master Handle", size: "22 CM", weight: "19 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "Jessore Dual Tooth", size: "21 CM", weight: "17.5 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" }
      ]
    },
    "plastic-jessore-tooth": {
      title: "Plastic Jessore Tooth Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> produces heavy-duty <strong>Plastic Jessore Tooth Combs</strong> with extra-wide and fine tooth spacing engineered for smooth hair detangling without pulling or breakage.</p>",
      specs: "Teeth Structure: Wide & Fine Dual Gap | Material: Virgin High-Impact Plastic | Color Options: Black, Amber, Pastel",
      images: ["assets/uploads/Quick-ifo-cards/img4.png", "assets/uploads/Quick-ifo-cards/img3.png"],
      products: [
        { name: "Wide Tooth Jessore", size: "21 CM", weight: "18.2 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" },
        { name: "Dual Tooth Jessore Pro", size: "22 CM", weight: "20 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" }
      ]
    },
    "plastic-box": {
      title: "Plastic Box Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> supplies wholesale <strong>Plastic Box Combs</strong> in individual and bulk boxed sets packaged for retail stores, supermarkets, and hotel distribution.</p>",
      specs: "Packaging: Individual Box / Display Master Carton | Material: Durable Virgin Polypropylene",
      images: ["assets/uploads/Quick-ifo-cards/img1.png", "assets/uploads/Quick-ifo-cards/img2.png"],
      products: [
        { name: "Boxed Retail Pack Comb", size: "20 CM", weight: "19 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "Master Box 12-Pack", size: "Mixed 18-22 CM", weight: "240 Grams Box", img: "assets/uploads/Quick-ifo-cards/img2.png" }
      ]
    },
    "plastic-pitta": {
      title: "Plastic PITTA Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the leading manufacturer of high-precision <strong>Plastic PITTA Combs</strong> crafted with rigid backbones, fine teeth alignment, and daily scalp care ergonomics.</p>",
      specs: "Style: PITTA Pattern Hair Comb | Material: Rigid Poly-Acetate | Anti-Static: Yes",
      images: ["assets/uploads/Quick-ifo-cards/img3.png"],
      products: [
        { name: "Standard PITTA Comb", size: "20 CM", weight: "17 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "Heavy Duty PITTA Pro", size: "22 CM", weight: "21 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" }
      ]
    },
    "neem-wooden": {
      title: "Neem Wooden Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the Premier <strong>Neem Wooden Comb Manufacturer</strong> in Bongaon, West Bengal. Handcrafted from 100% natural Neem Wood to condition hair naturally and massage scalp follicles.</p>",
      specs: "Material: 100% Natural Neem Wood | Anti-Static: 100% | Teeth: Polished Smooth Rounded Tips",
      images: ["assets/uploads/Quick-ifo-cards/img2.png"],
      products: [
        { name: "Neem Handle Comb", size: "20 CM", weight: "28 Grams", img: "assets/uploads/Quick-ifo-cards/img2.png" },
        { name: "Neem Wide Tooth", size: "19 CM", weight: "25 Grams", img: "assets/uploads/Quick-ifo-cards/img2.png" },
        { name: "Pocket Wooden Neem", size: "14 CM", weight: "18 Grams", img: "assets/uploads/Quick-ifo-cards/img2.png" }
      ]
    },
    "plastic-razor": {
      title: "Plastic Razor & Barber Accessories",
      desc: "<p><strong>Loke Nath Comb Factory</strong> manufactures ergonomic <strong>Plastic Barber Razors</strong> and grooming accessories designed for barber shops, personal grooming, and salons.</p>",
      specs: "Material: High-Density ABS & Stainless Steel Holder | Ergonomics: Non-Slip Folding Handle",
      images: ["assets/uploads/Quick-ifo-cards/img4.png"],
      products: [
        { name: "Barber Folding Plastic Razor", size: "15 CM", weight: "22 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" },
        { name: "Salon Shaving Razor Grip", size: "16 CM", weight: "24 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" }
      ]
    },
    "shikha-kangha": {
      title: "Shikha Kangha Set Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> produces authentic traditional <strong>Shikha Kangha Sets</strong> crafted according to traditional cultural guidelines for daily wear and hair hygiene.</p>",
      specs: "Set Type: Traditional Kangha Comb | Material: High Grade Polymer / Eco Neem Wood | Polish: Smooth Non-Scratch Edges",
      images: ["assets/uploads/Quick-ifo-cards/img1.png", "assets/uploads/Quick-ifo-cards/img2.png"],
      products: [
        { name: "Traditional Shikha Kangha", size: "7 CM", weight: "8 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "Compact Kangha Wooden Set", size: "8 CM", weight: "10 Grams", img: "assets/uploads/Quick-ifo-cards/img2.png" }
      ]
    },
    "roll-comb": {
      title: "Roll Comb & Round Styling Brushes",
      desc: "<p><strong>Loke Nath Comb Factory</strong> manufactures premium <strong>Roll Combs</strong> (round blow-drying styling brushes) for salons, barbers, and daily hair volume styling.</p>",
      specs: "Type: Round Barrel Roll Comb | Bristles: Heat-Resistant Nylon Ball-Tip | Usage: Blow Drying & Volume Styling",
      images: ["assets/uploads/catalog_center_showcase.png"],
      products: [
        { name: "Professional Barrel Roll Comb", size: "23 CM", weight: "55 Grams", img: "assets/uploads/catalog_center_showcase.png" },
        { name: "Salon Blow-Dry Roll Comb", size: "24 CM", weight: "62 Grams", img: "assets/uploads/catalog_center_showcase.png" }
      ]
    },
    "ladies": {
      title: "9 Inch Ladies Comb Manufacturers",
      desc: "<p><strong>Loke Nath Comb Factory</strong> is the Reliable <strong>9 Inch Ladies Comb Manufacturer</strong> in Bongaon, West Bengal, India. Our 9-inch ladies' comb features smooth anti-static teeth that glide effortlessly through long or thick hair without causing breakage or scalp discomfort.</p>",
      specs: "Material: Premium Grade Polymer & Acetate | Length: 22 CM | Features: Fine & Wide Teeth Combo | Anti-Static: Yes",
      images: ["assets/uploads/Quick-ifo-cards/img3.png", "assets/uploads/Quick-ifo-cards/img1.png"],
      products: [
        { name: "Spider", size: "22 CM", weight: "14.7 Grams", img: "assets/uploads/Quick-ifo-cards/img3.png" },
        { name: "Airline", size: "22 CM", weight: "19.7 Grams", img: "assets/uploads/Quick-ifo-cards/img1.png" },
        { name: "Surya", size: "21 CM", weight: "16.7 Grams", img: "assets/uploads/Quick-ifo-cards/img4.png" }
      ]
    }
  };

  let pageImgTimer = null;

  function loadCategory(catKey) {
    const data = catalogDb[catKey] || catalogDb["ladies"];

    if (detailTitle) detailTitle.innerText = data.title;
    if (detailDesc) detailDesc.innerHTML = data.desc;
    if (detailSpecs) detailSpecs.innerText = data.specs;
    if (breadcrumbCat) breadcrumbCat.innerText = data.title;

    // Image Auto-Slider logic
    if (pageImgTimer) clearInterval(pageImgTimer);
    let imgIdx = 0;
    const imgList = data.images && data.images.length > 0 ? data.images : ["assets/uploads/Quick-ifo-cards/img3.png"];
    if (detailImg) detailImg.src = imgList[0];

    if (imgList.length > 1) {
      pageImgTimer = setInterval(() => {
        imgIdx = (imgIdx + 1) % imgList.length;
        if (detailImg) {
          detailImg.style.opacity = '0.4';
          setTimeout(() => {
            detailImg.src = imgList[imgIdx];
            detailImg.style.opacity = '1';
          }, 200);
        }
      }, 3000); // 3-second image auto scroll
    }

    // Active Sidebar Tab Highlight (#800033)
    tabBtns.forEach(btn => {
      const btnCat = btn.getAttribute('data-category');
      if (btnCat === catKey) {
        btn.className = "detail-tab-btn w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition bg-brand-primary text-white shadow";
      } else {
        btn.className = "detail-tab-btn w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition text-gray-700 hover:bg-white hover:text-brand-primary";
      }
    });

    // Render Right Model Cards Grid
    if (detailGrid) {
      detailGrid.innerHTML = data.products.map(p => `
        <div class="bg-gray-50 hover:bg-pink-50/60 p-4 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition text-center group flex flex-col justify-between">
          <div class="h-40 bg-white rounded-xl flex items-center justify-center p-3 mb-3 border border-gray-100 overflow-hidden">
            <img src="${p.img}" alt="${p.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300">
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm sm:text-base group-hover:text-brand-primary transition">${p.name}</h4>
            <div class="text-xs text-gray-500 mt-1 font-medium space-y-0.5">
              <p>Size: <span class="text-gray-800 font-semibold">${p.size}</span></p>
              <p>Weight: <span class="text-gray-800 font-semibold">${p.weight}</span></p>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Parse URL query ?cat=...
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = (urlParams.get('cat') || 'ladies').toLowerCase();

  let initialKey = "ladies";
  if (catParam.includes("wood")) initialKey = "wooden";
  else if (catParam.includes("pocket")) initialKey = "pocket";
  else if (catParam.includes("family")) initialKey = "family";
  else if (catParam.includes("lice")) initialKey = "lice";
  else if (catParam.includes("hotel")) initialKey = "hotel";
  else if (catParam.includes("salon")) initialKey = "salon";
  else if (catParam.includes("brush")) initialKey = "brushes";
  else if (catParam.includes("ladies") || catParam.includes("9 inch")) initialKey = "ladies";
  else initialKey = "hair-comb";

  loadCategory(initialKey);

  // Tab Listeners
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catKey = btn.getAttribute('data-category');
      loadCategory(catKey);
    });
  });
}

