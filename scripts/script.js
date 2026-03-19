let selectedFiles = [];

document.getElementById('file-upload').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...files];
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