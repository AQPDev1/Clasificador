const URL = "./My_model/";
let model, maxPredictions;

// Cargar el modelo
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Modelo cargado exitosamente");
    } catch (error) {
        console.error("Error al cargar el modelo:", error);
    }
}

// Manejar la carga de imágenes
document.getElementById('imageUpload').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(event) {
            const img = new Image();
            img.onload = async function() {
                document.getElementById('imagePreview').innerHTML = '';
                document.getElementById('imagePreview').appendChild(img);
                await predict(img);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Realizar la predicción
async function predict(image) {
    try {
        if (!model) {
            console.log("El modelo aún no está cargado. Esperando...");
            await init();
        }
        const prediction = await model.predict(image);
        
        let highestProbability = 0;
        let bestClass = "";
        
        for (let i = 0; i < maxPredictions; i++) {
            if (prediction[i].probability > highestProbability) {
                highestProbability = prediction[i].probability;
                bestClass = prediction[i].className;
            }
        }
        
        const resultElement = document.getElementById('result');
        resultElement.innerText = `Especie: ${bestClass}`;
        resultElement.style.display = 'block'; // Asegura que el elemento sea visible
    } catch (error) {
        console.error("Error al realizar la predicción:", error);
        document.getElementById('result').innerText = "Error al realizar la predicción";
    }
}

// Iniciar la carga del modelo
init();