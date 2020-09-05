// Inform the background page that
// this tab is initialized.
chrome.runtime.sendMessage({
  from: "content",
  subject: "init",
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if (msg.from === "popup" && msg.subject === "DOMInfo") {
    // Collect the necessary data.
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)

    var photoSquares = document.querySelectorAll(".v1Nh3.kIKUG._bz0w");
    var photoLinks = [];

    photoSquares.forEach((element) =>
      photoLinks.push(element.querySelector("a").href)
    );

    var domInfo = {
      total: document.querySelector(".g47SY").textContent,
      photos: photoLinks,
      profile: /.com\/([^']*)\//.exec(location.href)[1],
    };

    // Directly respond to the sender (popup),
    // through the specified callback.
    response(domInfo);
  }
});
