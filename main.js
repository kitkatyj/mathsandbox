"use strict";
var canvas = document.getElementById("sandbox");
var debug = document.getElementById("debug");
var ctx;
var drawingOffset = [0, 0];
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
    var printDebug = function () {
        if (!debug)
            return;
        var debugText = "cursorPosition:\t [" + world.cursorPosition[0] + "," + world.cursorPosition[1] + "]";
        debug.innerText = debugText;
    };
    document.addEventListener("mousemove", mouseMove);
    draw();
    canvasSizeReset();
};
var World = /** @class */ (function () {
    function World() {
        this.nubs = [];
        this.cursorPosition = [0, 0];
        var defaultNub = new Nub();
        this.nubs.push(defaultNub);
    }
    World.prototype.draw = function (ctx) {
        var _this = this;
        this.nubs.forEach(function (nub) {
            nub.showHitbox = (nub.position[0] - nub.width / 2 < _this.cursorPosition[0] && _this.cursorPosition[0] <= nub.position[0] + nub.width / 2 &&
                nub.position[1] - nub.height / 2 < _this.cursorPosition[1] && _this.cursorPosition[1] <= nub.position[1] + nub.height / 2);
            nub.draw(ctx);
        });
    };
    return World;
}());
var Nub = /** @class */ (function () {
    function Nub() {
        this.text = "1";
        this.position = [0, 0];
        this.width = 64;
        this.height = 64;
        this.showHitbox = false;
    }
    Nub.prototype.draw = function (ctx) {
        // console.log("drawing nub");
        // console.log(ctx.font);
        if (this.showHitbox) {
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 0.2;
            ctx.drawRoundedRectangle(drawingOffset[0] - this.width / 2, drawingOffset[1] - this.height / 2, this.width, this.height, 16);
            ctx.globalAlpha = 1;
            document.body.style.cursor = "grab";
        }
        else {
            document.body.style.cursor = "default";
        }
        ctx.font = this.width + "px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(this.text, drawingOffset[0], drawingOffset[1] + this.height / 2 - 8);
    };
    return Nub;
}());
window.onload = main;
