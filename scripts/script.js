let selectedFiles = [];
 
document.getElementById('file-upload').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    selectedFiles = [...files];
    updateUploadPreview();
});
 
function updateUploadPreview() {
    const previewArea = document.getElementById('upload-preview');
 
    previewArea.innerHTML = selectedFiles.map((file, index) => `
        <div class="upload-item">
            <span>${sanitizeHTML(file.name)}</span>
            <button class="remove-file" onclick="removeFile(${index})">✖</button>
        </div>
    `).join('');
}
 
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateUploadPreview();
}
 
function sanitizeHTML(text) {
    let div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
 
const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "3b1b7519-e6d0-4211-b899-64097a6f0ab0");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});