window.onload = function() {
    const canv = document.getElementById("myCanvas");
    let ctx = canv.getContext("2d");
    const urlParams = new URLSearchParams(window.location.search);
    const img = new Image();
    img.src = "/static/coloring-pages/" + urlParams.get('img') + '.jpg';
    let imgData;
    img.onload = function () {
        canv.width = img.width;
        canv.height = img.height;

        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0,0,canv.width, canv.height);
        //convert image to be only white and black
        for (let i = 0; i < imgData.data.length;i+=4){
            if(imgData.data[i] > 100){
                imgData.data[i] = 255;
                imgData.data[i+1] = 255;
                imgData.data[i+2] = 255;
            }else{
                imgData.data[i] = 0;
                imgData.data[i+1] = 0;
                imgData.data[i+2] = 0;
            }
            imgData.data[i+3] = 255;
        }
        ctx.putImageData(imgData, 0,0);
        canv.addEventListener('mousedown', floodfill);
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
        if(r == color[0] && g == color[1] && b == color[2]){
            return true;
        }
        return false;i
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

        let startX = e.clientX;
        let startY = e.clientY;

        let stack = [[startY, startX]];
        let currPos;
        let newX, newY;
        let idx;
        while(stack.length > 0){
            currPos = stack.pop();
            colorPixel((currPos[0] * canv.width + currPos[1])* 4, 255,0,0);
            for(let i = 0; i < 4;i++){
                newY = currPos[0] + yDirections[i];
                newX = currPos[1] + xDirections[i];
                idx = ((newY * canv.width) + newX)* 4;
                // console.log(idx);
                if(idx >=0 && idx < imgData.data.length){
                    //check if pixel color not white or fill color
                    if(!matchColor(imgData.data[idx], imgData.data[idx+1],imgData.data[idx + 2],[255,255,255])){
                        if(!matchColor(imgData.data[idx], imgData.data[idx+1], imgData.data[idx+2], [255,0,0])){
                            stack.push([newY, newX]);
                        }

                    }
                }
            }
        }
        ctx.putImageData(imgData, 0,0);
    }

}