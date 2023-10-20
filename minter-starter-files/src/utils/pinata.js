import axios from "axios";

const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;
const JWT = process.env.REACT_APP_PINATA_JWT;

export const pinFileToIPFS = async (formData) => {
  const url = `https://api.pinata.cloud/pinning/pinFiletoIPFS`;
  return axios
  .post(url, formData, {
    headers: {
      pinata_api_key: key,
      pinata_secret_api_key: secret,
      //   Authorization: JWT,
    },
  })
  .then(function (response) {
    console.log(response);
    console.log(
      "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
    );
    return {
      success: true,
      pinataUrl:
        "https://gateway.pinata.cloud/ipfs/" +
        response.data.IpfsHash,
    };
  })
  .catch(function (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  });

};
//   try {
//     const data = JSON.stringify({
//       pinataContent: {
//         name: "Pinnie NFT",
//         description: "A nice NFT of Pinnie the Pinata",
//         external_url: "https://pinata.cloud",
//         image:
//           "ipfs://bafkreih5aznjvttude6c3wbvqeebb6rlx5wkbzyppv7garjiubll2ceym4",
//       },
//       pinataMetadata: {
//         name: "metadata.json",
//       },
//     });
//     const res = await axios.post(
//       "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           pinata_api_key: key,
//           pinata_secret_api_key: secret,
//           Authorization: JWT,
//         },
//       }
//     );
//     console.log(res.data);
//     return {
//       success: true,
//       pinataUrl: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       success: false,
//       message: error,
//     };
//   }
//};
