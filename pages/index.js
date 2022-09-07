import Head from "next/head"
import styles from "../styles/Home.module.css"
import { ManualHeader, Header, LotteryEntrance } from "../components"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Smart Contract Lottery with NextJs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <ManualHeader /> */}
      <Header />
      <LotteryEntrance />
    </div>
  )
}
