class World {
    expressions:Expression[] = [];
    cursorPosition: number[] = [0,0];
    draggingItem:Nub | Expression | null = null;
    tools = ["Move","Copy"];
    currentTool:number = 0;
    cursor:string = "default";

    constructor(){
        let defaultExpression = new Expression();
        let defaultNub = new NumberNub(1);
        defaultExpression.nubs.push(defaultNub);
        this.expressions.push(defaultExpression);
    }
    
    draw(ctx:CanvasRenderingContext2D){
        for(let i = 0; i < this.expressions.length; i++){
            for(let j = 0; j < this.expressions[i].nubs.length; j++){
                const nub = this.expressions[i].nubs[j];

                nub.isHovered = (
                    nub.position[0] - nub.width/2 < this.cursorPosition[0] && this.cursorPosition[0] <= nub.position[0] + nub.width/2 &&
                    nub.position[1] - nub.height/2 < this.cursorPosition[1] && this.cursorPosition[1] <= nub.position[1] + nub.height/2
                )

                if(nub.isDragged){
                    nub.position[0] = parseFloat((this.cursorPosition[0] - nub.dragOffset[0]).toFixed(1));
                    nub.position[1] = parseFloat((this.cursorPosition[1] - nub.dragOffset[1]).toFixed(1));
                }
    
                nub.draw(ctx);
            }
        }
        
        if(this.draggingItem && this.draggingItem instanceof Nub){
            this.draggingItem.draw(ctx);
            this.draggingItem.position[0] = parseFloat((this.cursorPosition[0]).toFixed(1));
            this.draggingItem.position[1] = parseFloat((this.cursorPosition[1]).toFixed(1));
        }
    }
}