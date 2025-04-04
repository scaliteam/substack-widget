// widget.js
(function() {
  // Get the script tag that loaded this widget
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  
  // Check if there's a configuration object
  if (!window.CustomSubstackWidget) {
    console.error('CustomSubstackWidget configuration not found');
    return;
  }
  
  const config = window.CustomSubstackWidget;
  
  // Validate required properties
  if (!config.substackUrl) {
    console.error('substackUrl is required in CustomSubstackWidget configuration');
    return;
  }
  
  // Set defaults for optional properties
  const placeholder = config.placeholder || 'Enter your email';
  const buttonText = config.buttonText || 'Subscribe';
  const theme = config.theme || 'default';
  const redirect = config.redirect || '';
  
  // Get the container element
  const containerId = 'custom-substack-embed';
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with id '${containerId}' not found`);
    return;
  }
  
  // Define theme colors
  const themes = {
    default: '#3D69E1',
    blue: '#3D69E1',
    green: '#41C388',
    red: '#E15D3D',
    purple: '#8366B3',
    orange: '#F7883B',
    black: '#333333'
  };
  
  const themeColor = themes[theme] || themes.default;
  
  // Create widget HTML
  const widgetHTML = `
    <div class="css-widget-container">
      <style>
        .css-widget-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .css-widget-header {
          margin-bottom: 15px;
        }
        .css-widget-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 5px 0;
          color: #333;
        }
        .css-widget-description {
          font-size: 14px;
          margin: 0;
          color: #666;
        }
        .css-widget-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .css-widget-input {
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #ddd;
          font-size: 16px;
        }
        .css-widget-button {
          padding: 12px;
          border-radius: 4px;
          border: none;
          background-color: ${themeColor};
          color: white;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .css-widget-button:hover {
          opacity: 0.9;
        }
        .css-widget-message {
          margin-top: 10px;
          font-size: 14px;
          color: #666;
        }
        .css-widget-error {
          color: #E15D3D;
        }
        .css-widget-success {
          color: #41C388;
        }
      </style>
      <div class="css-widget-header">
        <h3 class="css-widget-title">Subscribe to updates</h3>
        <p class="css-widget-description">Stay in the loop with the latest content.</p>
      </div>
      <form class="css-widget-form" id="css-substack-form">
        <input type="email" class="css-widget-input" placeholder="${placeholder}" required id="css-email-input">
        <button type="submit" class="css-widget-button">${buttonText}</button>
      </form>
      <div class="css-widget-message" id="css-widget-message"></div>
    </div>
  `;
  
  // Set the container content
  container.innerHTML = widgetHTML;
  
  // Get form elements
  const form = document.getElementById('css-substack-form');
  const emailInput = document.getElementById('css-email-input');
  const messageContainer = document.getElementById('css-widget-message');
  
  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (!email) return;
    
    // Show loading
    messageContainer.textContent = 'Subscribing...';
    messageContainer.className = 'css-widget-message';
    
    // Create URL without protocol to handle both http and https
    const substackUrl = config.substackUrl.replace(/^https?:\/\//, '');
    const subscribeUrl = `https://${substackUrl}/api/v1/free`;
    
    // Subscribe to Substack
    fetch(subscribeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        redirect: 'false', // We handle redirect ourselves
      }),
    })
    .then(response => {
      if (response.ok) {
        messageContainer.textContent = 'Subscription successful!';
        messageContainer.className = 'css-widget-message css-widget-success';
        
        // Handle redirect if specified
        if (redirect) {
          setTimeout(() => {
            window.location.href = redirect;
          }, 1000);
        }
      } else {
        throw new Error('Subscription failed');
      }
    })
    .catch(error => {
      messageContainer.textContent = 'Something went wrong. Please try again.';
      messageContainer.className = 'css-widget-message css-widget-error';
      console.error('Error:', error);
    });
  });
})();