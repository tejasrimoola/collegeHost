const registerBtn = document.getElementById('register-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.getElementById('close-modal');

// Open Modal
registerBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

// Close Modal
closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Close Modal on Outside Click
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});
