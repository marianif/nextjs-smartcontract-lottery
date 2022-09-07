/**
 * @notice this component allows users to enter the lottery
 * @dev we're using the useWeb3Contract() hook from moralis
 * You can use the useWeb3Contract hook to execute on-chain functions. You need to provide the correct abi of the contract, the corresponding contractAddress, the functionName that you would like to execute, and any parameters (params) thet you need to send with the function.
 */

import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

const LotteryEntrance = () => {
  const dispatch = useNotification()
  const [entranceFee, setEntranceFee] = useState("0")
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("Nobody")
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const contractAddress = chainId ? contractAddresses[chainId][0] : null

  // runContractFunction can both send transaction and read state
  const { runContractFunction: enterLottery } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "enterLottery",
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getEntranceFee",
  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getNumberOfPlayers",
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getRecentWinner",
  })

  const handleSuccess = async (tx) => {
    await tx.wait(1)
    dispatch({
      type: "info",
      message: "Transaction complete!",
      title: "Transaction Notification",
      position: "topL",
      icon: "bell",
    })

    updateUI()
  }

  const updateUI = async () => {
    const entranceFee = await getEntranceFee()
    const numPlayers = await getNumberOfPlayers()
    const recentWinner = await getRecentWinner()

    setEntranceFee(entranceFee.toString())
    setNumPlayers(numPlayers.toString())
    setRecentWinner(recentWinner)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  return (
    <div>
      <h1>Hello from the Lottery Entrance!</h1>
      {contractAddress ? (
        <div>
          <h6>
            Lottery Entrance Fee:{" "}
            {ethers.utils.formatUnits(entranceFee, "ether")}
            ETH
          </h6>
          <div>
            <p>
              Number of Players:
              {numPlayers}
            </p>
            <p>
              Recent Winner Address:
              {recentWinner}
            </p>
          </div>
          <button
            onClick={async () =>
              await enterLottery({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }
          >
            Enter Lottery!
          </button>
        </div>
      ) : (
        <h6>No Address detected!</h6>
      )}
    </div>
  )
}

export default LotteryEntrance
