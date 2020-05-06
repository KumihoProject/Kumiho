
========
.. index:: ! FoxBead

.. _FoxBead:
FoxBead
========

``FoxBead`` 는 Kumiho에서 제공하는 오라클 서비스입니다.

------------------------------------------------------------------------------


Commit-Reveal
---------------------
FoxBead에서 제공하는 비용이 들지않게 고안된 Commit-Reveal 매커니즘입니다.

예제는 https://github.com/KumihoProject/KumihoDice 에서 확인할 수 잇습니다.

Commit은 5분간 유지되며 Reveal을 하면 다시 5분간 유지됩니다.

1. Commit
^^^^^^^^^^^^^^^^^^^
.. code-block:: javascript

    fetch('https://bead.kumiho.org/commit-reveal/<Contract Address(Revealer)>?meta=<Meta Data>').then(console.log);

    //{
    //    "messageHash":"0xb1d0c27bad208b7a7e8df99357539680fe082f1884166a4bbdc1cd6564fdb93d",
    //    "v":"0x1b",
    //    "r":"0xb315c1941998fcea4ea6b9a4987f2282f9311857f90503c8d9e1993c7f6522e5",
    //    "s":"0x3461281ab9afb41e10ad691c2fd5c1010c2456d35c62317b8bd17b08fd2cf2c5",
    //    "signature":"0xb315c1941998fcea4ea6b9a4987f2282f9311857f90503c8d9e1993c7f6522e53461281ab9afb41e10ad691c2fd5c1010c2456d35c62317b8bd17b08fd2cf2c51b",
    //    "revealer":"0x721F785036BAf02671a6700d1769c43a9225568d",
    //    "address":"0x242BCe82d002DB2De7cE19D5b005E7d534C05321",
    //    "timestamp":1588773265450,
    //    "hashWithMeta":{
    //        "message":"0xb94597af00c399fb1be5b229625c7d6b282b085d66bc82822b0ed557b25734c3",
    //        "messageHash":"0x0ae5719d2dac8627fa5227d70b4a84ce5186289c09e20c114fce3ccf46bce930",
    //        "v":"0x1b",
    //        "r":"0x489f521e3671565b7df658fa815a20081dd2b373df91fb536d49331928eedbdf",
    //        "s":"0x6b2d41e31f4adea7d58393b7a17d8ed1c8eb682e77895caca06d1db717bf3868",
    //        "signature":"0x489f521e3671565b7df658fa815a20081dd2b373df91fb536d49331928eedbdf6b2d41e31f4adea7d58393b7a17d8ed1c8eb682e77895caca06d1db717bf38681b"
    //    }
    //}

----------
Results
----------

1. ``messageHash, v, r, s`` - ``bytes32, uint8, bytes32, bytes32``: FoxBead에서 생성한 랜덤키를 서명한 해시와 서명 정보
2. ``revealer`` - ``address``: 해당 commit을 reveal 할 contract의 주소. 해당 주소에서 emit된 KumihoCommitReveal 이벤트만이 해당 commit의 랜덤키를 reveal할 수 있다.
3. ``address`` - ``address``: 해당 commit을 sign한 signer의 주소
4. ``timestamp`` - ``Number``: 해당 commit을 생성한 timestamp
5. ``hashWithMeta`` - ``Object``: meta data와 messageHash를 hash 후 sign한 서명 데이터

----------
Meta Data
----------
.. code-block:: javascript

    const hashMetaMessage = {
        ...caver.klay.accounts.sign(caver.utils.soliditySha3(signedMessage.messageHash, meta ? caver.utils.padLeft(caver.utils.toHex(meta), 64) : ''), account.privateKey)
    };

hashWithMeta는 위와같은 과정으로 생성되며 컨트랙트에서 필요한 검증이 필요한 데이터의 경우 위와같이 전송할 수 있습니다.
KumihoDice에서 commitLastBlock을 위 Meta Data를 이용하여 전송받고 검증합니다.

