let selected = "brush";
let curColor = [255, 0,0];

function selectOption(value){
    selected = value;
}
function selectColor(color){
    //turn rgb string into array
    const rgb = color.match(/\d+/g);
    curColor = rgb;
}