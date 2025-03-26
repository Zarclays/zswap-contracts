// import { WNATIVE_ADDRESS }  from "@zarclays/zswap-core-sdk";

import { AddressMap } from "@zarclays/zswap-core-sdk";



const func = async function ({ getNamedAccounts, deployments, ethers,getChainId }) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const chainId = await getChainId();
  
  let wethAddress;



  const nativeCurrencyLabelBytes = ethers.encodeBytes32String("ZSWAP\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
  console.log('Encoded:',"ZSWAP\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0", nativeCurrencyLabelBytes)
  const nftDescriptor = await deploy('NFTDescriptor', {
    from: deployer,
    log: true,
  });

  // const nonfungibleTokenPositionDescriptor = await deploy('NonfungibleTokenPositionDescriptor', {
  //   from: deployer,
  //   args: [wethAddress, nativeCurrencyLabelBytes],
  //   libraries: { NFTDescriptor: nftDescriptor.address },
  //   log: true,
  // });

  // const nonfungiblePositionManager = await deploy('NonfungiblePositionManager', {
  //   from: deployer,
  //   args: [factoryAddress, wethAddress, nonfungibleTokenPositionDescriptor.address],
  //   log: true,
  // });


};

func.tags = ["nd"];
func.dependencies = [];
export default func;