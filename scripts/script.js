document.addEventListener('DOMContentLoaded', function () {

    let selectedFiles = [];
    
    const fileUploadInput = document.getElementById('file-upload');
    if (fileUploadInput) {
        fileUploadInput.addEventListener('change', function (e) {
            const files = Array.from(e.target.files);
            selectedFiles = [...files];
            updateUploadPreview();
        });
    }

    function updateUploadPreview() {
        const previewArea = document.getElementById('upload-preview');
        if (!previewArea) return;

        previewArea.innerHTML = selectedFiles.map((file, index) => `
            <div class="upload-item">
                <span>${sanitizeHTML(file.name)}</span>
                <button class="remove-file" onclick="removeFile(${index})">✖</button>
            </div>
        `).join('');
    }

    window.removeFile = function (index) {
        selectedFiles.splice(index, 1);
        updateUploadPreview();
    };

    function sanitizeHTML(text) {
        let div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

 
    const formWrapper = document.querySelector(".form-wrapper");
    if (formWrapper) {
        formWrapper.addEventListener("submit", function (e) {
            e.preventDefault();

            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const result = document.getElementById('result');

            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            if (result) result.style.display = "none";

            const formData = new FormData(form);

            fetch("https://formsubmit.co/ajax/30cent0@proton.me", {
                method: "POST",
                body: formData,
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
                    if (result) {
                        result.innerHTML = "Submission failed: " + (data.message || "Please try again.");
                        result.style.color = "red";
                        result.style.display = "block";
                    }
                }
            })
            .catch(() => {
                if (result) {
                    result.innerHTML = "There was an error sending your application. Please try again.";
                    result.style.color = "red";
                    result.style.display = "block";
                }
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                setTimeout(() => {
                    if (result) result.style.display = "none";
                }, 6000);
            });
        });
    }

});