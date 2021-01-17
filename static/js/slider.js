let brushSize = 7;
$(document).ready(function(){
    let slider = document.getElementById("brush-size");
    let output = document.getElementById("brush-size-display");

    function getBrushSize(value){
        let size = 3;
        for(let i = 1; i < value;i++){
            size=size*2+1;
        }
        return size;
    }

    brushSize = getBrushSize(slider.value);
    output.innerText = slider.value;

    $("#brush-size").on('input',function(){
        slider = document.getElementById("brush-size");
        output = document.getElementById("brush-size-display");
        output.innerText = slider.value;
    });
    $("#brush-size").change(function(){
    slider = document.getElementById("brush-size");
    brushSize = getBrushSize(slider.value);
    console.log(slider.value);
    console.log(brushSize);
});
});