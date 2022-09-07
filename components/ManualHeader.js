import { useMoralis } from "react-moralis"
import { useEffect } from "react"

/**
 * @notice this component allows us to manually connect to web3
 * @dev we use moralis and react-moralis as web3 APIs
 */

const ManualHeader = () => {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis()

  const connectToWeb3 = async () => {
    await enableWeb3()
    // make sure that Next recognize window
    if (typeof window !== undefined) {
      window.localStorage.setItem("connected", "injectedWeb3")
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) return
    if (typeof window !== undefined) {
      if (window.localStorage.getItem("connected")) {
        console.log("Enabling Web3")
        enableWeb3()
      }
    }
  }, [isWeb3Enabled])

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("Account changed to Account" + account)
      if (!account) {
        console.log("No account found")
        window.localStorage.removeItem("connected")
        deactivateWeb3()
      }
    })
  }, [])

  return (
    <div>
      {account ? (
        <div>
          <h3>
            Connected to {account.slice(0, 6)}...
            {account.slice(account.length - 4)}
          </h3>
        </div>
      ) : (
        <div>
          <button disabled={isWeb3EnableLoading} onClick={connectToWeb3}>
            Connect!
          </button>
        </div>
      )}
    </div>
  )
}

export default ManualHeader
