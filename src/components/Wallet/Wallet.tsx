import React from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface IWalletProps {
  accounts: any[] | null;
  connectWallet: () => void;
  walletBalance: { [key: string]: string };
}

const Wallet: React.FC<IWalletProps> = ({
  accounts,
  connectWallet,
  walletBalance,
}) => {
  return (
    <div className="text-pink-600 font-bold relative sm:m-0 mr-2">
      {(!window.ethereum as any) && (
        <div>
          MetaMask is not installed.{" "}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            Install it
          </a>
        </div>
      )}

      <button
        className="w-full max-w-fit px-4 py-1 text-sm text-pink-600 font-semibold rounded-full border border-pink-200 hover:text-white hover:bg-pink-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2"
        type="button"
        onClick={connectWallet}
      >
        {!!accounts?.length ? (
          <span>
            Connected &nbsp;
            <i className="fas fa-chevron-down"></i>
          </span>
        ) : (
          "Connect to Metamask"
        )}
      </button>
      {!!accounts?.length && (
        <div className="mt-2 text-black">
          Balance: {walletBalance[accounts[0]]} ETH
        </div>
      )}
    </div>
  );
};

export default Wallet;
