// hardhat.config.ts

import "dotenv/config"
// import "@nomiclabs/hardhat-etherscan"
// import "@nomiclabs/hardhat-solhint"
// import "@tenderly/hardhat-tenderly"
// import "@nomiclabs/hardhat-waffle"
// import "hardhat-abi-exporter"
// import "hardhat-deploy"
// import "hardhat-deploy-ethers"
// import "hardhat-gas-reporter"
// import "hardhat-spdx-license-identifier"


// import '@typechain/hardhat'
// import '@nomiclabs/hardhat-ethers'

import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy';
import '@nomicfoundation/hardhat-ethers';
import 'hardhat-deploy-ethers';

// // import "hardhat-typechain"
import "hardhat-watcher"
import "solidity-coverage"
import "./tasks/index.cts"

import { HardhatUserConfig } from "hardhat/types"
import { removeConsoleLog } from "hardhat-preprocessor"

const accounts = {
  mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
  // accountsBalance: "990000000000000000000",
}

const config: HardhatUserConfig = {
  abiExporter: {
    path: "./abi",
    clear: false,
    flat: true,
    // only: [],
    // except: []
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      mainnet: process.env.SCROLLSCAN_API_KEY||'',
      scroll_sepolia: process.env.SCROLLSCAN_API_KEY||''
    },
    customChains: [
      {
        network: "scroll_sepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/"
        }
      }
    ]
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true",
    excludeContracts: ["contracts/mocks/", "contracts/libraries/"],
  },
  mocha: {
    timeout: 20000,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    dev: {
      // Default to 1
      default: 1,
      // dev address mainnet
      // 1: "",
    },
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      gasPrice: 120 * 1000000000,
      chainId: 1,
    },
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    hardhat: {
      forking: {
        enabled: process.env.FORKING === "true",
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      },
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
    },
    
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        '7c764ca90dab0468b163bb8272e247eb06abd756072b7c80e9e2f88e24b3b518',
        'dac5005f97f0be8bb23879f38a9ca93c60410d20796806d23f03aac88a1964a3',
        '767b05471aa3713700998846d7be6038db16d5e29e7460c604bb382fcf4100a3',
        '67d7a67d19c2d63df22f4078f5e7732f500fe37bc42660510e09da038814fa5e'
      ],
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },

    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 20000000000,
      gasMultiplier: 2,
    },
    moonbase: {
      url: "https://rpc.testnet.moonbeam.network",
      accounts,
      chainId: 1287,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gas: 5198000,
      gasMultiplier: 4,
    },
    fantom: {
      url: "https://rpcapi.fantom.network",
      accounts,
      chainId: 250,
      live: true,
      saveDeployments: true,
      gasPrice: 22000000000,
    },
    "fantom-testnet": {
      url: "https://rpc.testnet.fantom.network",
      accounts,
      chainId: 4002,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts,
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    xdai: {
      url: "https://rpc.xdaichain.com",
      accounts,
      chainId: 100,
      live: true,
      saveDeployments: true,
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    "bsc-testnet": {
      url: "https://data-seed-prebsc-2-s3.binance.org:8545",
      accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    heco: {
      url: "https://http-mainnet.hecochain.com",
      accounts,
      chainId: 128,
      live: true,
      saveDeployments: true,
    },
    "heco-testnet": {
      url: "https://http-testnet.hecochain.com",
      accounts,
      chainId: 256,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
      gasPrice: 470000000000,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts,
      chainId: 43113,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    harmony: {
      url: "https://api.s0.t.hmny.io",
      accounts,
      chainId: 1666600000,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    "harmony-testnet": {
      url: "https://api.s0.b.hmny.io",
      accounts,
      chainId: 1666700000,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    okex: {
      url: "https://exchainrpc.okex.org",
      accounts,
      chainId: 66,
      live: true,
      saveDeployments: true,
    },
    "okex-testnet": {
      url: "https://exchaintestrpc.okex.org",
      accounts,
      chainId: 65,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts,
      chainId: 42161,
      live: true,
      saveDeployments: true,
      blockGasLimit: 700000,
    },
    "arbitrum-testnet": {
      url: "https://kovan3.arbitrum.io/rpc",
      accounts,
      chainId: 79377087078960,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    celo: {
      url: "https://forno.celo.org",
      accounts,
      chainId: 42220,
      live: true,
      saveDeployments: true,
    },
    "celo_t": {// alfajores
      url: "https://alfajores-forno.celo-testnet.org",
      accounts,
      chainId: 44787,
      live: true,
      saveDeployments: true,
    },
    palm: {
      url: "https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267",
      accounts,
      chainId: 11297108109,
      live: true,
      saveDeployments: true,
    },
    "palm-testnet": {
      url: "https://palm-testnet.infura.io/v3/da5fbfafcca14b109e2665290681e267",
      accounts,
      chainId: 11297108099,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    moonriver: {
      url: "https://rpc.moonriver.moonbeam.network",
      accounts,
      chainId: 1285,
      live: true,
      saveDeployments: true,
    },
    fuse: {
      url: "https://rpc.fuse.io",
      accounts,
      chainId: 122,
      live: true,
      saveDeployments: true,
    },
    clover: {
      url: "https://rpc-ivy.clover.finance",
      accounts,
      chainId: 1024,
      live: true,
      saveDeployments: true,
    },
    telos: {
      url: "https://rpc1.us.telos.net/evm",
      accounts,
      chainId: 40,
      live: true,
      saveDeployments: true,
    },
    moonbeam: {
      url: "https://rpc.api.moonbeam.network",
      accounts,
      chainId: 1284,
      live: true,
      saveDeployments: true,
    },

    

    mantle: {
      url: "https://rpc.mantle.xyz",
      accounts,
      chainId: 5000,
      live: true,
      saveDeployments: true,
    },
    mantle_t: {
      url: "https://rpc.testnet.mantle.xyz/",
      accounts,
      chainId: 5001,
      live: true,
      tags: ["staging"],
    },

    scroll: {
      url: "https://1rpc.io/scroll",
      accounts,
      chainId: 534352,
      live: true,
      saveDeployments: true,
      
		}, 

		scroll_sepolia: { //Scroll Sepolia
			url: "https://sepolia-rpc.scroll.io",
			accounts,
			chainId: 534351,
      saveDeployments: true,
      tags: ["staging"],
		},

    findora: {
      url: "https://rpc-mainnet.findora.org",
      accounts,
      chainId: 2152,
      live: true,
      saveDeployments: true,
      
		}, 
		findora_t: {
			url: "https://prod-testnet.prod.findora.org:8545",
			accounts,
			chainId: 2153,
      saveDeployments: true,
      tags: ["staging"],
		},
    meter_testnet: {
			url: "https://rpctest.meter.io",
			accounts,
			chainId: 83,
		},
		meter: {
			url: "https://rpc.meter.io",
			accounts,
			chainId: 82,
		},

    core_testnet: {
			url: "https://rpc.test.btcs.network/",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
			chainId: 1115,
		},
		core: {
			url: "https://rpc.coredao.org/",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
			chainId: 1116,
		},
		dchain_t:{
			url: "https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
			
			chainId: 2713017997578000
		},

    canto_t: {
			url: "https://canto-testnet.plexnode.wtf",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
			chainId: 7701,
		},

		

		"fraxtal": { //fraxtal
			url: "https://rpc.frax.com",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
			chainId: 252 ,
			// gasPrice: 350000000,
			
			
		},

		"fraxtal_t": { //fraxtal test
			url: "https://rpc.testnet.frax.com",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
			chainId: 2522 ,
			// gasPrice: 350000000,
		},
		
		opencampus: {//Educhain Test
			url: `https://open-campus-codex-sepolia.drpc.org`,
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
			chainId: 656476 
		},

		"base_t": { //Base test
			url: "https://sepolia.base.org",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
			chainId: 84532 ,
			// gasPrice: 350000000,
			
			
		},

    galadriel_t: {
			chainId: 696969,
			url: "https://devnet.galadriel.com/",
			accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2] : [],
		},


  },
  paths: {
    artifacts: "artifacts",
    cache: "cache",
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
    sources: "contracts",
    tests: "test",
  },
  preprocess: {
    eachLine: removeConsoleLog((bre) => bre.network.name !== "hardhat" && bre.network.name !== "localhost"),
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.26",
        settings: {
          optimizer: {
						enabled: true,
						runs: 200,
						details: {
							yul: true,
						},
					},
					viaIR: true,
        },
      },
    ],
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT!,
    username: process.env.TENDERLY_USERNAME!,
  },
  // typechain: {
  //   outDir: "types",
  //   target: "ethers-v6",
    
  // },
  
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
}

export default config
