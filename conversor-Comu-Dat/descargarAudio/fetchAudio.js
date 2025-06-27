
/*
response=fetch("http://127.0.0.1:8000/audio/").then(response => {
    for (const header of response.headers) {
        console.log(header);
    }}).then(response => response.blob())
*/

import * as FFmpeg from '@ffmpeg/ffmpeg';
const { createFFmpeg, fetchFile } = FFmpeg;

//const ffmpeg = new FFmpeg({ log: true });
//const ffmpeg = createFFmpeg({ log: true });

async function fetchUltimoAudio() {
    const response = await fetch('http://127.0.0.1:8000/ultimo-audio/');
    const data = await response.json();
    const audioBlob = await fetch(data.audio_url).then(r => r.blob());
    return audioBlob;
}


//const { createFFmpeg, fetchFile } = FFmpeg;



async function convertirYDescargarMP3() {
   fetch("http://127.0.0.1:8000/audio/1/to-mp3/")
   .then(response => console.log(response))
   .catch(error => console.error('Error:', error));
    fetch("http://127.0.0.1:8000/audio/1/download/").then(response => {
    console.log(response);
    return response.blob();})
    .then(blob=>{
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'audio.mp3';
        a.click();
        window.URL.revokeObjectURL(url);

    })
    .catch(error => console.error('Error:', error));
}


//await ffmpeg.load(); // Carga FFmpeg antes de usarlo

//Botones para descargar
document.getElementById("wav").addEventListener("click", () => {
    //convertirYDescargar('wav');
});

document.getElementById("mp3").addEventListener("click", () => {
    convertirYDescargarMP3('mp3');
});

