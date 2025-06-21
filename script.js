// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Importante: Configure estas variáveis
    const SEU_NUMERO_WHATSAPP = "5511969961123"; // Coloque seu número com código do país e DDD
    const SEU_LINK_PAGAMENTO = "00020126770014BR.GOV.BCB.PIX0136f5f81f14-ba0d-456b-82fe-864b3e0feb100215Apoie o WorCAP.5204000053039865802BR5925Rafael Marinho de Andrade6009SAO PAULO621405104M31Gi9AR063048773"; // Link do Mercado Pago, PicPay, etc.
    const SEU_PIX_COPIA_COLA = "00020126770014BR.GOV.BCB.PIX0136f5f81f14-ba0d-456b-82fe-864b3e0feb100215Apoie o WorCAP.5204000053039865802BR5925Rafael Marinho de Andrade6009SAO PAULO621405104M31Gi9AR063048773"; // Chave PIX para o QR Code

    // Referências aos elementos do DOM
    const productsSection = document.getElementById('products-section');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutModal = document.getElementById('checkout-modal');
    const paymentModal = document.getElementById('payment-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const checkoutForm = document.getElementById('checkout-form');
    const cartSection = document.getElementById('cart-section');
    const closeCartButton = document.getElementById('close-cart-btn');

    let cart = [];

    function renderProducts() {
        const productsByCategory = productsData.reduce((acc, product) => {
            (acc[product.category] = acc[product.category] || []).push(product);
            return acc;
        }, {});

        productsSection.innerHTML = '';

        for (const category in productsByCategory) {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categoryContainer.appendChild(categoryTitle);

            const productsGrid = document.createElement('div');
            productsGrid.className = 'products-grid';

            productsByCategory[category].forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';

                let sizeSelectorHTML = '';
                if (product.category === 'camiseta' && product.sizes) {
                    const sizeButtons = product.sizes.map(size => `<button data-size="${size}">${size}</button>`).join('');
                    sizeSelectorHTML = `<div class="size-selector">${sizeButtons}</div>`;
                }

                card.innerHTML = `
                    <img src="${product.photo}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        ${sizeSelectorHTML}
                        <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                        <button class="add-to-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
                    </div>
                `;
                productsGrid.appendChild(card);
            });

            categoryContainer.appendChild(productsGrid);
            productsSection.appendChild(categoryContainer);
        }

        document.querySelectorAll('.product-card').forEach(card => {
            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            const sizeSelector = card.querySelector('.size-selector');
            const productId = parseInt(addToCartBtn.dataset.id);

            if (sizeSelector) { 
                let selectedSize = null;
                const sizeButtons = sizeSelector.querySelectorAll('button');
                addToCartBtn.disabled = true;

                sizeButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        button.classList.add('selected');
                        selectedSize = button.dataset.size;
                        addToCartBtn.disabled = false;
                    });
                });

                addToCartBtn.addEventListener('click', () => {
                    if (selectedSize) {
                        addToCart(productId, selectedSize);
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        addToCartBtn.disabled = true;
                        selectedSize = null;
                    }
                });

            } else { 
                addToCartBtn.addEventListener('click', () => {
                    addToCart(productId, null);

                });
            }
        });
    }

    function addToCart(productId, size = null) {
        const cartItemId = size ? `${productId}-${size}` : `${productId}`;
        const existingItem = cart.find(item => item.cartItemId === cartItemId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            const product = productsData.find(p => p.id === productId);
            cart.push({ ...product, quantity: 1, size: size, cartItemId: cartItemId });
        }
        updateCartDisplay();
    }

    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            checkoutButton.disabled = true;
        } else {
            cartItemsContainer.innerHTML = '';
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                const displayName = item.size ? `${item.name} (Tamanho: ${item.size})` : item.name;

                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <span>${displayName}</span>
                        <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus-btn" data-cart-item-id="${item.cartItemId}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus-btn" data-cart-item-id="${item.cartItemId}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
            checkoutButton.disabled = false;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function handleCartActions(event) {
        const target = event.target;
        const cartItemId = target.dataset.cartItemId;

        if (!cartItemId) return;

        const itemInCart = cart.find(item => item.cartItemId === cartItemId);
        if (!itemInCart) return;

        if (target.classList.contains('plus-btn')) {
            itemInCart.quantity++;
        } else if (target.classList.contains('minus-btn')) {
            itemInCart.quantity--;
            if (itemInCart.quantity === 0) {
                cart = cart.filter(item => item.cartItemId !== cartItemId);
            }
        }
        updateCartDisplay();
    }
    
    cartItemsContainer.addEventListener('click', handleCartActions);

    async function generateOrder(customerInfo) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const orderDate = new Date().toLocaleDateString('pt-BR');
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        doc.setFontSize(18);
        doc.text("Resumo do Pedido", 15, 20);
        doc.setFontSize(12);
        doc.text(`Data do Pedido: ${orderDate}`, 15, 30);
        doc.text(`Cliente: ${customerInfo.name}`, 15, 40);
        doc.text(`Telefone: ${customerInfo.phone}`, 15, 50);
        doc.text(`Email: ${customerInfo.email}`, 15, 60);
        doc.line(15, 65, 195, 65);
        doc.text("Itens do Pedido:", 15, 75);

        let y = 85;
        cart.forEach(item => {
            if (y > 260) { doc.addPage(); y = 20; }
            const itemName = item.size ? `${item.name} (Tamanho: ${item.size})` : item.name;
            doc.text(`- ${itemName} (x${item.quantity})`, 15, y);
            doc.text(`R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`, 160, y);
            y += 10;
        });

        doc.line(15, y, 195, y);
        y += 10;
        doc.setFontSize(14);
        doc.text(`Valor Total: R$ ${total.toFixed(2).replace('.', ',')}`, 140, y);
        y += 15;
        doc.line(15, y, 195, y);
        y += 10;
        doc.setFontSize(16);
        doc.text("Pague com PIX", 15, y);
        y += 10;

        const qrCanvas = document.createElement('canvas');
        new QRious({
            element: qrCanvas,
            value: SEU_PIX_COPIA_COLA,
            size: 200
        });
        const qrImage = qrCanvas.toDataURL('image/png');

        doc.setFontSize(12);
        doc.text("Escaneie o QR Code:", 15, y);
        doc.addImage(qrImage, 'PNG', 15, y + 5, 50, 50);
        doc.text("Ou use a chave PIX Copia e Cola:", 75, y);
        doc.setFontSize(10);
        doc.text(SEU_PIX_COPIA_COLA, 75, y + 10, {maxWidth: 120});
        doc.text("O seu pedido está disponível para retirada a partir do dia 09 de setembro de 2025, durante o WorCAP25.", 15, 75);
        doc.text("Quaisquer dúvidas contate a equipe Organizadora.", 15, 75);

        doc.save("worcap_merchandise_pedidos.pdf");

        let whatsappMessage = `Olá! Gostaria de fazer um pedido:\n\n`;
        cart.forEach(item => {
            const itemName = item.size ? `*${item.name}* (Tamanho: *${item.size}*)` : `*${item.name}*`;
            whatsappMessage += `${itemName} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
        });
        whatsappMessage += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
        whatsappMessage += `\n\n*Meus dados:*\nNome: ${customerInfo.name}\nTelefone: ${customerInfo.phone}`;
        whatsappMessage += `\n\n(O resumo detalhado com QR Code para pagamento está no PDF em anexo)`;

        const whatsappUrl = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
        
        window.open(whatsappUrl, '_blank');
        doc.save("worcap_merchandise_pedidos.pdf");

        checkoutModal.style.display = 'none';
        confirmationModal.style.display = 'block';
    }
    
    function showPaymentModal() {
        checkoutModal.style.display = 'none';
        paymentModal.style.display = 'block';
        const qrCanvas = document.getElementById('qr-code');
        new QRious({ element: qrCanvas, value: SEU_PIX_COPIA_COLA, size: 250, foreground: 'black', level: 'H' });
        document.getElementById('payment-link').href = SEU_LINK_PAGAMENTO;
    }

    checkoutButton.addEventListener('click', () => { checkoutModal.style.display = 'block'; });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                if (modal.id === 'confirmation-modal') {
                    showPaymentModal();
                }
            }
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            const modal = event.target;
            modal.style.display = 'none';
            if (modal.id === 'confirmation-modal') {
                showPaymentModal();
            }
        }
    });

    checkoutForm.addEventListener('submit', (event) => { 
        event.preventDefault(); 
        const customerInfo = { 
            name: document.getElementById('customer-name').value, 
            phone: document.getElementById('customer-phone').value, 
            email: document.getElementById('customer-email').value 
        }; 
        generateOrder(customerInfo); 
    });

    // ### INÍCIO DA LÓGICA DO CARRINHO MOBILE ###
    // Abre o carrinho ao clicar no botão flutuante
    cartSection.addEventListener('click', (event) => {
        if (!cartSection.classList.contains('cart-open') && window.innerWidth <= 768) {
            cartSection.classList.add('cart-open');
        }
    });

    // Fecha o carrinho ao clicar no botão 'x'
    closeCartButton.addEventListener('click', (event) => {
        // CORREÇÃO: Impede que o clique no botão de fechar se propague para o cartSection
        event.stopPropagation(); 
        cartSection.classList.remove('cart-open');
    });
    // ### FIM DA LÓGICA DO CARRINHO MOBILE ###

    renderProducts();
    updateCartDisplay();
});
