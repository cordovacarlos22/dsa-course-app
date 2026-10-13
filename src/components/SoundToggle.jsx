import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isSoundOn, playSound, setSoundOn } from '../lib/sounds'

// 🔊 / 🔇 in the header: turns the celebration sounds on or off.
function SoundToggle() {
  const { t } = useTranslation()
  const [isOn, setIsOn] = useState(isSoundOn)

  function toggle() {
    const turnOn = !isOn
    setSoundOn(turnOn)
    setIsOn(turnOn)
    // A short "ding" shows the sound works. It also switches the audio on
    // in Safari, because it happens during a click.
    if (turnOn) playSound('step')
  }

  return (
    // after:-inset-2.5 makes the tap area about 48 px tall without making the
    // button look bigger.
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isOn}
      aria-label={t('sound.label')}
      title={t(isOn ? 'sound.turnOff' : 'sound.turnOn')}
      className="relative rounded-full border border-slate-300 px-2.5 py-1 text-sm transition-colors after:absolute after:-inset-2.5 hover:border-brand"
    >
      <span aria-hidden="true">{isOn ? '🔊' : '🔇'}</span>
    </button>
  )
}

export default SoundToggle
