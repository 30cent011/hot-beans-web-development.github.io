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
    const submitBtn = form.querySelector('button[type="submit"]');
    const result = document.getElementById('result');
 
   
    const fileInput = document.getElementById('file-upload');
    if (fileInput.files.length > 0) {
        const fileSizeMB = fileInput.files[0].size / 1024 / 1024;
        if (fileSizeMB > 10) {
            result.innerHTML = "File too large. Please upload a CV under 10MB.";
            result.style.color = "red";
            result.style.display = "block";
            return;
        }
    }
 
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    result.style.display = "none";
 
    const formData = new FormData(form);
 

    fetch("https://formsubmit.co/ajax/30cent0@proton.me", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === "true" || data.success === true) {
            window.open("success.html", "SubmissionPopup", "width=500,height=400");
            form.reset();
            selectedFiles = [];
            updateUploadPreview();
            result.innerHTML = "Application submitted successfully!";
            result.style.color = "green";
            result.style.display = "block";
        } else {
            result.innerHTML = "Submission failed: " + (data.message || "Please try again.");
            result.style.color = "red";
            result.style.display = "block";
        }
    })
    .catch(() => {
        result.innerHTML = "There was an error sending your application. Please try again.";
        result.style.color = "red";
        result.style.display = "block";
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        setTimeout(() => {
            result.style.display = "none";
        }, 6000);
    });
});