var webSocketCarInputUrl = "ws://192.168.50.122/CarInput";
var webSocketCameraUrl = "ws://192.168.50.122/Camera";
var websocketCamera;
var websocketCarInput;

function initCarInputWebSocket() {
  websocketCarInput = new WebSocket(webSocketCarInputUrl);
  websocketCarInput.onopen = function (event) {};
  websocketCarInput.onclose = function (event) {
    setTimeout(initCarInputWebSocket, 2000);
  };
  websocketCarInput.onmessage = function (event) {};
}
function initWebSocket() {
  initCarInputWebSocket();
}
function sendBtnInput(key, value) {
  var data = key + "," + value;
  websocketCarInput.send(data);
}
function GoForward() {
  sendBtnInput("Move", 1);
}
function GoDown() {
  sendBtnInput("Move", 2);
}
function GoLeft() {
  sendBtnInput("Move", 3);
}
function GoRight() {
  sendBtnInput("Move", 4);
}
function Stop() {
  sendBtnInput("Move", 0);
}

window.onload = initWebSocket;
document
  .getElementById("Controlltable")
  .addEventListener("touchend", function (event) {
    event.preventDefault();
  });
