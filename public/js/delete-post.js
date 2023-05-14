async function deleteFormHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/').pop();

    const response = await fetch (`/api/posts/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/profile');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);