# SOLBACK

**SOLBACK** is a web application that helps Solana users reclaim SOL locked as rent in empty SPL token accounts. The app scans your wallet, identifies empty token accounts, and lets you close them to recover the SOL, with donation to support development.

---

## Features

- **Wallet Integration:** Connect your Solana wallet securely.
- **Scan for Empty Accounts:** Find all empty SPL token accounts holding rent-exempt SOL.
- **Batch Close Accounts:** Select and close multiple accounts in a single transaction.
- **Donation Slider:** Choose a percentage of recovered SOL to donate.
- **Transparent & Secure:** All actions are client-side; private keys never leave your wallet.
- **Responsive UI:** Modern, accessible design with Tailwind CSS and Radix UI components.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Blockchain:** [@solana/web3.js](https://github.com/solana-labs/solana-web3.js), [@solana/spl-token](https://github.com/solana-labs/solana-program-library/tree/master/token/js)
- **Wallet Adapter:** [@solana/wallet-adapter-react](https://github.com/solana-labs/wallet-adapter)
- **UI:** [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **State/UI:** React, TypeScript, Zustand

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Devang0907/Solback.git
   cd Solback
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure Environment:**

   Create a `.env` file for RPC (take reference from .env.example)

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## Usage

1. **Connect your Solana wallet** using the "Connect Wallet" button.
2. **Scan for empty token accounts** by clicking "Scan Accounts".
3. **Select accounts** you want to close (all are selected by default).
4. **Adjust the donation slider** if you wish to support the project.
5. **Close accounts** and reclaim your SOL!

---

## Security

- All code runs client-side in your browser.
- Your private keys never leave your wallet.
- You only sign transactions to close your own empty accounts.
- The app cannot access any funds beyond the empty accounts you select.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.


## Credits

- [Solana Labs](https://solana.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

---

## Links

- [Live Demo](https://solback.devangrakholiya.me/)

---