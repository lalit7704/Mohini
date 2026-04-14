// Premium Header System JavaScript
// Modern, performant mobile menu + sticky + search functionality

class PremiumHeader {
  constructor() {
    this.header = document.querySelector('.premium-header-wrapper');
    if (!this.header) return;
    
    this.headerEl = this.header.querySelector('.premium-header');
    this.mobileMenuBtn = this.header.querySelector('.premium-header__mobile-menu-toggle');
    this.searchBtn = this.header.querySelector('.premium-header__search-toggle');
    this.mobileMenu = this.header.querySelector('.premium-header__mobile-menu');
    this.searchModal = this.header.querySelector('.premium-header__search-modal');
    this.searchInput = this.header.querySelector('.premium-header__search-input');
    
    this.isMenuOpen = false;
    this.isSearchOpen = false;
    this.scrollTop = 0;
    this.headerHeight = 0;
    
    this.init();
  }
  
  init() {
    // Set initial header height
    this.updateHeaderHeight();
    
    // Event listeners
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
    }
    
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', this.toggleSearch.bind(this));
    }
    
    if (this.searchInput) {
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeSearch();
      });
    }
    
    // Close menus on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        this.closeSearch();
      }
    });
    
    // Close on outside click
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    
    // Sticky & scroll effects
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
    
    // Cart count updates
    document.addEventListener('cart:updated', this.updateCartCount.bind(this));
  }
  
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.mobileMenu.classList.toggle('premium-header__mobile-menu--open');
    this.mobileMenuBtn.classList.toggle('premium-header__icon--active');
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  
  closeMobileMenu() {
    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }
  
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    this.searchModal.classList.toggle('premium-header__search-modal--open');
    this.searchBtn.classList.toggle('premium-header__icon--active');
    
    if (this.isSearchOpen) {
      this.searchInput.focus();
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeSearch() {
    if (this.isSearchOpen) {
      this.toggleSearch();
    }
  }
  
  handleOutsideClick(e) {
    if (this.isMenuOpen && !this.header.contains(e.target)) {
      this.closeMobileMenu();
    }
    if (this.isSearchOpen && !this.header.contains(e.target)) {
      this.closeSearch();
    }
  }
  
  handleScroll() {
    this.scrollTop = window.scrollY;
    
    if (this.headerEl.classList.contains('premium-header--transparent')) {
      if (this.scrollTop > 100) {
        this.headerEl.classList.add('premium-header--scrolled');
      } else {
        this.headerEl.classList.remove('premium-header--scrolled');
      }
    }
  }
  
  updateHeaderHeight() {
    this.headerHeight = this.headerEl.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`);
  }
  
  handleResize() {
    this.updateHeaderHeight();
    // Close mobile menu on desktop
    if (window.innerWidth >= 990) {
      this.closeMobileMenu();
    }
  }
  
  updateCartCount() {
    const cartCountEls = this.header.querySelectorAll('.premium-header__cart-count');
    const cartCount = window.cart?.item_count || 0;
    
    cartCountEls.forEach(el => {
      el.textContent = cartCount;
      el.style.display = cartCount > 0 ? 'flex' : 'none';
    });
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PremiumHeader());
} else {
  new PremiumHeader();
}

// Utility for cart updates from other scripts
document.dispatchEvent(new CustomEvent('premium-header:ready'));

// Smooth scroll for nav links
document.addEventListener('click', (e) => {
  const link = e.target.closest('.premium-header__nav a[href^="#"]');
  if (link) {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

