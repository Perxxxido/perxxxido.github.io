// Основной класс парсера
class BinaryParser {
	constructor(buffer) {
		this.buffer = new Uint8Array(buffer);
		this.position = 0;
	}

	parse() {
		const state = {
			attrName: null,
			attr: {},
			element: null
		};
		
		const functions = {
			0x00: (arg) => { state.attrName = arg; },
			0x01: (arg) => { 
				if (state.attrName !== String.fromCharCode(0x00)) 
					state.attr[state.attrName] = arg; 
				else 
					state.attr = {};
			},
			0x02: (arg) => alert(arg),
			0x10: () => { state.element = document.createElement(state.attrName); },
			0x11: () => { 
				if (state.attrName !== String.fromCharCode(0x00)) 
					state.element.textContent = state.attrName; 
			},
			0x12: () => {
				for (const [name, value] of Object.entries(state.attr)) {
					state.element.setAttribute(name, value);
				}
			},
			0x13: () => {
				const parentElement = state.attrName
					? document.querySelector(state.attrName) 
					: document.body;
				parentElement.appendChild(state.element);
			}
		};

		while (this.position < this.buffer.length) {
			const byte = this.buffer[this.position];
			
			if ((byte & 0xF0) === 0x00) {
				const funcCode = byte.toString(16).padStart(2, '0');
				this.position++;
				
				let argBytes = [];
				while (this.position < this.buffer.length && this.buffer[this.position] !== 0x7F) {
					argBytes.push(this.buffer[this.position]);
					this.position++;
				}
				
				const arg = argBytes.length > 0
					? new TextDecoder().decode(new Uint8Array(argBytes))
					: null;
				
				if (functions[funcCode]) {
					functions[funcCode](arg);
					console.log(
						`%c0x${funcCode} %c${arg}`,
						"color: #fff;",
						"color: #aaa;"
					);
				} else {
					console.warn(`Unknown function code: 0x${funcCode}`);
				}
				
				if (this.buffer[this.position] === 0x7F) this.position++;
			} 
			else if ((byte & 0xF0) === 0x10) {
				const funcCode = byte.toString(16).padStart(2, '0');
				this.position++;
				
				if (functions[funcCode]) {
					functions[funcCode]();
				} else {
					console.warn(`Unknown function code: 0x${funcCode}`);
				}
			} 
			else {
				this.position++;
			}
		}
	}
}

// Функция для загрузки и парсинки файла
async function loadAndParseBinaryFile(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		
		const buffer = await response.arrayBuffer();
		const parser = new BinaryParser(buffer);
		parser.parse();
	} catch (error) {
		console.error('Error loading binary file:', error);
	}
}

// Загрузка файла после полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('bin').forEach(script => {
		const src = script.getAttribute('src');
		if (src) {
			loadAndParseBinaryFile(src);
		}
	});
});
