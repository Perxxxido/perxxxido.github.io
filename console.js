const sendData = (url, data) => {
    const formData = new FormData();
    
    // Добавляем обязательные параметры
    if(data.c) formData.append('c', data.c);
    if(data.name) formData.append('name', data.name);
    if(data.text) formData.append('text', data.text);
    
    return fetch(url, {
        method: 'POST',
        body: formData
    }).then(res => res.json());
};

// Функция для получения сообщений чата
const getChatMessages = (chatName) => {
    return sendData('/chat/get.php', { c: chatName })
        .then(response => {
            if(response.error) {
                console.error(`%cОшибка: ${response.error}`, 'color: #f66;');
                return [];
            }
            return response.messages || [];
        });
};

// Функция для отправки сообщения
const sendChatMessage = (chatName, userName, messageText) => {
    if(!userName || userName.trim() === '') {
        console.error('%cИмя является обязательным параметром', 'color: #f66;');
        return Promise.reject('Имя обязательно');
    }

    return sendData('/send.php', {
        c: chatName,
        name: userName,
        text: messageText
    });
};

// Мониторинг переменных и обработка чата
function watchChatSystem(interval = 100) {
    let currentChat = null;
    let lastMessagesHash = '';
    let userName = '';
    
    const processChatUpdate = async () => {
        if(!currentChat) return;
        
        try {
            const messages = await getChatMessages(currentChat);
            const newHash = JSON.stringify(messages);
            
            if(newHash !== lastMessagesHash) {
                lastMessagesHash = newHash;
                console.clear();
                
                if(messages.length === 0) {
                    console.log('%cНет сообщений в чате', 'color: #aaa;');
                } else {
                    messages.forEach(msg => {
                        console.log(
                            `%c${msg.name}: %c${msg.text}`,
                            'color: #fff; font-weight: bold;',
                            'color: #aaa;'
                        );
                    });
                }
            }
        } catch(error) {
            console.error('%cОшибка получения сообщений:', 'color: #f66;', error);
        }
    };
    
    // Мониторим изменения переменных
    const timer = setInterval(() => {
        try {
            // Обновляем текущий чат
            if(window.чат !== undefined) {
                const newChat = window.чат;
                window.чат = undefined;
                
                if(newChat && newChat !== currentChat) {
                    currentChat = newChat;
                    lastMessagesHash = '';
                    console.clear();
                    console.log(`%cАктивный чат: ${currentChat}`, 'color: #4af;');
                    processChatUpdate();
                }
            }
            
            // Обновляем имя пользователя
            if(window.имя !== undefined) {
                const newName = window.имя;
                window.имя = undefined;
                
                if(newName && newName !== userName) {
                    userName = newName;
                    console.log(`%cУстановлено имя: ${userName}`, 'color: #4af;');
                }
            }
            
            // Отправляем новое сообщение
            if(window.текст !== undefined && currentChat && userName) {
                const message = window.текст;
                window.текст = undefined;
                
                if(message && message.trim() !== '') {
                    sendChatMessage(currentChat, userName, message)
                        .then(() => processChatUpdate())
                        .catch(error => console.error('%cОшибка отправки:', 'color: #f66;', error));
                }
            }
            
            // Периодически обновляем чат
            processChatUpdate();
            
        } catch(error) {
            console.error('%cОшибка в системе чата:', 'color: #f66;', error);
        }
    }, interval);
    
    return {
        stop: () => clearInterval(timer)
    };
}

// Запускаем систему чата
const chatSystem = watchChatSystem();
