async function editFormHandler(event, postId) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value.trim();
  const content = document.querySelector('textarea[name="content"]').value.trim();
  console.log(title);
  console.log(content);

  const response = await fetch(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({
      post_id: postId,
      title,
      content
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

document.querySelectorAll('.edit-post-form').forEach(form => {
  const postId = form.dataset.postId;
  form.addEventListener('submit', event => {
    editFormHandler(event, postId);
  });
});
