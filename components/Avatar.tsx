"use client";

import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

export default function Avatar({
  address,
  size = 36,
}: {
  address?: string;
  size?: number;
}) {
  if (!address) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: 9999, background: "#27272a" }}
      />
    );
  }
  return <Jazzicon diameter={size} seed={jsNumberForAddress(address)} />;
}
