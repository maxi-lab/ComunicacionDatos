// grabacion.js

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

const botonGrabar = document.getElementById("grabar");
const reproductorAudio = document.getElementById("audioPlayback");

botonGrabar.addEventListener("click", async () => {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // WAV requiere transformación adicional
        const audioURL = URL.createObjectURL(audioBlob);
        reproductorAudio.src = audioURL;

      // Crea un enlace de descarga automáticamente
        
      /*const enlaceDescarga = document.createElement("a");
        enlaceDescarga.href = audioURL;
        enlaceDescarga.download = "grabacion.webm";
        enlaceDescarga.textContent = "Descargar audio";
        document.body.appendChild(enlaceDescarga);*/


        // Enviar al backend
      const formData = new FormData();
      formData.append("title", "Grabación web"); // Titulo de la grabacion
      formData.append('audio_file', audioBlob, 'grabacion.webm');

      fetch('http://127.0.0.1:8000/api/audio/', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log("Respuesta del servidor:", data);
      })
      .catch(error => {
        console.error("Error al subir el audio:", error);
      });

      
      };

      mediaRecorder.start();
      isRecording = true;
      botonGrabar.textContent = "Detener grabación";
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("No se pudo acceder al micrófono.");
    }
  } else {
    mediaRecorder.stop();
    isRecording = false;
    botonGrabar.textContent = "Grabar audio";
  }
});
