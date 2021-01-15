window.onload = function() {
    const canv = document.getElementById("myCanvas");
    let ctx = canv.getContext("2d");
    const urlParams = new URLSearchParams(window.location.search);
    const img = new Image();
    img.src = "/static/coloring-pages/" + urlParams.get('img') + '.jpg';

    img.onload = function () {
        canv.width = img.width;
        canv.height = img.height;
        ctx.drawImage(img, 0, 0);
    }
}