'use client';

import { ConnectKitButton } from 'connectkit';

export default function Home() {
  return (
    <main className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
      <header className="bg-black py-8 shadow-md w-full">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Wallet Connect</h1>
          <nav>
            <ul className="flex space-x-10">
              <li>
                <ConnectKitButton />
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </main>
  );
}
