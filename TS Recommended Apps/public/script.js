// Toggle RTL for Arabic (example: add ?lang=ar to URL)
if (window.location.search.includes('lang=ar')) {
    document.documentElement.setAttribute('dir', 'rtl');
}

// Email Login
document.getElementById('email-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Simulate login (integrate with backend later)
    showMessage('Login successful!', 'success');
});

// OAuth (using NextAuth redirects)
document.getElementById('google-login').addEventListener('click', () => {
    window.location.href = '/api/auth/signin/google';
});
document.getElementById('github-login').addEventListener('click', () => {
    window.location.href = '/api/auth/signin/github';
});

// Forgot Password Flow
document.getElementById('forgot-password').addEventListener('click', async () => {
    const email = prompt('Enter your email:');
    if (!email) return;
    const response = await fetch('/api/searchEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.accounts.length > 1) {
        showAccountSelection(data.accounts);
    } else if (data.accounts.length === 1) {
        sendOTP(data.accounts[0].id);
    } else {
        showMessage('No accounts found.', 'error');
    }
});

function showAccountSelection(accounts) {
    const list = document.getElementById('accounts-list');
    list.innerHTML = '';
    accounts.forEach(acc => {
        const li = document.createElement('li');
        li.innerHTML = `<button class="btn-primary p-2 rounded" onclick="sendOTP('${acc.id}')">${acc.name} (${acc.email})</button>`;
        list.appendChild(li);
    });
    document.getElementById('account-selection').classList.remove('hidden');
}

async function sendOTP(userId) {
    const response = await fetch('/api/sendOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
    const data = await response.json();
    if (data.success) {
        document.getElementById('otp-section').classList.remove('hidden');
        showMessage('OTP sent to your email.', 'success');
    } else {
        showMessage('Error sending OTP.', 'error');
    }
}

document.getElementById('verify-otp').addEventListener('click', async () => {
    const otp = document.getElementById('otp-code').value;
    const response = await fetch('/api/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
    });
    const data = await response.json();
    if (data.success) {
        showMessage('Login successful!', 'success');
        // Redirect to dashboard
    } else {
        showMessage(data.message, 'error');
    }
});

function showMessage(msg, type) {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.className = type === 'success' ? 'text-green-400' : 'text-red-400';
}