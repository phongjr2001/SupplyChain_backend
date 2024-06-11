<<<<<<< HEAD
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, ethers, Overrides } from 'ethers';
=======
import {
   TransactionResponse,
} from "@ethersproject/abstract-provider";
import { BigNumber, ethers, Overrides } from 'ethers';
import Exceptions from "../../HttpResponse/Exception";
>>>>>>> 0221216 (auth finish)

export default class BaseInterface {
   _provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
   _contractAddress: string;
   _abi: ethers.ContractInterface;
   _contract: ethers.Contract;
<<<<<<< HEAD
   _option: Overrides;
=======
   _options: Overrides;
>>>>>>> 0221216 (auth finish)

   constructor(
      provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
      address: string,
      abi: ethers.ContractInterface
   ) {
      this._provider = provider;
      this._contractAddress = address;
      this._abi = abi;
<<<<<<< HEAD
      this._option = { gasLimit: 1500000 };
=======
      this._options = { gasLimit: 300000 };
>>>>>>> 0221216 (auth finish)
      this._contract = new ethers.Contract(address, abi, provider.getSigner());
   }

   _handleTransactionResponse = async (tx: TransactionResponse) => {
      try {
         const recept = await tx.wait();
         return recept.transactionHash;
      } catch (error: any) {
<<<<<<< HEAD
         throw new Error(error.message);
=======
         throw new Exceptions(error.message);
>>>>>>> 0221216 (auth finish)
      }
   }

   _parseToEth = (amount: number) => {
      return ethers.utils.parseEther(amount.toString());
   }

   _formatToEth = (bigNumber: BigNumber) => {
      return Number.parseFloat(ethers.utils.formatEther(bigNumber))
   }

   _toWei = (amount: number) => {
      return ethers.utils.parseUnits(amount.toString());
   }

   _toNumber = (bigNumber: BigNumber) => {
      try {
         return bigNumber.toNumber();
      } catch (error) {
         return Number.parseFloat(ethers.utils.formatEther(bigNumber));
      }
   }
}