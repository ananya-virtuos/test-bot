(function() {
  const shopId = Shopify.shop || 'default';
  
  // Fetch shop config to get custom emoji
  fetch(`https://brands-monte-nice-root.trycloudflare.com/api/v1/shop-config?shopId=${shopId}`)
    .then(r => r.json())
    .then(config => {
      const emoji = config.triggerButtonEmoji || '💬';
      const chatbotUrl = `https://test-bot-gamma-nine.vercel.app?shopId=${shopId}`;
      
      const w = document.createElement('div');
      w.id = 'chatbot-wrapper';
      w.style.cssText = `position:fixed;bottom:20px;right:20px;width:400px;height:600px;z-index:9999;box-shadow:0 5px 40px rgba(0,0,0,0.16);border-radius:12px;background:white;display:none;flex-direction:column;overflow:hidden`;
      
      const i = document.createElement('iframe');
      i.id = 'chatbot-iframe';
      i.src = chatbotUrl;
      i.style.cssText = `flex:1;width:100%;border:none;border-radius:12px`;
      i.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-modals';
      i.title = 'GiftCart Chatbot';
      w.appendChild(i);
      document.body.appendChild(w);
      
      const t = document.createElement('button');
      t.id = 'chatbot-toggle';
      t.style.cssText = `position:fixed;bottom:30px;right:30px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;font-size:28px;cursor:pointer;z-index:9998;box-shadow:0 4px 12px rgba(102,126,234,0.4);transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;padding:0`;
      t.innerHTML = emoji;
      t.setAttribute('aria-label', 'Open chatbot');
      
      t.addEventListener('mouseover', () => {
        t.style.transform = 'scale(1.1)';
        t.style.boxShadow = '0 6px 20px rgba(102,126,234,0.6)';
      });
      t.addEventListener('mouseout', () => {
        t.style.transform = 'scale(1)';
        t.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)';
      });
      
      const c = document.createElement('button');
      c.id = 'chatbot-close';
      c.style.cssText = `position:fixed;bottom:30px;right:30px;width:60px;height:60px;border-radius:50%;background:#ef4444;color:white;border:none;font-size:28px;cursor:pointer;z-index:10000;box-shadow:0 4px 12px rgba(239,68,68,0.4);transition:all 0.3s ease;display:none;align-items:center;justify-content:center;padding:0`;
      c.innerHTML = '✕';
      c.setAttribute('aria-label', 'Close chatbot');
      
      c.addEventListener('mouseover', () => {
        c.style.transform = 'scale(1.1) rotate(90deg)';
        c.style.boxShadow = '0 6px 20px rgba(239,68,68,0.6)';
      });
      c.addEventListener('mouseout', () => {
        c.style.transform = 'scale(1) rotate(0deg)';
        c.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)';
      });
      
      document.body.appendChild(t);
      document.body.appendChild(c);
      
      function toggle() {
        const visible = w.style.display === 'flex';
        w.style.display = visible ? 'none' : 'flex';
        t.style.display = visible ? 'flex' : 'none';
        c.style.display = visible ? 'none' : 'flex';
      }
      
      t.addEventListener('click', toggle);
      c.addEventListener('click', toggle);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && w.style.display === 'flex') toggle();
      });
    })
    .catch(() => console.log('Chatbot config failed'));
})();
