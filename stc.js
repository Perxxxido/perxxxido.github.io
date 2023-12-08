var data = document.getElementById("data");
var ids = [];
var tag = [];
var count = Number(data.getAttribute("t")) + 1;
for (let i = 1; i < count; i++) {
	ids[i] = data.getAttribute("t" + i);
}
for (let i = 1; i < count; i++) {
	tag[i] = document.getElementById(ids[i]);
	var s = tag[i].getAttribute("s");
	var p = tag[i].getAttribute("p");
	var c = tag[i].getAttribute("c");
	var b = tag[i].getAttribute("b");
	tag[i].style.fontSize = s + "px";
	tag[i].style.fontSize = p + "pt";
	tag[i].style.color = "#" + c;
	tag[i].style.backgroundColor = "#" + b;
}
