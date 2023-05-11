// Signup submition
const signUpHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const first_name = document.querySelector('#first_name').value.trim();
    const last_name = document.querySelector('#last_name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const gender = document.querySelector('#gender').value.trim();
    const password = document.querySelector('#password').value.trim();

    if(username && first_name && last_name && email && gender && password) {

        const response = await fetch('/api/users/', {
            method: 'POST',
            body: JSON.stringify({ username, first_name, last_name, email, gender, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if(response.ok) {
            document.location.replace('/profile');
        } else {
            alert(response.statusText);
        }
    }
};

document.querySelector('.signup-form').addEventListener('submit', signUpHandler);