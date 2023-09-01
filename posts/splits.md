---
title: '(WIP) Bringing Sablier to Juicebox'
date: '2023-09-01'
---

After submitting my contracts to the Juicebox Delegate hackathon and somehow winning, I developed continued interest in the protocol, and as a [hacker](http://www.catb.org/~esr/faqs/hacker-howto.html), interested in expanding it's offerings.

Following some discourse with [Jango](https://jango.eth.limo/) in the [Juicebox Discord](https://discord.gg/Z4tngdRJ), he encouraged me to pursue building a token streaming [Split Allocator](https://docs.juicebox.money/dev/learn/glossary/split-allocator/) that allows Juicebox [Projects](https://docs.juicebox.money/user/project/) to stream tokens via [Sablier V2](https://sablier.com/) 

I know the links and nomenclature might be exhausting but succinctly:

* Projects sometimes pay contributors for work
* Give those operators a more trust-enabled payment option

>If you're interested in building on the Juicebox protocol, continue through the next sections. If you're interested in the DAO, skip to the end of this post.

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

>Hey I heard you like allocating, I put some allocations beside your allocations so you can allocate while you allocate, but first, what are you allocating?

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

It's also a highly reverred example of smart-contract engineering and a testament to just how well you can build & test software for the EVM. [Paul Razvan Berg](https://twitter.com/PaulRBerg) and [
Andrei Vlad Birgaoanu](https://twitter.com/andreivladbrg) truly built some sturdy software accompanied by pristine documentation.

## 