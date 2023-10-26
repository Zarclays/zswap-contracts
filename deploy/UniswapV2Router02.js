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
  
  let wethAddress;

  if (chainId in WNATIVE_ADDRESS) {
    wethAddress = WNATIVE_ADDRESS[chainId];
  } else {
    const weth = await ethers.getContract("WETH9");
    wethAddress = weth.address
    if(!wethAddress){
      throw Error("No WNATIVE!");
    }
  }

  const factoryAddress = (await deployments.get("UniswapV2Factory")).address;

  await deploy("UniswapV2Router02", {
    from: deployer,
    args: [factoryAddress, wethAddress],
    log: true,
    deterministicDeployment: false,
  });
};

module.exports.tags = ["UniswapV2Router02", "AMM"];
module.exports.dependencies = ["UniswapV2Factory","WETH", "Mocks"];
