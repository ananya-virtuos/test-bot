# 🚀 Deployment & Shopify Integration Guide

## Quick Start: Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial chatbot commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"
5. ✅ Your app is now live at `https://your-project.vercel.app`

---

## 📱 Shopify Integration - Step by Step

### Step 1: Add to theme.liquid
1. Go to Shopify Admin → Online Store → Themes
2. Click "Customize" on your active theme
3. Go to Theme settings → Header (or appropriate section)
4. Click "Edit code" or find `theme.liquid`
5. Add this before the closing `</body>` tag:

```html
<!-- GiftCart Chatbot Widget -->
<script>
  (function() {
    const chatbotUrl = 'https://your-deployed-url.vercel.app'; // Replace with your URL
    
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
      border-radius: 8px;
      display: none;
    `;
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'chatbot-iframe';
    iframe.src = chatbotUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 8px;
    `;
    iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-modals';
    iframe.title = 'GiftCart Chatbot';
    
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);
    
    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'chatbot-toggle';
    toggleBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #1f2937;
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      z-index: 9998;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    `;
    toggleBtn.innerHTML = '💬';
    
    toggleBtn.addEventListener('mouseover', () => {
      toggleBtn.style.transform = 'scale(1.1)';
    });
    toggleBtn.addEventListener('mouseout', () => {
      toggleBtn.style.transform = 'scale(1)';
    });
    
    toggleBtn.addEventListener('click', () => {
      const isVisible = wrapper.style.display === 'block';
      wrapper.style.display = isVisible ? 'none' : 'block';
      toggleBtn.innerHTML = isVisible ? '💬' : '✕';
    });
    
    document.body.appendChild(toggleBtn);
    
    // Show on page load (optional - hide by default for better UX)
    setTimeout(() => {
      wrapper.style.display = 'none'; // Start hidden
    }, 500);
  })();
</script>
```

### Step 2: Configure Environment Variables
For production deployment, set these in your deployment platform:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_API_BASE_URL=https://bot.api.vurve.ai`
   - `NEXT_PUBLIC_API_ENDPOINT=/api/v1/talk`
   - `NEXT_PUBLIC_APP_NAME=GiftCart Chatbot`

---

## 🔧 Advanced Integration Options

### Option A: Floating Widget (Recommended)
```html
<!-- Bottom-right floating bubble with toggle -->
<!-- Use the script above -->
```

### Option B: Fixed Header Bar
```html
<style>
  #chatbot-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 9999;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }
  #chatbot-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
<div id="chatbot-wrapper">
  <iframe id="chatbot-iframe" src="https://your-deployed-url.vercel.app" title="Chatbot"></iframe>
</div>
```

### Option C: Sidebar Chat
```html
<style>
  #chatbot-wrapper {
    position: fixed;
    right: -420px;
    top: 0;
    width: 400px;
    height: 100vh;
    z-index: 9999;
    background: white;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }
  #chatbot-wrapper.open {
    right: 0;
  }
  #chatbot-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
```

---

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] CORS headers enabled (already done in next.config.js)
- [ ] API endpoint is accessible from Shopify
- [ ] Deployed URL is live and accessible
- [ ] Tested in Shopify theme preview
- [ ] Tested on mobile devices
- [ ] Tested cross-browser compatibility
- [ ] Analytics configured (if needed)

---

## 🐛 Troubleshooting

### **Iframe not loading in Shopify**
- ✅ Check that X-Frame-Options header is ALLOWALL (done)
- ✅ Verify CORS headers are set (done)
- ✅ Test URL directly in browser
- ✅ Check browser console for errors

### **Chat not responding**
- Verify API endpoint is correct in env variables
- Check network tab in DevTools for API calls
- Ensure backend API is accessible from Shopify domain

### **Cross-origin errors**
- Add wildcard CORS: `Access-Control-Allow-Origin: *`
- Or specify Shopify domain: `Access-Control-Allow-Origin: https://your-store.myshopify.com`

### **Styling issues in iframe**
- iframe inherits parent theme styles - consider CSS scoping
- Use Tailwind's isolation utilities if needed

---

## 📊 Optional: Add Analytics

Track chatbot usage in Shopify:

```javascript
// Add to your ChatContainer.tsx
const trackEvent = (eventName: string, data?: any) => {
  if (window.parent !== window) {
    // Running in iframe, send message to parent
    window.parent.postMessage({
      type: 'chatbot-event',
      event: eventName,
      data: data
    }, '*');
  }
  // Also send to your analytics
  console.log(`Analytics: ${eventName}`, data);
};
```

---

## 🎯 Next Steps

1. **Test locally:** `npm run dev` → visit `http://localhost:3000`
2. **Build for production:** `npm run build`
3. **Deploy to Vercel:** Follow Step 1-2 above
4. **Add to Shopify:** Follow Shopify Integration steps
5. **Monitor & optimize:** Check performance metrics

---

## 📞 Support

- Next.js Docs: https://nextjs.org/docs
- Vercel Deployment: https://vercel.com/docs
- Shopify Theme Development: https://shopify.dev/docs/themes
