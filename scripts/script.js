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
            <span class="file-size">(${(file.size / 1024).toFixed(1)} KB)</span>
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
 

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
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

        const jsonData = {
            access_key: "3b1b7519-e6d0-4211-b899-64097a6f0ab0",
            subject: "New Job Application - Hot Beans Development",
            first_name: form.querySelector('[name="first_name"]').value,
            last_name: form.querySelector('[name="last_name"]').value,
            email: form.querySelector('[name="email"]').value,
            phone: form.querySelector('[name="phone"]').value,
            job: form.querySelector('[name="job"]').value,
            skill: form.querySelector('[name="skill"]').value,
            message: form.querySelector('[name="message"]').value,
        };
 

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileSizeMB = file.size / 1024 / 1024;
 

            if (fileSizeMB > 5) {
                throw new Error("CV file is too large. Please upload a file under 5MB.");
            }
 
            submitBtn.textContent = "Processing CV...";
            const base64 = await fileToBase64(file);
 

            jsonData.cv_filename = file.name;
            jsonData.cv_file_size = (fileSizeMB).toFixed(2) + " MB";
            jsonData.cv_data = base64; 
        } else {
            jsonData.cv_filename = "No CV uploaded";
        }
 
        submitBtn.textContent = "Sending...";
 

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(jsonData)
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