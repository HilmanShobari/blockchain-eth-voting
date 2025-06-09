import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://still-broken-hill.matic-amoy.quiknode.pro/8709bf5eb7f5a10aa1d549e0b3e378d5b9372a96"
  );
  web3 = new Web3(provider);
}
 
export default web3;