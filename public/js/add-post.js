// Add posts logic

async function addPost(event) {
    event.preventDefault();
  
    const title = document.querySelector('#post-title').value.trim();
    const content = document.querySelector('#content').value.trim();
  
    if (title && content) {
      const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/profile'); // Redirect to homepage after successful post creation
      } else {
        alert(response.statusText);
      }
    }
  };
  
  document.querySelector('.new-post-form').addEventListener('submit', addPost);
  