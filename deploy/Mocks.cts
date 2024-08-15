import {DeployFunction} from 'hardhat-deploy/types';


const func = async function ({ getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments
  const chainId = await getChainId()
  const { deployer } = await getNamedAccounts()
  if (chainId === '31337' || chainId === '1337') {
    await deploy("WETH9Mock", {
      from: deployer,
      log: true,
    })
  } 
  
}

export const skip = ({ getChainId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const chainId = await getChainId()
      resolve(chainId !== "31337" && chainId !== "1337")
    } catch (error) {
      reject(error)
    }
  })

func.tags = ["test", "Mocks"];

export default func;