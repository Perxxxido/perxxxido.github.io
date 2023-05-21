window.onload = function() {
  document.getElementById("llinks").innerHTML = "<a w a href='javascript:set_background_image();'>Поменять фон</a> <a w a href='https://perxxxido.ru'>Главная</a>";
  set_background_image();
};

function rand() {
  return Math.floor(Math.random() *3);
}
function set_background_image() {
  let ran = rand();

  if(ran == 0) {
    document.body.style.background = "radial-gradient(circle at 50% 0%, #3300ff, #330066)";
  }
  if(ran == 1) {
    document.body.style.background = "radial-gradient(circle at 50% 0%, #990033, #993333)";
  }
  if(ran == 2) {
    document.body.style.background = "radial-gradient(circle at 50% 0%, #339933, #006600)";
  }

  console.log(ran);
}
