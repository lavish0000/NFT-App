import { ethers } from "ethers";

export const requestWalletConnection = ():Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
         window.ethereum.request({
          method: "eth_requestAccounts",
        }).then(resolve).catch(reject);
    } else {
        reject("No wallet connection found");
    }
  });
};

export const getWalletBalance = (account: string):Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
         window.ethereum.request({
          method: "eth_getBalance",
          params: [account.toString(), "latest"]
        }).then((balance: string) => {
          resolve(ethers.utils.formatEther(balance));
        }).catch(reject);
    } else {
        reject("No wallet connection found");
    }
  });
}

export const makePayment = (account: string, amount: string):Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const transaction = {
          to: account,
          value: ethers.utils.parseEther(amount)
        };
        signer.sendTransaction(transaction).then(resolve).catch(reject);
    } else {
        reject("No wallet connection found");
    }
  });
}
