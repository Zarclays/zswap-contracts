# Deployment

npx hardhat deploy --network scroll_sepolia --tags AMM,MasterChef,SushiBar,ZSwapToken


## Networks

### HardHat

```sh
npx hardhat node
```

### Mainnet

```sh
yarn mainnet:deploy
```

```sh
yarn mainnet:verify
```

```sh
hardhat tenderly:verify --network mainnet ContractName=Address
```

```sh
hardhat tenderly:push --network mainnet ContractName=Address
```

### Ropsten

```sh
yarn ropsten:deploy
```

```sh
yarn ropsten:verify
```

```sh
hardhat tenderly:verify --network ropsten ContractName=Address
```

### Kovan

```sh
yarn ropsten:deploy
```

```sh
yarn ropsten:verify
```

```sh
hardhat tenderly:verify --network kovan ContractName=Address
```



## Specific Contracts

### Deploy Multicall

```sh
npx hardhat deploy --tags Multicall2
```

```sh
npx hardhat deploy --tags Multicall2 --network local
```


## Verify Contract
```sh
npx hardhat  etherscan-verify --network scroll_sepolia --solc-input --api-url https://api-sepolia.scrollscan.com --api-key XXB....
```
