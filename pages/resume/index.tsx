import Image from "next/image";
import Layout from "../../components/resume";
import profilePic from "./me.jpg";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <section>
        <div className="flex space-x-16 flex space-y-8 mt-4 mb-4">
          <Image
            src={profilePic}
            width={200}
            height={200}
            alt="Picture of the author"
            className="rounded-full h-40 w-40 object-cover"
          />

          <div className="">
            <h1 className="text-3xl font-bold">👨‍💻 Justin Pulley</h1>
            <p className="text-xl mt-2 ">justinpulley92@gmail.com</p>
            <Link href="/Resume_JustinP.docx">
              <p className="text-sm mt-2">📄 Download (.docx)</p>
            </Link>
          </div>
        </div>
        <p className="mt-2 text-xl">
          <b>🙊 Languages:</b> <i>Rust, TypeScript, JavaScript, Solidity</i>
        </p>
        <p className="mt-2 text-xl">
          <b>🛜 Web Frameworks:</b> <i>React, NextJS, Svelte-Kit</i>
        </p>
        <p className="mt-2 text-xl">
          <b>🛠️ Libraries / Tools:</b>{" "}
          <i>Ethers-js, Foundry, Viem, WAGMI, Rainbow Kit</i>
        </p>
        <p className="mt-2 text-xl">
          <b>👩‍🎤 Protocols:</b>{" "}
          <i>
            AAVE, DEXs, NounsDAO, OpenSea, X2Y2, LooksRare, NFTs
          </i>
        </p>

        <h2 className="text-3xl font-bold mt-6">🚀 Projects</h2>
        <h3 className="mt-2 text-xl">
          <b>Vitalik Buterin's NFT: </b>{" "}
          <Link href={`https://proofofstake.gitcoin.co/`}>
            Proof of Stake Pages
          </Link>
          {/* https://opensea.io/collection/cryptochunksbyte */}
        </h3>

        <h3 className="mt-2 text-xl">
          <b>The "First" On-Chain Punks: </b>{" "}
          <Link
            href={`https://etherscan.io/address/0xb4FbbEEc646f154C731e565817915270f44079c4#code`}
          >
            CryptoChunkz
          </Link>
        </h3>

        <h3 className="mt-2 text-xl">
          <b>Nouns x Gitcoin NFTs: </b>{" "}
          <Link
            href={`https://etherscan.io/address/0x18535414aeb2993e8e2cab33147413a3d6b0194c#code`}
          >
            GTC Uber Nouns
          </Link>
        </h3>

        <h2 className="text-3xl font-bold mt-6">🎓 Education</h2>
        <p className="mb-4 mt-2 text-xl">
          <b>MIT via OCW</b> - Computer Science & Engineering (September 2022 – Now)
        </p>
      </section>
    </Layout>
  );
}
