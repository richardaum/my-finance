import { useState } from "react";

export function useFocus() {
  const [isFocused, setIsFocused] = useState(false);

  return {
    isFocused,
    props: {
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    },
  };
}
