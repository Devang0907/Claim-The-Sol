import { create } from "zustand"

export type Network = "mainnet-beta" | "devnet"

interface NetworkState {
  network: Network
  setNetwork: (network: Network) => void
}

export const useNetworkStore = create<NetworkState>((set) => ({
  network: "mainnet-beta",
  setNetwork: (network) => set({ network }),
}))
