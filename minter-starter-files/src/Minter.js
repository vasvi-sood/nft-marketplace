import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "./utils/interact.js";
import { pinFileToIPFS } from "./utils/pinata.js";
const ethers = require("ethers");
const fs = require("fs");
const FormData = require("form-data");

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require("./contract-abi.json");
// const contractAddress = "0x6ebadc78c52df4c6b1cebeb70dea3737759f388f";
const contractAddress = "0xf4B2114f963A7537EC4a68B30Ed61C3D6A2a29a9";
const Minter = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [picture, setPicture] = useState([]);

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    console.log("here");
    if (name.trim() == "" || description.trim() == "") {
      return {
        success: false,
        status: "❗Please make sure all fields are completed before minting.",
      };
    }
    const metadata = new Object();
    metadata.name = name;
    // metadata.image = url;
    metadata.description = description;

    //make pinata call
    const response = await pinFileToIPFS(picture, metadata);
    console.log(response);
    if (!response) {
      console.log("what");
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI = response.pinataResponse;
    console.log(tokenURI);
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    //set up your Ethereum transaction
    // const transactionParameters = {
    //   to: contractAddress, // Required except during contract publications.
    //   from: window.ethereum.selectedAddress, // must match user's active address.
    //   data: window.contract.methods
    //     .safeMint(window.ethereum.selectedAddress, tokenURI)
    //     .encodeABI(), //make call to NFT smart contract
    // };
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: window.contract.methods
        .safeMint(window.ethereum.selectedAddress, tokenURI)
        .encodeABI(), //make call to NFT smart contract
    };

    //sign the transaction via Metamask
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      console.log("success");
      // return {
      //   success: true,
      //   status:
      //     "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
      //     txHash,
      // };
    } catch (error) {
      console.log("error");
      // return {
      //   success: false,
      //   status: "😥 Something went wrong: " + error.message,
      // };
    }
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title"> NFT minter page</h1>
      <p>Add asset's link, name, and description, then press "Mint."</p>
      <form>
        <input
          encType="multipart/form-data"
          type="file"
          onChange={(e) => {
            const file = e.target.files;

            // let data = new FormData();

            // data.append("file", fs.createReadStream(file));

            //   making axios POST request to Pinata ⬇️
            console.log(e.target.files[0]);
            const formData = new FormData();
            formData.append("file", e.target.files[0]);

            setPicture(formData);
          }}
        />
        <h2> Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2> Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">{status}</p>
    </div>
  );
};

export default Minter;
