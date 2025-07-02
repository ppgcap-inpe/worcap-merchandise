document.addEventListener('DOMContentLoaded', () => {
    // Configurações
    const SEU_NUMERO_WHATSAPP = "5511969961123";
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
        posterSelectionModal: document.getElementById('poster-selection-modal'), // NOVO
        posterSelectionGrid: document.getElementById('poster-selection-grid'), // NOVO
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
        if (!elements.cartItemsContainer) return;

        // --- LÓGICA DE PROMOÇÃO ---
        const camisetasNoCarrinho = cart.filter(item => item.category === 'camiseta' && !item.isGift);
        const quantidadeDeCamisetas = camisetasNoCarrinho.reduce((acc, item) => acc + item.quantity, 0);
        const isPromoCamisetaActive = quantidadeDeCamisetas >= 2;

        const temCopoOuCaneca = cart.some(item => (item.category === 'copo' || item.category === 'caneca') && !item.isGift);
        const isPromoPosterActive = camisetasNoCarrinho.length > 0 && temCopoOuCaneca;
        
        const temPosterDeBrinde = cart.some(item => item.isGift);

        if (isPromoPosterActive && !temPosterDeBrinde) {
            cart.push({
                id: null,
                name: "Pôster de Brinde",
                price: 0,
                quantity: 1,
                category: 'poster',
                isGift: true,
                cartItemId: 'poster-brinde-' + Date.now()
            });
        }
        
        if (!isPromoPosterActive && temPosterDeBrinde) {
            cart = cart.filter(item => !item.isGift);
        }

        // --- FIM DA LÓGICA DE PROMOÇÃO ---

        if (cart.length === 0) {
            elements.cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            elements.checkoutButton.disabled = true;
            elements.cartTotalSpan.textContent = `R$ 0,00`;
            return;
        }

        elements.cartItemsContainer.innerHTML = '';
        let finalTotal = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            let itemPrice = item.price;
            let originalPriceHTML = '';
            let displayName = item.size ? `${item.name} (Tamanho: ${item.size})` : item.name;

            if (item.isGift) {
                itemPrice = 0;
                displayName = `🎉 ${displayName} (Brinde)`;
            } else if (item.category === 'camiseta' && isPromoCamisetaActive) {
                itemPrice = 70.00;
                originalPriceHTML = `<span style="text-decoration: line-through; color: #999; margin-left: 5px;">R$ 75,00</span>`;
            }
            
            finalTotal += itemPrice * item.quantity;

            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <span>${displayName}</span>
                    <span class="item-price">
                        R$ ${itemPrice.toFixed(2).replace('.', ',')}
                        ${originalPriceHTML}
                    </span>
                </div>
                <div class="cart-item-controls">
                    ${!item.isGift ? `
                    <button class="quantity-btn minus-btn" data-cart-item-id="${item.cartItemId}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus-btn" data-cart-item-id="${item.cartItemId}">+</button>
                    ` : `<span>1</span>`}
                </div>
            `;
            elements.cartItemsContainer.appendChild(itemElement);
        });
        
        elements.cartTotalSpan.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
        elements.checkoutButton.disabled = cart.length === 0;
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

    // NOVA FUNÇÃO para abrir e popular o modal de seleção de pôsteres
    function openPosterSelectionModal() {
        elements.posterSelectionGrid.innerHTML = ''; // Limpa a grade
        const posters = productsData.filter(p => p.category === 'poster');

        posters.forEach(poster => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${poster.photo}" alt="${poster.name}">
                <div class="product-info">
                    <h3>${poster.name}</h3>
                    <button class="add-to-cart-btn" data-id="${poster.id}">Selecionar</button>
                </div>
            `;
            elements.posterSelectionGrid.appendChild(card);
        });

        elements.posterSelectionModal.style.display = 'flex';
        addPosterSelectionListeners();
    }
    
    // NOVA FUNÇÃO para adicionar eventos aos botões do modal de seleção
    function addPosterSelectionListeners() {
        document.querySelectorAll('#poster-selection-grid .add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedPosterId = parseInt(e.target.dataset.id);
                const selectedPosterData = productsData.find(p => p.id === selectedPosterId);
                const giftItemInCart = cart.find(item => item.isGift);

                if (giftItemInCart && selectedPosterData) {
                    // Atualiza o item de brinde no carrinho com o poster escolhido
                    Object.assign(giftItemInCart, {
                        ...selectedPosterData,
                        price: 0,
                        isGift: true,
                        cartItemId: giftItemInCart.cartItemId,
                        quantity: 1
                    });
                }
                
                elements.posterSelectionModal.style.display = 'none';
                updateCartDisplay();
                // Continua o fluxo para o checkout normal
                elements.checkoutModal.style.display = 'flex';
            });
        });
    }

    async function generateOrder(customerInfo) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const orderDate = new Date().toLocaleDateString('pt-BR');
        
        let finalTotal = 0;
        const quantidadeDeCamisetas = cart.filter(item => item.category === 'camiseta' && !item.isGift).reduce((acc, item) => acc + item.quantity, 0);
        const isPromoCamisetaActive = quantidadeDeCamisetas >= 2;

        doc.setFontSize(18);
        doc.text("Resumo do Pedido", 15, 20);
        doc.setFontSize(12);
        doc.text(`Data: ${orderDate}`, 15, 30);
        doc.text(`Cliente: ${customerInfo.name}`, 15, 40);
        doc.text(`Telefone: ${customerInfo.phone}`, 15, 50);
        doc.text(`Email: ${customerInfo.email}`, 15, 60);
        doc.line(15, 65, 195, 65);

        doc.text("Itens do Pedido:", 15, 75);
        let y = 85;
        cart.forEach(item => {
            if (y > 260) { doc.addPage(); y = 20; }
            let itemPrice = item.price;
            if (item.isGift) {
                itemPrice = 0;
            } else if (item.category === 'camiseta' && isPromoCamisetaActive) {
                itemPrice = 70.00;
            }
            const itemTotal = itemPrice * item.quantity;
            finalTotal += itemTotal;
            let itemName = item.size ? `${item.name} (Tamanho: ${item.size})` : item.name;
            if(item.isGift) itemName = `${itemName} (BRINDE)`;
            doc.text(`- ${itemName} (x${item.quantity})`, 15, y);
            doc.text(`R$ ${itemTotal.toFixed(2).replace('.', ',')}`, 160, y);
            y += 10;
        });

        doc.line(15, y, 195, y);
        y += 10;
        doc.setFontSize(14);
        doc.text(`Total: R$ ${finalTotal.toFixed(2).replace('.', ',')}`, 140, y);
        y += 15;
        doc.line(15, y, 195, y);
        y += 10;
        
        doc.save("pedido_worcap.pdf");
        
        let whatsappMessage = `Olá! Gostaria de confirmar meu pedido:\n\n`;
        cart.forEach(item => {
            let itemName = item.size ? `${item.name} (Tamanho: ${item.size})` : item.name;
            if(item.isGift) itemName = `${itemName} (BRINDE)`;
            whatsappMessage += `- ${itemName} (x${item.quantity})\n`;
        });
        whatsappMessage += `\n*Total: R$ ${finalTotal.toFixed(2).replace('.', ',')}*`;
        whatsappMessage += `\n\n*Dados do cliente:*\nNome: ${customerInfo.name}\nTelefone: ${customerInfo.phone}\nEmail: ${customerInfo.email}`;
        whatsappMessage += `\n\n(Verifique o PDF anexo com os detalhes do pedido)`;
        const whatsappUrl = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        elements.paymentModal.style.display = 'none';
        elements.confirmationModal.style.display = 'flex';
    }

    function showPaymentModal() {
        elements.checkoutModal.style.display = 'none';
        elements.paymentModal.style.display = 'flex';

        let finalTotal = 0;
        const quantidadeDeCamisetas = cart.filter(item => item.category === 'camiseta' && !item.isGift).reduce((acc, item) => acc + item.quantity, 0);
        const isPromoCamisetaActive = quantidadeDeCamisetas >= 2;
        
        cart.forEach(item => {
            let itemPrice = item.price;
            if (item.isGift) {
                itemPrice = 0;
            } else if (item.category === 'camiseta' && isPromoCamisetaActive) {
                itemPrice = 70.00;
            }
            finalTotal += itemPrice * item.quantity;
        });

        elements.paymentTotalSpan.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
        new QRious({ element: document.getElementById('qr-code'), value: SEU_PIX_COPIA_COLA, size: 200 });
    }

    function setupCopyPixButton() {
        if (elements.copyPixButton) {
            elements.copyPixButton.addEventListener('click', () => {
                navigator.clipboard.writeText(SEU_PIX_COPIA_COLA).then(() => {
                    elements.copyFeedback.textContent = 'Chave copiada!';
                    elements.copyFeedback.style.opacity = '1';
                    setTimeout(() => { elements.copyFeedback.style.opacity = '0'; }, 2000);
                });
            });
        }
    }

    function initEventListeners() {
        // Listener para o campo de busca
        elements.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = productsData.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)
            );
            renderProducts(filtered);
        });

        // Listener para ações nos itens do carrinho (aumentar/diminuir quantidade)
        elements.cartItemsContainer.addEventListener('click', handleCartActions);

        // Listener para o botão "Finalizar Pedido"
        elements.checkoutButton.addEventListener('click', () => {
            const temBrindeParaEscolher = cart.some(item => item.isGift && item.id === null);

            if (temBrindeParaEscolher) {
                // Se tem brinde para escolher, abre o modal de seleção de pôsteres
                openPosterSelectionModal();
            } else {
                // Senão, segue o fluxo normal para o modal de informações do cliente
                elements.checkoutModal.style.display = 'flex';
            }
        });

        // Listeners para todos os botões de fechar dos modais
        elements.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Listener para fechar modais clicando fora do conteúdo
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Listener para o formulário de informações do cliente
        elements.checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showPaymentModal();
        });

        // Listener para o botão de fechar no modal de pagamento, que finaliza o pedido
        const finalPaymentButton = elements.paymentModal.querySelector('.close-button');
        finalPaymentButton.addEventListener('click', () => {
            const customerInfo = {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value
            };
            generateOrder(customerInfo);
            cart = [];
            updateCartDisplay();
        });

        // --- LÓGICA PARA OS BOTÕES FLUTUANTES MOBILE ---

        // Listener para abrir o carrinho no modo mobile
        elements.cartSection.addEventListener('click', (e) => {
            if (!elements.cartSection.classList.contains('cart-open') && window.innerWidth <= 768) {
                if (e.target.closest('.cart-item-controls')) return;
                elements.cartSection.classList.add('cart-open');
            }
        });
        
        // Listener para abrir o card de promoções no modo mobile
        const promoCard = document.getElementById('promo-card');
        promoCard.addEventListener('click', () => {
            if (!promoCard.classList.contains('promo-open') && window.innerWidth <= 768) {
                promoCard.classList.add('promo-open');
            }
        });

        // Listener para o botão de fechar do carrinho no modo mobile
        elements.closeCartButton.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.cartSection.classList.remove('cart-open');
        });

        // Listener para o botão de fechar do card de promoções no modo mobile
        const closePromoButton = document.getElementById('close-promo-btn');
        closePromoButton.addEventListener('click', (e) => {
            e.stopPropagation();
            promoCard.classList.remove('promo-open');
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