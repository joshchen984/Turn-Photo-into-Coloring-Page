let downloadBtn = document.getElementById('btn-download');

downloadBtn.addEventListener('click', download);

function download(e){
    const canvas = document.getElementById('myCanvas');
    const dataUrl = canvas.toDataURL('image/jpeg')
    downloadBtn.href = dataUrl;
}