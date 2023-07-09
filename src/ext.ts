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