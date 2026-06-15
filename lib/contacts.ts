export type Contact = {
  name: string;
  address: `0x${string}`;
};

/**
 * Single source of truth for contacts (was previously duplicated in 4 places).
 *
 * NOTE: Bob and Charlie below are placeholder addresses. Replace them with real
 * Arc testnet addresses before sending — a transfer to a placeholder address
 * succeeds on-chain but the funds are effectively unrecoverable.
 */
export const contacts: Contact[] = [
  { name: "Alice", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
  { name: "Bob", address: "0x1234567890123456789012345678901234567890" },
  { name: "Charlie", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" },
];

/** Resolve a contact by name, case-insensitively ("alice" === "Alice"). */
export function resolveContact(name: string): Contact | undefined {
  const q = name.trim().toLowerCase();
  return contacts.find((c) => c.name.toLowerCase() === q);
}

/** Reverse-lookup: get a contact's display name from an address. */
export function contactName(address: string): string | undefined {
  const a = address.toLowerCase();
  return contacts.find((c) => c.address.toLowerCase() === a)?.name;
}
