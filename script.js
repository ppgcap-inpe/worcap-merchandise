document.addEventListener('DOMContentLoaded', () => {
    // Configurações
    const SEU_NUMERO_WHATSAPP = "5511969961123";
    const SEU_LINK_PAGAMENTO = "00020126580014BR.GOV.BCB.PIX0136ad731057-4699-4bc8-b66c-985b94e6a5035204000053039865802BR5925Andreza Cristina Barbieri6009SAO PAULO62140510y7TR3APyjf63040811";
    const SEU_PIX_COPIA_COLA = "00020126580014BR.GOV.BCB.PIX0136ad731057-4699-4bc8-b66c-985b94e6a5035204000053039865802BR5925Andreza Cristina Barbieri6009SAO PAULO62140510y7TR3APyjf63040811";

    // Elementos DOM
    const elements = {
        productsSection: document.getElementById('products-section'),
        cartItemsContainer: document.getElementById('cart-items'),
        cartTotalSpan: document.getElementById('cart-total'),
        checkoutButton: document.getElementById('checkout-button'),
        checkoutModal: document.getElementById('checkout-modal'),
        paymentModal: document.getElementById('payment-modal'),
        confirmationModal: document.getElementById('confirmation-modal'),
        closeButtons: document.querySelectorAll('.close-button'),
        checkoutForm: document.getElementById('checkout-form'),
        cartSection: document.getElementById('cart-section'),
        closeCartButton: document.getElementById('close-cart-btn'),
        productViewerModal: document.getElementById('product-viewer-modal'),
        productViewerImage: document.getElementById('product-viewer-image'),
        searchInput: document.getElementById('search-input'),
        copyPixButton: document.getElementById('copy-pix-key-btn'),
        copyFeedback: document.getElementById('copy-feedback'),
        paymentTotalSpan: document.getElementById('payment-modal-total')
    };

    let cart = [];

    // Função para renderizar produtos
    function renderProducts(productsToRender = productsData) {
        elements.productsSection.innerHTML = productsToRender.length === 0 
            ? '<p class="no-results-message">Nenhum produto encontrado.</p>'
            : createProductGrid(productsToRender);
        
        addEventListenersToProductCards();
    }

    function createProductGrid(products) {
        const productsByCategory = products.reduce((acc, product) => {
            (acc[product.category] = acc[product.category] || []).push(product);
            return acc;
        }, {});

        return Object.entries(productsByCategory).map(([category, items]) => `
            <div class="category-container">
                <h2 class="category-title">${category}</h2>
                <div class="products-grid">
                    ${items.map(product => `
                        <div class="product-card">
                            <img src="${product.photo}" alt="${product.name}">
                            <div class="product-info">
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                ${product.category === 'camiseta' && product.sizes 
                                    ? `<div class="size-selector">${
                                        product.sizes.map(size => 
                                            `<button data-size="${size}">${size}</button>`
                                        ).join('')
                                    }</div>` 
                                    : ''}
                                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                                <button class="add-to-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    function addEventListenersToProductCards() {
        document.querySelectorAll('.product-card').forEach(card => {
            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            const sizeSelector = card.querySelector('.size-selector');
            const productId = parseInt(addToCartBtn.dataset.id);

            if (sizeSelector) { 
                let selectedSize = null;
                const sizeButtons = sizeSelector.querySelectorAll('button');
                addToCartBtn.disabled = true;

                sizeButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        button.classList.add('selected');
                        selectedSize = button.dataset.size;
                        addToCartBtn.disabled = false;
                    });
                });

                addToCartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (selectedSize) {
                        addToCart(productId, selectedSize);
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        addToCartBtn.disabled = true;
                        selectedSize = null;
                    }
                });

            } else { 
                addToCartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(productId, null);
                });
            }

            // Visualizador de imagem
            const productImage = card.querySelector('img');
            productImage.addEventListener('click', () => {
                elements.productViewerImage.src = productImage.src;
                elements.productViewerModal.style.display = 'flex';
            });
        });
    }

    function addToCart(productId, size = null) {
        const cartItemId = size ? `${productId}-${size}` : `${productId}`;
        const existingItem = cart.find(item => item.cartItemId === cartItemId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            const product = productsData.find(p => p.id === productId);
            if (product) {
                cart.push({ 
                    ...product, 
                    quantity: 1, 
                    size: size, 
                    cartItemId: cartItemId 
                });
            }
        }
        updateCartDisplay();
    }

    function updateCartDisplay() {
        if (cart.length === 0) {
            elements.cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            elements.checkoutButton.disabled = true;
        } else {
            elements.cartItemsContainer.innerHTML = '';
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
                elements.cartItemsContainer.appendChild(itemElement);
            });
            elements.checkoutButton.disabled = false;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        elements.cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
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

    async function generateOrder(customerInfo) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const orderDate = new Date().toLocaleDateString('pt-BR');
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Cabeçalho
        doc.setFontSize(18);
        doc.text("Resumo do Pedido", 15, 20);
        doc.setFontSize(12);
        doc.text(`Data: ${orderDate}`, 15, 30);
        doc.text(`Cliente: ${customerInfo.name}`, 15, 40);
        doc.text(`Telefone: ${customerInfo.phone}`, 15, 50);
        doc.text(`Email: ${customerInfo.email}`, 15, 60);
        doc.line(15, 65, 195, 65);

        // Itens
        doc.text("Itens do Pedido:", 15, 75);
        let y = 85;
        cart.forEach(item => {
            if (y > 260) { doc.addPage(); y = 20; }
            const itemName = item.size ? `${item.name} (Tamanho: ${item.size})` : item.name;
            doc.text(`- ${itemName} (x${item.quantity})`, 15, y);
            doc.text(`R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`, 160, y);
            y += 10;
        });

        // Total
        doc.line(15, y, 195, y);
        y += 10;
        doc.setFontSize(14);
        doc.text(`Total: R$ ${total.toFixed(2).replace('.', ',')}`, 140, y);
        y += 15;
        doc.line(15, y, 195, y);
        y += 10;

        // PIX
        doc.setFontSize(16);
        doc.text("Pagamento via PIX", 15, y);
        y += 10;

        // QR Code
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
        doc.text("Ou copie a chave PIX:", 75, y);
        doc.setFontSize(10);
        doc.text(SEU_PIX_COPIA_COLA, 75, y + 10, { maxWidth: 120 });

        // Informações de retirada
        y = 250;
        doc.setFontSize(10);
        doc.text("Retirada disponível a partir de 09/09/2025", 15, y);
        doc.text("durante o WorCAP25.", 15, y + 5);

        doc.save("pedido_worcap.pdf");

        // WhatsApp
        let whatsappMessage = `Olá! Gostaria de confirmar meu pedido:\n\n`;
        cart.forEach(item => {
            const itemName = item.size ? `${item.name} (Tamanho: ${item.size})` : item.name;
            whatsappMessage += `- ${itemName} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
        });
        whatsappMessage += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
        whatsappMessage += `\n\n*Dados do cliente:*\nNome: ${customerInfo.name}\nTelefone: ${customerInfo.phone}\nEmail: ${customerInfo.email}`;
        whatsappMessage += `\n\n(Verifique o PDF anexo com os detalhes do pedido)`;

        const whatsappUrl = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        // Fecha o modal e mostra confirmação
        elements.checkoutModal.style.display = 'none';
        elements.confirmationModal.style.display = 'flex';
    }

    function showPaymentModal() {
        elements.checkoutModal.style.display = 'none';
        elements.paymentModal.style.display = 'flex';

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        elements.paymentTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        

        // Atualiza QR Code
        new QRious({ 
            element: document.getElementById('qr-code'), 
            value: SEU_PIX_COPIA_COLA, 
            size: 200 
        });
    }

    function setupCopyPixButton() {
        if (elements.copyPixButton) {
            elements.copyPixButton.addEventListener('click', () => {
                navigator.clipboard.writeText(SEU_PIX_COPIA_COLA).then(() => {
                    elements.copyFeedback.textContent = 'Chave copiada!';
                    elements.copyFeedback.style.opacity = '1';
                    setTimeout(() => {
                        elements.copyFeedback.style.opacity = '0';
                    }, 2000);
                }).catch(err => {
                    console.error('Falha ao copiar: ', err);
                    elements.copyFeedback.textContent = 'Erro ao copiar';
                    elements.copyFeedback.style.opacity = '1';
                });
            });
        }
    }

    function initEventListeners() {
        // Busca
        elements.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = productsData.filter(p => 
                p.name.toLowerCase().includes(term) || 
                p.category.toLowerCase().includes(term) || 
                p.description.toLowerCase().includes(term)
            );
            renderProducts(filtered);
        });

        // Carrinho
        elements.cartItemsContainer.addEventListener('click', handleCartActions);
        elements.checkoutButton.addEventListener('click', () => {
            elements.checkoutModal.style.display = 'flex';
        });

        // Modais
        elements.closeButtons.forEach(button => {
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

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                if (e.target.id === 'confirmation-modal') {
                    showPaymentModal();
                }
            }
        });

        // Formulário
        elements.checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const customerInfo = {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value
            };
            generateOrder(customerInfo);
        });

        // Carrinho mobile
        elements.cartSection.addEventListener('click', (e) => {
            if (!elements.cartSection.classList.contains('cart-open') && window.innerWidth <= 768) {
                elements.cartSection.classList.add('cart-open');
            }
        });

        elements.closeCartButton.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.cartSection.classList.remove('cart-open');
        });
    }

    function init() {
        renderProducts();
        updateCartDisplay();
        setupCopyPixButton();
        initEventListeners();
    }

    init();
});