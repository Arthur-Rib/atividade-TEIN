async function findFaces() {
    const model = await blazeface.load();
    const img = document.querySelector("img");
    const predictions = await model.estimateFaces(img, false);
    if (predictions.length > 0) {
        document.getElementById("status").innerText = "Rosto Encontrado!";
        const canvas = document.getElementById("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(250,225,6,0.5)";
        for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];
            ctx.fillRect(start[0], start[1], size[0], size[1]);
        }
        return predictions
    } else {
        document.getElementById("status").innerText = "Nenhum rosto encontrado!";
        return []
    }
}
async function lookForSafeDistance() {
    const faces = await findFaces()
    let ok = true
    for (let i = 0; i < faces.length; i++) {
        const f1 = faces[i];
        for (let j = 0; j < faces.length; j++) {
            const f2 = faces[j];
            if (f1.topLeft[0] !== f2.topLeft[0] || f1.topLeft[1] !== f2.topLeft[1]) {
                const distance = Math.sqrt(Math.pow(f1.topLeft[0] - f2.topLeft[0], 2) + Math.pow(f1.topLeft[1] - f2.topLeft[1], 2))
                if (distance < 20) {
                    ok = false
                }
            }
        }
    }
    if (ok) {
        alert('todos estão em distancias seguras!')
    } else {
        alert('pessoal, o covid matou muitos, existem alguns que estão muito próximos')
    }
}
lookForSafeDistance()