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
    brushSize = getBrushSize(slider.value)
    });

let colorPicker = new iro.ColorPicker('#picker', {
    width:100
});

    colorPicker.on('color:change',function(color){
        let customColorBox = document.getElementById('custom-color');
        let hsv = color.hsv;
        if(hsv.v < 20){
            console.log(hsv.v);
            hsv.v = 20;
        }
        color.set(hsv);
        customColorBox.style.fill = colorPicker.color.rgbString;
    });
});