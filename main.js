"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Expression = /** @class */ (function () {
    function Expression() {
        this.nubs = [];
        this.isDragged = false;
    }
    return Expression;
}());
var Nub = /** @class */ (function () {
    function Nub(text, position) {
        if (text === void 0) { text = "1"; }
        if (position === void 0) { position = [0, 0]; }
        this.text = "1";
        this.width = 64;
        this.height = 64;
        this.position = [0, 0];
        this.dragOffset = [0, 0];
        this.isHovered = false;
        this.isDragged = false;
        this.text = text;
        this.position = position;
    }
    Nub.prototype.draw = function (ctx) {
        // console.log("drawing nub");
        // console.log(ctx.font);
        if (this.isHovered) {
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = this.isDragged ? 0.3 : 0.1;
            ctx.drawRoundedRectangle(this.position[0] + drawingOffset[0] - this.width / 2, this.position[1] + drawingOffset[1] - this.height / 2, this.width, this.height, 16);
            ctx.globalAlpha = 1;
        }
        ctx.font = this.width + "px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.position[0] + drawingOffset[0], this.position[1] + drawingOffset[1] + this.height / 2 - 8);
    };
    return Nub;
}());
var NumberNub = /** @class */ (function (_super) {
    __extends(NumberNub, _super);
    function NumberNub(value, position) {
        if (position === void 0) { position = [0, 0]; }
        var _this = _super.call(this) || this;
        _this.value = 1;
        _this.text = "1";
        _this.value = value;
        _this.text = value.toString();
        return _this;
    }
    return NumberNub;
}(Nub));
var World = /** @class */ (function () {
    function World() {
        this.expressions = [];
        this.cursorPosition = [0, 0];
        this.draggingItem = null;
        this.tools = ["Move", "Copy"];
        this.currentTool = 0;
        this.cursor = "default";
        var defaultExpression = new Expression();
        var defaultNub = new NumberNub(1);
        defaultExpression.nubs.push(defaultNub);
        this.expressions.push(defaultExpression);
    }
    World.prototype.draw = function (ctx) {
        for (var i = 0; i < this.expressions.length; i++) {
            for (var j = 0; j < this.expressions[i].nubs.length; j++) {
                var nub = this.expressions[i].nubs[j];
                nub.isHovered = (nub.position[0] - nub.width / 2 < this.cursorPosition[0] && this.cursorPosition[0] <= nub.position[0] + nub.width / 2 &&
                    nub.position[1] - nub.height / 2 < this.cursorPosition[1] && this.cursorPosition[1] <= nub.position[1] + nub.height / 2);
                if (nub.isDragged) {
                    nub.position[0] = parseFloat((this.cursorPosition[0] - nub.dragOffset[0]).toFixed(1));
                    nub.position[1] = parseFloat((this.cursorPosition[1] - nub.dragOffset[1]).toFixed(1));
                }
                nub.draw(ctx);
            }
        }
        if (this.draggingItem && this.draggingItem instanceof Nub) {
            this.draggingItem.draw(ctx);
            this.draggingItem.position[0] = parseFloat((this.cursorPosition[0]).toFixed(1));
            this.draggingItem.position[1] = parseFloat((this.cursorPosition[1]).toFixed(1));
        }
    };
    return World;
}());
CanvasRenderingContext2D.prototype.drawRoundedRectangle = function (x, y, width, height, cornerRadius) {
    var radius = Math.min(cornerRadius, Math.min(width / 2, height / 2));
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    // Set stroke and fill styles as needed
    this.fill();
};
var canvas = document.getElementById("sandbox");
var debug = document.getElementById("debug");
var toolBar = document.getElementById("toolbar");
var ctx;
var drawingOffset = [0, 0];
console.log("Ready!");
var main = function () {
    if (!(canvas instanceof HTMLCanvasElement)) {
        console.error("Canvas is not found");
        return;
    }
    ;
    ctx = canvas.getContext('2d');
    var resizeTimer;
    window.addEventListener("resize", function (e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(canvasSizeReset, 250);
    });
    var canvasSizeReset = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawingOffset = [canvas.width / 2, canvas.height / 2];
    };
    var world = new World();
    var draw = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        world.draw(ctx);
        printDebug();
        window.requestAnimationFrame(draw);
    };
    var mouseMove = function (e) {
        world.cursorPosition = [
            (e.clientX - drawingOffset[0]),
            (e.clientY - drawingOffset[1])
        ];
    };
    var mouseDown = function (e) {
        if (!(e instanceof MouseEvent))
            return;
        // e.preventDefault();
        for (var i = 0; i < world.expressions.length; i++) {
            for (var j = 0; j < world.expressions[i].nubs.length; j++) {
                var nub = world.expressions[i].nubs[j];
                if (!nub.isHovered)
                    continue;
                document.body.style.cursor = "grabbing";
                if (e.button == 2 || world.currentTool == 1) {
                    // console.log("Copying");
                    // RIGHT MOUSE BUTTON
                    var newNub = void 0;
                    if (nub instanceof NumberNub) {
                        newNub = new NumberNub(nub.value);
                    }
                    else {
                        newNub = new Nub(nub.text);
                    }
                    newNub.isDragged = true;
                    newNub.isHovered = true;
                    newNub.dragOffset[0] = world.cursorPosition[0] - newNub.position[0];
                    newNub.dragOffset[1] = world.cursorPosition[1] - newNub.position[1];
                    newNub.position = __spreadArrays(nub.position);
                    world.draggingItem = newNub;
                }
                else if (e.button == 0) {
                    // LEFT MOUSE BUTTON
                    // console.log("Dragging");
                    nub.isDragged = true;
                    nub.dragOffset[0] = world.cursorPosition[0] - nub.position[0];
                    nub.dragOffset[1] = world.cursorPosition[1] - nub.position[1];
                }
                return;
            }
        }
    };
    var mouseUp = function (e) {
        if (world.draggingItem) {
            var newExp = new Expression();
            world.draggingItem.isDragged = false;
            if (world.draggingItem instanceof Nub) {
                newExp.nubs.push(world.draggingItem);
            }
            world.draggingItem = null;
            world.expressions.push(newExp);
            // console.log(world.expressions);
        }
        for (var i = 0; i < world.expressions.length; i++) {
            for (var j = 0; j < world.expressions[i].nubs.length; j++) {
                var nub = world.expressions[i].nubs[j];
                nub.isDragged = false;
            }
        }
        document.body.style.cursor = "default";
    };
    var printDebug = function () {
        if (!debug)
            return;
        var debugText = "cursorPosition:\t [" + world.cursorPosition[0] + "," + world.cursorPosition[1] + "]";
        debugText += "\ncurrentTool:\t " + world.currentTool;
        debug.innerText = debugText;
    };
    var handleContextMenu = function (e) {
        e.preventDefault();
    };
    var initToolbar = function () {
        var _a;
        if (!toolBar)
            return;
        var _loop_1 = function (i) {
            var tool = world.tools[i];
            var label = document.createElement("label");
            label.htmlFor = "tool_" + tool;
            var radio = document.createElement("input");
            radio.type = "radio";
            radio.id = "tool_" + tool;
            radio.name = "tool";
            radio.value = tool;
            if (i == 0) {
                radio.checked = true;
                (_a = radio.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("selected");
            }
            radio.addEventListener("change", function (e) {
                var _a;
                var target = e.target;
                if (target.checked) {
                    world.currentTool = i;
                    (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("selected");
                }
            });
            var labelText = document.createTextNode(tool + " [" + (i + 1) + "]");
            label.appendChild(radio);
            label.appendChild(labelText);
            toolBar.appendChild(label);
        };
        // toolBar.innerHTML = "";
        for (var i = 0; i < world.tools.length; i++) {
            _loop_1(i);
        }
    };
    var handleKeyboard = function (e) {
        var _a, _b;
        // console.log(e.key);
        if (e.key === "1") {
            (_a = document.getElementById("tool_Move")) === null || _a === void 0 ? void 0 : _a.click();
        }
        else if (e.key === "2") {
            (_b = document.getElementById("tool_Copy")) === null || _b === void 0 ? void 0 : _b.click();
        }
    };
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyboard);
    draw();
    canvasSizeReset();
    initToolbar();
};
window.onload = main;
