/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/01-rotate-to-mouse/index.ts":
/*!*****************************************!*\
  !*** ./src/01-rotate-to-mouse/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_Arrow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/Arrow */ \"./src/common/Arrow.ts\");\n/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ \"./src/common/utils.ts\");\n\n\nvar canvas = document.querySelector('#mainCanvas');\n\nif (canvas) {\n  var context = canvas.getContext('2d');\n  var arrow = new _common_Arrow__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n  arrow.x = canvas.width / 2;\n  arrow.y = canvas.height / 2;\n  var pos = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.captureMouse)(canvas);\n\n  if (context) {\n    var drawFrame = function drawFrame() {\n      window.requestAnimationFrame(drawFrame);\n      context.clearRect(0, 0, canvas.width, canvas.height);\n\n      if (pos.x && pos.y) {\n        var dx = pos.x - arrow.x;\n        var dy = pos.y - arrow.y;\n        arrow.rotation = Math.atan2(dy, dx);\n      }\n\n      arrow.draw(context);\n    };\n\n    drawFrame();\n  }\n}\n\n//# sourceURL=webpack://threeJourney/./src/01-rotate-to-mouse/index.ts?");

/***/ }),

/***/ "./src/common/Arrow.ts":
/*!*****************************!*\
  !*** ./src/common/Arrow.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\nvar Arrow = /*#__PURE__*/function () {\n  function Arrow() {\n    _classCallCheck(this, Arrow);\n\n    this.x = 0;\n    this.y = 0;\n    this.color = '#42A5F5';\n    this.rotation = 0;\n  }\n\n  _createClass(Arrow, [{\n    key: \"draw\",\n    value: function draw(context) {\n      context.save();\n      context.translate(this.x, this.y);\n      context.rotate(this.rotation);\n      context.lineWidth = 2;\n      context.fillStyle = this.color;\n      context.beginPath();\n      context.moveTo(-50, -25);\n      context.lineTo(0, -25);\n      context.lineTo(0, -50);\n      context.lineTo(50, 0);\n      context.lineTo(0, 50);\n      context.lineTo(0, 25);\n      context.lineTo(-50, 25);\n      context.lineTo(-50, -25);\n      context.closePath();\n      context.fill();\n      context.stroke();\n      context.restore();\n    }\n  }]);\n\n  return Arrow;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Arrow);\n\n//# sourceURL=webpack://threeJourney/./src/common/Arrow.ts?");

/***/ }),

/***/ "./src/common/utils.ts":
/*!*****************************!*\
  !*** ./src/common/utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"captureMouse\": () => (/* binding */ captureMouse),\n/* harmony export */   \"captureTouch\": () => (/* binding */ captureTouch),\n/* harmony export */   \"containPoint\": () => (/* binding */ containPoint)\n/* harmony export */ });\nvar captureTouch = function captureTouch(element) {\n  console.log('captureTouch');\n  var touch = {\n    x: null,\n    y: null,\n    isTouch: false\n  };\n  element.addEventListener('touchstart', function () {\n    touch.isTouch = true;\n  });\n  element.addEventListener('touchend', function () {\n    touch.isTouch = false;\n    touch.x = null;\n    touch.y = null;\n  });\n  element.addEventListener('touchmove', function (e) {\n    var _e$touches$ = e.touches[0],\n        pageX = _e$touches$.pageX,\n        pageY = _e$touches$.pageY;\n    touch.x = pageX;\n    touch.y = pageY;\n  });\n  return touch;\n};\n\nvar captureMouse = function captureMouse(element) {\n  var mouse = {\n    x: 0,\n    y: 0,\n    event: null\n  };\n  var offsetLeft = element.offsetLeft,\n      offsetTop = element.offsetTop;\n  element.addEventListener('mousemove', function (e) {\n    var x;\n    var y;\n    x = e.pageX;\n    y = e.pageY;\n    x -= offsetLeft;\n    y -= offsetTop;\n    mouse.x = x;\n    mouse.y = y;\n    mouse.event = e;\n  });\n  return mouse;\n};\n/**\n * 是否包含在区域内\n */\n\n\nvar containPoint = function containPoint(rect, x, y) {\n  return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;\n};\n\n\n\n//# sourceURL=webpack://threeJourney/./src/common/utils.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/01-rotate-to-mouse/index.ts");
/******/ 	
/******/ })()
;