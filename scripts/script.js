let selectedFiles = [];
 
// File upload preview
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
 

async function uploadCV(file) {
    const formData = new FormData();
    formData.append("file", file);
 
    const response = await fetch("https://file.io/?expires=7d", {
        method: "POST",
        body: formData
    });
 
    const data = await response.json();
 
    if (data.success) {
        return data.link; 
    } else {
        throw new Error("CV upload failed: " + data.message);
    }
}
 

const form = document.querySelector('.form-wrapper');
const submitBtn = form.querySelector('button[type="submit"]');
const result = document.getElementById('result');
 
form.addEventListener('submit', async function(e) {
    e.preventDefault();
 
    const fileInput = document.getElementById('file-upload');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    result.style.display = "none";
 
    try {
        const formData = new FormData(form);
 
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
 

            const fileSizeMB = file.size / 1024 / 1024;
            if (fileSizeMB > 100) {
                throw new Error("File too large. Please upload a CV under 100MB.");
            }
 
            submitBtn.textContent = "Uploading CV...";
            const cvLink = await uploadCV(file);
 
        
            formData.delete("cv");
            formData.append("cv_download_link", cvLink);
        }
 
   
        submitBtn.textContent = "Sending...";
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
 
        const data = await response.json();
 
        if (response.ok) {
            result.innerHTML = "Application sent successfully!";
            result.style.color = "green";
            result.style.display = "block";
            window.open("success.html", "SubmissionPopup", "width=500,height=400");
            form.reset();
            selectedFiles = [];
            updateUploadPreview();
        } else {
            throw new Error(data.message);
        }
 
    } catch (error) {
        result.innerHTML = "Error: " + error.message;
        result.style.color = "red";
        result.style.display = "block";
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        setTimeout(() => {
            result.style.display = "none";
        }, 6000);
    }
});
 