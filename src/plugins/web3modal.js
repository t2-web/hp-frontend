import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Fortmatic from "fortmatic";
// import Torus from "@toruslabs/torus-embed";
// import Authereum from "authereum";
// import { Bitski } from "bitski";
const providerOptions = {
  // walletconnect: {
  //   package: WalletConnectProvider,
  //   options: {
  //     infuraId: "27e484dcd9e3efcfd25a83a78777cdf1"
  //   }
  // },
  // torus: {
  //   package: Torus
  // },
  // fortmatic: {
  //   package: Fortmatic,
  //   options: {
  //     key: "pk_test_391E26A3B43A3350"
  //   }
  // },
  // authereum: {
  //   package: Authereum
  // },
  // bitski: {
  //   package: Bitski,
  //   options: {
  //     clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
  //     callbackUrl: window.location.href + "bitski-callback.html"
  //   }
  // }
};

const web3Modal = new Web3Modal({
  network: "testnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
  disableInjectedProvider: false // optional. For MetaMask / Brave / Opera.
});

export default web3Modal;
