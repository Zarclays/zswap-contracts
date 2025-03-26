# ZSwap

https://zswap.app

## Deployed Contracts

https://dev.zswap.app/contracts

## Publish
yarn npm publish

## Docs

[Development](docs/DEVELOPMENT.md)

[Deployment](docs/DEPLOYMENT.md)

[History](docs/HISTORY.md)

## Security

[Security Policy](SECURITY.md)

## License

[MIT](LICENSE.txt)



## Patch-Package
`npx patch-package @zarclays/zswap-core-sdk  --exclude p.json$`


## Test Liquidity


npx hardhat --network neoX_t  router:add-liquidity --deadline 1735516861  --to 0x4ABda0097D7545dE58608F7E36e0C1cac68b4943 --token-a 0xE7B1D4a5264d5984d1f06F559aA0B712222275CC --token-a-desired '100000000000000000000000' --token-a-minimum '100000000000000000000000' --token-b 0x043C8d950F59d49B072eAacDACc1Cd1635936981 --token-b-desired '60000000000000000000000' --token-b-minimum '60000000000000000000000'

npx hardhat --network localhost  router:add-liquidity --deadline 1745516861  --to 0x4ABda0097D7545dE58608F7E36e0C1cac68b4943 --token-a 0x3aa5ebb10dc797cac828524e59a333d0a371443c --token-a-desired '10000000000000000000' --token-a-minimum '1000000000000000000' --token-b 0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9 --token-b-desired '600000000000' --token-b-minimum '600000000000'

