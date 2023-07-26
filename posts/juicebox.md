---
title: 'Juicebox Delegate Hackathon'
date: '2023-07-26'
---

I recently competed in, and [won](https://snapshot.org/#/filipv.eth/proposal/0xcecf8f9a92cea21c55d7cdde739b1b48101b75b24f8edb945feb0cd7aad7f9c2), a [Hackathon](https://docs.juicebox.money/delegate-hackathon/) hosted by [Juicebox.money](https://juicebox.money/) and [BuidlGuidl](https://buidlguidl.com/)!

The goal of the Hack was to create a [Treasury Extension](https://docs.juicebox.money/dev/build/treasury-extensions/) that extends a Juicebox [Project](https://docs.juicebox.money/dev/learn/glossary/project/) with some useful functionality, as well as a Front-End Interface, for my front-end (and in the spiriting of BuidlGuidl), I used [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2).

I decided to build a Merkle Root Whitelist Data Source, an item on JB's wishlist for treasury extensions. Putting a list of addresses on-chain on Ethereum can be quite costly, so I believed existing projects would be interested in the extension.

To put it simply, we can hash a list of addresses (leaves) into a 32 byte Merkle Root Hash, and then formulate a proof that an address is a leaf in our Merkle Tree.

>A hash tree allows efficient and secure verification of the contents of a large data structure.

You can read more about Merkle Trees [here](https://en.wikipedia.org/wiki/Merkle_tree) and an implementation of them for allow-listing an ERC-721 NFT [here](https://medium.com/@ItsCuzzo/using-merkle-trees-for-nft-whitelists-523b58ada3f9)

## Juicebox Architecture

I had no previous experience with JB, so the first day was spent getting a lay of the land.

My main questions were:

- How is a Project deployed?
- How is a Delegate attached?
- Whats the diff b/t Data Source and Delegates?
- How do I implement access control on a DS/Delegate?
- How can I test this end-to-end?

The best example resource I found was a Delegate by JB Contributors themselves, a buyback Delegate that includes a [base workflow](https://github.com/jbx-protocol/juice-buyback/blob/main/contracts/test/helpers/TestBaseWorkflowV3.sol) setup. This guided me toward an understanding that I have distilled into a [flow-chart](https://excalidraw.com/#json=URlBFuN_V5yyBOYf0SEx1,Q9O4xeEl4qtfSGMOJ0FSoA) for your convenience:

>Note: This may not be 100% accurate, just my heuristic understanding. Also, I encourage you to visit the flow-chart link, from which this image is derived.. it contains useful JB Documentation links to further demystify things.

![](https://raw.githubusercontent.com/simplemachine92/blog/main/public/images/jbactions2.png)

## Launching a Project & Attaching a Delegate

A project can be launched in a few ways, but in JBStraws case we call [launchProjectFor()](https://docs.juicebox.money/dev/api/contracts/or-controllers/jbcontroller3_1/#launchprojectfor) via our own [Project Deployer](https://github.com/simplemachine92/JBStraws-Contracts/blob/merkle/src/JBStrawsProjectDeployer.sol)

The required data is 

```solidity
struct LaunchProjectData {
    JBProjectMetadata projectMetadata;
    JBFundingCycleData data;
    JBFundingCycleMetadata metadata;
    uint256 mustStartAtOrAfter;
    JBGroupedSplits[] groupedSplits;
    JBFundAccessConstraints[] fundAccessConstraints;
    IJBPaymentTerminal[] terminals;
    string memo;
}
```

JBFundingCycleData includes a ```dataSource``` which points to an implementation of our datasource, a ```useDataSourceForPay``` and ```useDataSourceForRedeem``` which are set optionally, which essentially attach our Delegate.

Here's the [full list of JBFundingCycleParams](https://docs.juicebox.money/dev/api/data-structures/jbfundingcyclemetadata/#definition) if you're curious.

>Note: Delegates are attached per funding cycle, read more about [funding cycles](https://docs.juicebox.money/dev/learn/glossary/funding-cycle/)

## Data Source vs. Delegate Distinction

The distinction is mainly that a Data Source derives contextual information from Pay or Redeem calls (coming from a PaymentTerminal), and a Delegate acts on this info by way of ```didPay()``` or ```didRedeem()``` hooks. A Delegate is also (always?) a Data Source, but a Data Source can be used without calling Delegate hooks.

That means that A Data Source adheres to ```IJBFundingCycleDataSource3_1_1```, Pay Delegates to ```IJBPayDelegate3_1_1```, and Redemption Delegates to ```IJBRedemptionDelegate3_1_1```.

Here's [JBStraws example of a sole Data Source.](https://github.com/simplemachine92/JBStraws-Contracts/blob/merkle/src/JBStraws.sol)

## Data Source & Delegate Access Control
After digging, I found an example of access control on a Delegate in this [721-Delegate](https://github.com/jbx-protocol/juice-721-delegate/blob/42d3a6d91f96ac82ae443fb9b5a22dd1ff8d398e/contracts/JBTiered721Delegate.sol#L251) implementation.

Permissions are set by calling [JBOperatorStore.setOperator()](https://docs.juicebox.money/dev/api/contracts/jboperatorstore/#write) and permissions can be confirmed by a contract adhering to abstract [JBOperatable](https://docs.juicebox.money/dev/api/contracts/or-abstract/jboperatable/) with ```requirePermission()```.

Here's how I did that in [JBStraws](https://github.com/simplemachine92/JBStraws-Contracts/blob/8a35fa9c52132c6d6d6724b3b9becde551339a1d/src/JBStraws.sol#L145)

## Testing

[Murky](https://github.com/dmfxyz/murky) made Merkle tree, root, and proof generation a breeze. I'm super thankful to [dmfxyz](https://github.com/dmfxyz) and other contributors. It's so good it even has a mention in the [Forge Book](https://book.getfoundry.sh/forge/differential-ffi-testing?highlight=merkle#example-differential-testing-merkle-tree-implementations).

Thanks to the great work and examples from the JB team, creating a mock deployment of the protocol was a breeze. Again, check out the [buyback-delegate](https://github.com/jbx-protocol/juice-buyback) test helpers if you're having any issues mocking the architecture.

Checkout the [tests](https://github.com/simplemachine92/JBStraws-Contracts/blob/merkle/test/Integrations.t.sol) written for JBStraws!

## Afterthoughts & Links

I'm skipping over the front-end development as it's not really the "bread and butter" of this build, but I believe that deploying my JB Project on Goerli and connecting it to my Scaffold-ETH 2 Front-end helped me secure the win in this hack. Even though my contract was simple, it demonstrated sufficient protocol knowledge, and adhered to the rules and wishes of the hosts. 

Thanks to the JuiceBox team and BuidlGuidl for hosting this awesome hack. It really helped me understand the value prop of extensible Treasury management. Please read [this](https://jango.eth.limo/9E01E72C-6028-48B7-AD04-F25393307132/) post by Jango of Juicebox if you are curious about more of the ethos.

Github:
- [Contracts](https://github.com/simplemachine92/JBStraws-Contracts)
- [Front-end](https://github.com/simplemachine92/JBStraws-Interface)