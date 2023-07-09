class Nub {
    text = "1";
    width = 64;
    height = 64;
    position = [0,0];
    dragOffset: number[] = [0,0];

    isHovered = false;
    isDragged = false;

    constructor(text:string = "1", position = [0,0]){
        this.text = text;
        this.position = position;
    }

    draw(ctx:CanvasRenderingContext2D){
        // console.log("drawing nub");
        // console.log(ctx.font);
        if(this.isHovered){
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = this.isDragged ? 0.3 : 0.1;
            ctx.drawRoundedRectangle(this.position[0] + drawingOffset[0] - this.width/2, this.position[1] + drawingOffset[1] - this.height/2, this.width, this.height, 16);
            ctx.globalAlpha = 1;
        }

        ctx.font = this.width+"px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.position[0] + drawingOffset[0], this.position[1] + drawingOffset[1] + this.height/2 - 8);
    }
}