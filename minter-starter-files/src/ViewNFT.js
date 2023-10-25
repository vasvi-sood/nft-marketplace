import React, { useRef } from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./utils/interact.js";
import { NFTCard } from "./NFTComponent.js";

// import { pinFileToIPFS } from "./utils/pinata.js";
const FormData = require("form-data");

const ViewNFT = () => {
  const [NFTs, setNFTs] = useState([]);

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

  const fetchNFTs = async () => {
    await connectWalletPressed();
    let nfts;
    console.log("fetching nfts");

    const baseURL = process.env.REACT_APP_ALCHEMY_KEY;
    var requestOptions = {
      method: "GET",
    };

    //   if (!collection.length) {

    //     const fetchURL = `${baseURL}?owner=${walletAddress}`;

    //     nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    //   } else {
    console.log("fetching nfts for collection owned by address");
    const fetchURL = `${baseURL}/getNFTs?owner=${walletAddress}&contractAddresses%5B%5D=0xb703D4b3d7341f7af7D11B2e1B5D1f5df6dD2237`;
    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    //   }

    if (nfts) {
      console.log("nfts:", nfts.ownedNfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  return (
    <div className="Minter">
      <br></br>
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
          onClick={() => {
            fetchNFTs();
          }}
        >
          Click here to see your NFT Collection{" "}
        </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length > 0 &&
          NFTs.map((nft) => {
            return <NFTCard nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default ViewNFT;
