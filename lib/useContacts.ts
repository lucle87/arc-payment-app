"use client";

import { useCallback, useEffect, useState } from "react";

export type Contact = { id: string; name: string; address: string };

const KEY = "arc_contacts";

function read(): Contact[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function write(list: Contact[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return String(Date.now()) + Math.random().toString(16).slice(2);
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    setContacts(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setContacts(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Contact[]) => {
    setContacts(next);
    write(next);
  }, []);

  const add = useCallback(
    (name: string, address: string) => persist([...read(), { id: newId(), name, address }]),
    [persist]
  );

  const update = useCallback(
    (id: string, name: string, address: string) =>
      persist(read().map((c) => (c.id === id ? { ...c, name, address } : c))),
    [persist]
  );

  const remove = useCallback(
    (id: string) => persist(read().filter((c) => c.id !== id)),
    [persist]
  );

  const resolveByName = useCallback(
    (name: string) =>
      contacts.find((c) => c.name.toLowerCase() === name.trim().toLowerCase()),
    [contacts]
  );

  const nameByAddress = useCallback(
    (addr: string) =>
      contacts.find((c) => c.address.toLowerCase() === addr.toLowerCase())?.name,
    [contacts]
  );

  return { contacts, add, update, remove, resolveByName, nameByAddress };
}
