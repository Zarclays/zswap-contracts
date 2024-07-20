// import { WNATIVE_ADDRESS } from "@zarclays/zswap-core-sdk";

import { AddressMap } from "@zarclays/zswap-core-sdk";

// const zswapCore = await import("@zarclays/zswap-core-sdk");
// const {WETH9_ADDRESS, WNATIVE_ADDRESS } = zswapCore;
let WETH9_ADDRESS: AddressMap;
let WNATIVE_ADDRESS: AddressMap;
const zswapCore = import("@zarclays/zswap-core-sdk").then((zswapCore)=>{
  WETH9_ADDRESS = zswapCore.WETH9_ADDRESS;
  WNATIVE_ADDRESS = zswapCore.WNATIVE_ADDRESS;

});

const wethDeployNames= {
  31337: {
    name: 'Wrapped ETH',
    symbol: 'WETH'
  },
  42220: {
    name: 'Wrapped CELO',
    symbol: 'WCELO'
  },
  44787: {
    name: 'Wrapped CELO',
    symbol: 'WCELO'
  },

  4002: {
    name: 'Wrapped Fantom',
    symbol: 'WFTM'
  },

  534351: {
    name: 'Wrapped SCROLL',
    symbol: 'wScroll'
  },

  82: {
    name: 'Wrapped MTRG',
    symbol: 'wMTRG'
  },

  83: {
    name: 'Wrapped MTRG',
    symbol: 'wMTRG'
  },

  1115: {
    name: 'Wrapped tCore',
    symbol: 'wtCore'
  },

  1116: {
    name: 'Wrapped Core',
    symbol: 'wCore'
  },

  2713017997578000: {
    name: 'Wrapped ETH',
    symbol: 'WETH'
  },
}

const func = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const chainId = await getChainId();
  console.log('chainId is ', chainId)
  let wethAddress;

  if (chainId === "31337" || chainId === "1337") {
    await deploy("WETH9", {
        from: deployer,
        args: ["Wrapped ETHER", "WETH"],
        log: true,
        deterministicDeployment: false,
      });
    const weth = await ethers.getContract("WETH9");
    wethAddress = weth.address
  } else if (chainId in WNATIVE_ADDRESS) {
    
    wethAddress = WNATIVE_ADDRESS[chainId];
    console.log('Using Native WETH ', wethAddress)
  } else {
    
    const wethInChain = wethDeployNames[+chainId];
    console.log('wethInChain: ',wethInChain)
    if(wethInChain){
      console.log('Deploying WETH ')
      console.log(wethInChain)
      await deploy("WETH9", {
        from: deployer,
        args: [wethInChain.name, wethInChain.symbol],
        log: true,
        deterministicDeployment: false,
      });
        const weth = await ethers.getContract("WETH9");
        wethAddress = weth.address
      
    }else{
      // throw Error("No WNATIVE!");
    }
  }

};

func.tags = ["WETH", "AMM"];

export default func;

