const products = [
    { id: 1, name: 'Panel Unli Private', price: 5000 },
    { id: 2, name: 'Panel Unli Public', price: 4000 },
    { id: 3, name: 'Reseller Panel Private', price: 6000 },
    { id: 4, name: 'PT Panel Private', price: 7000 },
    { id: 5, name: 'Admin Panel Private', price: 8000 },
    { id: 6, name: 'Own Panel Private', price: 10000 },
    { id: 7, name: 'TK Panel Private', price: 12000 },
    { id: 8, name: 'Head Admin Panel Private', price: 14000 },
    { id: 9, name: 'PO Script Nika V16', price: 20000 },
    { id: 10, name: 'Script Otax V3 Gen 3', price: 50000 },
    { id: 11, name: 'Script Xorizo V6', price: 15000 },
    { id: 12, name: 'Own Jasher Public', price: 10000 },
    { id: 13, name: 'Own Jasher Private', price: 15000 },
    { id: 14, name: 'Script Pushkontak', price: 10000 },
    { id: 15, name: 'Marga push ch', price: 5000 },
    { id: 16, name: 'Own push ch', price: 10000 }
];

let cart = [];

function showNotification(message) {
    const notificationEl = document.createElement('div');
    notificationEl.className = 'notification';
    notificationEl.textContent = message;
    document.body.appendChild(notificationEl);

    setTimeout(() => {
        notificationEl.classList.add('show');
    }, 10);

    setTimeout(() => {
        notificationEl.classList.remove('show');
        setTimeout(() => {
            notificationEl.remove();
        }, 400);
    }, 3000);
}

function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
            <button onclick="addToCart(${product.id})">
                <i class="fas fa-plus-circle"></i> Tambah
            </button>
        `;
        productGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const productToAdd = products.find(p => p.id === productId);
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({...productToAdd, quantity: 1});
    }
    updateCart();
    const cartEl = document.getElementById('shopping-cart');
    cartEl.style.transform = 'scale(1.03)';
    setTimeout(() => {
        cartEl.style.transform = 'scale(1)';
    }, 200);
}

function updateCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    let total = 0;
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p style="text-align: center; color: #777;">Keranjang kosong.</p>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} <br>
                <strong>(${item.quantity}x)</strong> - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}
            `;
            cartItemsEl.appendChild(li);
            total += item.price * item.quantity;
        });
    }
    cartTotalEl.querySelector('p').innerHTML = `Total: <strong>Rp ${total.toLocaleString('id-ID')}</strong>`;
}

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang belanja Anda kosong.');
        return;
    }
    document.getElementById('products-list').style.display = 'none';
    document.getElementById('shopping-cart').style.display = 'none';
    document.getElementById('payment-selection').style.display = 'block';
});

document.querySelectorAll('.payment-option-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const method = event.target.dataset.method;
        document.getElementById('payment-selection').style.display = 'none';
        document.getElementById('checkout-confirmation').style.display = 'block';
        showPaymentDetails(method);
    });
});

function showPaymentDetails(method) {
    const paymentDetailsEl = document.getElementById('payment-details');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let paymentContent = '';
    let orderMessage = ``;

    if (method === 'dana') {
        paymentContent = `
            <p class="payment-info">
                Metode Pembayaran: DANA <br>
                Nomor: <span>082373215063</span> <br>
                A.N: *****
            </p>
        `;
        orderMessage = `
*╭───••─ ❖ ─••───╮*
*✨ KONFIRMASI PESANAN ✨*
*╰───••─ ❖ ─••───╯*

*📜 Rincian Pesanan:*
${cart.map(item => `   - ${item.name} (${item.quantity}x)`).join('\n')}

*💰 Total Pembayaran:*
   Rp ${total.toLocaleString('id-ID')}

*💳 Metode Pembayaran:*
   DANA: 082373215063
   (A.N. *****)

*💬 KONFIRMASI:*
   Saya sudah melakukan pembayaran dan siap mengirim bukti.
`;
    } else if (method === 'qris') {
        paymentContent = `
            <p>Silakan scan QRIS di bawah ini:</p>
            <img id="qris-image" src="qris.jpg" alt="QRIS Code">
        `;
        orderMessage = `
*╭───••─ ❖ ─••───╮*
*✨ KONFIRMASI PESANAN ✨*
*╰───••─ ❖ ─••───╯*

*📜 Rincian Pesanan:*
${cart.map(item => `   - ${item.name} (${item.quantity}x)`).join('\n')}

*💰 Total Pembayaran:*
   Rp ${total.toLocaleString('id-ID')}

*💳 Metode Pembayaran:*
   QRIS

*💬 KONFIRMASI:*
   Saya sudah melakukan pembayaran dan siap mengirim bukti.
`;
    }

    paymentDetailsEl.innerHTML = `
        <p class="payment-info">
            Total yang harus dibayar: <strong>Rp ${total.toLocaleString('id-ID')}</strong>
        </p>
        
        ${paymentContent}

        <p>
            <i class="fas fa-exclamation-circle"></i>
            Silakan salin detail di bawah ini, lalu kirim ke grup WhatsApp.
        </p>
        <pre id="order-message-text">${orderMessage}</pre>
        
        <button id="copy-btn"><i class="fas fa-copy"></i> Salin Detail</button>
        <button id="open-whatsapp-btn"><i class="fab fa-whatsapp"></i> Buka Grup WhatsApp</button>
    `;

    document.getElementById('copy-btn').addEventListener('click', () => {
        const textToCopy = document.getElementById('order-message-text').innerText;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showNotification('Detail pesanan berhasil disalin!');
            })
            .catch(err => {
                showNotification('Gagal menyalin. Silakan salin manual.');
            });
    });

    document.getElementById('open-whatsapp-btn').addEventListener('click', () => {
        const groupLink = 'https://chat.whatsapp.com/BulL0ZUZfBfIJLae6IdG4i';
        window.open(groupLink, '_blank');
    });
}

// Logika Preloader dan Pop-up Promosi
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const promoPopup = document.getElementById('promo-popup');
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';

        setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            
            // Tampilkan pop-up promosi setelah konten utama terlihat
            setTimeout(() => {
                promoPopup.classList.add('show');
            }, 1000); 

            // Sembunyikan pop-up setelah 5 detik
            setTimeout(() => {
                promoPopup.classList.add('hide');
            }, 6000);
            
            // Hapus pop-up dari DOM setelah animasi selesai
            setTimeout(() => {
                promoPopup.remove();
            }, 6600); // Durasi 600ms (0.6s) dari animasi 'hide'

        }, 500); 
    }, 1000);

    renderProducts();
});