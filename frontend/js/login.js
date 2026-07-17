const panels = {
    login: document.getElementById('loginPanel'),
    register: document.getElementById('registerPanel'),
    reset: document.getElementById('resetPanel')
};

const panelTitle = document.getElementById('panelTitle');
const pupils = document.querySelectorAll('.funny-character .pupil');
const passwordInputs = document.querySelectorAll('input[type="password"]');
let isLookingAway = false;
let lastMousePosition = { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 };

function setLookAway(value) {
    isLookingAway = value;
    document.querySelectorAll('.funny-character').forEach(character => {
        character.classList.toggle('look-away', value);
    });
    if (value) {
        pupils.forEach(pupil => {
            pupil.style.transform = 'translate(0, 6px)';
        });
    } else {
        updateEyes(lastMousePosition);
    }
}

function updateEyes(event) {
    if (event && event.clientX !== undefined) {
        lastMousePosition = { clientX: event.clientX, clientY: event.clientY };
    }
    if (isLookingAway) return;

    pupils.forEach(pupil => {
        const eye = pupil.parentElement;
        const rect = eye.getBoundingClientRect();
        const dx = lastMousePosition.clientX - (rect.left + rect.width / 2);
        const dy = lastMousePosition.clientY - (rect.top + rect.height / 2);
        const dist = Math.min(4.5, Math.sqrt(dx * dx + dy * dy) / 15);
        const angle = Math.atan2(dy, dx);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
}

passwordInputs.forEach(input => {
    input.addEventListener('focus', () => setLookAway(true));
    input.addEventListener('blur', () => setLookAway(false));
    input.addEventListener('mouseenter', () => setLookAway(true));
    input.addEventListener('mouseleave', () => {
        if (!input.matches(':focus')) {
            setLookAway(false);
        }
    });
});

window.addEventListener('mousemove', updateEyes);

function setActivePanel(name) {
    Object.keys(panels).forEach(key => {
        panels[key].classList.toggle('active', key === name);
    });

    const titles = {
        login: 'Login',
        register: 'Register',
        reset: 'Reset Password'
    };

    panelTitle.textContent = titles[name] || 'Login';
    location.hash = name;
}

function updatePanelFromHash() {
    const hash = location.hash.replace('#', '');
    if (hash && panels[hash]) {
        setActivePanel(hash);
    } else {
        setActivePanel('login');
    }
}

window.addEventListener('hashchange', updatePanelFromHash);
updatePanelFromHash();

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    if (!username || !password) {
        message.textContent = 'Please enter both username and password.';
        message.className = 'message error';
        return;
    }

    alert('Login successful for user: ' + username);
    message.textContent = '';
    this.reset();
});

document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const message = document.getElementById('registerMessage');

    hideError('regUsernameError');
    hideError('regEmailError');
    hideError('regPhoneError');
    hideError('regPasswordError');
    hideError('regConfirmPasswordError');

    let isValid = true;

    if (!username) {
        showError('regUsernameError');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showError('regEmailError');
        isValid = false;
    }

    if (!phone) {
        showError('regPhoneError');
        isValid = false;
    }

    if (password.length < 6) {
        showError('regPasswordError');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('regConfirmPasswordError');
        isValid = false;
    }

    if (!isValid) {
        message.textContent = '';
        message.className = 'message';
        return;
    }

    alert('Registration successful!');
    message.textContent = 'Registration successful! You can now login.';
    message.className = 'message success';
    this.reset();
});

document.getElementById('resetForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value;
    const confirmPassword = document.getElementById('resetConfirmPassword').value;
    const message = document.getElementById('resetMessage');

    if (!email) {
        message.textContent = 'Please enter your email address.';
        message.className = 'message error';
        return;
    }

    if (!validateEmail(email)) {
        message.textContent = 'Please enter a valid email address.';
        message.className = 'message error';
        return;
    }

    if (newPassword.length < 8) {
        message.textContent = 'Password must be at least 8 characters long.';
        message.className = 'message error';
        return;
    }

    if (newPassword !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        message.className = 'message error';
        return;
    }

    message.textContent = 'Your password has been reset successfully.';
    message.className = 'message success';
    this.reset();
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id) {
    document.getElementById(id).style.display = 'block';
}

function hideError(id) {
    document.getElementById(id).style.display = 'none';
}
