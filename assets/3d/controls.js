/* ==========================================================
   SẢNH 3D MỞ SÁCH — controls.js
   Bàn phím: WASD / mũi tên để đi, E / Enter / Space để tương tác.
   Điện thoại: joystick ảo góc dưới trái (hiện khi máy có màn cảm ứng).
   Kết quả: MS3D.input = { x, z } trong khoảng [-1, 1] (z âm = đi lên/phía bắc).
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  var input = MS3D.input = { x: 0, z: 0, enabled: true };
  var keys = {};
  var stick = { x: 0, z: 0 };

  var MAP = { KeyW: "u", ArrowUp: "u", KeyS: "d", ArrowDown: "d", KeyA: "l", ArrowLeft: "l", KeyD: "r", ArrowRight: "r" };

  function typing(e) {
    var t = e.target;
    return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
  }
  function update() {
    var kx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), kz = (keys.d ? 1 : 0) - (keys.u ? 1 : 0);
    var x = kx + stick.x, z = kz + stick.z, len = Math.hypot(x, z);
    if (len > 1) { x /= len; z /= len; }
    input.x = input.enabled ? x : 0;
    input.z = input.enabled ? z : 0;
  }
  MS3D.updateInput = update;

  window.addEventListener("keydown", function (e) {
    if (typing(e) || !input.enabled) return;
    var k = MAP[e.code];
    if (k) { keys[k] = true; e.preventDefault(); update(); return; }
    if ((e.code === "KeyE" || e.code === "Enter" || e.code === "Space") && MS3D.onInteract) {
      // Enter/Space trên nút đang focus thì để nút tự xử lý
      if ((e.code === "Enter" || e.code === "Space") && e.target && e.target.tagName === "BUTTON") return;
      e.preventDefault(); MS3D.onInteract();
    }
  });
  window.addEventListener("keyup", function (e) { var k = MAP[e.code]; if (k) { keys[k] = false; update(); } });
  window.addEventListener("blur", function () { keys = {}; stick.x = stick.z = 0; update(); });

  MS3D.clearInput = function () { keys = {}; stick.x = stick.z = 0; update(); };

  /* Joystick ảo. base: phần tử .joy chứa .joy-knob */
  MS3D.setupJoystick = function (base) {
    if (!base) return;
    var knob = base.querySelector(".joy-knob");
    var id = null, cx = 0, cy = 0, R = 46;
    function setKnob(dx, dy) { knob.style.transform = "translate(" + dx + "px," + dy + "px)"; }
    base.addEventListener("pointerdown", function (e) {
      id = e.pointerId; base.setPointerCapture(id);
      var r = base.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      move(e); e.preventDefault();
    });
    function move(e) {
      if (e.pointerId !== id) return;
      var dx = e.clientX - cx, dy = e.clientY - cy, len = Math.hypot(dx, dy);
      if (len > R) { dx = dx / len * R; dy = dy / len * R; }
      setKnob(dx, dy);
      var nx = dx / R, ny = dy / R;
      // vùng chết nhỏ ở giữa
      if (Math.hypot(nx, ny) < 0.15) nx = ny = 0;
      stick.x = nx; stick.z = ny; update();
    }
    function end(e) { if (e.pointerId !== id) return; id = null; setKnob(0, 0); stick.x = stick.z = 0; update(); }
    base.addEventListener("pointermove", move);
    base.addEventListener("pointerup", end);
    base.addEventListener("pointercancel", end);
  };

  MS3D.isTouch = function () {
    try { return window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window || navigator.maxTouchPoints > 0; }
    catch (e) { return false; }
  };
})();
