(() => {
  const BTN_CLASS = "ytp-miniplayer-button";

  function createSvgIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const check_ytp_r = document.querySelector(".ytp-right-controls-right");
    svg.setAttribute("version", "1.1");
    if (check_ytp_r) {
      svg.setAttribute("height", "32");
      svg.setAttribute("width", "32");
      svg.setAttribute("viewBox", "0 0 32 32");
      svg.style.transform = "scale(1.2)";
    } else {
      svg.setAttribute("height", "100%");
      svg.setAttribute("width", "100%");
      svg.setAttribute("viewBox", "0 0 65 65");
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z"
    );
    path.setAttribute("fill", "#fff");

    svg.appendChild(path);
    return svg;
  }

  function inject() {
    let controls = null;
    const check_ytp_r = document.querySelector(".ytp-right-controls-right");
    if (check_ytp_r) {
      controls = check_ytp_r;
    } else {
      controls = document.querySelector(".ytp-right-controls");
    }
    if (!controls) return;

    if (controls.querySelector(`.${BTN_CLASS}`)) return;
    document.querySelectorAll(`.${BTN_CLASS}`).forEach((el) => el.remove());

    const btn = document.createElement("button");
    btn.className = `ytp-button ${BTN_CLASS}`;
    btn.title = "Mini player";
    btn.setAttribute("aria-label", "Mini player");
    btn.draggable = false;
    btn.style.cursor = "pointer";
    btn.style.background = "transparent";

    if (check_ytp_r) {
      btn.style.display = "flex";
      btn.style.justifyContent = "center";
      btn.style.alignItems = "center";
    }

    const svg = createSvgIcon();
    btn.appendChild(svg);

    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        // Check if context menu exists
        const contextMenu = document.querySelector(
          ".ytp-popup.ytp-contextmenu"
        );

        if (!contextMenu) {
          // Context menu doesn't exist, simulate right click and escape
          const videoElement = document.querySelector(
            ".video-stream.html5-main-video"
          );
          if (videoElement) {
            // Simulate right click on video element
            const rightClickEvent = new MouseEvent("contextmenu", {
              bubbles: true,
              cancelable: true,
              view: window,
              button: 2,
              buttons: 2,
              clientX:
                videoElement.getBoundingClientRect().left +
                videoElement.getBoundingClientRect().width / 2,
              clientY:
                videoElement.getBoundingClientRect().top +
                videoElement.getBoundingClientRect().height / 2,
            });
            videoElement.dispatchEvent(rightClickEvent);

            // Eager interval to watch for context menu and hide it immediately
            let contextMenuWatcher = setInterval(() => {
              const contextMenu = document.querySelector(
                ".ytp-popup.ytp-contextmenu"
              );
              if (contextMenu) {
                // Hide the context menu immediately
                contextMenu.style.display = "none";
                clearInterval(contextMenuWatcher);

                // Simulate escape key to ensure proper cleanup
                const escapeEvent = new KeyboardEvent("keydown", {
                  key: "Escape",
                  code: "Escape",
                  keyCode: 27,
                  which: 27,
                  bubbles: true,
                  cancelable: true,
                });
                document.dispatchEvent(escapeEvent);

                // Now try to click the miniplayer menu item
                setTimeout(() => {
                  const mini_btn = Array.from(
                    document.querySelectorAll(".ytp-menuitem")
                  ).find((e) => e.textContent.trim() === "Miniplayer");
                  if (mini_btn) {
                    mini_btn.click();
                    console.log(
                      "🎯 MiniPlayer triggered after context menu simulation"
                    );
                  } else {
                    console.log("MiniPlayer menu item not found");
                  }
                }, 100);
              }
            }, 10); // Check every 10ms for quick response

            // Safety timeout to clear interval if context menu doesn't appear
            setTimeout(() => {
              clearInterval(contextMenuWatcher);
            }, 1000);
          } else {
            console.warn(
              "⚠️ Video element not found for context menu simulation"
            );
          }
        } else {
          // Context menu exists, directly click the miniplayer menu item
          document.querySelectorAll(".ytp-menuitem")[1]?.click();
          console.log("🎯 MiniPlayer triggered");
        }
      } catch (err) {
        console.error("❌ MiniPlayer trigger failed", err);
      }
    };

    // Insert as the 4th last child
    const children = controls.children;
    const insertBeforeIndex = Math.max(children.length - 4, 0);
    controls.insertBefore(btn, children[insertBeforeIndex] || null);

    console.log("✅ MiniPlayer button injected");
  }

  function start() {
    inject();
    setInterval(inject, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
