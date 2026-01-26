// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const navLinkItems = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navLinks && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        });

        mobileMenuOverlay.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });

        // Close mobile menu when clicking a link
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
            });
        });
    }

    // Initialize active navigation
    setActiveNav();
    
    // Add entrance animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature items and category cards for entrance animations
    document.querySelectorAll('.feature-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Initialize expand button on page load
    setTimeout(() => {
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filterValue = activeFilter.getAttribute('data-filter');
            updateBrandsCount();
            if (shouldShowExpandButton(filterValue)) {
                expandBrandsContainer.style.display = 'block';
                categoriesContainer.classList.add('collapsed');
            }
        }
    }, 100);
});

// Smooth Scroll with Active Navigation
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
    const scrollY = window.pageYOffset;

    // Remove all active classes first
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Only add active class if we've scrolled past 50px
    if (scrollY < 50) {
        return;
    }

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// Category Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const categoriesContainer = document.querySelector('.categories');
const expandBrandsBtn = document.getElementById('expandBrandsBtn');
const expandBrandsContainer = document.getElementById('expandBrandsContainer');
const brandsCount = document.getElementById('brandsCount');
let isExpanded = false;

// Function to count visible brands
function countVisibleBrands() {
    return Array.from(categoryCards).filter(card => 
        card.style.display !== 'none' && 
        window.getComputedStyle(card).display !== 'none'
    ).length;
}

// Function to update brands count display
function updateBrandsCount() {
    const visibleCount = countVisibleBrands();
    if (brandsCount) {
        brandsCount.textContent = `${visibleCount} brand${visibleCount !== 1 ? 's' : ''} available`;
    }
}

// Function to check if expand button should be shown
function shouldShowExpandButton(filterValue) {
    const visibleCount = countVisibleBrands();
    // Show expand button only for 'all' filter and when there are more than 8 brands (2 rows of 4)
    return filterValue === 'all' && visibleCount > 8;
}

// Function to toggle expand/collapse
function toggleExpand() {
    isExpanded = !isExpanded;
    const expandText = expandBrandsBtn.querySelector('.expand-text');
    const collapseText = expandBrandsBtn.querySelector('.collapse-text');
    
    if (isExpanded) {
        categoriesContainer.classList.remove('collapsed');
        expandBrandsBtn.classList.add('expanded');
        expandText.style.display = 'none';
        collapseText.style.display = 'inline';
        // Smooth scroll to show expanded content
        setTimeout(() => {
            const rect = categoriesContainer.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (rect.bottom > window.innerHeight) {
                window.scrollBy({
                    top: 200,
                    behavior: 'smooth'
                });
            }
        }, 100);
    } else {
        categoriesContainer.classList.add('collapsed');
        expandBrandsBtn.classList.remove('expanded');
        expandText.style.display = 'inline';
        collapseText.style.display = 'none';
        // Scroll back to categories section when collapsing
        const categoriesSection = document.getElementById('categories');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Event listener for expand button
if (expandBrandsBtn) {
    expandBrandsBtn.addEventListener('click', toggleExpand);
}

function applyFilter(filterValue) {
    categoryCards.forEach(card => {
        // First set opacity to 0 for hiding animation
        if (filterValue === 'all') {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            }, 50);
        } else {
            const category = card.getAttribute('data-category');
            if (category === filterValue) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }
    });
    
    // Update expand button visibility and brands count after animation
    setTimeout(() => {
        updateBrandsCount();
        if (shouldShowExpandButton(filterValue)) {
            expandBrandsContainer.style.display = 'block';
            if (!isExpanded) {
                categoriesContainer.classList.add('collapsed');
            }
        } else {
            expandBrandsContainer.style.display = 'none';
            categoriesContainer.classList.remove('collapsed');
            isExpanded = false;
            if (expandBrandsBtn) {
                expandBrandsBtn.classList.remove('expanded');
                expandBrandsBtn.querySelector('.expand-text').style.display = 'inline';
                expandBrandsBtn.querySelector('.collapse-text').style.display = 'none';
            }
        }
    }, 350);
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Clear search input when using filters
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');
        applyFilter(filterValue);
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    categoryCards.forEach(card => {
        const brandName = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const keywords = card.getAttribute('data-keywords')?.toLowerCase() || '';
        
        const matches = brandName.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       keywords.includes(searchTerm);

        if (searchTerm === '' || matches) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    // Reset filter buttons if searching, otherwise maintain current filter
    if (searchTerm !== '') {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Hide expand button when searching
        expandBrandsContainer.style.display = 'none';
        categoriesContainer.classList.remove('collapsed');
    } else {
        // Re-apply the active filter when search is cleared
        const activeFilter = document.querySelector('.filter-btn.active');
        if (!activeFilter) {
            filterButtons[0].classList.add('active');
            applyFilter('all');
        } else {
            // Update expand button visibility based on current filter
            setTimeout(() => {
                updateBrandsCount();
                const currentFilter = activeFilter.getAttribute('data-filter');
                if (shouldShowExpandButton(currentFilter)) {
                    expandBrandsContainer.style.display = 'block';
                    if (!isExpanded) {
                        categoriesContainer.classList.add('collapsed');
                    }
                }
            }, 350);
        }
    }
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Create WhatsApp message
    const whatsappMessage = `Hello! I'm ${name}%0A%0APhone: ${phone}${email ? `%0AEmail: ${email}` : ''}%0A%0AMessage: ${message}`;
    const whatsappUrl = `https://wa.me/94776553572?text=${whatsappMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    contactForm.reset();
    
    // Show success message
    alert('Thank you! Redirecting you to WhatsApp to complete your inquiry.');
});

// Lazy Loading Images
const images = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Add transition styles for category cards
categoryCards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease';
});