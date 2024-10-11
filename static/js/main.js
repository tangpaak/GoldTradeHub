try {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded event fired');

        // Mobile menu functionality
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Currency converter
        const convertBtn = document.getElementById('convert-btn');
        if (convertBtn) {
            console.log('Convert button found');
            convertBtn.addEventListener('click', function() {
                console.log('Convert button clicked');
                const amountInput = document.getElementById('amount');
                const fromCurrency = document.getElementById('from-currency');
                const toCurrency = document.getElementById('to-currency');
                const resultElement = document.getElementById('conversion-result');

                if (!amountInput || !fromCurrency || !toCurrency || !resultElement) {
                    console.error('One or more elements for currency conversion not found');
                    return;
                }

                const amount = parseFloat(amountInput.value);
                const from = fromCurrency.value;
                const to = toCurrency.value;

                if (isNaN(amount)) {
                    showNotification('Please enter a valid amount', 'error');
                    return;
                }

                const rateElement = document.getElementById('usd-to-cny');
                if (!rateElement) {
                    showNotification('Exchange rate not available', 'error');
                    return;
                }

                const rate = parseFloat(rateElement.dataset.rate);

                let result;
                if (from === 'USD' && to === 'CNY') {
                    result = amount * rate;
                } else if (from === 'CNY' && to === 'USD') {
                    result = amount / rate;
                } else {
                    result = amount; // Same currency
                }

                resultElement.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
                showNotification('Conversion completed', 'success');
            });
        } else {
            console.error('Convert button not found');
        }

        // Initialize old prices
        let oldAskPriceUSD = 0;
        let oldBidPriceUSD = 0;
        let oldAskPriceCNY = 0;
        let oldBidPriceCNY = 0;
        let oldAskPriceHKD = 0;
        let oldBidPriceHKD = 0;

        // Gold prices update function
        function updateGoldPrices(middlePriceUSD) {
            console.log('Updating gold prices');
            const askPriceUSD = middlePriceUSD * 1.015;
            const bidPriceUSD = middlePriceUSD * 0.985;

            const elements = {
                askPriceUSD: document.getElementById('ask-price-usd'),
                bidPriceUSD: document.getElementById('bid-price-usd'),
                askPriceCNY: document.getElementById('ask-price-cny'),
                bidPriceCNY: document.getElementById('bid-price-cny'),
                askPriceHKD: document.getElementById('ask-price-hkd'),
                bidPriceHKD: document.getElementById('bid-price-hkd'),
                usdToCny: document.getElementById('usd-to-cny'),
                usdToHkd: document.getElementById('usd-to-hkd'),
                lastUpdated: document.getElementById('last-updated')
            };

            function updateArrow(elementId, newPrice, oldPrice) {
                const arrowElement = document.getElementById(elementId + '-arrow');
                if (arrowElement) {
                    if (newPrice > oldPrice) {
                        arrowElement.innerHTML = '&#9650;'; // Up arrow
                        arrowElement.className = 'price-arrow price-arrow-up';
                    } else if (newPrice < oldPrice) {
                        arrowElement.innerHTML = '&#9660;'; // Down arrow
                        arrowElement.className = 'price-arrow price-arrow-down';
                    } else {
                        arrowElement.innerHTML = '';
                        arrowElement.className = 'price-arrow';
                    }
                }
            }

            if (elements.askPriceUSD) elements.askPriceUSD.textContent = askPriceUSD.toFixed(2);
            if (elements.bidPriceUSD) elements.bidPriceUSD.textContent = bidPriceUSD.toFixed(2);

            updateArrow('ask-price-usd', askPriceUSD, oldAskPriceUSD);
            updateArrow('bid-price-usd', bidPriceUSD, oldBidPriceUSD);

            if (elements.usdToCny) {
                const usdToCnyRate = parseFloat(elements.usdToCny.dataset.rate);
                const askPriceCNY = askPriceUSD * usdToCnyRate;
                const bidPriceCNY = bidPriceUSD * usdToCnyRate;
                if (elements.askPriceCNY) elements.askPriceCNY.textContent = askPriceCNY.toFixed(2);
                if (elements.bidPriceCNY) elements.bidPriceCNY.textContent = bidPriceCNY.toFixed(2);
                updateArrow('ask-price-cny', askPriceCNY, oldAskPriceCNY);
                updateArrow('bid-price-cny', bidPriceCNY, oldBidPriceCNY);
                oldAskPriceCNY = askPriceCNY;
                oldBidPriceCNY = bidPriceCNY;
            }

            if (elements.usdToHkd) {
                const usdToHkdRate = parseFloat(elements.usdToHkd.dataset.rate);
                const askPriceHKD = askPriceUSD * usdToHkdRate;
                const bidPriceHKD = bidPriceUSD * usdToHkdRate;
                if (elements.askPriceHKD) elements.askPriceHKD.textContent = askPriceHKD.toFixed(2);
                if (elements.bidPriceHKD) elements.bidPriceHKD.textContent = bidPriceHKD.toFixed(2);
                updateArrow('ask-price-hkd', askPriceHKD, oldAskPriceHKD);
                updateArrow('bid-price-hkd', bidPriceHKD, oldBidPriceHKD);
                oldAskPriceHKD = askPriceHKD;
                oldBidPriceHKD = bidPriceHKD;
            }

            // Update timestamp
            const now = new Date();
            if (elements.lastUpdated) elements.lastUpdated.textContent = now.toLocaleString();

            // Add a subtle animation to the updated prices
            const priceElements = document.querySelectorAll('#ask-price-usd, #bid-price-usd, #ask-price-cny, #bid-price-cny, #ask-price-hkd, #bid-price-hkd');
            priceElements.forEach(el => {
                el.classList.add('price-updated');
                setTimeout(() => el.classList.remove('price-updated'), 1000);
            });

            // Store current prices for next comparison
            oldAskPriceUSD = askPriceUSD;
            oldBidPriceUSD = bidPriceUSD;
        }

        // Call this function with the current middle price when the page loads
        const initialMiddlePriceUSD = 63000; // This should be fetched from an API in the future
        updateGoldPrices(initialMiddlePriceUSD);

        // Set up an interval to update prices every 60 seconds (adjust as needed)
        setInterval(() => {
            // In a real-world scenario, you would fetch the latest price from an API here
            const newMiddlePriceUSD = 63000 + (Math.random() - 0.5) * 1000; // Simulate price fluctuation
            updateGoldPrices(newMiddlePriceUSD);
        }, 60000);

        function showNotification(message, type) {
            console.log('Showing notification:', message, type);
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.className = `fixed bottom-4 right-4 p-4 rounded-md text-white ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} shadow-lg transition-opacity duration-300`;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Initialize tooltip
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.addEventListener('mouseover', function() {
                const tooltipText = this.getAttribute('title');
                const tooltipElement = document.createElement('span');
                tooltipElement.className = 'tooltiptext';
                tooltipElement.textContent = tooltipText;
                this.appendChild(tooltipElement);
                this.removeAttribute('title');
            });
            tooltip.addEventListener('mouseout', function() {
                const tooltipElement = this.querySelector('.tooltiptext');
                if (tooltipElement) {
                    this.setAttribute('title', tooltipElement.textContent);
                    this.removeChild(tooltipElement);
                }
            });
        }
    });
} catch (error) {
    console.error('An error occurred:', error);
}
