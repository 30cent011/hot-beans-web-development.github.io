let selectedFiles = [];
 
document.getElementById('file-upload').addEventListener('change', function() {
    const preview = document.getElementById('upload-preview');
    if (this.files.length > 0) {
        preview.textContent = '📎 ' + this.files[0].name;
    } else {
        preview.textContent = '';
    }
});
 
document.querySelector(".form-wrapper").addEventListener("submit", function(e) {
    e.preventDefault();
 
    const form = e.target;
    const formData = new FormData(form);
 
    fetch("https://formsubmit.co/joebrawl129@gmail.com", {
        method: "POST",
        body: formData
    })
    .then(() => {
        window.open("success.html", "SubmissionPopup", "width=500,height=400");
        form.reset();
        document.getElementById('upload-preview').textContent = '';
    })
    .catch(() => {
        alert("Error submitting application.");
    });
});
 