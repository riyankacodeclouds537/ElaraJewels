const container = document.getElementById('wishlist-container');
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  if (wishlist.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">Your wishlist is empty.</p>';
  } else {
    wishlist.forEach(item => {
      const card = document.createElement('div');
      card.className = 'border p-4 rounded shadow text-center';
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="mx-auto h-40 object-contain mb-4">
        <h2 class="font-semibold text-lg">${item.title}</h2>
        <p class="text-sm text-gray-500">${item.category}</p>
        <p class="text-pink-600 font-bold">${item.price}</p>
      `;
      container.appendChild(card);
    });
  }