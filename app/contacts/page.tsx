"use client";

import { useState } from "react";
import Link from "next/link";
import { useContacts } from "@/lib/useContacts";
import Avatar from "@/components/Avatar";

const HEX = /^0x[0-9a-fA-F]{40}$/;

export default function ContactsPage() {
  const { contacts, add, update, remove } = useContacts();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");

  function handleAdd() {
    const n = name.trim();
    const a = address.trim();
    if (!n) return setError("Enter a name");
    if (!HEX.test(a)) return setError("Invalid address (must be 0x + 40 hex chars)");
    add(n, a);
    setName("");
    setAddress("");
    setError("");
  }

  function startEdit(id: string, n: string, a: string) {
    setEditingId(id);
    setEditName(n);
    setEditAddress(a);
  }

  function saveEdit(id: string) {
    if (!editName.trim() || !HEX.test(editAddress.trim())) return;
    update(id, editName.trim(), editAddress.trim());
    setEditingId(null);
  }

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">Contacts</h1>
          <p className="text-zinc-400 text-lg">Saved on this browser.</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Add contact</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (e.g. Alice)"
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
              placeholder="Wallet address (0x…)"
              className="flex-[2] rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm"
            />
            <button onClick={handleAdd} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400">
              Add
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        {contacts.length === 0 ? (
          <p className="text-zinc-500">No contacts yet. Add one above.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contacts.map((c) => (
              <div key={c.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
                {editingId === c.id ? (
                  <div className="space-y-3">
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2" />
                    <input value={editAddress} onChange={(e) => setEditAddress(e.target.value.trim())} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-xs" />
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(null)} className="flex-1 rounded-xl border border-zinc-700 py-2 text-sm">Cancel</button>
                      <button onClick={() => saveEdit(c.id)} className="flex-1 rounded-xl bg-orange-500 py-2 text-sm font-semibold">Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4"><Avatar address={c.address} size={52} /></div>
                    <h2 className="text-2xl font-bold mb-2">{c.name}</h2>
                    <p className="text-sm text-zinc-500 break-all mb-6">{c.address}</p>
                    <div className="flex gap-2">
                      <Link href={`/send?to=${c.address}`} className="flex-1 text-center rounded-xl bg-orange-500 py-2 text-sm font-semibold hover:bg-orange-400">Send</Link>
                      <button onClick={() => startEdit(c.id, c.name, c.address)} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Edit</button>
                      <button onClick={() => remove(c.id)} className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
