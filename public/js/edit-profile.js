// Signup submition
const editProfile = async (event) => {
    event.preventDefault();

    const id = document.querySelector('#user_id').value.trim();
    const username = document.querySelector('#username').value.trim();
    const first_name = document.querySelector('#first_name').value.trim();
    const last_name = document.querySelector('#last_name').value.trim();
    if(id && username && first_name && last_name) {

        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ id, username, first_name, last_name }),
            headers: { 'Content-Type': 'application/json' },
        });

        if(response.ok) {
            document.location.replace('/profile');
        } else {
            alert(response.statusText);
        }
    }
};

document.querySelector('.edit-form').addEventListener('submit', editProfile);