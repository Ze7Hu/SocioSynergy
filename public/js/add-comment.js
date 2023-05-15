async function commentFormHandler(event) {
  event.preventDefault();

  const text = document.querySelector('textarea#comment-textarea').value.trim();
  const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  if (text) {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ text, post_id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      
      console.log('Successs');
      document.location.reload();
    } catch (err) {
      // console.log('Error:', err.message);
      alert('Error while submitting the comment');
      document.querySelector('#add-comment-form').style.display = 'block';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addCommentForm = document.querySelector('#add-comment-form');
  if (addCommentForm) {
    addCommentForm.addEventListener('submit', commentFormHandler);
  }
});
