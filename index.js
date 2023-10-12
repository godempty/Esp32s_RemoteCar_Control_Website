var webSocketCarInputUrl = "ws://192.168.50.122:80/CarInput";
var webSocketCameraUrl = "ws://192.168.50.122/Camera";
var websocketCamera;
var websocketCarInput;

document.addEventListener("DOMContentLoaded", function () {
  // overall setup
  function Setup() {
    initWebSocket();
    endJoystick();
  }
  // websocket
  function initCarInputWebSocket() {
    websocketCarInput = new WebSocket(webSocketCarInputUrl);
    websocketCarInput.onopen = function (e) {
      console.log("WebSocket connection opened");
    };
    websocketCarInput.onerror = function (e) {
      console.error("WebSocket error: " + e.data);
    };
    websocketCarInput.onclose = function (event) {
      setTimeout(initCarInputWebSocket, 2000);
      console.log("reconnecting to CarInputWebSocket.");
    };
    websocketCarInput.onmessage = function (event) {};
  }
  function initWebSocket() {
    initCarInputWebSocket();
  }
  // 搖桿
  const joystickContainer = document.getElementById("joystick-container");
  const joystickKnob = document.getElementById("joystick-knob");
  let isJoystickMoving = false;
  joystickKnob.addEventListener("mousedown", (e) => {
    isJoystickMoving = true;
    moveJoystick(e);
  });
  window.addEventListener("mousemove", moveJoystick);
  window.addEventListener("mouseup", endJoystick);

  function moveJoystick(event) {
    if (isJoystickMoving) {
      const containerRect = joystickContainer.getBoundingClientRect();
      const knobRect = joystickKnob.getBoundingClientRect();

      const centerX = containerRect.left + containerRect.width / 2;
      const centerY = containerRect.top + containerRect.height / 2;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;

      const distance = Math.min(
        containerRect.width / 2,
        Math.hypot(deltaX, deltaY)
      );

      const angle = Math.atan2(deltaY, deltaX);
      const Cos = Math.cos(angle);
      const Sin = Math.sin(angle);
      const knobX = centerX + distance * Cos - knobRect.width / 2;
      const knobY = centerY + distance * Sin - knobRect.height / 2;

      joystickKnob.style.left = knobX + "px";
      joystickKnob.style.top = knobY + "px";

      var posX =
        knobX -
        (containerRect.left + containerRect.width / 2 - knobRect.width / 2);
      var posY =
        knobY -
        (containerRect.top + containerRect.height / 2 - knobRect.height / 2);
      sendData(posX, posY, containerRect.width / 2);
    }
  }
  function endJoystick() {
    isJoystickMoving = false;
    const containerRect = joystickContainer.getBoundingClientRect();
    const knobRect = joystickKnob.getBoundingClientRect();
    // 將搖桿恢復到中心位置
    joystickKnob.style.left =
      containerRect.left + containerRect.width / 2 - knobRect.width / 2 + "px";
    joystickKnob.style.top =
      containerRect.top + containerRect.height / 2 - knobRect.height / 2 + "px";
    sendData(0, 0, containerRect.width / 2);
  }
  function sendData(posX, posY, radius) {
    var extent = Math.sqrt(posX * posX + posY * posY) / radius;
    console.log("posX = ", posX, "posY = ", posY);
    console.log("extent = ", extent);
    var jsonData = {
      valX: parseFloat(posX.toFixed(7)),
      valY: parseFloat(posY.toFixed(7)),
      power: parseFloat(extent.toFixed(7)),
    };
    var jsonString = JSON.stringify(jsonData);
    websocketCarInput.send(jsonString);
  }
  window.onload = Setup;
});
