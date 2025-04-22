
document.addEventListener("DOMContentLoaded", () => {
  // Hamburger toggle
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const mobileMenu = document.getElementById("mobile-menu");

  hamburgerIcon?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
  });

  // Carousel Functionality
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      const text = slide.querySelector(".slide-text");
      slide.classList.toggle("active", i === index);
      slide.style.opacity = i === index ? "1" : "0";
      slide.style.zIndex = i === index ? "10" : "0";

      if (text) {
        if (i === index) {
          text.classList.remove("opacity-0", "translate-y-5");
        } else {
          text.classList.add("opacity-0", "translate-y-5");
        }
      }
    });
  }

  document.getElementById("next")?.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  document.getElementById("prev")?.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 6000);

  showSlide(currentSlide);

  // Fade in on scroll
  const fadeEls = document.querySelectorAll(".fade-on-scroll");
  const fadeObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-5");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeEls.forEach((el) => fadeObserver.observe(el));

  // Product section scroll animation
  const section = document.getElementById("products");
  const cards = document.querySelectorAll("[data-animate]");

  const productObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.remove("opacity-0", "translate-y-5");
          section.classList.add("opacity-100", "translate-y-0");

          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.remove("opacity-0", "scale-95");
              card.classList.add("opacity-100", "scale-100");
            }, index * 150);
          });

          productObserver.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );
  if (section) productObserver.observe(section);

  // Search toggle
  const openSearch = document.getElementById('openSearch');
  const searchBar = document.getElementById('searchBar');
  const clearSearch = document.getElementById('clearSearch');

  openSearch?.addEventListener('click', () => {
    searchBar?.classList.toggle('hidden');
  });

  clearSearch?.addEventListener('click', () => {
    searchBar?.classList.add('hidden');
  });

  // Wishlist Logic
  const wishlist = new Set(JSON.parse(localStorage.getItem("wishlistItems")) || []);
  const countBadge = document.getElementById("wishlist-count");
  const heartIcon = document.getElementById("navbar-heart-icon");

  function updateWishlistCount() {
    const count = wishlist.size;
    if (countBadge) {
      countBadge.textContent = count;
      count > 0
        ? countBadge.classList.remove("hidden")
        : countBadge.classList.add("hidden");
    }

    if (heartIcon) {
      if (count > 0) {
        heartIcon.classList.remove("far");
        heartIcon.classList.add("fas", "text-pink-600");
      } else {
        heartIcon.classList.add("far");
        heartIcon.classList.remove("fas", "text-pink-600");
      }
    }
  }

  updateWishlistCount();

  document.querySelectorAll(".wishlist-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");
      const productId = button.getAttribute("data-product-id");

      if (wishlist.has(productId)) {
        wishlist.delete(productId);
        icon.classList.remove("fas", "text-pink-500");
        icon.classList.add("far", "text-gray-400");
      } else {
        wishlist.add(productId);
        icon.classList.remove("far", "text-gray-400");
        icon.classList.add("fas", "text-pink-500");
      }

      localStorage.setItem("wishlistItems", JSON.stringify(Array.from(wishlist)));
      updateWishlistCount();
    });
  });

  const wishlistNavbarBtn = document.getElementById("wishlistNavbarBtn");
  wishlistNavbarBtn?.addEventListener("click", () => {
    window.location.href = "wishlist.html";
  });

  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      const productImage = btn.dataset.image;

      const productImageElement = document.getElementById(`product-image-${productId}`);
      if (productImageElement) {
        productImageElement.src = productImage;
      }

      const product = {
        id: productId,
        title: btn.dataset.title,
        category: btn.dataset.category,
        price: btn.dataset.price,
        image: productImage
      };

      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

      if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Added to wishlist!');
      }
    });
  });

  // === DROPDOWN LOGIC ADDED BELOW ===

  function setupDropdown(buttonId, dropdownId) {
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);

    if (!button || !dropdown) return;

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      dropdown.classList.add("hidden");
    });

    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
      dropdown.classList.add("hidden");
    });
  }

  setupDropdown("shopBtn", "shopDropdown");
  setupDropdown("categoriesBtn", "categoriesDropdown");
  setupDropdown("productsBtn", "productsDropdown");
  setupDropdown("dealsBtn", "dealsDropdown");
  setupDropdown("elementsBtn", "elementsDropdown");
});

// === CART FUNCTIONS OUTSIDE DOMContentLoaded ===

function addToCart(button) {
  const productCard = button.closest('.relative');
  const title = productCard.querySelector('h4').textContent;
  const price = productCard.querySelector('p.font-bold').textContent;
  const image = productCard.querySelector('img').src;
  const id = button.dataset.productId || title.replace(/\s+/g, '-').toLowerCase();

  const newItem = { id, title, price, image };

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const exists = cart.some(item => item.id === newItem.id);
  if (!exists) {
    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    openCart();
  } else {
    alert("This item is already in the cart!");
  }
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p class='text-gray-500'>Your cart is empty.</p>";
    return;
  }

  cart.forEach(item => {
    const itemHTML = `
      <div class="flex items-center justify-between border p-2 rounded-md cart-item" data-id="${item.id}">
        <div class="flex items-center gap-4">
          <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain">
          <div>
            <h4 class="text-gray-800 font-medium">${item.title}</h4>
            <p class="text-yellow-700 font-bold">${item.price}</p>
          </div>
        </div>
        <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700 text-xl">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = cartItems.length;
    badge.classList.toggle('hidden', cartItems.length === 0);
  }
}

function openCart() {
  document.getElementById('cartSidebar').classList.remove('translate-x-full');
  document.getElementById('cartBackdrop').classList.remove('hidden');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.add('translate-x-full');
  document.getElementById('cartBackdrop').classList.add('hidden');
}

