let drawing = false;
$(document).ready(function(){
    let scale;
    //canvas
    const canv = document.getElementById("myCanvas");
    let ctx = canv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const urlParams = new URLSearchParams(window.location.search);
    const img = new Image();
    img.src = "/static/coloring-pages/" + urlParams.get('img') + '.jpg';
    let imgData;

    img.onload = function () {
        canv.width = img.width;
        canv.height = img.height;
        scale = canv.clientWidth/img.width;
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0,0,canv.width, canv.height);
        //convert image to be only white and bconslack
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
            if(selected==='brush'){
                drawing=true;
                brushDraw(e);
            }else if(selected==='pen') {
                drawing=false;
                penDraw(e);
            }else if(selected==='bucket'){
                floodfill(e);
            }
        });
        canv.addEventListener('mouseup', function(e){
            drawing = false;
        });
        canv.addEventListener('mousemove', brushDraw);

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
        return r === color[0] && g === color[1] && b === color[2];

    }

    function colorPixel(pixelPos,r, g, b, imgData){
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
        let idx = ((startY * canv.width) + startX)* 4;
        let startColor;

        if(!matchColor(imgData.data[idx], imgData.data[idx+1],imgData.data[idx + 2],[0,0,0])){
            startColor = [imgData.data[idx], imgData.data[idx+1],imgData.data[idx + 2]];
        }else{
            return;
        }
        if(arrayEquals(startColor,curColor)){
            return;
        }

        let stack = [[startY, startX]];
        let currPos;
        let newX, newY;
        while(stack.length > 0){
            currPos = stack.pop();
            for(let i = 0; i < 4;i++){
                newY = currPos[0] + yDirections[i];
                newX = currPos[1] + xDirections[i];
                idx = ((newY * canv.width) + newX)* 4;
                if(coordsValid(newX, newY, canv)){
                    //check if pixel color is same as starting color
                    if(matchColor(imgData.data[idx], imgData.data[idx+1],imgData.data[idx + 2],startColor)){
                        stack.push([newY, newX]);
                        colorPixel((newY * canv.width + newX)* 4, curColor[0],curColor[1],curColor[2], imgData);
                    }
                }
            }
        }
        ctx.putImageData(imgData, 0,0);
    }

    function brushDraw(e){
        if(!drawing){return;}
        imgData = ctx.getImageData(0,0,canv.width, canv.height);

        const startCoords = getMousePos(canv, e, scale);
        const startX = Math.floor(startCoords.x);
        const startY = Math.floor(startCoords.y);
        let idx = ((startY * canv.width) + startX)* 4;
        if(matchColor(imgData.data[idx], imgData.data[idx+1],imgData.data[idx + 2],[0,0,0])){
            return;
        }
        colorPixel((startY * canv.width + startX)* 4, curColor[0],curColor[1],curColor[2], imgData);
        drawSquare(brushSize, startX, startY);
        ctx.putImageData(imgData, 0,0);
    }

    function drawSquare(width, startX, startY){
        let idx = ((startY * canv.width) + startX)* 4;
        if(width === 3){
            const xDirections = [0,0,1,-1, 1, 1,-1,-1];
            const yDirections = [1,-1,0,0, 1, -1,1,-1];
            if(coordsValid(startX, startY, canv)) {
                if (!matchColor(imgData.data[idx], imgData.data[idx + 1], imgData.data[idx + 2], [0,0,0])) {
                    colorPixel((startY * canv.width + startX) * 4, curColor[0], curColor[1], curColor[2], imgData);
                }
            }

            let newY, newX;
            for(let i = 0; i < 8;i++){

                newY = startY + yDirections[i];
                newX = startX + xDirections[i];
                idx = ((newY * canv.width) + newX)* 4;
                if(coordsValid(newX, newY, canv)){
                    //check if pixel color is start color
                    if(!matchColor(imgData.data[idx], imgData.data[idx+1],imgData.data[idx + 2],[0,0,0])){
                        colorPixel((newY * canv.width + newX)* 4, curColor[0],curColor[1],curColor[2], imgData);
                    }
                }
            }
            return;
        }
        for(let i = startX-Math.floor(width/2);i <= Math.floor(startX+width/2);i++){
            if(coordsValid(i, startY, canv)){
                idx = ((startY * canv.width) + i)* 4;
                if(!matchColor(imgData.data[idx], imgData.data[idx+1],imgData.data[idx + 2],[0,0,0])){
                    colorPixel(idx, curColor[0],curColor[1],curColor[2], imgData);
                }
            }

        }
        for(let i = startY-Math.floor(width/2);i <= Math.floor(startY+width/2);i++){
            if(coordsValid(startX, i, canv)) {
                idx = ((i * canv.width) + startX) * 4;
                if (!matchColor(imgData.data[idx], imgData.data[idx + 1], imgData.data[idx + 2], [0,0,0])) {
                    colorPixel(idx, curColor[0], curColor[1], curColor[2], imgData);
                }
            }
        }
        drawSquare((width-1)/2, startX + Math.ceil(width/4), startY + Math.ceil(width/4));
        drawSquare((width-1)/2, Math.ceil(startX + width/4), startY - Math.ceil(width/4));
        drawSquare((width-1)/2, startX - Math.ceil(width/4), startY + Math.ceil(width/4));
        drawSquare((width-1)/2, startX - Math.ceil(width/4), startY - Math.ceil(width/4));
    }
    function penDraw(e){
        ctx.lineWidth=4;
        ctx.strokeStyle = "black";
        const currPos = getMousePos(canv, e, scale);
        ctx.lineTo(currPos.x, currPos.y);
        ctx.stroke();
    }
});

function getMousePos(canvas, e, scale) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left)/scale,
      y: (e.clientY - rect.top)/scale
    };

}

function arrayEquals(a, b){
    if(a.length !== b.length){
        return false;
    }
    for(let i = 0; i < a.length;i++){
        if(b[i] !== a[i]){
            return false;
        }
    }
    return true;
}

function coordsValid(x, y, canvas){
    if(x>=0 && x < canvas.width){
        if(y>=0 && y < canvas.height){
            return true;
        }
    }
    return false;
}