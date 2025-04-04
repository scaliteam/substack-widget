(function () {
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];

  if (!window.CustomSubstackWidget) {
    console.error('CustomSubstackWidget configuration not found');
    return;
  }

  const config = window.CustomSubstackWidget;

  if (!config.substackUrl) {
    console.error('substackUrl is required in CustomSubstackWidget configuration');
    return;
  }

  const placeholder = config.placeholder || 'Email';
  const buttonText = config.buttonText || 'Subscribe';
  const redirect = config.redirect || '';
  const containerId = 'custom-substack-embed';
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id '${containerId}' not found`);
    return;
  }

  const widgetHTML = `
    <div class="custom-widget">
      <style>
        .custom-widget {
          display: flex;
          justify-content: center;
          padding: 20px;
          background-color: transparent;
        }

        .custom-widget-form {
          display: flex;
          width: 100%;
          max-width: 700px;
          gap: 12px;
        }

        .custom-widget-input {
          flex: 1;
          background-color: white;
          color: black;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
        }

        .custom-widget-input::placeholder {
          color: #333;
          opacity: 1;
        }

        .custom-widget-button {
          padding: 16px 24px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6); /* dark blue gradient */
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
        }

        .custom-widget-button:hover {
          opacity: 0.95;
        }

        .custom-widget-message {
          margin-top: 10px;
          font-size: 14px;
          text-align: center;
          color: #fff;
        }

        .custom-widget-error {
          color: #E15D3D;
        }

        .custom-widget-success {
          color: #41C388;
        }
      </style>

      <form class="custom-widget-form" id="custom-substack-form">
        <input type="email" class="custom-widget-input" placeholder="${placeholder}" required id="custom-email-input">
        <button type="submit" class="custom-widget-button">${buttonText}</button>
      </form>
      <div class="custom-widget-message" id="custom-widget-message"></div>
    </div>
  `;

  container.innerHTML = widgetHTML;

  const form = document.getElementById('custom-substack-form');
  const emailInput = document.getElementById('custom-email-input');
  const messageContainer = document.getElementById('custom-widget-message');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return;

    messageContainer.textContent = 'Subscribing...';
    messageContainer.className = 'custom-widget-message';

    const substackUrl = config.substackUrl.replace(/^https?:\/\//, '');
    const subscribeUrl = `https://${substackUrl}/api/v1/free`;

    fetch(subscribeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        redirect: 'false',
      }),
    })
      .then((response) => {
        if (response.ok) {
          messageContainer.textContent = 'Subscription successful!';
          messageContainer.className = 'custom-widget-message custom-widget-success';
          if (redirect) {
            setTimeout(() => {
              window.location.href = redirect;
            }, 1000);
          }
        } else {
          throw new Error('Subscription failed');
        }
      })
      .catch((error) => {
        messageContainer.textContent = 'Something went wrong. Please try again.';
        messageContainer.className = 'custom-widget-message custom-widget-error';
        console.error('Error:', error);
      });
  });
})();
