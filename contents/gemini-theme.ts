import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["https://gemini.google.com/*"]
}

function injectStyles() {
  if (document.getElementById("r-style")) return

  const style = document.createElement("style")
  style.id = "r-style"
  style.textContent = `
    .r-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(
        90deg,
        #4285f4,
        #ea4335,
        #fbbc05,
        #34a853
      );
      background-size: 200% 200%;
      animation: r-shift 2s linear infinite;
      z-index: 2147483647 !important;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s ease, visibility 0.4s;
      pointer-events: none;
    }

    .r-bar.thinking {
      opacity: 1 !important;
      visibility: visible !important;
    }

    @keyframes r-shift {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    .r-effect {
      border: 2px solid transparent !important;
      background-image:
        linear-gradient(var(--pds-surface-container-lowest, #1e1e1e), var(--pds-surface-container-lowest, #1e1e1e)),
        linear-gradient(90deg, #4285f4, #ea4335, #fbbc05, #34a853) !important;
      background-origin: border-box !important;
      background-clip: padding-box, border-box !important;
      box-shadow: 0 0 20px rgba(66,133,244,0.45) !important;
      transition: all 0.3s ease;
      border-radius: 32px !important;
    }

    [contenteditable="true"] {
      caret-color: #4285F4 !important; 
      caret-shape: bar !important; 
    }
  `
  document.head.appendChild(style)
}

function injectTopBar() {
  if (document.querySelector(".r-bar")) return
  const bar = document.createElement("div")
  bar.className = "r-bar"
  document.body.appendChild(bar)
}

function setupTextboxEffect() {
  const observer = new MutationObserver(() => {
    const stopBtn = document.querySelector('button[aria-label*="Stop"], [aria-label*="Interrupt"]')
    const isThinking = !!stopBtn

    const bar = document.querySelector(".r-bar") as HTMLElement
    if (bar) {
      if (isThinking) {
        bar.classList.add("thinking")
      } else {
        bar.classList.remove("thinking")
      }
    }

    const box = document.querySelector('[contenteditable="true"]') as HTMLElement | null
    if (!box) return

    const triggerR = () => {
      const dialogueBox = box.closest(".input-area-container") as HTMLElement || box.parentElement
      if (dialogueBox) {
        dialogueBox.classList.add("r-effect")
        setTimeout(() => {
          dialogueBox.classList.remove("r-effect")
        }, 2500)
      }
    }

    if (!(box as any).__rListener) {
      box.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) triggerR()
      })
        ; (box as any).__rListener = true
    }

    const sendBtn = document.querySelector('button[aria-label*="Send"], button[aria-label*="Submit"]') as HTMLElement | null
    if (sendBtn && !(sendBtn as any).__rBtn) {
      sendBtn.addEventListener("click", triggerR)
        ; (sendBtn as any).__rBtn = true
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

const storage = new Storage()

async function init() {
  const isEnabled = await storage.get("theme-enabled")
  if (String(isEnabled) !== "false") {
    injectStyles()
    injectTopBar()
    setupTextboxEffect()
  }
}

storage.watch({
  "theme-enabled": () => location.reload()
})

init()