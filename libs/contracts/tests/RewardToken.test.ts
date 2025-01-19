import { expect } from "chai";
import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { ethers } from "ethers";
import { deployRahatTokenFixture, TokenFixture } from "./fixtures/tokenFixture";

describe('------ Reward Token Tests ------', function () {


  describe("Deployment", function () {

    let tf: TokenFixture;
    let minter: ethers.Signer;
    // let provider: EthereumProvider;
    before(async function () {
      tf = await loadFixture(deployRahatTokenFixture);
      minter = tf.signers[0];

    });
    it("should deploy contracts with expected initial values", async function () {
      expect(await tf.rewardToken.name()).to.equal('Rahat');
      expect(await tf.rewardToken.symbol()).to.equal('RTH');
      expect(await tf.rewardToken.decimals()).to.equal(0n);
      expect(await tf.rewardToken.totalSupply()).to.equal(0n);
    });

    it("should not be able to mint tokens without role", async function () {
      await expect(tf.rewardToken.connect(minter).mint(minter.address, 100000n)).to.be.revertedWith('Not a minter');
    });

    it('should set minter', async function () {
      const tokenAppId = hre.ethers.id('TOKEN_APP');
      const MINTER_ROLE = hre.ethers.id('MINTER')
      await tf.accessManagerV2.connect(tf.deployer).grantRole(tokenAppId, MINTER_ROLE, minter.address);
      //check if minter has access to mint function
      const hasRole = await tf.accessManagerV2.hasRole(tokenAppId, MINTER_ROLE, minter.address);
      expect(hasRole).to.equal(true);
    })
    it("should mint tokens", async function () {
      await tf.rewardToken.connect(minter).mint(minter.address, 100000n);
      expect(await tf.rewardToken.balanceOf(minter.address)).to.equal(100000n);
    });

  });
});

