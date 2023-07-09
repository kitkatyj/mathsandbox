const canvas = document.getElementById("sandbox");
const debug = document.getElementById("debug");
const toolBar = document.getElementById("toolbar");
let ctx:CanvasRenderingContext2D;
let drawingOffset = [0,0];

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

    const mouseDown = (e:MouseEvent) => {
        if(!(e instanceof MouseEvent)) return;
        // e.preventDefault();
        for(let i = 0; i < world.expressions.length; i++){
            for(let j = 0; j < world.expressions[i].nubs.length; j++){
                const nub = world.expressions[i].nubs[j];
                if(!nub.isHovered) continue;
                document.body.style.cursor = "grabbing";
                if(e.button == 2 || world.currentTool == 1) {
                    // console.log("Copying");
                    // RIGHT MOUSE BUTTON
                    let newNub:Nub;
                    if(nub instanceof NumberNub){
                        newNub = new NumberNub(nub.value);
                    } else {
                        newNub = new Nub(nub.text);
                    }
                    newNub.isDragged = true;
                    newNub.isHovered = true;
                    newNub.dragOffset[0] = world.cursorPosition[0] - newNub.position[0];
                    newNub.dragOffset[1] = world.cursorPosition[1] - newNub.position[1];
                    newNub.position = [...nub.position];
                    world.draggingItem = newNub;
                } else if(e.button == 0) {
                    // LEFT MOUSE BUTTON
                    // console.log("Dragging");
                    nub.isDragged = true;
                    nub.dragOffset[0] = world.cursorPosition[0] - nub.position[0];
                    nub.dragOffset[1] = world.cursorPosition[1] - nub.position[1];
                }
                return;
            }
        }
    }

    const mouseUp = (e:MouseEvent) => {
        if(world.draggingItem){
            const newExp:Expression = new Expression();
            world.draggingItem.isDragged = false;
            if(world.draggingItem instanceof Nub){
                newExp.nubs.push(world.draggingItem);
            }
            world.draggingItem = null;

            world.expressions.push(newExp);
            // console.log(world.expressions);
        }

        for(let i = 0; i < world.expressions.length; i++){
            for(let j = 0; j < world.expressions[i].nubs.length; j++){
                const nub = world.expressions[i].nubs[j];
                nub.isDragged = false;
            }
        }

        document.body.style.cursor = "default";
    }

    const printDebug = () => {
        if(!debug) return;
        let debugText = "cursorPosition:\t ["+world.cursorPosition[0]+","+world.cursorPosition[1]+"]";
        debugText += "\ncurrentTool:\t "+world.currentTool;
        debug.innerText = debugText;
    }

    const handleContextMenu = (e:MouseEvent) => {
        e.preventDefault();
    }

    const initToolbar = () => {
        if(!toolBar) return;
        // toolBar.innerHTML = "";
        for(let i = 0; i < world.tools.length; i++){
            const tool = world.tools[i];
            const label = document.createElement("label");
            label.htmlFor = "tool_"+tool;

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.id = "tool_"+tool;
            radio.name = "tool";
            radio.value = tool;
            if(i == 0){
                radio.checked = true;
                radio.parentElement?.classList.add("selected");
            }
            radio.addEventListener("change", (e) => {
                const target = e.target as HTMLInputElement;
                if(target.checked){
                    world.currentTool = i;
                    target.parentElement?.classList.add("selected");
                }
            })

            const labelText = document.createTextNode(tool+" ["+(i+1)+"]");

            label.appendChild(radio);
            label.appendChild(labelText);

            toolBar.appendChild(label);
        }
    }

    const handleKeyboard = (e:KeyboardEvent) => {
        // console.log(e.key);
        if(e.key === "1"){
            document.getElementById("tool_Move")?.click();
        } else if(e.key === "2"){
            document.getElementById("tool_Copy")?.click();
        }
    }

    canvas.addEventListener("mousemove",mouseMove);
    canvas.addEventListener("mousedown",mouseDown);
    canvas.addEventListener("mouseup",mouseUp);
    canvas.addEventListener("contextmenu",handleContextMenu);
    document.addEventListener("keydown",handleKeyboard);
    draw(); canvasSizeReset(); initToolbar();
}

window.onload = main;