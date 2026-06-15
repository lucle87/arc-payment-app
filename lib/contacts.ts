// Contacts now live per-browser in localStorage (see lib/useContacts.ts).
// These server-side stubs stay so existing imports don't break; they return nothing.
export type Contact = { name: string; address: `0x${string}` };

export const contacts: Contact[] = [];

export function resolveContact(name: string): Contact | undefined {
  const q = name.trim().toLowerCase();
  return contacts.find((c) => c.name.toLowerCase() === q);
}

export function contactName(address: string): string | undefined {
  const a = address.toLowerCase();
  return contacts.find((c) => c.address.toLowerCase() === a)?.name;
}
