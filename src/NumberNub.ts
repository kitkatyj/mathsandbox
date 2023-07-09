class NumberNub extends Nub {
    value:number = 1;
    text:string = "1";

    constructor(value:number, position = [0,0]){
        super();
        this.value = value;
        this.text = value.toString();
    }
}