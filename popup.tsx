import { useStorage } from "@plasmohq/storage/hook"

import "./popup.css"

function Popup() {
  const [enabled, setEnabled] = useStorage<boolean>("theme-enabled", true)

  return (
    <div className="popup-container">
      <h1 className="title">Google AI Theme</h1>

      <div className="toggle-row">
        <span className="toggle-label">Enable Theme</span>

        <label className="switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  )
}

export default Popup
