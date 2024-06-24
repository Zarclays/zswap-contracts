

module.exports = async function (taskArguments, hre, runSuper) {

  const  { Wallet, utils } = hre.ethers;
  const { mnemonic } = taskArguments
  if(!mnemonic){
    throw new Error('No Mnemonic given. Specify a mnemonic with the flag --mnemonic ')
  }

  
  const hdNode = utils.HDNode.fromMnemonic(mnemonic);
  for (let i = 0; i < 3; i++) {
    const accountHdNode = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);// This returns a new HDNode

    const wallet = new Wallet(accountHdNode)
    // const wallet = Wallet.fromMnemonic(
    //   mnemonic
    // )
    console.log('Wallet ', i+1)
    console.log('==== ')
    console.log('wallet.address:', wallet.address)
    console.log('wallet.mnemonic.phrase:', wallet.mnemonic.phrase)
    console.log('wallet.privateKey:', wallet.privateKey)
    console.log('------ ')
    
  }
  // const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`); // This returns a new HDNode
  // const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`);
  
  // const wallet = Wallet.fromMnemonic(
  //   mnemonic
  // )
  
  // console.log('wallet.address:', wallet.address)
  // console.log('wallet.mnemonic.phrase:', wallet.mnemonic.phrase)
  // console.log('wallet.privateKey:', wallet.privateKey)

}


