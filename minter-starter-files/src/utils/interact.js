import { pinFileToIPFS } from "./pinata.js";
var ethers = require("ethers");
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require("../contract-abi.json");
// const contractAddress = "0x6ebadc78c52df4c6b1cebeb70dea3737759f388f";
// const contractAddress = "0x1283acF4BF0dBa33FCb16d38651Fbfa0E8034922";
// const contractAddress = "0xb703D4b3d7341f7af7D11B2e1B5D1f5df6dD2237"; //has safemint function, ust make caller minter
const contractAddress = "0xA47f54F69d61C57558bc343c7472546046CCA0a3"; //new updated contract

export const getcontractAddress = async () => {
  return contractAddress;
};
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      }); // onen metamask in browser, if user accept return all accounts
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0], // if user rehect empty string is returned error message
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts", //returns account adresses cureently connecte to metamask
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const mintNFT = async (picture, metadata) => {
  console.log("mint nft function");
  // make pinata call
  const response = await pinFileToIPFS(picture, metadata);
  console.log(response);
  if (!response) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI = response.pinataResponse;
  console.log(tokenURI);

  // set up your Ethereum transaction

  // sign the transaction via Metamask
  try {
    // let tokenURI =
    //   "https://beige-cheerful-dragon-779.mypinata.cloud/ipfs/QmSyAmrcYKMXxkSB1vcdTfKXj4SPGN3cawj1QoGHdJZpGw";

    console.log("inside try");
    let decprice = parseFloat(metadata.price) * 100000000000000000;
    let strprice = decprice.toString();
    let price = parseInt(strprice, 16);
    let finalprice = "0x" + price;
    console.log(decprice, strprice, price, finalprice);
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: "0x5AF3107A4000", // list price
      data: window.contract.methods
        .createToken(tokenURI, finalprice)
        // .getListPrice()
        .encodeABI(), //make call to NFT smart contract
    };

    console.log(transactionParameters);
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    console.log("success");
    return {
      success: true,
      status:
        "✅ Check out your transaction on Goerli: https://goerli.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
  // let contract = new ethers.Contract(
  //   contractAddress,
  //   contractABI,
  //   window.ethereum.selectedAddress
  // );

  // //massage the params to be sent to the create NFT request
  // const price = ethers.parseUnits(metadata.price, "ether");
  // let listingPrice = ethers.parseUnits("0.0001", "ether");
  // listingPrice = listingPrice.toString();

  // //actually create the NFT
  // try {
  //   let transaction = await contract.createToken(tokenURI, price, {
  //     value: listingPrice,
  //   });
  //   await transaction.wait();

  //   alert("Successfully listed your NFT!");
  // } catch (e) {
  //   alert("Upload error" + e);
  // }
};

export const viewNFT = async () => {
  console.log("view nft function");

  try {
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    const result = await window.contract.methods.getAllNFTs().call();
    console.log("success", result);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};
