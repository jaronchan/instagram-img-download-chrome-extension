// Update the relevant fields with the new data.
const setDOMInfo = (info) => {
  document.getElementById("title").textContent = info.profile + "'s profile";
  document.getElementById("total").textContent = info.total;
  document.getElementById("photos").textContent = info.photos.length;
  document.getElementById("profile").textContent = info.profile;

  var wrapper = document.getElementById("photo-grid");

  //   for (i = 0; i < Math.ceil(info.photos.length / 3); i++) {
  //     table.insertRow(-1);
  //   }

  info.photos.forEach((element) => {
    var node = document.createElement("img");
    node.src = element + "media?size=l";
    wrapper.appendChild(node);
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
});
