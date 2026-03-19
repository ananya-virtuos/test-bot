(function() {
    // Get shop ID from Shopify
    const shopId = Shopify.shop || 'default';
    const chatbotUrl = `https://your-chatbot.vercel.app?shopId=${shopId}`;
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.id = 'chatbot-wrapper';
    wrapper.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 600px;
      z-index: 9999;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      border-radius: 12px;
      background: white;
      display: none;
      flex-direction: column;
      overflow: hidden;
    `;
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'chatbot-iframe';
    iframe.src = chatbotUrl;
    iframe.style.cssText = `
      flex: 1;
      width: 100%;
      border: none;
      border-radius: 12px;
    `;
    iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-modals';
    iframe.title = 'GiftCart Chatbot';
    
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
    
    // Create toggle button (emoji)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'chatbot-toggle-emoji';
    toggleBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      font-size: 28px;
      cursor: pointer;
      z-index: 9998;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    `;
    toggleBtn.innerHTML = '💬';
    toggleBtn.setAttribute('aria-label', 'Open chatbot');
    
    // Hover effects for emoji button
    toggleBtn.addEventListener('mouseover', () => {
      toggleBtn.style.transform = 'scale(1.1)';
      toggleBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
    });
    
    toggleBtn.addEventListener('mouseout', () => {
      toggleBtn.style.transform = 'scale(1)';
      toggleBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    });
    
    // Create close button (X) - shown when chatbot is open
    const closeBtn = document.createElement('button');
    closeBtn.id = 'chatbot-close-btn';
    closeBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #ef4444;
      color: white;
      border: none;
      font-size: 28px;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      transition: all 0.3s ease;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0;
    `;
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close chatbot');
    
    // Hover effects for close button
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.transform = 'scale(1.1) rotate(90deg)';
      closeBtn.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6)';
    });
    
    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.transform = 'scale(1) rotate(0deg)';
      closeBtn.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
    });
    
    document.body.appendChild(toggleBtn);
    document.body.appendChild(closeBtn);
    
    // Toggle function
    function toggleChatbot() {
      const isVisible = wrapper.style.display === 'flex';
      
      if (isVisible) {
        // Close chatbot
        wrapper.style.display = 'none';
        toggleBtn.style.display = 'flex';
        closeBtn.style.display = 'none';
      } else {
        // Open chatbot
        wrapper.style.display = 'flex';
        toggleBtn.style.display = 'none';
        closeBtn.style.display = 'flex';
      }
    }
    
    // Event listeners
    toggleBtn.addEventListener('click', toggleChatbot);
    closeBtn.addEventListener('click', toggleChatbot);
    
    // Close chatbot when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wrapper.style.display === 'flex') {
        toggleChatbot();
      }
    });
  })();
