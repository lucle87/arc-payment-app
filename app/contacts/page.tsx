import Link from "next/link";
import { contacts } from "@/lib/contacts";

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4">Contacts</h1>
          <p className="text-zinc-400 text-xl">Your favorite recipients.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contacts.map((contact) => (
            <div
              key={contact.address}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
            >
              <div className="text-5xl mb-6">👤</div>
              <h2 className="text-2xl font-bold mb-3">{contact.name}</h2>
              <p className="text-sm text-zinc-500 break-all mb-8">
                {contact.address}
              </p>
              <Link
                href={`/send?to=${contact.address}`}
                className="block text-center w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-400"
              >
                Send Money
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
