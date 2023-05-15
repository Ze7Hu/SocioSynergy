const sendMsg = async (event) => {
    event.preventDefault();

    const recipient_id = document.querySelector('#recipient-id').value.trim();
    const sender_id = document.querySelector('#sender-id').value.trim();
    const recipientName = document.querySelector('#recipient-name').value.trim();
    const msg_content = document.querySelector('#message-text').value.trim();

    if(recipient_id && sender_id && recipientName && msg_content) {
        
        const response = await fetch('/api/msg/', {
            method: 'POST',
            body: JSON.stringify({ recipient_id, sender_id, msg_content }),
            headers: { 'Content-Type': 'application/json '},
        });

        if(response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
};
