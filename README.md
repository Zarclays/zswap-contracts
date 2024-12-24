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