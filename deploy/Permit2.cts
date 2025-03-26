const func = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;

  const { deployer, dev } = await getNamedAccounts();

  await deploy("Permit2", {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  });
};

func.tags = ["permit2"];
export default func
