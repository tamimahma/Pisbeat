// =====================================
// PISBEAT FLOW JOURNAL
// =====================================

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

const image = document.getElementById("outlineImage");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");

const brushBtn = document.getElementById("brushModeBtn");
const eraserBtn = document.getElementById("eraserBtn");

const undoBtn = document.getElementById("undoBtn");
const resetBtn = document.getElementById("resetBtn");

const downloadBtn = document.getElementById("downloadBtn");
const saveBtn = document.getElementById("saveBtn");

const analysisResult =
document.getElementById("analysisResult");

const statusMessage =
document.getElementById("statusMessage");

let drawing = false;

let currentColor = "#ff66cc";

let currentTool = "brush";

let history = [];
function resizeCanvas() {

    canvas.width = image.clientWidth;
    canvas.height = image.clientHeight;

}

image.onload = () => {

    resizeCanvas();

};

window.addEventListener(
    "resize",
    resizeCanvas
);
document
.querySelectorAll(".color")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            currentColor =
            button.dataset.color;

            colorPicker.value =
            currentColor;

        }
    );

});

colorPicker.addEventListener(
    "input",
    e => {

        currentColor =
        e.target.value;

    }
);
brushBtn.addEventListener(
    "click",
    () => {

        currentTool = "brush";

    }
);

eraserBtn.addEventListener(
    "click",
    () => {

        currentTool = "eraser";

    }
);

canvas.addEventListener(
    "mousedown",
    startDrawing
);

canvas.addEventListener(
    "mousemove",
    draw
);

canvas.addEventListener(
    "mouseup",
    stopDrawing
);

canvas.addEventListener(
    "mouseleave",
    stopDrawing
);

function startDrawing(e){

    saveHistory();

    drawing = true;

    ctx.beginPath();

    ctx.moveTo(
        e.offsetX,
        e.offsetY
    );

}

function draw(e){

    if(!drawing) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineWidth =
    brushSize.value;

    ctx.strokeStyle =
    currentTool === "eraser"
    ? "#ffffff"
    : currentColor;

    ctx.lineTo(
        e.offsetX,
        e.offsetY
    );

    ctx.stroke();

}

function stopDrawing(){

    drawing = false;

}
function saveHistory(){

    history.push(
        canvas.toDataURL()
    );

    if(history.length > 20){

        history.shift();

    }

}

undoBtn.addEventListener(
    "click",
    () => {

        if(history.length === 0)
        return;

        const previous =
        history.pop();

        const img =
        new Image();

        img.onload = () => {

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.drawImage(
                img,
                0,
                0
            );

        };

        img.src = previous;

    }
);

resetBtn.addEventListener(
    "click",
    () => {

        saveHistory();

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }
);
downloadBtn.addEventListener(
    "click",
    () => {

        const exportCanvas =
        document.createElement(
            "canvas"
        );

        exportCanvas.width =
        image.naturalWidth;

        exportCanvas.height =
        image.naturalHeight;

        const exportCtx =
        exportCanvas.getContext(
            "2d"
        );

        exportCtx.drawImage(
            image,
            0,
            0,
            exportCanvas.width,
            exportCanvas.height
        );

        exportCtx.drawImage(
            canvas,
            0,
            0,
            exportCanvas.width,
            exportCanvas.height
        );

        const link =
        document.createElement("a");

        link.download =
        "pisbeat-artwork.png";

        link.href =
        exportCanvas.toDataURL(
            "image/png"
        );

        link.click();

    }
);
function generateColorStory(){

    let story =
    "Your artwork reflects creativity and self-expression.";

    if(currentColor.includes("ff")){

        story =
        "You seem expressive, energetic, and emotionally open today.";
    }

    analysisResult.innerHTML =
    story;

    return story;

}
saveBtn.addEventListener(
    "click",
    async () => {

        statusMessage.innerHTML =
        "Saving...";

        const flow =
        document.querySelector(
            'input[name="flowRating"]:checked'
        );

        const data = {

            name:
            document.getElementById("name").value,

            email:
            document.getElementById("email").value,

            ageGroup:
            document.getElementById("ageGroup").value,

            status:
            document.getElementById("status").value,

            artworkTitle:
            document.getElementById("artworkTitle").value,

            mood:
            document.getElementById("mood").value,

            flowRating:
            flow ? flow.value : "",

            dominantColor:
            currentColor,

            colorAnalysis:
            generateColorStory(),

            reflectionAnswer:
            document.getElementById("reflectionAnswer").value,

            gratitude:
            document.getElementById("gratitude").value,

            diary:
            document.getElementById("diary").value,

            consent:
            document.getElementById("consent").checked

        };

        try{

            const response =
            await fetch(
                APPS_SCRIPT_URL,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(data)
                }
            );

            const result =
            await response.json();

            if(result.success){

                statusMessage.innerHTML =
                "✅ Flow saved successfully!";

            }else{

                statusMessage.innerHTML =
                "❌ Failed to save.";

            }

        }catch(error){

            statusMessage.innerHTML =
            "❌ Connection error.";

            console.error(error);

        }

    }
);
