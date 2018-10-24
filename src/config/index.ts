// tslint:disable:object-literal-sort-keys

export default {
  networks: {
    alphanet: {
      bip32: {
        private: 0x43587cf,
        public: 0x4358394
      },
      name: 'alphanet',
      nethash: 'd21f07a10a8314d558132de8a3848e6fa9edde754638d1aacd381c6efb8be81d',
      token: 'SBX',
      symbol: 'SBX',
      version: 0x4B,
      explorer: 'https://explorer.swapblocks.io',
      wif: 0xbb,
      p2pVersion: '0.0.1',
      activePeer: {
        ip: '136.144.141.118',
        port: 4100,
      },
      peers: [
        '164.132.216.107:4100',
        '167.99.82.39:4100'
      ],
    },
    testnet: {
      bip32: {
        private: 0x43587cf,
        public: 0x4358394
      },
      name: 'testnet',
      nethash: '9d39602ff3d69780da2c9f5ed5e24451409f6511e226bd540dd84a375508ce5b',
      token: 'DSBX',
      symbol: 'DSBX',
      version: 0x52,
      explorer: 'https://dexplorer.swapblocks.io',
      wif: 0xba,
      p2pVersion: '0.0.1',
      activePeer: {
        ip: '136.144.141.118',
        port: 4111,
      },
      peers: [
        '164.132.216.107:4111',
        '167.99.82.39:4111'
      ],
    },
  },
  blockchain: {
    interval: 8,
    delegates: 51,
    date: new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0)),
  },
};
