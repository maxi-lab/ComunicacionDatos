
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
    return fetch("http://127.0.0.1:8000/ultimo-audio/")
    .then(response => response.json())
    .then(data => {
        return data.id
    })
    .catch(error => console.error('Error:', error));

}

//const { createFFmpeg, fetchFile } = FFmpeg;


let selectedSampleRate = null;
let selectedBitDepth = null;

document.getElementById("convertir").addEventListener("click", () => {
    selectedSampleRate = getSelectedSampleRate();
    console.log("Tasa seleccionada:", selectedSampleRate);
    // Opcional: Avisar al usuario que la tasa fue seleccionada
    alert(`Tasa seleccionada: ${selectedSampleRate ?? 'Tasa Original'}`);
    selectedBitDepth = getSelectedBitDepth();
        console.log("Bit de profundidad seleccionado:", selectedBitDepth);
    // Opcional: Avisar al usuario que el bit de cuantizacion
    alert(`Tasa seleccionada: ${selectedBitDepth ?? 'Tasa Original'}`);
});

function getSelectedSampleRate() {
  const radios = document.querySelectorAll('input[name="tasaMuestreo"]');
  for (const radio of radios) {
    if (radio.checked) {
      switch (radio.id) {
        case 'tasaOriginal': return null; // sin cambio de tasa
        case 'tasa8kHz': return 8000;
        case 'tasa16kHz': return 16000;
        case 'tasa44kHz': return 44100;
        case 'tasa96kHz': return 96000;
      }
    }
  }
  return null;
}

function getSelectedBitDepth() {
    const radios = document.querySelectorAll('input[name="profundidadBits"]'); // Assuming 'profundidadBits' is the name of your radio group
    for (const radio of radios) {
        if (radio.checked) {
            switch (radio.id) {
                case 'bitOriginal': return null; // sin cambio de profundidad de bits
                case 'calidad8Bit': return 8;
                case 'calidad16Bit': return 16;
                case 'calidad24Bit': return 24;
            }
        }
    }
    return null;
}




async function convertirYDescargarMP3() {
    if (selectedSampleRate === undefined || selectedBitDepth === undefined) {
        alert('Primero selecciona una tasa de muestreo y una profundidad de bits, luego haz click en "Convertir".');
        return;
    }
    const audioId = await fetchUltimoAudio();
    // Pasa ambos parámetros al backend
    fetch(`http://127.0.0.1:8000/audio/${audioId}/to-mp3/?sample_rate=${selectedSampleRate ?? ''}&bit_depth=${selectedBitDepth ?? ''}`)
       .then(response => console.log(response))
       .catch(error => console.error('Error:', error));
    fetch(`http://127.0.0.1:8000/audio/${audioId}/download/`).then(response => {
        return response.blob();
    })
    .then(blob=>{
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `audio${audioId}.mp3`;
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error:', error));
}

async function convertirYDescargarWAV() {
    if (selectedSampleRate === undefined || selectedBitDepth === undefined) {
        alert('Primero selecciona una tasa de muestreo y una profundidad de bits, luego haz click en "Convertir".');
        return;
    }
    const audioId = await fetchUltimoAudio();
    // Pasa ambos parámetros al backend
    fetch(`http://127.0.0.1:8000/audio/${audioId}/to-wav/?sample_rate=${selectedSampleRate ?? ''}&bit_depth=${selectedBitDepth ?? ''}`)
    .then(response => console.log(response))
    .catch(error => console.error('Error:', error));
    fetch(`http://127.0.0.1:8000/audio/${audioId}/download/`)
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `audio${audioId}.wav`;
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error:', error));
}


//await ffmpeg.load(); // Carga FFmpeg antes de usarlo

//Botones para descargar
document.getElementById("wav").addEventListener("click", () => {
    convertirYDescargarWAV();
});

document.getElementById("mp3").addEventListener("click", () => {
    convertirYDescargarMP3('mp3');
});