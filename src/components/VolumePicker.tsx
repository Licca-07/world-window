type VolumePickerProps = {
  value: number
  onChange: (value: number) => void
}

export function VolumePicker({ value, onChange }: VolumePickerProps) {
  const percent = Math.round(value * 100)

  return (
    <div className="volume-picker">
      <p className="volume-label">Volume</p>
      <label className="volume-slider">
        <span className="sr-only">Music volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${percent}%`}
        />
      </label>
      <span className="volume-percent" aria-hidden>
        {percent}%
      </span>
    </div>
  )
}
