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
 
document.querySelector(".form-wrapper").addEventListener("submit", function(e) {
    e.preventDefault();
 
    const form = e.target;
    const formData = new FormData(form);
    formData.append("access_key", "3b1b7519-e6d0-4211-b899-64097a6f0ab0");
 
    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    })
    .then(() => {
        window.open("success.html", "SubmissionPopup", "width=500,height=400");
        form.reset();
        selectedFiles = [];
        updateUploadPreview();
    })
    .catch(() => {
        alert("There was an error sending your application.");
    });
});
 