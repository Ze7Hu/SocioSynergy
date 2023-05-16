const sendMsg = async (e) => {
    e.preventDefault();

    const recipient_id = document.querySelector('#recipient-id').value.trim();
    const sender_id = document.querySelector('#sender-id').value.trim();
    const recipientName = document.querySelector('#recipient-name').value.trim();
    const msg_content = document.querySelector('#message-text').value.trim();
    
    console.log("im here")
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

const msgID = $('a.msg-button').click((e) => {
    const senderID = e.currentTarget.getAttribute('data-sender-id');
    const senderName = e.currentTarget.getAttribute('data-sender-name');
    
    $('#newMsg').text(`Reply to: ${senderName}`);
    $('#recipient-id').val(senderID);
    $('#recipient-name').val(senderName);
})