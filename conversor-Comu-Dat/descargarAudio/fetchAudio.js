const btn=document.getElementById("convertir");
btn.addEventListener("click", async () => {
fetch("http://127.0.0.1:8000/audio/").then(response => {
    console.log("Response received:", response);

    }).catch((error) => {
    console.error("Error fetching audio:", error);
    });
})