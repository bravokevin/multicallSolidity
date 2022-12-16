import { ethers } from "hardhat";

interface Token {
    target: string;
    callData: string;
    name?: string;
}

const iface = new ethers.utils.Interface(
    [
        'function latestRoundData() external view returns(uint80 roundId,int256 answer,uint256 startedAt,uint256 updatedAt,uint80 answeredInRound)'
    ]);

const callData = iface.encodeFunctionData("latestRoundData()", []);

const TOKENS: Token[] = [
    {
        target: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        callData
    },
    {
        target: "0xc929ad75B72593967DE83E7F7Cda0493458261D9",
        callData
    },
    {
        target: "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
        callData
    },
    {
        target: "0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7",
        callData
    },
    {
        target: "0xAE48c91dF1fE419994FFDa27da09D5aC69c30f55",
        callData
    },
    {
        target: "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A",
        callData
    },
    {
        target: "0x553303d460EE0afB37EdFf9bE42922D8FF63220e",
        callData
    },

]


const addTokensNames = () => {
    const NAMES = ["ETH", "1INCH", "AAVE", "ADA", "AVAX", "BNB", "UNI"]
    NAMES.forEach((name, index) => {
        TOKENS[index].name = name;
    })

}


const multicall = async () => {
    const multicallContract = await ethers.getContractAt("IMulticall2", "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696");
    const results = await multicallContract.callStatic.tryAggregate(true, TOKENS);

    addTokensNames()
    results.forEach((result, index) => {
        const price = iface.decodeFunctionResult("latestRoundData()", result.returnData)

        console.log(`The price of ${TOKENS[index].name} in usd is ${Number(price.answer)} `)
    });

}

multicall()