document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÕES ---
    const SEU_NUMERO_WHATSAPP = "5511969961123";
    const SEU_PIX_COPIA_COLA = "00020126580014BR.GOV.BCB.PIX0136ad731057-4699-4bc8-b66c-985b94e6a5035204000053039865802BR5925Andreza Cristina Barbieri6009SAO PAULO62140510y7TR3APyjf63040811";
    const COUNTDOWN_TARGET_DATE = new Date('2025-08-12T23:59:59');

    // --- ELEMENTOS DOM ---
    const elements = {
        productsSection: document.getElementById('products-section'),
        cartItemsContainer: document.getElementById('cart-items'),
        cartTotalSpan: document.getElementById('cart-total'),
        checkoutButton: document.getElementById('checkout-button'),
        checkoutModal: document.getElementById('checkout-modal'),
        paymentModal: document.getElementById('payment-modal'),
        confirmationModal: document.getElementById('confirmation-modal'),
        posterSelectionModal: document.getElementById('poster-selection-modal'),
        posterSelectionGrid: document.getElementById('poster-selection-grid'),
        closeButtons: document.querySelectorAll('.close-button'),
        checkoutForm: document.getElementById('checkout-form'),
        cartSection: document.getElementById('cart-section'),
        closeCartButton: document.getElementById('close-cart-btn'),
        productViewerModal: document.getElementById('product-viewer-modal'),
        productViewerImage: document.getElementById('product-viewer-image'),
        searchInput: document.getElementById('search-input'),
        copyPixButton: document.getElementById('copy-pix-key-btn'),
        copyFeedback: document.getElementById('copy-feedback'),
        paymentTotalSpan: document.getElementById('payment-modal-total'),
        daysSpan: document.getElementById('days'),
        hoursSpan: document.getElementById('hours'),
        minutesSpan: document.getElementById('minutes'),
        secondsSpan: document.getElementById('seconds'),
        countdownBanner: document.getElementById('countdown-banner'),
        comboModal: document.getElementById('combo-modal'),
        comboModalTitle: document.getElementById('combo-modal-title'),
        comboModalGrid: document.getElementById('combo-modal-grid'),
        comboStatusSpan: document.getElementById('combo-status'),
        addComboBtn: document.getElementById('add-combo-to-cart-btn'),
        comboSection: document.getElementById('combo-section'),
        comboSelectionsDisplay: document.createElement('div')
    };

    elements.comboSelectionsDisplay.id = 'combo-selections-display';

    let cart = [];
    let comboSelections = [];
    let comboRequirements = {};
    let currentComboType = '';

    function renderProducts(productsToRender = productsData) {
        elements.productsSection.innerHTML = productsToRender.length === 0 
            ? '<p class="no-results-message">Nenhum produto encontrado.</p>'
            : createProductGrid(productsToRender, false);
        addEventListenersToProductCards();
    }

    function createProductGrid(products, isComboModal) {
        const productsByCategory = products.reduce((acc, product) => {
            (acc[product.category] = acc[product.category] || []).push(product);
            return acc;
        }, {});
        const buttonText = isComboModal ? 'Selecionar' : 'Adicionar ao Carrinho';
        return Object.entries(productsByCategory).map(([category, items]) => `
            <div class="category-container">
                <h2 class="category-title">${category}</h2>
                <div class="products-grid">
                    ${items.map(product => {
                        const defaultColor = product.colors ? Object.keys(product.colors)[0] : null;
                        const defaultPhoto = product.colors ? product.colors[defaultColor] : product.photo;
                        const medidasBtn = product.category === 'camiseta' ? `<button class="medidas-btn" data-id="${product.id}" title="Ver tabela de medidas"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;"><rect x="3" y="11" width="18" height="2" rx="1" fill="#FEAE00"/><rect x="7" y="5" width="10" height="2" rx="1" fill="#FEAE00"/><rect x="7" y="17" width="10" height="2" rx="1" fill="#FEAE00"/><circle cx="5" cy="12" r="2" fill="#FEAE00"/><circle cx="19" cy="12" r="2" fill="#FEAE00"/></svg></button>` : '';
                        return `<div class="product-card" data-id="${product.id}" data-category="${product.category}"><img src="${defaultPhoto}" alt="${product.name}" class="product-img"><div class="product-info"><h3>${product.name}</h3><p>${product.description}</p>${product.colors ? `<div class="color-selector">${Object.entries(product.colors).map(([color, img]) => `<button class="color-btn" data-color="${color}" style="background:${color === 'preta' ? '#222' : '#fff'};color:${color === 'preta' ? '#fff' : '#222'};border:2px solid #ccc;">${color.charAt(0).toUpperCase() + color.slice(1)}</button>`).join('')} ${medidasBtn}</div>` : ''}${product.category === 'camiseta' && product.sizes ? `<div class="size-selector">${product.sizes.map(size => `<button data-size="${size}">${size}</button>`).join('')}</div>` : ''}<div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div><button class="add-to-cart-btn" data-id="${product.id}">${buttonText}</button></div></div>`;
                    }).join('')}
                </div>
            </div>`).join('');
    }

    function addEventListenersToProductCards() {
        document.querySelectorAll('#products-section .product-card').forEach(card => {
            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            const sizeSelector = card.querySelector('.size-selector');
            const colorSelector = card.querySelector('.color-selector');
            const medidasBtn = card.querySelector('.medidas-btn');
            const productId = parseInt(card.dataset.id);
            const product = productsData.find(p => p.id === productId);
            let selectedSize = null;
            let selectedColor = product && product.colors ? Object.keys(product.colors)[0] : null;

            if (colorSelector) {
                const colorButtons = colorSelector.querySelectorAll('.color-btn');
                if (colorButtons.length > 0) colorButtons[0].classList.add('selected');
                colorButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        colorButtons.forEach(btn => btn.classList.remove('selected'));
                        button.classList.add('selected');
                        selectedColor = button.dataset.color;
                        const img = card.querySelector('.product-img');
                        if (product && product.colors && product.colors[selectedColor]) {
                            img.src = product.colors[selectedColor];
                        }
                    });
                });
            }

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
            }

            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (sizeSelector && !selectedSize) {
                    alert('Por favor, selecione um tamanho.');
                    return;
                }
                addToCart(productId, selectedSize, selectedColor);
                if (sizeSelector) {
                    card.querySelectorAll('.size-selector button').forEach(b => b.classList.remove('selected'));
                    addToCartBtn.disabled = true;
                    selectedSize = null;
                }
            });

            if (medidasBtn) {
                medidasBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    elements.productViewerImage.src = "assets/produtos/camisetas/tabela_medidas.jpg";
                    elements.productViewerModal.style.display = 'flex';
                });
            }
            const productImage = card.querySelector('img');
            productImage.addEventListener('click', () => {
                elements.productViewerImage.src = productImage.src;
                elements.productViewerModal.style.display = 'flex';
            });
        });
    }

    function addToCart(productId, size = null, color = null, source = null) {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;
        const isFromCombo = source !== null;
        if (!isFromCombo) {
            const existingItem = cart.find(item => item.id === productId && item.size === size && item.color === color && !item.source);
            if (existingItem) {
                existingItem.quantity++;
                updateCartDisplay();
                return;
            }
        }
        const cartItemId = `${productId}-${size || ''}-${color || ''}-${Date.now()}`;
        cart.push({ ...product, quantity: 1, size, color, cartItemId, source });
        updateCartDisplay();
    }
    
    function calculateTotalAndPromotions() {
        let nonTshirtTotal = 0;
        cart.filter(item => item.category !== 'camiseta' && !item.isGift)
            .forEach(item => nonTshirtTotal += item.price * item.quantity);

        const allTshirts = cart.filter(item => item.category === 'camiseta');
        const totalTshirtCount = allTshirts.reduce((acc, item) => acc + item.quantity, 0);

        const comboTier = totalTshirtCount >= 5 ? 5 : (totalTshirtCount >= 3 ? 3 : 0);

        let finalTshirtTotal = 0;
        allTshirts.forEach(shirt => {
            let price = shirt.price;
            if (comboTier === 5) {
                if (shirt.price === 75.00) price = 68.00;
                if (shirt.price === 65.00) price = 58.00;
            } else if (comboTier === 3) {
                if (shirt.price === 75.00) price = 70.00;
                if (shirt.price === 65.00) price = 60.00;
            }
            finalTshirtTotal += price * shirt.quantity;
        });
        
        const finalTotal = nonTshirtTotal + finalTshirtTotal;

        const cupCount = cart.filter(p => p.category === 'copo').reduce((acc, i) => acc + i.quantity, 0);
        const mugCount = cart.filter(p => p.category === 'caneca').reduce((acc, i) => acc + i.quantity, 0);
        const isEligibleForGift = (totalTshirtCount >= 1 && cupCount >= 1 && mugCount >= 1) || finalTotal >= 150;

        return { finalTotal, isEligibleForGift, comboTier };
    }

    function updateCartDisplay() {
        const { finalTotal, isEligibleForGift, comboTier } = calculateTotalAndPromotions();
        const giftInCart = cart.find(item => item.isGift);
        
        if (isEligibleForGift && !giftInCart) cart.push({ name: 'Pôster de Brinde', description: 'Escolha seu pôster na finalização.', price: 0, isGift: true, quantity: 1, category: 'brinde', cartItemId: 'gift-poster-placeholder' });
        else if (!isEligibleForGift && giftInCart) cart = cart.filter(item => !item.isGift);
        
        if (cart.length === 0) {
            elements.cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            elements.checkoutButton.disabled = true;
        } else {
            elements.cartItemsContainer.innerHTML = '';
            cart.forEach(item => {
                let displayName = item.name;
                if (item.source === 'kit') displayName += ' (Kit)';
                else if (item.source) displayName += ' (Combo)';
                if (item.size) displayName += ` (Tamanho: ${item.size})`;
                if (item.color) displayName += ` (Cor: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)})`;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                let priceDisplay = '';
                
                if (item.isGift) {
                    priceDisplay = `<span class="item-price" style="color: green; font-weight: bold;">Grátis</span>`;
                } else if (item.category === 'camiseta' && comboTier > 0) {
                    let effectivePrice = item.price;
                    if (comboTier === 5) {
                        if (item.price === 75.00) effectivePrice = 68.00;
                        if (item.price === 65.00) effectivePrice = 58.00;
                    } else if (comboTier === 3) {
                        if (item.price === 75.00) effectivePrice = 70.00;
                        if (item.price === 65.00) effectivePrice = 60.00;
                    }

                    if (effectivePrice < item.price) {
                        priceDisplay = `<div class="item-price-combo"><span class="price-old">De: R$ ${item.price.toFixed(2).replace('.', ',')}</span><span class="price-new">Por: R$ ${effectivePrice.toFixed(2).replace('.', ',')}</span></div>`;
                    } else {
                        priceDisplay = `<span class="item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>`;
                    }
                } else {
                    priceDisplay = `<span class="item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>`;
                }

                if (item.isGift) itemElement.innerHTML = `<div class="cart-item-info"><span><b>${displayName}</b></span></div><div class="cart-item-controls">${priceDisplay}</div>`;
                else itemElement.innerHTML = `<div class="cart-item-info"><span>${displayName}</span></div><div class="cart-item-controls">${priceDisplay}<button class="quantity-btn minus-btn" data-cart-item-id="${item.cartItemId}">-</button><span>${item.quantity}</span><button class="quantity-btn plus-btn" data-cart-item-id="${item.cartItemId}">+</button></div>`;
                elements.cartItemsContainer.appendChild(itemElement);
            });
            elements.checkoutButton.disabled = false;
        }
        elements.cartTotalSpan.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
    }

    function handleCartActions(event) {
        const target = event.target;
        const cartItemId = target.dataset.cartItemId;
        if (!cartItemId || cartItemId.startsWith('gift-')) return;
        const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
        if (itemIndex === -1) return;
        if (target.classList.contains('plus-btn')) cart[itemIndex].quantity++;
        else if (target.classList.contains('minus-btn')) {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity === 0) cart.splice(itemIndex, 1);
        }
        updateCartDisplay();
    }
    
    function openPosterSelectionModal() {
        elements.posterSelectionGrid.innerHTML = createProductGrid(productsData.filter(p => p.category === 'poster'), true);
        elements.posterSelectionModal.style.display = 'flex';
        addPosterSelectionListeners();
    }

    function addPosterSelectionListeners() {
        document.querySelectorAll('#poster-selection-grid .add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedPosterId = parseInt(e.target.dataset.id);
                const selectedPosterData = productsData.find(p => p.id === selectedPosterId);
                const giftPlaceholderIndex = cart.findIndex(item => item.cartItemId === 'gift-poster-placeholder');
                if (giftPlaceholderIndex !== -1 && selectedPosterData) cart[giftPlaceholderIndex] = { ...selectedPosterData, price: 0, isGift: true, quantity: 1, cartItemId: `gift-${selectedPosterData.id}` };
                elements.posterSelectionModal.style.display = 'none';
                updateCartDisplay();
                elements.checkoutModal.style.display = 'flex';
            });
        });
    }

    function openComboModal(type) {
        comboSelections = [];
        currentComboType = type;
        let productsToShow = [], title = '';
        if (type === 'combo3') {
            title = 'Monte seu Combo 3 Amigos';
            productsToShow = productsData.filter(p => p.category === 'camiseta');
            comboRequirements = { total: 3, camiseta: 3 };
        } else if (type === 'combo5') {
            title = 'Monte seu Combo 5 Amigos';
            productsToShow = productsData.filter(p => p.category === 'camiseta');
            comboRequirements = { total: 5, camiseta: 5 };
        } else if (type === 'kit') {
            title = 'Monte seu Kit Fan do WorCAP';
            productsToShow = productsData.filter(p => ['camiseta', 'caneca', 'copo'].includes(p.category));
            comboRequirements = { total: 3, camiseta: 1, caneca: 1, copo: 1 };
        }
        elements.comboModalTitle.textContent = title;
        elements.comboModalGrid.innerHTML = createProductGrid(productsToShow, true);
        const modalContent = elements.comboModal.querySelector('.modal-content');
        modalContent.insertBefore(elements.comboSelectionsDisplay, elements.comboModalGrid.nextSibling);
        updateComboSelectionsDisplay();
        updateComboStatus();
        addListenersToComboModalCards();
        elements.comboModal.style.display = 'flex';
    }

    function addListenersToComboModalCards() {
        elements.comboModalGrid.querySelectorAll('.product-card').forEach(card => {
            const productId = parseInt(card.dataset.id);
            const productData = productsData.find(p => p.id === productId);
            const selectButton = card.querySelector('.add-to-cart-btn');
            const sizeSelector = card.querySelector('.size-selector');
            const colorSelector = card.querySelector('.color-selector');
            const productImage = card.querySelector('.product-img');
            let selectedSize = null;
            let selectedColor = productData.colors ? Object.keys(productData.colors)[0] : null;
            if (colorSelector) {
                const colorButtons = colorSelector.querySelectorAll('.color-btn');
                if (colorButtons.length > 0) colorButtons[0].classList.add('selected');
                colorButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        colorButtons.forEach(btn => btn.classList.remove('selected'));
                        button.classList.add('selected');
                        selectedColor = button.dataset.color;
                        if (productData.colors && productData.colors[selectedColor]) {
                            productImage.src = productData.colors[selectedColor];
                        }
                    });
                });
            }
            if (sizeSelector) {
                selectButton.disabled = true;
                const sizeButtons = sizeSelector.querySelectorAll('button');
                sizeButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        button.classList.add('selected');
                        selectedSize = button.dataset.size;
                        selectButton.disabled = false;
                    });
                });
            }
            
            // --- CORREÇÃO 1: A chamada da função agora passa os dados corretos ---
            selectButton.addEventListener('click', (e) => {
                e.stopPropagation();
                handleComboSelection(productData, selectedSize, selectedColor);
            });
        });
    }

    function handleComboSelection(productData, size, color) {
        if (!productData) return;
        const currentCount = comboSelections.filter(sel => sel.category === productData.category).length;
        const requirementCount = comboRequirements[productData.category];
        if (currentCount < requirementCount) {
            comboSelections.push({ ...productData, size, color, uniqueId: Date.now() + Math.random() });
            updateComboSelectionsDisplay();
            updateComboStatus();
        } else {
            alert(`Você já selecionou o número máximo de ${productData.category}s para este pacote.`);
        }
    }

    function updateComboSelectionsDisplay() {
        elements.comboSelectionsDisplay.innerHTML = '';
        if (comboSelections.length > 0) {
            const list = document.createElement('div');
            comboSelections.forEach(item => {
                let displayName = item.name;
                if (item.size) displayName += ` (${item.size}, ${item.color})`;
                const itemElement = document.createElement('div');
                itemElement.className = 'combo-selection-item';
                itemElement.innerHTML = `<span>${displayName}</span><button class="remove-combo-item-btn" data-unique-id="${item.uniqueId}">&times;</button>`;
                list.appendChild(itemElement);
            });
            elements.comboSelectionsDisplay.appendChild(list);
            list.querySelectorAll('.remove-combo-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const uniqueIdToRemove = parseFloat(e.target.dataset.uniqueId);
                    comboSelections = comboSelections.filter(sel => sel.uniqueId !== uniqueIdToRemove);
                    updateComboSelectionsDisplay();
                    updateComboStatus();
                });
            });
        }
    }

    function updateComboStatus() {
        elements.comboStatusSpan.textContent = `${comboSelections.length}/${comboRequirements.total} selecionados`;
        elements.addComboBtn.disabled = comboSelections.length !== comboRequirements.total;
    }

    // --- CORREÇÃO: Função de gerar pedido foi completada e corrigida ---
    function generateOrder(customerInfo, openWhatsApp = false) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const orderDate = new Date().toLocaleDateString('pt-BR');
        const { finalTotal, comboTier } = calculateTotalAndPromotions();
        
        // Cabeçalho do PDF
        doc.setFontSize(18);
        doc.text("Resumo do Pedido", 15, 20);
        doc.setFontSize(12);
        doc.text(`Data: ${orderDate}`, 15, 30);
        doc.text(`Cliente: ${customerInfo.name}`, 15, 40);
        doc.text(`Telefone: ${customerInfo.phone}`, 15, 50);
        doc.text(`Email: ${customerInfo.email}`, 15, 60);
        doc.line(15, 65, 195, 65);
        doc.text("Itens do Pedido:", 15, 75);
        
        let y = 85; // Posição Y inicial da lista de itens
        cart.forEach(item => {
            if (y > 260) { doc.addPage(); y = 20; }
            let itemName = item.name;
            if (item.source === 'kit') itemName += ' (Kit)';
            else if (item.source) itemName += ' (Combo)';
            if (item.size) itemName += ` (${item.size}, ${item.color})`;
            
            let priceText = '';
            if(item.isGift) priceText = "Grátis";
            else if (item.category === 'camiseta' && comboTier > 0) {
                let effectivePrice = item.price;
                if (comboTier === 5) {
                    if (item.price === 75.00) effectivePrice = 68.00;
                    if (item.price === 65.00) effectivePrice = 58.00;
                } else if (comboTier === 3) {
                    if (item.price === 75.00) effectivePrice = 70.00;
                    if (item.price === 65.00) effectivePrice = 60.00;
                }
                if(effectivePrice < item.price) priceText = `Por: R$ ${effectivePrice.toFixed(2).replace('.', ',')} (De: R$ ${item.price.toFixed(2).replace('.', ',')})`;
                else priceText = `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;
            } else {
                priceText = `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;
            }

            doc.text(`- ${itemName} x${item.quantity}`, 15, y);
            doc.text(priceText, 195, y, { align: 'right' });
            y += 10;
        });
        doc.line(15, y, 195, y); y += 10;
        doc.setFontSize(14);
        doc.text(`Total: R$ ${finalTotal.toFixed(2).replace('.', ',')}`, 195, y, { align: 'right' });
        y += 15;
        doc.line(15, y, 195, y); y += 10;
        doc.setFontSize(16); doc.text("Pagamento via PIX", 15, y); y += 10;
        const qrCanvas = document.createElement('canvas');
        new QRious({ element: qrCanvas, value: SEU_PIX_COPIA_COLA, size: 200 });
        const qrImage = qrCanvas.toDataURL('image/png');
        doc.setFontSize(12); doc.text("Escaneie o QR Code:", 15, y);
        doc.addImage(qrImage, 'PNG', 15, y + 5, 50, 50);
        doc.text("Ou copie a chave PIX:", 75, y);
        doc.setFontSize(10); doc.text(SEU_PIX_COPIA_COLA, 75, y + 10, { maxWidth: 120 });
        y = 250;
        doc.setFontSize(10);
        doc.text("Retirada disponível a partir de 09/09/2025", 15, y);
        doc.text("durante o WorCAP25.", 15, y + 5);
        doc.save(`pedido_worcap_${customerInfo.name.replace(/\s/g, '_')}.pdf`);

        if (openWhatsApp) {
            // WhatsApp
            let whatsappMessage = `Olá! Gostaria de confirmar meu pedido:\n\n`;
            cart.forEach(item => {
                let itemName = item.name;
                if (item.size) itemName += ` (Tamanho: ${item.size})`;
                if (item.color) itemName += ` (Cor: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)})`;
                const priceString = item.isGift ? "Grátis" : `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;
                whatsappMessage += `- ${itemName} (x${item.quantity}) - ${priceString}\n`;
            });

            whatsappMessage += `\n*Total: R$ ${finalTotal.toFixed(2).replace('.', ',')}*`;
            whatsappMessage += `\n\n*Dados do cliente:*\nNome: ${customerInfo.name}\nTelefone: ${customerInfo.phone}\nEmail: ${customerInfo.email}`;
            whatsappMessage += `\n\n(Verifique o PDF anexo com os detalhes do pedido)`;

            const whatsappUrl = `https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    function showPaymentModal(customerInfo) {
        elements.checkoutModal.style.display = 'none';
        elements.paymentModal.style.display = 'flex';
        const { finalTotal } = calculateTotalAndPromotions();
        elements.paymentTotalSpan.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
        new QRious({ element: document.getElementById('qr-code'), value: SEU_PIX_COPIA_COLA, size: 200 });
        elements.paymentModal.dataset.customerInfo = JSON.stringify(customerInfo);
    }
    
    function startCountdown() {
        if (!elements.countdownBanner) return;
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = COUNTDOWN_TARGET_DATE - now;
            if (distance < 0) {
                clearInterval(interval);
                elements.countdownBanner.innerHTML = "<p style='font-size: 1.5rem; font-weight: bold;'>A LOJA ESTÁ FECHADA!</p>";
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            elements.daysSpan.textContent = String(days).padStart(2, '0');
            elements.hoursSpan.textContent = String(hours).padStart(2, '0');
            elements.minutesSpan.textContent = String(minutes).padStart(2, '0');
            elements.secondsSpan.textContent = String(seconds).padStart(2, '0');
        }, 1000);
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

    function setupOpenWhatsappButton() {
        const btn = document.getElementById('open-whatsapp-btn');
        if (btn) btn.addEventListener('click', () => {
            const customerInfo = JSON.parse(elements.paymentModal.dataset.customerInfo || '{}');
            generateOrder(customerInfo, true);
        });
    }

    function setupDownloadPdfButton() {
        const btn = document.getElementById('download-pdf-btn');
        if (btn) btn.addEventListener('click', () => {
            const customerInfo = JSON.parse(elements.paymentModal.dataset.customerInfo || '{}');
            generateOrder(customerInfo, false);
        });
    }

    function initEventListeners() {
        elements.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = productsData.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
            renderProducts(filtered);
        });
        elements.cartItemsContainer.addEventListener('click', handleCartActions);
        elements.comboSection.addEventListener('click', (e) => {
            const card = e.target.closest('.combo-card');
            if (card && card.dataset.comboType) openComboModal(card.dataset.comboType);
        });
        elements.addComboBtn.addEventListener('click', () => {
            comboSelections.forEach(item => {
                addToCart(item.id, item.size, item.color, currentComboType);
            });
            elements.comboModal.style.display = 'none';
        });
        elements.checkoutButton.addEventListener('click', () => {
            const temBrindeParaEscolher = cart.some(item => item.cartItemId === 'gift-poster-placeholder');
            if (temBrindeParaEscolher) openPosterSelectionModal();
            else elements.checkoutModal.style.display = 'flex';
        });
        elements.checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const customerInfo = {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value
            };
            showPaymentModal(customerInfo);
        });
        
        // --- CORREÇÃO 3: Lógica de fechamento dos modais foi corrigida e reativada ---
        elements.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    if (modal.id === 'payment-modal') {
                        elements.confirmationModal.style.display = 'flex';
                    }
                }
            });
        });
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                const modal = e.target;
                modal.style.display = 'none';
                if (modal.id === 'payment-modal') {
                    elements.confirmationModal.style.display = 'flex';
                }
            }
        });
        
        elements.cartSection.addEventListener('click', (e) => {
            if (!elements.cartSection.classList.contains('cart-open') && window.innerWidth <= 768) {
                elements.cartSection.classList.add('cart-open');
            }
        });
        elements.closeCartButton.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.cartSection.classList.remove('cart-open');
        });
        const filterContainer = document.getElementById('filter-container');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    const category = e.target.dataset.category;
                    renderProducts(category === 'todos' ? productsData : productsData.filter(p => p.category.toLowerCase() === category));
                }
            });
        }
    }

    function init() {
        renderProducts();
        updateCartDisplay();
        startCountdown();
        setupCopyPixButton();
        setupOpenWhatsappButton();
        setupDownloadPdfButton();
        initEventListeners();
    }

    init();
});