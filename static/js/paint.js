let drawing = false;
$(document).ready(function(){
    let curColor = [255, 0,0];
    const borderColor = [0,0,0];
    let scale;
    //canvas
    const canv = document.getElementById("myCanvas");
    canv.style.width = (window.innerWidth*0.5).toString().concat("px");
    let ctx = canv.getContext("2d");
    const urlParams = new URLSearchParams(window.location.search);
    const img = new Image();
    img.src = "/static/coloring-pages/" + urlParams.get('img') + '.jpg';
    let imgData;

    //paint canvas
    const paintCanvas = document.getElementById('colors');
    let paintCtx = paintCanvas.getContext("2d");
    paintCanvas.style.width = "300px";
    paintCanvas.style.height = "150px";
    const rectWidth = 40;

    drawColorRects(paintCtx, borderColor, rectWidth);



    img.onload = function () {
        canv.width = img.width;
        canv.height = img.height;
        scale = parseFloat(canv.style.width.substring(0,canv.style.width.length - 2))/img.width;
        canv.style.width= (canv.width * scale).toString().concat("px");
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0,0,canv.width, canv.height);
        //convert image to be only white and black
        for (let i = 0; i < imgData.data.length;i+=4){
            if(imgData.data[i] > 100){
                imgData.data[i] = 0;
                imgData.data[i+1] = 0;
                imgData.data[i+2] = 0;
            }else{
                imgData.data[i] = 255;
                imgData.data[i+1] = 255;
                imgData.data[i+2] = 255;
            }
            imgData.data[i+3] = 255;
        }
        ctx.putImageData(imgData, 0,0);
        canv.addEventListener('mousedown', function(e){
            if(selected=='brush'){
                drawing=true;
                ctx.beginPath();
                brushDraw(e);
            }else if(selected=='pen') {
                drawing=false;
                penDraw(e);
            }else if(selected=='bucket'){
                floodfill(e);
            }
        });
        canv.addEventListener('mouseup', function(e){
            drawing = false;
            if(selected == 'brush') {
                ctx.beginPath();
            }
        });
        canv.addEventListener('mousemove', brushDraw);
        paintCanvas.addEventListener('mousedown', switchColor);

        $('input[type=radio][name=icons]').change(function(){
            ctx.beginPath();
            drawing=false;
        })
    }
    /**
     * Checks if color matches another color.
     * @param r - red value
     * @param g - green value
     * @param b - blue value
     * @param color - array of length 3 with rgb value
     * @returns {boolean}
     */
    function matchColor(r, g, b, color){
        return r == color[0] && g == color[1] && b == color[2];

    }

    function colorPixel(pixelPos,r, g, b){
        imgData.data[pixelPos] = r;
        imgData.data[pixelPos+1] = g;
        imgData.data[pixelPos+2] = b;
        imgData.data[pixelPos + 3] = 255;
    }
    /**
     * Fills section of image with color using floodfill algorithm.
     * @param e - event
     */
    function floodfill(e){
        //directions to move in floodfill
        const xDirections = [0,0,1,-1];
        const yDirections = [1,-1,0,0];

        imgData = ctx.getImageData(0,0,canv.width, canv.height);

        const startCoords = getMousePos(canv, e, scale);
        const startX = Math.floor(startCoords.x);
        const startY = Math.floor(startCoords.y);
        let stack = [[startY, startX]];
        let currPos;
        let newX, newY;
        let idx;
        while(stack.length > 0){
            currPos = stack.pop();
            for(let i = 0; i < 4;i++){
                newY = currPos[0] + yDirections[i];
                newX = currPos[1] + xDirections[i];
                idx = ((newY * canv.width) + newX)* 4;
                if(idx >=0 && idx < imgData.data.length){
                    //check if pixel color not white or fill color
                    if(!matchColor(imgData.data[idx], imgData.data[idx+1],imgData.data[idx + 2],[0,0,0])){
                        if(!matchColor(imgData.data[idx], imgData.data[idx+1], imgData.data[idx+2], curColor)){
                            stack.push([newY, newX]);
                            colorPixel((newY * canv.width + newX)* 4, curColor[0],curColor[1],curColor[2]);
                        }

                    }
                }
            }
        }
        ctx.putImageData(imgData, 0,0);
    }

    function switchColor(e){
        const mousePos = getMousePos(paintCanvas, e, 1);
        const x = mousePos.x;
        const y = mousePos.y;
        const pixel = paintCtx.getImageData(x, y, 1,1).data;
        if(!matchColor(pixel[0], pixel[1], pixel[2], [0,0,0])){
            curColor = pixel.slice(0,4);
        }
    }

    function brushDraw(e){
        if(!drawing){return;}

        ctx.lineWidth=4;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";
        const currPos = getMousePos(canv, e, scale);
        ctx.lineTo(currPos.x, currPos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(currPos.x, currPos.y);
    }

    function penDraw(e){
        ctx.lineWidth=4;
        ctx.strokeStyle = "black";
        const currPos = getMousePos(canv, e, scale);
        ctx.lineTo(currPos.x, currPos.y);
        ctx.stroke();
    }
});
function drawColorRect(x, y, color, ctx, borderColor, width){
    ctx.beginPath();
    ctx.rect(x, y, width,width);
    ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
    ctx.fill();
    ctx.rect(x, y, width,width);
    ctx.strokeStyle = `rgb(${borderColor[0]},${borderColor[1]},${borderColor[2]})`;
    ctx.lineWidth = "4";
    ctx.stroke();
    ctx.closePath();
}

function getMousePos(canvas, e, scale) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left)/scale,
      y: (e.clientY - rect.top)/scale
    };

}

function drawColorRects(paintCtx, borderColor, rectWidth){
    drawColorRect(rectWidth/4,rectWidth/4,[255,0,0], paintCtx, borderColor, rectWidth);//red
    drawColorRect(rectWidth*1.5 + rectWidth/4,rectWidth/4,[0,255,0], paintCtx, borderColor, rectWidth);//green
    drawColorRect((rectWidth * 1.5)*2 + rectWidth/4,rectWidth/4,[0,0,255], paintCtx, borderColor, rectWidth);//blue
    drawColorRect((rectWidth * 1.5)*3 + rectWidth/4,rectWidth/4,[255,255,255], paintCtx, borderColor, rectWidth); //white
    drawColorRect(rectWidth/4,rectWidth*1.5 + rectWidth/4,[255,165,0], paintCtx, borderColor, rectWidth); //orange
    drawColorRect(rectWidth*1.5 + rectWidth/4,rectWidth*1.5 + rectWidth/4,[255,255,0], paintCtx, borderColor, rectWidth);//yellow
    drawColorRect((rectWidth * 1.5)*2 + rectWidth/4,rectWidth*1.5 + rectWidth/4,[64,224,208], paintCtx, borderColor, rectWidth);//turquoise
    drawColorRect((rectWidth * 1.5)*3 + rectWidth/4,rectWidth*1.5 + rectWidth/4,[139,69,19], paintCtx, borderColor, rectWidth);//brown
}

