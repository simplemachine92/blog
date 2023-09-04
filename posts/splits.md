---
title: 'Bringing Sablier to Juicebox'
date: '2023-09-01'
---

After submitting my contracts to the Juicebox Delegate hackathon and somehow winning, I developed continued interest in the protocol, and as a [hacker](http://www.catb.org/~esr/faqs/hacker-howto.html), interested in expanding it's offerings.

Following some discourse with [Jango](https://jango.eth.limo/) in the [Juicebox Discord](https://discord.gg/Z4tngdRJ), he encouraged me to pursue building a token streaming [Split Allocator](https://docs.juicebox.money/dev/learn/glossary/split-allocator/) that allows Juicebox [Projects](https://docs.juicebox.money/user/project/) to stream tokens via [Sablier V2](https://sablier.com/) 

I know the links and nomenclature might be exhausting but succinctly:

* Projects sometimes pay contributors for work
* Give those operators a more trust-enabled payment option

If you're interested in building on the Juicebox protocol, continue through the next sections. If you're interested in the DAO, skip to the end of this post.

## Split Allocatoors

Juicebox main offerings are two-fold: crowdfunding and treasury management. 

A project collects funding via Juicebox (and can issue [Project Tokens](https://docs.juicebox.money/user/project/#token) in return) and disperses payouts via payout distribution [Splits](https://docs.juicebox.money/dev/learn/glossary/splits/) which are attached to that Projects [Funding Cycle](https://docs.juicebox.money/dev/learn/glossary/funding-cycle/). Funding cycles are configured by the Projects [Operators](https://docs.juicebox.money/dev/learn/glossary/operator/)

Split allocators are extensions that are deployed independently and attached to a funding cycle.

Attaching an allocator to a [JBSplit](https://docs.juicebox.money/dev/api/data-structures/jbsplit/):

```solidity
JBSplit({
      preferClaimed: false,
      preferAddToBalance: false,
      percent: 1_000_000_000,
      projectId: 1,
      beneficiary: payable(address(0)),
      lockedUntil: 0,
      allocator: IJBSplitAllocator(address(YOUR_ALLOCATOR_ADDRESS))
    });
```

Split Allocators abide by this [interface](https://docs.juicebox.money/dev/api/interfaces/ijbsplitallocator/).. Just needs that allocate function as our entry point and..

![](https://raw.githubusercontent.com/simplemachine92/blog/main/public/images/anything.jpeg)

## Allocate

You may have noticed that we must differentiate what is being allocated:

* Payout Distribution
* Reserved Tokens Distribution

We can determine that by the ```allocate()``` calls origin:

* [**Terminal:**](https://docs.juicebox.money/dev/learn/architecture/terminals/) Payout Distribution
* [**Controller:**](https://docs.juicebox.money/dev/api/contracts/or-controllers/jbcontroller3_1/) Reserved Tokens

How it looks in Juicebox Sips:
```solidity
/// @notice Called by a project's payout (JBTerminal) or reserved token distribution split (JBController)
  /// @dev See https://docs.juicebox.money/dev/learn/glossary/split-allocator/
  /// @param _data See https://docs.juicebox.money/dev/api/data-structures/jbsplitallocationdata/
  function allocate(JBSplitAllocationData calldata _data) external payable override {
    // Ensure call is coming from Terminal or Controller
    if (
      !directory.isTerminalOf(_data.projectId, IJBPaymentTerminal(msg.sender)) &&
      directory.controllerOf(_data.projectId) != msg.sender
    ) revert JuiceSips_Unauthorized();

    if (_data.projectId != projectId) revert JuiceSips_Unauthorized();

    // Logic for handling ETH payouts
    if (directory.isTerminalOf(_data.projectId, IJBPaymentTerminal(msg.sender))) {
      if (swapOnPayout) {
        uint256 quote = _getQuote(msg.value);
        _swap(int256(msg.value), quote);
      }
    }
  }
```

You can see at the top of allocate that we are ensuring the call comes from either the terminal of the project or the controller, this keeps any random bozo from executing logic on our allocator. Then if we receive a payout distribution (call comes from terminal), we start handling the ETH we receive.

We aren't worried about streaming project tokens (only because I haven't built that yet)..

## Enter Sablier V2

Sablier lets you stream ERC20s to anyone with configurations that determine the release schedule. A highly configurable trust mechanism to pay mfers.

>IWETH9!  
No CALLVALUE next time  
I wrapped with IWETH9!  
SLOAD gets my balance next time  
I wrapped with IWETH9!  
So my contracts could shine  
Contracts do more with  
IWETH9!

"IYKYK" - [Monzy](https://genius.com/Monzy-kill-dash-nine-lyrics)

Anyway, Sablier uses ERC20 tokens to enable this streaming payment mechanism, it escrows token amounts and updates balances for release over time, it's pretty straight forward on the surface.

It's also a highly reverred example of smart-contract engineering and testament to just how well you can build & test software for the EVM. [Paul Razvan Berg](https://twitter.com/PaulRBerg) and [
Andrei Vlad Birgaoanu](https://twitter.com/andreivladbrg) truly built some sturdy software accompanied by pristine documentation.

## Stream Management

One key element of this build is that a contract is managing streams. So we need funds refunded to the managing contract (JBSips), and luckily Sablier v2-periphery enables just that via their proxy plugin. Funds are [auto-forwarded](https://docs.sablier.com/contracts/v2/guides/proxy-architecture/deploy) to JBSips.

Deploying streams can be costly gas wise, so we deploy streams in [batches.](https://docs.sablier.com/contracts/v2/guides/proxy-architecture/batch-stream)

Since this is an extensive operation, I won't put the code here, but you can check [this link](https://github.com/simplemachine92/JBSips/blob/eec2da1b331bb007f35ea97e94bd6b763c2fac51/src/abstract/JBSablier.sol#L211) to see how it works in JBSips.

Streams can be cancelled in [batches](https://github.com/simplemachine92/JBSips/blob/eec2da1b331bb007f35ea97e94bd6b763c2fac51/src/JBSips.sol#L173C31-L173C31) as well.

## Dev Takeaways

Amid developing this extension, Sablier updated their file paths in v2-core, adding a /src/ directory that was meant to better support hardhat projects. This caused me some headaches in managing dependencies because their v2-periphery had not yet bumped that v2-core update. Paul was quick to address this though.

**Solc doesn't check interface file structure,** it only checks if the file is [the same file](https://forum.soliditylang.org/t/making-interfaces-structural/1790). This caused a solc compiler error that basically said ```the interface IGoodInterface doesn't match the interface IGoodInterface!```

I had imported the (functionally same) interfaces from different locations, one from v2-core, one from v2-periph. So, make sure your interfaces are sourced from the same file if used in different locations.

## JBDAO Takeaways

Juicebox DAO was helpful in pushing me towards the right goals of this project. I first framed my proposal as a feature that would bring JBDAO more project deployers, and thus collect more fees. The response to that framing was not well received because there's no proven market-fit for this feature, and it was suggested that this served better as an experiment in dev-rel and building experimental features. This discourse took place in public so [give it a read.](https://discord.com/channels/775859454780244028/1134595113381798008)

JBDAO encourages public discourse/coordination > dms, and choosing to build in public, while being receptive to feedback, were key to submitting a [successful proposal.](https://www.jbdao.org/s/juicebox/412) You can read more about contributing [here.](https://docs.juicebox.money/dao/contribute/)

o7