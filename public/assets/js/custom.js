$(document).ready(function () {
  var isAdvancedUpload = (function () {
    var div = document.createElement("div");
    return (
      ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
      "FormData" in window &&
      "FileReader" in window
    );
  })();

  let draggableFileArea = document.querySelector(".drag-file-area");
  let browseFileText = document.querySelector(".browse-files");
  let uploadIcon = document.querySelector(".upload-icon");
  let dragDropText = document.querySelector(".dynamic-message");
  let fileInput = document.querySelector(".default-file-input");
  let cannotUploadMessage = document.querySelector(".cannot-upload-message");
  let cancelAlertButton = document.querySelector(".cancel-alert-button");
  let uploadedFile = document.querySelector(".file-block");
  let fileName = document.querySelector(".file-name");
  let fileSize = document.querySelector(".file-size");
  let progressBar = document.querySelector(".progress-bar");
  let removeFileButton = document.querySelector(".remove-file-icon");
  let uploadButton = document.querySelector(".upload-button");
  let fileFlag = 0;

  fileInput.addEventListener("click", () => {
    fileInput.value = "";
    console.log(fileInput.value);
  });

  fileInput.addEventListener("change", (e) => {
    console.log(" > " + fileInput.value);
    uploadIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#000000" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2c1.595 0 3.105.374 4.445 1.04a1 1 0 1 1-.89 1.791 8 8 0 1 0 4.396 6.279 1 1 0 1 1 1.988-.22c.04.365.061.735.061 1.11 0 5.523-4.477 10-10 10S2 17.523 2 12zm19.707-7.707a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L12 12.586l8.293-8.293a1 1 0 0 1 1.414 0z" clip-rule="evenodd" data-original="#000000" class=""></path></g></svg>';
    dragDropText.innerHTML = "File Dropped Successfully!";
    document.querySelector(
      ".label"
    ).innerHTML = `Upload your .CSV file <span class="browse-files"> <input type="file" class="default-file-input" style=""/> <span class="browse-files-text" style="top: 0;"> browse file</span></span>`;
    uploadButton.innerHTML =
      '<img src="images/folder-big.svg" class="img-fluid" alt="">';
    fileName.innerHTML = fileInput.files[0].name;
    fileSize.innerHTML = (fileInput.files[0].size / 1024).toFixed(1) + " KB";
    uploadedFile.style.cssText = "display: block;";
    progressBar.style.width = 0;
    fileFlag = 0;
  });

  uploadButton.addEventListener("click", () => {
    let isFileUploaded = fileInput.value;
    if (isFileUploaded != "") {
      if (fileFlag == 0) {
        fileFlag = 1;
        var width = 0;
        var id = setInterval(frame, 50);
        function frame() {
          if (width >= 390) {
            clearInterval(id);
            uploadButton.innerHTML = `<span class="upload-button-icon"> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#000000" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2c1.595 0 3.105.374 4.445 1.04a1 1 0 1 1-.89 1.791 8 8 0 1 0 4.396 6.279 1 1 0 1 1 1.988-.22c.04.365.061.735.061 1.11 0 5.523-4.477 10-10 10S2 17.523 2 12zm19.707-7.707a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L12 12.586l8.293-8.293a1 1 0 0 1 1.414 0z" clip-rule="evenodd" data-original="#000000" class=""></path></g></svg> </span> Uploaded`;
          } else {
            width += 5;
            progressBar.style.width = width + "px";
          }
        }
      }
    } else {
      cannotUploadMessage.style.cssText =
        "display: flex; animation: fadeIn linear 1.5s;";
    }
  });

  cancelAlertButton.addEventListener("click", () => {
    cannotUploadMessage.style.cssText = "display: none;";
  });

  if (isAdvancedUpload) {
    [
      "drag",
      "dragstart",
      "dragend",
      "dragover",
      "dragenter",
      "dragleave",
      "drop",
    ].forEach((evt) =>
      draggableFileArea.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
      })
    );

    ["dragover", "dragenter"].forEach((evt) => {
      draggableFileArea.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadIcon.innerHTML = "file_download";
        dragDropText.innerHTML = "Drop your file here!";
      });
    });

    draggableFileArea.addEventListener("drop", (e) => {
      uploadIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#000000" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2c1.595 0 3.105.374 4.445 1.04a1 1 0 1 1-.89 1.791 8 8 0 1 0 4.396 6.279 1 1 0 1 1 1.988-.22c.04.365.061.735.061 1.11 0 5.523-4.477 10-10 10S2 17.523 2 12zm19.707-7.707a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L12 12.586l8.293-8.293a1 1 0 0 1 1.414 0z" clip-rule="evenodd" data-original="#000000" class=""></path></g></svg>';
      dragDropText.innerHTML = "File Dropped Successfully!";
      document.querySelector(
        ".label"
      ).innerHTML = `Upload your .CSV file <span class="browse-files"> <input type="file" class="default-file-input" style=""/> <span class="browse-files-text" style="top: -23px; left: -20px;"> browse file</span> </span>`;
      uploadButton.innerHTML =
        '<img src="images/folder-big.svg" class="img-fluid" alt="" />';

      let files = e.dataTransfer.files;
      fileInput.files = files;
      console.log(files[0].name + " " + files[0].size);
      console.log(document.querySelector(".default-file-input").value);
      fileName.innerHTML = files[0].name;
      fileSize.innerHTML = (files[0].size / 1024).toFixed(1) + " KB";
      uploadedFile.style.cssText = "";
      progressBar.style.width = 0;
      fileFlag = 0;
    });
  }

  removeFileButton.addEventListener("click", () => {
    uploadedFile.style.cssText = "display: none;";
    fileInput.value = "";
    uploadIcon.innerHTML = "";
    dragDropText.innerHTML = "Drag & drop";
    document.querySelector(
      ".label"
    ).innerHTML = `<span class="browse-files"> <input type="file" class="default-file-input"/> <span class="d-block upload-file">Upload your .CSV file</span>
								<span class="browse-files-text">browse Now</span> `;
    uploadButton.innerHTML =
      '<img src="images/folder-big.svg" class="img-fluid" alt="" />';
  });
});
