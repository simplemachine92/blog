---
title: 'Some alpha on AAVE V2 Liquidations'
date: '2023-01-23'
---

## Here’s what I wish I knew about this weird creditor
If you have an understanding of AAVE v2 liquidations already, just skip to the bottom. Otherwise, there is info here that may help you make or improve your own bot.

Simply put, an AAVE V2 Liquidation is:
* A user has previously supplied Collateral and Borrowed an asset. The borrowed asset could be the same as the supplied asset.

* The health value of their position has moved below 1.

* A liquidator sends a tx that repays a Borrowed (debt) asset and chooses which Collateral to receive.

The liquidator receives the **collateral** plus the [liquidation bonus](https://docs.aave.com/risk/v/aave-v2/asset-risk/risk-parameters), a percentage determined per asset by the AAVE protocol, that varies per asset.

To help collect the necessary data, AAVE offers a [js package](https://github.com/aave/aave-js) that queries its Subgraph. I personally opted to listen for events emitted from the [AAVE v2 Lending Pool](https://etherscan.io/address/0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9).

**Tips for reducing down to profitability:**  
* We need to clear a Collateral > the debtToCover, and select whichever has the highest liquidation bonus in order to maximize profit.

* Lodash (uniqBy, maxBy, filter) will be your bff for combing through this data.

* We need to know exactly how much collateral we are receiving, and it is helpful to know exactly the debt to be covered.

```
const largestDebt: Debt = _.maxBy(
      liqParams[0],
      function (o: { debtPriceEth: number }) {
        return o.debtPriceEth;
      }
    );

    // Filter by amounts greater than debtToCover
    var collatGreaterThan: Collat[] = _.filter(
      liqParams[1],
      function (o: { collatPriceEth: number }) {
        if (o.collatPriceEth >= largestDebt.debtPriceEth / 2) {
          return o.collatPriceEth;
        }
      }
    );

    // Finds the most profitable collateral to liquidate
    const largestCollat: Collat = _.maxBy(
      collatGreaterThan,
      function (o: { liquidationBonusMultiplier: number }) {
        return o.liquidationBonusMultiplier;
      }
    );
```

The last on this list was the most challenging to solve. AAVE didn’t seem to have any view functions to get the exact debtToCover or collatReceived, and the docs instead point you toward a set of formulas,.

Also, depending on which conversions you use via Ethers.js or otherwise, you could end up dropping some granularity along the way:

![Aave Documentation Image](https://bafybeicocy4heqght4iq6grt3mrp3z5t54n5kb57puquf5svf7uf33uvr4.ipfs.nftstorage.link/)

Surely, nothing could go wrong?
Surely, nothing could go wrong?
After many botched calculations, I instead [deployed](https://etherscan.io/address/0xA67BdecB3FB056F314Dcc76F3ACd3B3F936C52ca) a provider contract [that grabs these params directly from AAVE.](https://github.com/simplemachine92/Gavel-Data-Contracts) If you’d like to use that to skip the headache of bigint calculations, [here’s the ABI](https://gist.github.com/simplemachine92/3e1f2568af148fa9c11ed619613c6267). I forgot to verify the contract, sorry to the eth-sdk users, but it’s pretty easy to rig this up with Typechain, and then..

```
const liqInfo = await liqData.liquidationCallData(
      largestCollat.collatT,
      largestDebt.debtT,
      address,
      ethers.constants.MaxUint256,
      false
    );
```
A call to “liquidationCallData()” returns debtToCover (at index [0]), collatToReceive (at index [1], and a string which alerts us if any errors occured at index [2].

And just like that, you know exactly how much **debtToCover** and **collatReceived** for a particular liquidation call. I’ll cover estimation and execution in the next post.

*These are just tools/discoveries along my path of building software. I am in no way a financial expert, or traditionally trained in anything, and I’m most certainly an inexperienced writer. If you have questions, ask me on [twitter](https://twitter.com/nowonderer).*
