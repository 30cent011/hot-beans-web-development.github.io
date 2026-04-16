document.addEventListener('DOMContentLoaded', function () {
    let selectedFiles = [];
    const fileUploadInput = document.getElementById('file-upload');
    const previewArea = document.getElementById('upload-preview');
    const formWrapper = document.querySelector(".form-wrapper");
    const result = document.getElementById('result');

 
    if (fileUploadInput) {
        fileUploadInput.addEventListener('change', (e) => {
            selectedFiles = Array.from(e.target.files);
            updateUploadPreview();
        });
    }

    
    function updateUploadPreview() {
        if (!previewArea) return;

        previewArea.innerHTML = selectedFiles
            .map((file, index) => `
                <div class="upload-item">
                    <span>${sanitizeHTML(file.name)}</span>
                    <button class="remove-file" data-index="${index}">✖</button>
                </div>
            `)
            .join('');
    }

    if (previewArea) {
        previewArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-file')) {
                const index = parseInt(e.target.dataset.index);
                selectedFiles.splice(index, 1);
                updateUploadPreview();
            }
        });
    }

   
    function sanitizeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

   
    if (formWrapper) {
        formWrapper.addEventListener("submit", (e) => {
            e.preventDefault();

            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            if (result) result.style.display = "none";

            fetch("https://formsubmit.co/ajax/30cent0@proton.me", {
                method: "POST",
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === "true" || data.success === true) {
                    form.reset();
                    selectedFiles = [];
                    updateUploadPreview();
                    window.location.href = "success.html";
                } else {
                    showError(`Submission failed: ${data.message || "Please try again."}`);
                }
            })
            .catch(() => {
                showError("There was an error sending your application. Please try again.");
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                if (result) setTimeout(() => { result.style.display = "none"; }, 6000);
            });
        });
    }

    
    function showError(message) {
        if (result) {
            result.innerHTML = message;
            result.style.color = "red";
            result.style.display = "block";
        }
    }
});