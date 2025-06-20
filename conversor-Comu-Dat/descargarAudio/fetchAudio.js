response=fetch("http://127.0.0.1:8000/audio/").then(response => {
    for (const header of response.headers) {
        console.log(header);
    }}).then(response => response.blob())