const canvas = document.getElementById("sandbox");
const debug = document.getElementById("debug");
let ctx:CanvasRenderingContext2D;
let drawingOffset = [0,0];

interface CanvasRenderingContext2D {
    drawRoundedRectangle(x: number, y: number, width: number, height: number, cornerRadius: number): void;
}

CanvasRenderingContext2D.prototype.drawRoundedRectangle = function(x, y, width, height, cornerRadius) {
    const radius = Math.min(cornerRadius, Math.min(width / 2, height / 2));

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

const main = () => {
    if(!(canvas instanceof HTMLCanvasElement)) {
        console.error("Canvas is not found");
        return;
    };

    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let resizeTimer:ReturnType<typeof setTimeout>;

    window.addEventListener("resize",function(e){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(canvasSizeReset,250);
    });

    const canvasSizeReset = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawingOffset = [canvas.width/2,canvas.height/2];
    }

    const world:World = new World();

    const draw = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        world.draw(ctx);
        printDebug();
        window.requestAnimationFrame(draw);
    }

    const mouseMove = (e:MouseEvent) => {
        world.cursorPosition = [
            (e.clientX - drawingOffset[0]),
            (e.clientY - drawingOffset[1])
        ];
    }

    const printDebug = () => {
        if(!debug) return;
        const debugText = "cursorPosition:\t ["+world.cursorPosition[0]+","+world.cursorPosition[1]+"]";
        debug.innerText = debugText;
    }

    document.addEventListener("mousemove",mouseMove);
    draw(); canvasSizeReset();
}

class World {
    nubs:Nub[] = [];
    cursorPosition: number[] = [0,0];

    constructor(){
        let defaultNub = new Nub();
        this.nubs.push(defaultNub);
    }
    
    draw(ctx:CanvasRenderingContext2D){
        this.nubs.forEach(nub => {
            nub.showHitbox = (
                nub.position[0] - nub.width/2 < this.cursorPosition[0] && this.cursorPosition[0] <= nub.position[0] + nub.width/2 &&
                nub.position[1] - nub.height/2 < this.cursorPosition[1] && this.cursorPosition[1] <= nub.position[1] + nub.height/2
            )
            nub.draw(ctx);
        });
    }
}

class Nub {
    text = "1";
    position = [0,0];
    width = 64;
    height = 64;

    showHitbox = false;

    draw(ctx:CanvasRenderingContext2D){
        // console.log("drawing nub");
        // console.log(ctx.font);
        if(this.showHitbox){
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 0.2;
            ctx.drawRoundedRectangle(drawingOffset[0] - this.width/2, drawingOffset[1] - this.height/2, this.width, this.height, 16);
            ctx.globalAlpha = 1;
            document.body.style.cursor = "grab";
        } else {
            document.body.style.cursor = "default";
        }

        ctx.font = this.width+"px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(this.text, drawingOffset[0], drawingOffset[1] + this.height/2 - 8);
    }
}

window.onload = main;