.. code-block:: solidity

    // Check that commit is valid - it has not expired and its signature is valid.
    require(block.number <= commitLastBlock, "Commit has expired.");
    // secretSigner(구미호)로부터 받은것인지 확인
    require(
        secretSigner ==
            ecrecover(
                keccak256(
                    abi.encodePacked(
                        "\x19Klaytn Signed Message:\n32",
                        keccak256(abi.encodePacked(commit, commitLastBlock))
                    )
                ),
                metaV,
                metaR,
                metaS
            ),
        "ECDSA signature is not valid."
    );

2. Reveal
^^^^^^^^^^^^^^^^^^^^^^^^

Commit단계에서 Address를 지정한 Contract에서 KumihoCommitReveal 이벤트가 발생하면 FoxBead에선 Commit을 Reveal합니다.

.. code-block:: solidity

    event KumihoCommitReveal(bytes32 message)

-------------
Parameters
-------------

1. ``message`` - ``bytes32``: Reveal할 Commit

FoxBead에서 KumihoCommitReveal 이벤트를 감지하면 해당 Commit을 Reveal하며 이것을 조회할 수 있습니다.

.. code-block:: javascript

    fetch('https://bead.kumiho.org/commit-reveal/<Commit>').then(console.log);

    //{
    //    "revealed":true,
    //    "revealer":"0x721F785036BAf02671a6700d1769c43a9225568d",
    //    "message":"0x75cc0161727546b539a250e833a7d2095c544b89b479e4797cfb046a09f00f30",
    //    "messageHash":"0x55fea6b2a278c570869fe2eac9565467edd8f75f4643f512a2f48d0fed3aecae",
    //    "v":"0x1c",
    //    "r":"0xc60d5770f5909b4e463648cb3b51aab7970aa1dfe6a7ffb3cdc532ea137a7557",
    //    "s":"0x61a9e7a38761674b9e0f361ec7cc05f74be80278b41e076ca3fc87477f250103",
    //    "signature":"0xc60d5770f5909b4e463648cb3b51aab7970aa1dfe6a7ffb3cdc532ea137a755761a9e7a38761674b9e0f361ec7cc05f74be80278b41e076ca3fc87477f2501031c",
    //    "address":"0x242BCe82d002DB2De7cE19D5b005E7d534C05321",
    //    "timestamp":1588776238941,
    //    "hashWithMeta":{
    //        "message":"0x4650c53ede91b5e625ea3beafcc601d7f3fa1872ddf276c67233e4485190990d",
    //        "messageHash":"0xb456c36a5d7237a67bd7ffd4f1d7bde232edb99a14ee7779c4bc854af8b523ef",
    //        "v":"0x1b",
    //        "r":"0x6423de8badc8b255e08ea263a1e59377282a1614364636e42a02c291821083a5",
    //        "s":"0x3b2b1b3a62e5da2ffe65d54fa67fa3a756bde1dc50766b328057bd85408cfdac",
    //        "signature":"0x6423de8badc8b255e08ea263a1e59377282a1614364636e42a02c291821083a53b2b1b3a62e5da2ffe65d54fa67fa3a756bde1dc50766b328057bd85408cfdac1b"
    //    },
    //    "revealedTimestamp":1588776263957
    //}

----------
Results
----------

1. ``revealed`` - ``boolean``: 해당 Commit의 reveal여부
2. ``message`` - ``bytes32``: Commit 단계에서 생성된 랜덤키
3. ``messageHash, v, r, s`` - ``bytes32, uint8, bytes32, bytes32``: FoxBead에서 생성한 랜덤키를 서명한 해시와 서명 정보
4. ``revealer`` - ``address``: 해당 commit을 reveal 할 contract의 주소. 해당 주소에서 emit된 KumihoCommitReveal 이벤트만이 해당 commit의 랜덤키를 reveal할 수 있다.
5. ``address`` - ``address``: 해당 commit을 sign한 signer의 주소
6. ``timestamp`` - ``Number``: 해당 commit을 생성한 timestamp
7. ``hashWithMeta`` - ``Object``: meta data와 messageHash를 hash 후 sign한 서명 데이터
8. ``revealedTimestamp`` - ``Number``: FoxBead에서 Reveal한 시간

------------------------------------------------------------------------------

