import { useEffect, useMemo, useState } from 'react';

function formatBRLFromCents(cents) {
  const amount = (Number(cents || 0) / 100);
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseToCents(input) {
  if (input == null) return 0;
  const onlyDigits = String(input).replace(/\D/g, '');
  if (!onlyDigits) return 0;
  return Number(onlyDigits);
}

export default function CurrencyInput({
  value, // number in units (e.g., 1234.56) or string
  onValueChange, // (number) => void, in units
  placeholder = 'R$ 0,00',
  name,
  id,
  className,
  disabled,
  autoFocus,
}) {
  const initialCents = useMemo(() => {
    if (typeof value === 'number' && !isNaN(value)) {
      return Math.round(value * 100);
    }
    if (typeof value === 'string') {
      return parseToCents(value);
    }
    return 0;
  }, [value]);

  const [cents, setCents] = useState(initialCents);

  useEffect(() => {
    setCents(initialCents);
  }, [initialCents]);

  const display = formatBRLFromCents(cents);

  const handleChange = (e) => {
    const nextCents = parseToCents(e.target.value);
    setCents(nextCents);
    if (onValueChange) {
      onValueChange(Number((nextCents / 100).toFixed(2)));
    }
  };

  const handleBlur = () => {
    // normalize to two decimals on blur via parent already receiving number
    if (onValueChange) {
      onValueChange(Number((cents / 100).toFixed(2)));
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
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      autoFocus={autoFocus}
    />
  );
}


