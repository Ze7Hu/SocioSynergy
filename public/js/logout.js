// Logout submition
async function logout() {
    const response = await fetch('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    });
  
    if (response.ok) {
      document.location.replace('/');
      confirm('You are now logged out.')
    } else {
      alert(response.statusText);
    }
  };

