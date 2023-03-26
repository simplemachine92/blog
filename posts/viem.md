---
title: 'Building with Viem, Paradigms Ethers.js "Killer"'
date: '2023-03-26'
---

## tldr: I wouldn't choose Viem over Ethers js yet, but combining both is powerful.

Note: [Viem](https://viem.sh/) is under active development and currently in alpha.

Viem is a new web3 toolkit designed as an alternative/replacement to [Ethers.js](https://github.com/ethers-io/ethers.js/), designed to increase performance and improve the Ethereum dev experience.

It also touts some "Killer features", fork manipulation (changing blocks, setting storage, account impersonation)

I dove into this package after being alerted to the Arbitrum airdrop, writing a simple node script to claim and swap my tokens, in order to learn about shiny new Viem.

**I believe Viem has some powerful offerings, but is far from a replacement for a tried and true combo like ethers + eth-sdk.**

## Good news first, please

No.

The distinction between Public and Wallet Clients makes sense, but why can't my Test Client read/write to contracts?

**This creates a less than desirable pattern of Clients where we many clients.**

* Public Client

* Wallet Client

* Test Client (fork)

* Wallet Client (fork)

Manipulating a local anvil fork (with Test Client actions) and interacting with contracts on that fork is a killer feature IMO.. However, we aren't able to use an Ethers wallet instance in the test client, which requires we instantiate multiple wallet instances (one for whichever real network, and one for our local fork). This may be an intentional design decision, but can we at least get read/write contract methods in the Test Client? **Currently, the workaround is sending unsigned transactions.**

### Issues with contracts.

When you do create your contract instance, after importing an ABI manually or using wagmi/cli, things get messy.

In my experience, I found weird typings for contract arguments that immediately turned me away.

![Weird Types](https://bafkreigbcecov2mzbgrybhxh2t3b7nbsoebershiyu2u35hnsqsm3lywfu.ipfs.nftstorage.link/)

Also, the implied pattern is to create your own read/write function instances with "writeContract" or "readContract", but why go through the trouble when eth-sdk gives you tidy methods to call and correctly infers the types?

![Beautiful Types](https://bafkreifnniynwkfhbf7hl2fta4nx5nzgffi3iqsk4q2gk5gtqavm63uxpm.ipfs.nftstorage.link/)

### Docs can be messy in regards to contracts.
I understand the abi.ts in the example is meant to be demonstrative, but if you copy and paste that abi.ts, you're going to have a broken contract instance.

Instead, use a real JSON ABI from a contract you have, but use the same "as const" export as they demonstrate. You can use @wagmi/cli as they recommend, but you'll also have to include react & wagmi libs in your project (yuck for a node app).

### It would be helpful if the "Getting Started" section walked you through the general project setup/workflow.

Seriously, it's really hard to understand the project setup & workflow of this library. I'm guessing a section is in development, but it would seriously help adoption.

The contract issues and client abstraction patterns have kept me from using Viem as my main “driver”. Instead, I’ll use it in combination with ethers/eth-sdk for now.

## The Good

For my uses currently, Viem is a blazing fast Swiss army-knife for everything besides of contract interactions. Viem touts ~5x performance over ethers.js, and it has some nice patterns for watching events, blocks, txs.

* Performance is insane and package size is minimal

* Public Client watchBlocks, watchEvent:  Comes with convenient “unwatch” method, called to stop listening.

* Contract.multicall: Conveniently batch your read methods.

* Unit Methods: Centered around BigInts (js native) vs ethers custom types.

* Test Client Account Impersonation: Send txs from any acount, however, you currently have to encode txs without contract convenience methods.

* ENS Methods: I haven’t used this myself, but will be key for Dapps in general.

## Viem is on the path to disruption.

Regardless of the issues, getting comfortable with these Viems patterns will position you to use a powerful toolkit that could surpass ethers in convenience, making it the de-facto choice for Ethereum based dapp/script development.