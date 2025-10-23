import { useEffect, useMemo, useRef, useState } from 'react';

function formatPercentFromBasisPoints(bps) {
  const value = Number(bps || 0) / 100; // 1 bps = 0.01%
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + '%';
}

function parseToBasisPoints(input) {
  if (input == null) return 0;
  const onlyDigits = String(input).replace(/\D/g, '');
  if (!onlyDigits) return 0;
  return Number(onlyDigits);
}

export default function PercentInput({
  value, // number in percent units (e.g., 2.5 for 2.5%) or string
  onValueChange, // (number) => void, in percent units
  placeholder = '0,00%',
  name,
  id,
  className,
  disabled,
  autoFocus,
}) {
  const initialBps = useMemo(() => {
    if (typeof value === 'number' && !isNaN(value)) {
      return Math.round(value * 100); // percent -> bps
    }
    if (typeof value === 'string') {
      return parseToBasisPoints(value);
    }
    return 0;
  }, [value]);

  const [bps, setBps] = useState(initialBps);
  const inputRef = useRef(null);
  const [forceCaretToEnd, setForceCaretToEnd] = useState(false);

  useEffect(() => {
    setBps(initialBps);
  }, [initialBps]);

  const display = formatPercentFromBasisPoints(bps);

  const handleChange = (e) => {
    const nextBps = parseToBasisPoints(e.target.value);
    setBps(nextBps);
    if (onValueChange) {
      onValueChange(Number((nextBps / 100).toFixed(2))); // back to percent units
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Backspace' && e.key !== 'Delete') return;
    const el = e.currentTarget;
    const caretPos = el.selectionStart;
    const selectionEnd = el.selectionEnd;

    // If caret is at the very end (after '%') and user hits Backspace,
    // remove the last digit instead of trying to delete '%'.
    if (e.key === 'Backspace' && caretPos === selectionEnd && caretPos === String(display).length) {
      e.preventDefault();
      const nextBps = Math.floor(bps / 10);
      setBps(nextBps);
      if (onValueChange) {
        onValueChange(Number((nextBps / 100).toFixed(2)));
      }
      setForceCaretToEnd(true);
      return;
    }

    // If selection includes the '%' at the end, normalize behavior by preventing
    // deletion of '%' and acting as if only digits are selected.
    if (selectionEnd === String(display).length && selectionEnd !== caretPos) {
      // If selection reaches '%', trim selection to before '%'
      if (e.key === 'Backspace') {
        // let normal change occur; input value will be rebuilt from digits
        // No special handling needed beyond preventing removing '%'
        // We allow default because our change handler rebuilds the value anyway
      }
    }
  };

  useEffect(() => {
    if (forceCaretToEnd && inputRef.current) {
      const el = inputRef.current;
      const end = String(formatPercentFromBasisPoints(bps)).length;
      // Using requestAnimationFrame to ensure caret after value update
      requestAnimationFrame(() => {
        try {
          el.setSelectionRange(end, end);
        } catch {}
        setForceCaretToEnd(false);
      });
    }
  }, [forceCaretToEnd, bps]);

  const handleBlur = () => {
    if (onValueChange) {
      onValueChange(Number((bps / 100).toFixed(2)));
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      name={name}
      id={id}
      value={display}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      autoFocus={autoFocus}
      ref={inputRef}
    />
  );
}


