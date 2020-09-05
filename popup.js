// Update the relevant fields with the new data.

var downloadLinks = [];

const setDOMInfo = (info) => {
  document.getElementById("title").textContent = info.profile + "'s profile";
  document.getElementById("total").textContent = info.total;
  document.getElementById("photos").textContent = info.photos.length;
  document.getElementById("profile").textContent = info.profile;

  var wrapper = document.getElementById("photo-grid");

  downloadLinks = [];

  //   for (i = 0; i < Math.ceil(info.photos.length / 3); i++) {
  //     table.insertRow(-1);
  //   }

  info.photos.forEach((element) => {
    var id = /p\/([^']*)\//.exec(element)[1];

    var src = element + "media?size=l";
    downloadLinks.push(src);

    var anchor = document.createElement("a");

    anchor.id = id;
    anchor.href = src;
    anchor.download = "image";
    var img = document.createElement("img");
    img.classList.add("dl");
    img.src = src;

    toDataURL(img.src, function (dataURL) {
      img.src = dataURL;
      //   console.log(img.src);

      // now just to show that passing to a canvas doesn't hold the same results
      //   var canvas = document.createElement("canvas");
      //   canvas.width = img.naturalWidth;
      //   canvas.height = img.naturalHeight;
      //   canvas.getContext("2d").drawImage(img, 0, 0);

      //   console.log(canvas.toDataURL() === dataURL); // false - not same data
    });

    anchor.appendChild(img);
    wrapper.appendChild(anchor);
  });
};

// Once the DOM is ready...
window.addEventListener("DOMContentLoaded", () => {
  // ...query for the active tab...
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: "popup", subject: "DOMInfo" },
        // ...also specifying a callback to be called
        //    from the receiving end (content script).
        setDOMInfo
      );
    }
  );

  document.getElementById("dl_all").addEventListener("click", download_all);
});

function download(data) {
  const a = document.createElement("a");
  a.href = "data:application/zip;base64," + data;
  a.setAttribute("download", "imgs.zip");
  a.style.display = "none";
  a.addEventListener("click", (e) => e.stopPropagation()); // not relevant for modern browsers
  document.body.appendChild(a);
  setTimeout(() => {
    // setTimeout - not relevant for modern browsers
    a.click();
    document.body.removeChild(a);
  }, 0);
}

function download_all() {
  var zip = new JSZip();
  [...document.getElementsByClassName("dl")].forEach((img, i) =>
    zip.file("img" + i + ".jpg", img.src.replace(/data:.*?;base64,/, ""), {
      base64: true,
    })
  );
  zip.generateAsync({ type: "base64" }).then(download);
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var fr = new FileReader();

    fr.onload = function () {
      callback(this.result);
    };

    fr.readAsDataURL(xhr.response); // async call
  };

  xhr.send();
}
