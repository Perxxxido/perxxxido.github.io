async function parseBinaryFile(filename) {
    document.addEventListener('DOMContentLoaded', async function() {
        // Получаем файл как ArrayBuffer
        const response = await fetch(filename);
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        
        const state = {
            attrName: null,
            attr: {},
            element: null
        };
        
        // Список функций
        const functions = {
            00: (arg) => { state.attrName = arg; },
            01: (arg) => { if (state.attrName !== String.fromCharCode(0x00)) state.attr[state.attrName] = arg; else state.attr = {};},
            02: (arg) => ( alert(arg) ),
            
            
            
            10: () => { state.element = document.createElement(state.attrName); },
            11: () => { if (state.attrName !== String.fromCharCode(0x00)) state.element.textContent = state.attrName; },
            12: () => {
                for (const [name, value] of Object.entries(state.attr)) {
                    state.element.setAttribute(name, value);
                }
            },
            13: () => {
                const parentElement = state.attrName
                    ? document.querySelector(state.attrName) 
                    : document.body;
                parentElement.appendChild(state.element);
            }
        };

        // Функция декодирования аргумента
        const decodeArg = (argBytes) => {
            let result = '';
            for (const byte of argBytes) {
                //if (byte === 0x00 && byte <= 0x09) {
                    // 00-09 → цифры 0-9
                //    result += byte.toString();
                //} 
                //else if (byte >= 0x0A && byte <= 0x0F) {
                    // 0A-0F → операторы
                //    const operators = ['+', '-', '*', '/', '^', '='];
                //    result += operators[byte - 0x0A] || '';
                //}
                //else if (byte === 0xFF) {
                //    break; // разделитель
                //}
                //else {
                    // Остальные байты → ASCII символы
                    result += String.fromCharCode(byte);
                //}
            }
            return result;
        };
        
        let i = 0;
        while (i < bytes.length) {
            if ((bytes[i] & 0xF0) === 0x00) {
                const funcCode = bytes[i].toString(16).toUpperCase();
                i++;
                
                //if (i < bytes.length && bytes[i] === 0xFF) {
                //    i++;
                    
                    let argBytes = [];
                    while (i < bytes.length && bytes[i] !== 0x7F) {
                        argBytes.push(bytes[i]);
                        i++;
                    }
                    
                    const arg = argBytes.length > 0
                        ? new TextDecoder().decode(new Uint8Array(argBytes))
                        : null;
                    
                    if (functions[funcCode]) {
                        functions[funcCode](arg);
                        console.log(
                            `%c0x0${funcCode} %c${arg}`,
                            "color: #fff;",
                            "color: #aaa;"
                        );
                    } else {
                        console.warn(`Unknown function code: 0x${funcCode}`);
                    }
                    
                    if (i < bytes.length && bytes[i] === 0x7F) i++;
            } else if((bytes[i] & 0xF0) === 0x10) {
                const funcCode = bytes[i].toString(16).toUpperCase();
                i++;
                
                if (functions[funcCode]) {
                    functions[funcCode]();
                } else {
                    console.warn(`Unknown function code: 0x${funcCode}`);
                }
            } else {
                i++;
            }
        }
    });
}

// Пример использования
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('script[type="application/x-binary"]').forEach(script => {
		const src = script.getAttribute('src');
		if (src) {
			parseBinaryFile(src);
		}
	});
});
