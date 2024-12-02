const messageInput = document.getElementById('userInput');
        const sendButton = document.querySelector('.send-button');
        const chatMessages = document.getElementById('chatMessages');

        function appendMessage(text, type, isCode = false) {
            const message = document.createElement('div');
            message.classList.add('message', type);

            if (type === 'bot') {
                if (isCode) {
                    const preElement = document.createElement('pre');
                    preElement.textContent = text; // Output code in preformatted text block
                    message.appendChild(preElement);

                    const copyButton = document.createElement('span');
                    copyButton.classList.add('copy-icon');
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.onclick = () => copyToClipboard(text);
                    message.appendChild(copyButton);
                } else {
                    const content = document.createElement('div');
                    content.innerHTML = text.replace(/\n/g, '<br>'); // Handle newlines
                    message.appendChild(content);
                }
            } else {
                message.textContent = text;
            }

            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Kode berhasil disalin!');
            }).catch(err => {
                alert('Gagal menyalin kode: ' + err);
            });
        }

        async function getAIResponse(message) {
            try {
                const response = await axios.post('https://luminai.my.id/', {
                    content: message,
                    cName: "Bella", // Nama bot (custom)
                    cID: "BellaIixWcYu" // ID bot (custom)
                });

                const botResponse = response.data.result || 'Maaf, saya tidak dapat memahami permintaan Anda.';

                return botResponse;
            } catch (error) {
                console.error(error);
                return 'Maaf, terjadi kesalahan saat memproses permintaan Anda.';
            }
        }

        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            appendMessage(message, 'user'); // Add user message
            messageInput.value = '';

            const botResponse = await getAIResponse(message);
            appendMessage(botResponse, 'bot', true); // Mark as code to output in <pre>
        }

        function checkEnter(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
