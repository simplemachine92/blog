---
title: 'Building a level 0 Etherscan with Rust'
date: '2023-06-29'
---

## No DB, just a routine and an exposed Route.

Building an Etherscan clone might seem like heavy work, but we'll start simply with just a routine call to an RPC, and serve that over HTTP.

## Setup

Let's use Cargo to start our project (package).

```
cargo new my-service
```

Then add these dependencies to your `Cargo.toml`:

```toml
[dependencies]
axum = "0.2"
tokio = { version = "1", features = ["full"] }
ethers = "0.4"
eyre = "0.6"
```

Now we just modify our main.rs in our src directory.

## Code Breakdown

Let's initialize the necessary libraries:

```rust
use axum::{
    routing::get,
    Router,
};
use ethers::providers::{Middleware, Provider};
use std::sync::Arc;
use tokio::sync::RwLock;
use tokio::time::{sleep, Duration};
```
Here we're importing necessary structures from `axum` for creating route handlers, `ethers` for connecting to Ethereum node, `Arc` and `RwLock` from `tokio::sync` for thread-safe data sharing, and `Duration` & `sleep` from `tokio::time`.

Let's first look at our async function, `update_block`:

```rust
async fn update_block(block_string: Arc<RwLock<String>>) -> eyre::Result<()> {
    let rpc_url = "https://eth.llamarpc.com";
    let provider = Provider::try_from(rpc_url)?;

    loop {
        let block_number = provider.get_block_number().await?;

        {
            let mut block_str_guard = block_string.write().await;
            *block_str_guard = block_number.as_u64().to_string();
        }

        sleep(Duration::from_secs(13)).await;
    }
}
```
This function will continuously update Ethereum's latest block number. It creates a connection to our Ethereum RPC. Within this loop, it fetches the latest block number and writes it to a globally shared string (block_string) every 13 seconds.

```rust
#[tokio::main]
async fn main() {
    let block_string = Arc::new(RwLock::new(String::new()));
    tokio::spawn(update_block(block_string.clone()));
```
Here we're defining an empty mutable String reference (`block_string`) and then wrapping it with `Arc<RwLock>`. This ensures safe multi-threaded read/write access to the variable `block_string`. Then we initiate the `update_block` function to start running in the Tokio runtime.

Next:

```rust
    let app = Router::new().route("/", get(move || {
        let block_str_clone = block_string.clone();
        async move {
            let block_str_guard = block_str_clone.read().await;
            block_str_guard.clone()
        }
    }));
```
An Axum `Router` is defined that listens to HTTP GET requests on the root URL ("/"). For each GET request, it creates a clone of `block_string` and reads its value to return it to the client.

Lastly:

```rust
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```
We initialize the server to listen on "0.0.0.0:3000", making it publicly accessible on port 3000. The server is going to serve the previously defined `app`, effectively making our Ethereum block number API live (once deployed).

Here's the full code example:

```rust
use axum::{
    routing::get,
    Router,
};
use ethers::providers::{Middleware, Provider};
use std::sync::Arc;
use tokio::sync::RwLock;
use tokio::time::{sleep, Duration};

async fn update_block(block_string: Arc<RwLock<String>>) -> eyre::Result<()> {
    let rpc_url = "https://eth.llamarpc.com";
    let provider = Provider::try_from(rpc_url)?;

    loop {
        let block_number = provider.get_block_number().await?;

        {
            let mut block_str_guard = block_string.write().await;
            *block_str_guard = block_number.as_u64().to_string();
        }

        sleep(Duration::from_secs(13)).await;
    }
}

#[tokio::main]
async fn main() {

    let block_string = Arc::new(RwLock::new(String::new()));

    tokio::spawn(update_block(block_string.clone()));

    let app = Router::new().route("/", get(move || {
        let block_str_clone = block_string.clone();
        async move {
            let block_str_guard = block_str_clone.read().await;
            block_str_guard.clone()
        }
    }));

    // run it with hyper on localhost:3000
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

## Deploying

I chose [render](https://render.com/) to test deploying and accessing my API. Sign up for a free account, and once at your dashboard start a new Web Service instance.

![a link](https://raw.githubusercontent.com/simplemachine92/blog/main/public/images/render.png)

You will be asked to connect a github repository. After that deploy processed is finished you'll be able to access your API on the open web!

## Next

In the next version we will make it API idiomatic (returning JSON, etc..).