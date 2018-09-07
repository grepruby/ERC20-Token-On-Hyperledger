# Techracers HyperLedger

This is an open source repository for writing simple, [ERC20](https://en.wikipedia.org/wiki/ERC-20) based token [Chaincode](https://hyperledger-fabric.readthedocs.io/en/release-1.2/chaincode.html) on HyperLedger, using Node.js.

You can use this repository to build distributed networks, using the widely tested and accepted ERC20 standard, in a [HyperLedger Fabric](https://hyperledger-fabric.readthedocs.io/en/release-1.2/whatis.html) environment:

> NOTE: This repository assumes, you're already familiar with HyperLedger Fabric, and your system already has the prerequisites to start development on HyperLedger. If not, refer to [prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-1.2/prereqs.html), [key concepts](https://hyperledger-fabric.readthedocs.io/en/release-1.2/key_concepts.html) and [tutorials](https://hyperledger-fabric.readthedocs.io/en/release-1.2/tutorials.html) in HyperLedger's documentation.

## Getting Started

The code in this repository has been tested in the following environment:

- Node: `v8.9.3` and `v8.11.4`
- Hyperledger fabric: `v1.2`
- Docker: `18.06.1-ce` 
- Python: `2.7.12`
- Go: `go1.9.3 linux/amd64`
- Curl: `7.47.0`

We would recommend using the same version, while adapting from our code. 

After making sure the [prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-1.2/prereqs.html) are installed properly, follow the following steps:

```sh
cd path/to/repository/folder
cd network
```

Once you are in the network folder you can create our hyperledger network environment. It will create 2 organizations for you- Org1 and Org2 repectively, with an Orderer. Having 2 peers each.

## Housekeeping

If it's your second time running this tutorial, or you have run any other HyperLedger Fabric based code, first run the following commands:

```sh
./buildERC20TokenNetwork.sh down
```
It will ask for a confirmation:

```sh
Stopping for channel 'mychannel' with CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue? [Y/n]
```

Press `Y` and continue.

> Note: You can always check how many containers or volumes of docker are up and running, using the following commands:
- `docker ps`
- `docker volume ls`

If you have problems in shutting down containers and volumes using the script, try running the following commands:

- `docker network prune`
- `docker volume prune`
- `docker rm -f $(docker ps -aq)`

## Token Network Setup

Once you're done with the Housekeeping, you are ready to start you network, use the following commands:

```sh
./buildERC20TokenNetwork.sh up
Starting for channel 'mychannel' with CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue? [Y/n] Y
...
```

It may take some time to execute (usually between 90- 120 seconds, to execute). But if you see the following log in your terminal it executed successfully, and your network is ready to use.

```sh
========= All GOOD, execution completed ===========
 _____   _   _   ____
| ____| | \ | | |  _ \
|  _|   |  \| | | | | |
| |___  | |\  | | |_| |
|_____| |_| \_| |____/

```
It created the required certificates for each entity of HyperLedger using the `crypto-config.yaml` file, in a folder named `crypto-config` within your networks directory. Check it out!

It also created `channel.tx`, `genesis.block`, `Org1MSPanchors.tx` and `Org1MSPanchors.tx`.

> Note: We cannot cover everything in this README, to understand the intrecasies behind the process in detail [go through this tutorial](https://hyperledger-fabric.readthedocs.io/en/release-1.2/build_network.html).

It also created docker containers and volumes for:
- peer0 and peer1 or Org1
- peer0 and peer1 of Org2
- orderer
- cli
- chaincode

Check them using `docker ps` and `docker volume ls`. We also created a channel name `mychannel` between Org1 and Org2, both the peers of each org are a part of this channel. Then installed our chjaincode on `peer0` of each org and instantiated our chaincode, naming it `mycc`. You can see the logs of respective peer/chaincode using:

```sh
docker logs <peer identity> // type peer and then tab to see your options
docker logs <chaincode identity> // type dev and then tab to see your options
```

> Note: For debugging you can access your chaincode's and peers logs `docker logs <press TAB to see options>`; and If you don't see a container for chaincode (dev-peer0.org1.techracers.com-mycc-1.0) then there was a problem instantiating our token chaincode.

## Let's play with our token

Now that our chaincode is up and running let's try some getter and setter functions to understand it in a better way. For that we need to enter the CLI container we created.

```sh
docker exec -it cli bash
```

Now you'll see something like this:

```sh
root@0e2b84a5cedc:/opt/gopath/src/github.com/hyperledger/fabric/peer#
```

### Getter functions

Once you're in the CLI you can call the getter functions provided in our SimpleToken. We'll discuss each one of them accessible to you one by one:

#### getOwner

This function will return the owner of the token contract. Now it is the MSPID which instantiated the contract.

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getOwner"]}'
Org1MSP
```

Here `mychannel` is our channel name and `mycc` is the name of our chaincode, and as you can see `Org1MSP` is the current owner of our chaincode.

#### getName

This function will return the name of our token contract. It was set to `Simple Token` while instantiating the contract, you can see it [here](). // add permlink

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getName"]}'
Simple Token
```

As you can see `Simple Token` is our current token name.

#### getSymbol

This function will return the symbol for our token contract. It was set to `SMT` while instantiating the contract, you can see it [here](). // add permlink

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getSymbol"]}'
SMT
```

As you can see `SMT` is our current token symbol.

#### getTotalSupply

This function will return the total supply for our token contract. It defaults to `0` until it is set once. You can find the required logic [here](). // add permlink

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getTotalSupply"]}'
0
```

As you can see `0` is our current total supply.

#### isMintingAllowed

This getter returns the value of `isMintingAllowed` boolean stored on HyperLedger. It defaults to `undefined` until it is set once. You can find the required logic [here](). // add permlink

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["isMintingAllowed"]}'
undefined
```

As you can see `isMintingAllowed` is now, `undefined`. It will return `true` or `false` once set later.

#### getAllowance

This getter returns the value of `allowance` set by a token owner for a spender MSPID. It takes as Input the MSPID token owner as first argument and MSPID of spender as second argument. It defaults to `0` until it is set once. You can find the required logic [here](). // add permlink

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getAllowance", "Org1MSP", "Org2MSP"]}'
0
```

As you can see `getAllowance` is now, `0`. It will return `float` once set later. Lets also check for the other combination we have and see if it returns `0`.

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getAllowance", "Org2MSP", "Org1MSP"]}'
0
```

#### getBalanceOf

Our last getter is `getBalanceOf` function, it returns the token balance of every MSPID we enter. It also defaults to 0 if the MSPID don't have any token balance.

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getBalanceOf", "Org1MSP"]}'
0
peer chaincode query -C mychannel -n mycc -c '{"Args":["getBalanceOf", "Org2MSP"]}'
0
```

You can checkout the required code [here](). // add permlink

### Setter functions

Once you're done with the getter calls let's explore the setter functions provided in our SimpleToken. Remember you will need to satisfy the endorsement policy before you can make these transactions happen, so you will see some extra fields here. It will also take some time when a setter is called for the first time to a specific peer, later it returns results almost instantaniously. Also right now the CLI's configuration is set to Org1 peer0, you can check it using:

```sh
echo $CORE_PEER_ADDRESS
peer0.org1.techracers.com:7051
```

You can change to peer0, Org2 by running the following commands:

```sh
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/users/Admin@org2.techracers.com/msp

export CORE_PEER_ADDRESS=peer0.org2.techracers.com:7051

export CORE_PEER_LOCALMSPID="Org2MSP"

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt
```

Use a similar strategy for other peers.

#### updateMintingState

We assume your config is set to peer0 of org1, otherwise set it using the following commands:

```sh
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/users/Admin@org1.techracers.com/msp

export CORE_PEER_ADDRESS=peer0.org1.techracers.com:7051

export CORE_PEER_LOCALMSPID="Org1MSP"

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt
```

Now let's try to update our minting state to `true`. We need to specify the Orderer and the peers to satisfy our endorsement policy.

> Note: If you're following this tutoria;l this will be your first invocation so it will take some time.

```sh
peer chaincode invoke -o orderer.techracers.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/techracers.com/orderers/orderer.techracers.com/msp/tlscacerts/tlsca.techracers.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt --peerAddresses peer0.org2.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt -c '{"Args":["updateMintingState","true"]}'

2018-09-07 11:37:51.688 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

Now run the getter to see if it actually changed:

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["isMintingAllowed"]}'
true
```

Note: If you call it using peer0 of Org2, it will fail with the following result:

```sh
Error: endorsement failure during invoke. chaincode result: <nil>
```

You can open another Terminal and check the error logs as follows:

```sh
docker logs dev-peer0.org2.techracers.com-mycc-1.0

> token_chaincode@1.0.0 start /usr/local/src
> node tokenChaincode.js "--peer.address" "peer0.org2.techracers.com:7052"

E0907 11:37:51.462891616      19 ssl_transport_security.cc:238] Could not get common name of subject fromcertificate.
========= Token chaincode Invoke =========
========= Calling Function updateMintingState =========
========= Token chaincode Invoke =========
========= Calling Function updateMintingState =========
Error: Function only accessible to token owner: Org1MSP.
    at _throw (/usr/local/src/helpers/validations.js:74:9)
    at Function.checkCallerIsOwner (/usr/local/src/helpers/validations.js:62:7)
    at updateMintingState (/usr/local/src/tokens/MintableToken.js:32:17)
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
2018-09-07T11:40:45.711Z ERROR [lib/handler.js] [mychannel-0e379835]Calling chaincode Invoke() returned error response [Error: Function only accessible to token owner: Org1MSP.]. Sending ERROR message back to peer
```

> Note: You can enquire about other errors in a similar fashion, just be sure you are hitting the right peer.

If you want to know more about other validations you can check the chaincode [here](). // add permlink


#### mint

This function can be used to create/[mint](https://en.wikipedia.org/wiki/Mint_(facility)) tokens by the token owner. But `isMintingAllowed` should be set to `true`. Let's mint some tokens for `Org1MSP`. Make sure your config is set to Token Owner.

```sh
peer chaincode invoke -o orderer.techracers.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/techracers.com/orderers/orderer.techracers.com/msp/tlscacerts/tlsca.techracers.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt --peerAddresses peer0.org2.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt -c '{"Args":["mint","Org1MSP", "100.2345"]}'

2018-09-07 11:58:15.951 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

You can check the balance using our getter:

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getBalanceOf", "Org1MSP"]}'
100.2345
```

If you experience errors troubleshoot them using `docker log` and you can find the chaincode [here]().

#### transfer

Now we know that we have `100.2345` tokens registered under `Org1MSP`. Let's try to transfer `10` tokens to `Org2MSP`.  

```sh
peer chaincode invoke -o orderer.techracers.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/techracers.com/orderers/orderer.techracers.com/msp/tlscacerts/tlsca.techracers.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt --peerAddresses peer0.org2.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt -c '{"Args":["transfer","Org2MSP", "10"]}'

2018-09-07 12:09:37.441 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

You can check Org2's balance using:

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getBalanceOf", "Org2MSP"]}'
10
```

If you experience errors troubleshoot them using `docker log` and you can find the chaincode [here]().

#### updateTokenName

You can update the token name using this setter.

```sh
peer chaincode invoke -o orderer.techracers.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/techracers.com/orderers/orderer.techracers.com/msp/tlscacerts/tlsca.techracers.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt --peerAddresses peer0.org2.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt -c '{"Args":["updateTokenName","TECH COIN"]}'

2018-09-07 12:12:45.255 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

Check it using:

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getName"]}'
TECH COIN
```
If you experience errors troubleshoot them using `docker log` and you can find the chaincode [here]().

#### updateTokenSymbol

You can update the token symbol using this setter.

```sh
peer chaincode invoke -o orderer.techracers.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/techracers.com/orderers/orderer.techracers.com/msp/tlscacerts/tlsca.techracers.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt --peerAddresses peer0.org2.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt -c '{"Args":["updateTokenSymbol","TEC"]}'

2018-09-07 12:15:11.390 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

Check it using:

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getSymbol"]}'
TEC
```
If you experience errors troubleshoot them using `docker log` and you can find the chaincode [here]().

#### updateApproval

If you want some other MSPID to spend some tokens on your behalf you can use this setter.

```sh
peer chaincode invoke -o orderer.techracers.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/techracers.com/orderers/orderer.techracers.com/msp/tlscacerts/tlsca.techracers.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt --peerAddresses peer0.org2.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt -c '{"Args":["updateApproval","Org2MSP", "30"]}'

2018-09-07 12:18:19.068 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

Check it using:

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getAllowance", "Org1MSP", "Org2MSP"]}'
30
```
If you experience errors troubleshoot them using `docker log` and you can find the chaincode [here]().

#### transferFrom

Once you have approved Org2 to transfer on behalf of Org1. First set the config in cli for Org2, so you can call functions on it's behalf.

```sh
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/users/Admin@org2.techracers.com/msp

export CORE_PEER_ADDRESS=peer0.org2.techracers.com:7051

export CORE_PEER_LOCALMSPID="Org2MSP"

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt
```
Now lets transfer a float value to a non existent, but valid MSPID.

> Note: Such MSPIDs can be created later and will have tokens preallocated to them, just like Ethereum addresses. 

```sh
peer chaincode invoke -o orderer.techracers.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/techracers.com/orderers/orderer.techracers.com/msp/tlscacerts/tlsca.techracers.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt --peerAddresses peer0.org2.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt -c '{"Args":["transferFrom","Org1MSP", "UndefinedOrgMSP", "29.8989"]}'

2018-09-07 12:26:14.920 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

Check it using:

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getBalanceOf", "Org1MSP"]}'

60.3356

peer chaincode query -C mychannel -n mycc -c '{"Args":["getBalanceOf", "Org2MSP"]}'

10
```

If you experience errors troubleshoot them using `docker log` and you can find the chaincode [here]().

#### transferOwnership

Lastly set your conffig back to Owner of token and try transfering Token Ownership.

```sh
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/users/Admin@org1.techracers.com/msp

export CORE_PEER_ADDRESS=peer0.org1.techracers.com:7051

export CORE_PEER_LOCALMSPID="Org1MSP"

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt

peer chaincode invoke -o orderer.techracers.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/techracers.com/orderers/orderer.techracers.com/msp/tlscacerts/tlsca.techracers.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.techracers.com/peers/peer0.org1.techracers.com/tls/ca.crt --peerAddresses peer0.org2.techracers.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.techracers.com/peers/peer0.org2.techracers.com/tls/ca.crt -c '{"Args":["transferOwnership","Org2MSP"]}'

2018-09-07 12:33:40.267 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200
```

Check it using:

```sh
peer chaincode query -C mychannel -n mycc -c '{"Args":["getOwner"]}'
Org2MSP
```

If you experience errors troubleshoot them using `docker log` and you can find the chaincode [here]().

## ERC20 Architecture by Zeppelin
We used [Zepeelin Solidity's](https://github.com/OpenZeppelin/openzeppelin-solidity) tested standards to create this ERC20 token version on HyperLedger. You can refer to the architechural model of ERC20 here:

- **Helpers**  - Includes validations, checks which must be fulfilled during chaincode invocation or query; and utils for making the code `DRY`.
- **examples** - A simple chaincode that demonstrate how to create a simple token using the basic chaincodes provided in the repository.
- **ERC20** - A standard interface for fungible ERC20 tokens on HyperLedger.

## Security
Techracers is meant to provide secure and simple code, but please use common sense when doing anything that deals with real money! We take no responsibility for your implementation decisions and any security problem you might experience.

The core development principles and strategies that Techracers is based on include: security in depth, simple and modular code, clarity-driven naming conventions, comprehensive unit testing, pre-and-post-condition sanity checks, code consistency, and regular audits.

If you need further help, please email [support@techracers.com](mailto:support@techracers.com). If you want to work with us email at [sales@techracers.com](mailto:sales@techracers.com)

> Note: We welcome recommendations and suggestions from the Open source community, If you think you can help us [raise an issue]().

## License
Code released under the [MIT License]().