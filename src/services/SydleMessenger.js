const SydleMessenger = {
    // Envia mensagem para workspace do SYDLE ONE
    sendMessage: (subject, body, slot, recipient) => {
        const sourceSlot = window.frameElement ? window.frameElement.getAttribute('slotname') : null;
        let message = {
            sourceSlot: sourceSlot,
            source: 'SYDLE_EXPLORER',
            targetOrigin: '*',
            subject: subject,
            body: body,
            recipient: recipient || {
                slot: slot === '_self' ? sourceSlot : slot,
                target: '_workspace'
            }
        };

        console.log('message',message)
        
        window.parent.postMessage(JSON.stringify(message), '*');
    }
}

export default SydleMessenger;