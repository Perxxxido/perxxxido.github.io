function watchVariable(variableName, callback, interval = 100) {
    const data = {};
    const timer = setInterval(() => {
        try {
            if (window[variableName] !== undefined) {
                callback(window[variableName]);
                data[variableName] = window[variableName];
                window[variableName] = undefined;
            }
        } catch (error) {
            console.error('Ошибка при проверке переменной:', error);
        }
    }, interval);
}

watchVariable("set", (text) => {
    console.log(`%c${text}`, "color: #4af;");
});
