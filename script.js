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
                    ${items.map(product => {
                        const defaultColor = product.colors ? Object.keys(product.colors)[0] : null;
                        const defaultPhoto = product.colors ? product.colors[defaultColor] : product.photo;
                        // Botão de medidas apenas para camisetas
                        const medidasBtn = product.category === 'camiseta'
                            ? `<button class="medidas-btn" data-id="${product.id}" title="Ver tabela de medidas">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;">
                                    <rect x="3" y="11" width="18" height="2" rx="1" fill="#FEAE00"/>
                                    <rect x="7" y="5" width="10" height="2" rx="1" fill="#FEAE00"/>
                                    <rect x="7" y="17" width="10" height="2" rx="1" fill="#FEAE00"/>
                                    <circle cx="5" cy="12" r="2" fill="#FEAE00"/>
                                    <circle cx="19" cy="12" r="2" fill="#FEAE00"/>
                                </svg>
                            </button>`
                            : '';
                        return `
                            <div class="product-card" data-id="${product.id}">
                                <img src="${defaultPhoto}" alt="${product.name}" class="product-img">
                                <div class="product-info">
                                    <h3>${product.name}</h3>
                                    <p>${product.description}</p>
                                    ${product.colors ? `
                                        <div class="color-selector">
                                            ${Object.entries(product.colors).map(([color, img]) => `
                                                <button class="color-btn" data-color="${color}" style="background:${color === 'preta' ? '#222' : '#fff'};color:${color === 'preta' ? '#fff' : '#222'};border:2px solid #ccc;">${color.charAt(0).toUpperCase() + color.slice(1)}</button>
                                            `).join('')}
                                            ${medidasBtn}
                                        </div>
                                    ` : ''}
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
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    function addEventListenersToProductCards() {
        document.querySelectorAll('.product-card').forEach(card => {
            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            const sizeSelector = card.querySelector('.size-selector');
            const colorSelector = card.querySelector('.color-selector');
            const medidasBtn = card.querySelector('.medidas-btn');
            const productId = parseInt(addToCartBtn.dataset.id);
            let selectedSize = null;
            let selectedColor = null;

            // Cor
            if (colorSelector) {
                const colorButtons = colorSelector.querySelectorAll('.color-btn');
                selectedColor = colorButtons[0].dataset.color;
                colorButtons[0].classList.add('selected');
                const product = productsData.find(p => p.id === productId);

                colorButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        colorButtons.forEach(btn => btn.classList.remove('selected'));
                        button.classList.add('selected');
                        selectedColor = button.dataset.color;
                        // Troca imagem
                        const img = card.querySelector('.product-img');
                        img.src = product.colors[selectedColor];
                    });
                });
            }

            // Tamanho
            if (sizeSelector) { 
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
                        addToCart(productId, selectedSize, selectedColor);
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        addToCartBtn.disabled = true;
                        selectedSize = null;
                    }
                });

            } else { 
                addToCartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(productId, null, selectedColor);
                });
            }

            // Medidas
            if (medidasBtn) {
                medidasBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Exibe imagem de medidas no modal de visualização
                    elements.productViewerImage.src = "assets/produtos/camisetas/tabela_medidas.jpg";
                    elements.productViewerModal.style.display = 'flex';
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

    function addToCart(productId, size = null, color = null) {
        const cartItemId = size ? `${productId}-${size}-${color || ''}` : `${productId}-${color || ''}`;
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
                    color: color, 
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
                let displayName = item.name;
                if (item.size) displayName += ` (Tamanho: ${item.size})`;
                if (item.color) displayName += ` (Cor: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)})`;

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
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
            let itemName = item.name;
            if (item.size) itemName += ` (Tamanho: ${item.size})`;
            if (item.color) itemName += ` (Cor: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)})`;
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
            let itemName = item.name;
            if (item.size) itemName += ` (Tamanho: ${item.size})`;
            if (item.color) itemName += ` (Cor: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)})`;
            whatsappMessage += `- ${itemName} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
        });

        whatsappMessage += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
        whatsappMessage += `\n\n*Dados do cliente:*\nNome: ${customerInfo.name}\nTelefone: ${customerInfo.phone}\nEmail: ${customerInfo.email}`;
        whatsappMessage += `\n\n(Verifique o PDF anexo com os detalhes do pedido)`;

        const whatsappUrl = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        // Fecha o modal e mostra confirmação
        //elements.checkoutModal.style.display = 'none';
        //elements.confirmationModal.style.display = 'flex';
    }

    function showPaymentModal(customerInfo) {
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

        // Salva info para botão WhatsApp
        elements.paymentModal.dataset.customerInfo = JSON.stringify(customerInfo);
        // WhatsApp: abre imediatamente para evitar bloqueio de popup
        //generateOrder(customerInfo);
        // Após 7 segundos, abre WhatsApp e baixa PDF
        //setTimeout(() => {
        //    generateOrder(customerInfo);
        //}, 7000);
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

    function setupOpenWhatsappButton() {
        const btn = document.getElementById('open-whatsapp-btn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const customerInfo = JSON.parse(elements.paymentModal.dataset.customerInfo || '{}');
            let whatsappMessage = `Olá! Gostaria de confirmar meu pedido:\n\n`;
            cart.forEach(item => {
                let itemName = item.name;
                if (item.size) itemName += ` (Tamanho: ${item.size})`;
                if (item.color) itemName += ` (Cor: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)})`;
                whatsappMessage += `- ${itemName} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
            });
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            whatsappMessage += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
            whatsappMessage += `\n\n*Dados do cliente:*\nNome: ${customerInfo.name}\nTelefone: ${customerInfo.phone}\nEmail: ${customerInfo.email}`;
            whatsappMessage += `\n\n(Verifique o PDF anexo com os detalhes do pedido)`;

            const whatsappUrl = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        });
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

        // Formulário
        elements.checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const customerInfo = {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value
            };
            showPaymentModal(customerInfo);
        });

        // Modais
        elements.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    // Se fechar o modal de pagamento, abre o de confirmação
                    if (modal.id === 'payment-modal') {
                        elements.confirmationModal.style.display = 'flex';
                    }
                }
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                if (e.target.id === 'payment-modal') {
                    elements.confirmationModal.style.display = 'flex';
                }
            }
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

    function setupDownloadPdfButton() {
        const btn = document.getElementById('download-pdf-btn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const customerInfo = JSON.parse(elements.paymentModal.dataset.customerInfo || '{}');
            generateOrder(customerInfo);
        });
    }

    function setupFilterButtons() {
        const filterContainer = document.getElementById('filter-container');
        if (!filterContainer) return;
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                if (category === 'todos') {
                    renderProducts(productsData);
                } else {
                    const filtered = productsData.filter(p => p.category.toLowerCase() === category);
                    renderProducts(filtered);
                }
            }
        });
    }

    function init() {
        renderProducts();
        updateCartDisplay();
        setupCopyPixButton();
        setupOpenWhatsappButton();
        setupDownloadPdfButton();
        setupFilterButtons();
        initEventListeners();
    }

    init();
});