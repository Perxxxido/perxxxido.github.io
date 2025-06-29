function watchVariable(name, callback, interval = 100) {
  let data = {};
  setInterval(() => {
    if (window[name] !== undefined) {
      data[name] = window[name];
      callback(data[name]);
      window[name] = undefined;
    }
  }, interval);
}
watchVariable("set", (text) => {
    console.log(`%c${text}`, "color: #4af;");
});
