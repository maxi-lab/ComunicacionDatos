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



async function convertirYDescargar(formato) {
    if (!ffmpeg.isLoaded()) { await ffmpeg.load();}

    const webmBlob = await fetchUltimoAudio();
    const webmFile = new File([webmBlob], 'audio.webm');

    ffmpeg.FS('writeFile', 'audio.webm', await fetchFile(webmFile));

    const outputFile = formato === 'mp3' ? 'output.mp3' : 'output.wav';

    await ffmpeg.run('-i', 'audio.webm', outputFile);
    const data = ffmpeg.FS('readFile', outputFile);

    const url = URL.createObjectURL(new Blob([data.buffer], { type: `audio/${formato}` }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio.${formato}`;
    a.click();

    ffmpeg.FS('unlink', 'audio.webm');
    ffmpeg.FS('unlink', outputFile);
}


//await ffmpeg.load(); // Carga FFmpeg antes de usarlo

//Botones para descargar
document.getElementById("wav").addEventListener("click", () => {
    convertirYDescargar('wav');
});

document.getElementById("mp3").addEventListener("click", () => {
    convertirYDescargar('mp3');
});
