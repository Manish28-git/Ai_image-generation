const key = "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"; 
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const GenBtn = document.getElementById("btn");

async function query(data) {
    try {
        console.log("Sending request to API with prompt:", data);

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: data })
            }
        );

        console.log("Received response, Status Code:", response.status);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorMessage}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            console.error("API Error:", result);
            throw new Error(result.error || "Unexpected API response format");
        }

        const result = await response.blob();
        console.log("Image blob received successfully.");
        return result;
    } catch (error) {
        console.error("Error in API request:", error);
        alert(`Failed to generate image: ${error.message}`);
    }
}

async function generate() {
    const inputValue = inputText.value.trim();
    
    if (inputValue === "") {
        alert("Please enter some text before generating an image.");
        return;
    }

    try {
        console.log("Generating image for:", inputValue);

        // Show loading state
        image.src = "";
        image.alt = "Generating...";
        GenBtn.textContent = "Generating...";
        GenBtn.disabled = true;

        const response = await query(inputValue);
        if (response) {
            const objectUrl = URL.createObjectURL(response);
            image.src = objectUrl;
            image.alt = "Generated image";
            console.log("Image updated in the DOM.");
        } else {
            image.alt = "Image generation failed.";
        }
    } catch (error) {
        console.error("Error generating image:", error);
    } finally {
        // Reset button after API call completes
        GenBtn.textContent = "Generate Image";
        GenBtn.disabled = false;
    }
}

// Event listener for button click
GenBtn.addEventListener("click", generate);
