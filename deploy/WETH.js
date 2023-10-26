const { WNATIVE_ADDRESS } = require("@zarclays/zswap-core-sdk");

const wethDeployNames= {
  31337: {
    name: 'Wrapped CELO',
    symbol: 'WCELO'
  },
  42220: {
    name: 'Wrapped CELO',
    symbol: 'WCELO'
  },
  44787: {
    name: 'Wrapped CELO',
    symbol: 'WCELO'
  },
}

module.exports = async function ({ getNamedAccounts, deployments }) {
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
  } else {
    const wethInChain = wethDeployNames[+chainId];
    if(wethInChain){
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

module.exports.tags = ["WETH", "AMM"];

