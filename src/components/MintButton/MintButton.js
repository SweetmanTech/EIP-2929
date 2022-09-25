import { Box, Button } from "@mui/material";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useAccount, useContract, useSigner } from "wagmi";
import abi from "./abi.json";

const MintButton = () => {
  const { data: address } = useAccount();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signer,
  });

  const contractTwo = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi,
    signer
  );

  const withdraw = () => {
    if (!address) {
      toast.error("Please connect wallet.");
      return;
    }
    contract
      .withdraw()
      .then(async (tx) => {
        const receipt = await tx.wait();
        toast.success("Withdrew with Access Lists!");
      })
      .catch((error) => {
        toast.error(error?.reason || error.message);
      });
  };

  const withdrawAccessList = () => {
    if (!address) {
      toast.error("Please connect wallet.");
      return;
    }
    contractTwo
      .withdraw({
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("10", "gwei").toString(),
        accessList: [
          {
            address: "0xf29ff96aaea6c9a1fba851f74737f3c069d4f1a9", // core dev address
            keys: [],
          },
          {
            address: "0x2a2c412c440dfb0e7cae46eff581e3e26afd1cd0", // admin gnosis safe proxy address
            keys: [
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            ],
          },
          {
            address: "0xd9db270c1b5e3bd161e8c8503c55ceabee709552", // gnosis safe master address
            keys: [],
          },
          {
            address: "0xcfbf34d385ea2d5eb947063b67ea226dcda3dc38", // engineer address
            keys: [],
          },
          {
            address: "0x86d80d18890f694dc75e78703360085140fa51fd", // liquid split address
            keys: [],
          },
        ],
      })
      .then(async (tx) => {
        const receipt = await tx.wait();
        toast.success("Withdrew with Access Lists!");
      })
      .catch((error) => {
        toast.error(error?.reason || error.message);
      });
  };

  return (
    <Box m={3} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      <Button onClick={withdraw} size="large" variant="contained">
        Withdraw
      </Button>
      <Button onClick={withdrawAccessList} size="large" variant="contained">
        Withdraw with Access Lists
      </Button>
    </Box>
  );
};

export default MintButton;
