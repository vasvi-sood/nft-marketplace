import React, { useRef } from 'react';

export const NFTCard = ({ nft }) => {
  const executeSale=(id)=>{
    console.log("Execute Sale clicked", id);
  }
  return (
    <div className="w-1/4 flex flex-col ">
      <div className="rounded-md">
        <img
          className="object-cover h-128 w-full rounded-t-md"
          src={nft.media[0].gateway}
        ></img>
      </div>
      <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
        <div className="">
          <h2 className="text-xl text-gray-800">{nft.title}</h2>
          <p className="text-gray-600">Id: {parseInt(nft.id.tokenId, 16)}</p>
        </div>

        <div className="flex-grow mt-2">
          <p className="text-gray-600">Description:{nft.description}</p>
          <p className="text-gray-600">Price:{nft.metadata.price}</p>
          <p className="text-gray-600">User Created:{nft.metadata.username}</p>
          <button  onClick={() => {
            executeSale(parseInt(nft.id.tokenId));
          }}>Sell</button>
        </div>
      </div>
    </div>
  );
};
