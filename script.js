const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');
const pageContainer = document.getElementById('page-container');

// Open modal and load external HTML
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', async () => {
    const page = el.getAttribute('data-page');
    try {
      const res = await fetch(page);
      const html = await res.text();
      pageContainer.innerHTML = html;
      modal.classList.remove('hidden');
    } catch (err) {
      pageContainer.innerHTML = '<p>Error loading content.</p>';
      modal.classList.remove('hidden');
    }
  });
});

// Close modal
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  pageContainer.innerHTML = '';
});
overlay.addEventListener('click', () => {
  modal.classList.add('hidden');
  pageContainer.innerHTML = '';
});
//Code Lama
//7.GA TAU NYAMPUR AJA
 function addToCart(product) {
      alert(product + 'telah ditambahkan ke keranjang Anda!');
    }

    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const dotContainer = document.querySelector('.slider-dots');

    // Create dot indicators
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', () => showSlide(i));
      dotContainer.appendChild(dot);
    });

    function updateDots() {
      document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    function showSlide(index) {
      if (index < 0) {
        currentSlide = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }
      document.querySelector('.slider')
              .style.transform = `translateX(-${currentSlide * 100}%)`;
      updateDots();
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    window.onload = () => {
      showSlide(currentSlide);
    };
    // cart.js

// 1. Load or initialize cart (array of {name, qty})
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 2. Helpers

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    zIndex: 1000,
  });
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 2000);
}

// 3. Core functions

function addToCart(productName) {
  const qtyStr = prompt(`Berapa jumlah "${productName}" yang ingin ditambahkan?`, "1");
  const qty = parseInt(qtyStr, 10);
  if (!qty || qty < 1) {
    showToast("Jumlah tidak valid.");
    return;
  }

  const existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name: productName, qty });
  }

  saveCart();
  updateCartUI();
  showToast(`${productName} x${qty} ditambahkan.`);
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showToast("Item dihapus.");
}

function clearCart() {
  if (!cart.length) return;
  if (confirm("Yakin ingin mengosongkan keranjang?")) {
    cart = [];
    saveCart();
    updateCartUI();
    showToast("Keranjang dikosongkan.");
  }
}

function sendWhatsAppOrder() {
  if (!cart.length) return;
  const phone = '6281779996889';
  let msg = 'Halo Toko Nanda, saya ingin memesan:\n';
  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.name} x${item.qty}\n`;
  });
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.location.href = url;
}

// 4. Render & listeners

function updateCartUI() {
  const list = document.getElementById('cart-items');
  list.innerHTML = '';

  cart.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${item.name} x${item.qty}`;

    // Hapus button
    const btn = document.createElement('button');
    btn.textContent = 'Hapus';
    btn.style.marginLeft = '0.5rem';
    btn.addEventListener('click', () => removeItem(i));
    li.appendChild(btn);

    list.appendChild(li);
  });

  const hasItems = cart.length > 0;
  document.getElementById('whatsapp-order').style.display = hasItems ? 'inline-block' : 'none';
  document.getElementById('clear-cart').style.display      = hasItems ? 'inline-block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach addToCart to all Pesan Sekarang buttons
  document.querySelectorAll('button[onclick^="addToCart"]').forEach(btn => {
    const productName = btn.getAttribute('onclick').match(/addToCart\('(.+)'\)/)[1];
    btn.addEventListener('click', () => addToCart(productName));
    // Remove inline onclick to avoid double-binding
    btn.removeAttribute('onclick');
  });

  document.getElementById('whatsapp-order').addEventListener('click', sendWhatsAppOrder);
  document.getElementById('clear-cart').addEventListener('click', clearCart);

  // Initial UI render
  updateCartUI();
  
});
// 1. Cache umum untuk semua produk
let productItemsCache = null;

// 2. Daftar file HTML produk
const pages = ['kopi.html', 'mie.html' /*, 'teh.html', 'jus.html', dst. */];

// 3. Fungsi load & cache semua <li> dari tiap file produk
async function loadProductItems() {
  if (productItemsCache) return productItemsCache;

  // Fetch & parse setiap halaman, ambil <li> .product-list
  const allLists = await Promise.all(
    pages.map(async page => {
      const res  = await fetch(page);
      const text = await res.text();
      const doc  = new DOMParser().parseFromString(text, 'text/html');
      const lis  = Array.from(doc.querySelectorAll('.product-list li'));

      // Simpan nama & HTML mentah untuk tiap li
      return lis.map(li => ({
        page,                                      // catat asal file
        name: li.querySelector('strong').textContent.trim(),
        html: li.outerHTML
      }));
    })
  );

  // Flatten hasil jadi satu array
  productItemsCache = allLists.flat();
  return productItemsCache;
}

// 4. Fungsi search global yang kini mencakup semua produk
async function globalSearch() {
  const query = document
    .getElementById('global-search-input')
    .value
    .trim()
    .toLowerCase();

  const resultsContainer = document.getElementById('global-search-results');
  resultsContainer.innerHTML = '';
  if (!query) return;

  // Dapatkan semua item dari semua pages
  const items = await loadProductItems();

  items
    .filter(item => item.name.toLowerCase().includes(query))
    .forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = item.html;
      // Jika di-klik, buka modal sesuai halaman asal
      li.addEventListener('click', () => {
        openModal(item.page);        
        // Anda bisa tambahkan scroll/jump ke elemen spesifik di modal
      });
      resultsContainer.appendChild(li);
    });
}


// Pasang listener
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('global-search-input');
  input.addEventListener('input', globalSearch);
});
