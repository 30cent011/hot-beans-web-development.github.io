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

const form = document.querySelector('.form-wrapper');
const submitBtn = form.querySelector('button[type="submit"]');
const result = document.getElementById('result');
 
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('file-upload');
    if (fileInput.files.length > 0) {
        const filesize = fileInput.files[0].size / 1024 / 1024;
        if (filesize > 5) {
            result.innerHTML = "File too large. Please upload a CV under 5MB.";
            result.style.color = "red";
            result.style.display = "block";
            return;
        }
    }
 
    const formData = new FormData(form);
 
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    result.style.display = "none";
 

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            result.innerHTML = json.message;
            result.style.color = "green";
            result.style.display = "block";
            window.open("success.html", "SubmissionPopup", "width=500,height=400");
            form.reset();
            selectedFiles = [];
            updateUploadPreview();
        } else {
            result.innerHTML = json.message;
            result.style.color = "red";
            result.style.display = "block";
        }
    })
    .catch(error => {
        console.log(error);
        result.innerHTML = "Something went wrong. Please try again.";
        result.style.color = "red";
        result.style.display = "block";
    })
    .then(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        setTimeout(() => {
            result.style.display = "none";
        }, 5000);
    });
});