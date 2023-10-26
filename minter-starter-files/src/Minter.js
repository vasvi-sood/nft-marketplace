import React, { useRef } from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./utils/interact.js";
// import { pinFileToIPFS } from "./utils/pinata.js";
const FormData = require("form-data");

const Minter = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [username, setUsername] = useState("");
  const [picture, setPicture] = useState([]);

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
    // addWalletListener();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    console.log("on mint pressed",price);
   
    if (
      name.trim() == "" ||
      description.trim() == "" ||
      picture == "" ||
      price.trim()=="" ||
      username.trim()==""
    ) {
      await setStatus(
        "❗Please make sure all fields are completed before minting."
      );
    } 

   else if(parseFloat(price)<=0)
    await setStatus(
      "❗Please enter price>0"
    );
    else {
      const metadata = new Object();
      metadata.name = name;
      metadata.description = description;
      metadata.price=price;
      metadata.username=username;
      await setStatus("Please wait while we are processing the transaction");
      //make mintnft call
      let minterresponse = await mintNFT(picture, metadata);
      await setStatus(minterresponse.status);
    }
  };

  const onTransfer = async () => {};

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
      <p>Add asset's image, name, description, price and your name and then press "Mint."</p>
      <form>
        <input
          encType="multipart/form-data"
          type="file"
          onChange={(e) => {
            //   making axios POST request to Pinata ⬇️
            console.log(e.target.files[0]);
            const formData = new FormData();
            formData.append("file", e.target.files[0]);

            setPicture(formData);
          }}
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
        <h2>Price: </h2>
        <input
          type="number"
          placeholder="e.g. 0.00001 )"
          onChange={(event) => setPrice(event.target.value)}
        />
        <h2>Username: </h2>
        <input
          type="text"
          placeholder="e.g. John Smith "
          onChange={(event) => setUsername(event.target.value)}
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
