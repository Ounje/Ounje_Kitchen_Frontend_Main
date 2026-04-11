/** Diagonal "OUNJEFOOD" watermark rendered inside a modal */
export function ModalWatermark() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{ opacity: 0.07 }}
    >
      {[...Array(8)].map((_, row) => (
        <div
          key={row}
          className="absolute flex gap-10 whitespace-nowrap"
          style={{
            transform: 'rotate(-30deg)',
            top: `${row * 80 - 40}px`,
            left: '-60px',
          }}
        >
          {[...Array(6)].map((_, col) => (
            <span
              key={col}
              className="text-xl font-black tracking-widest text-[#1A3F1C] dark:text-primary"
            >
              OUNJEFOOD
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}