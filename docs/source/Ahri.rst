
====
.. index:: ! Ahri

.. _Ahri:
Ahri
====

``Ahri`` 는 Kumiho 플랫폼을 사용하기 위한 SDK입니다. 

.. code-block:: javascript

    const Ahri = window.Ahri;

------------------------------------------------------------------------------


compileSolidity
---------------------
.. code-block:: javascript

    async compileSolidity(solidity, { version, host })
    
솔리디티를 컴파일 하는 함수. ``${host}/api/compile`` 로 요청합니다. host의 기본값은 ``https://kumiho.org`` 입니다. version의 기본값은 ``v0.5.6+commit.b259423e``입니다. ``Solidity.sol`` 로 컴파일 됩니다.

.. code-block:: javascript

    const result = await Ahri.compileSolidity(solidity);
    
    console.log(result);
    
    //{
    //  contracts: {Solidity.sol: {…}},
    //  sources: {Solidity.sol: {…}},
    //}

------------------------------------------------------------------------------


deployContract
---------------------
.. code-block:: javascript

    async deployContract(abi, bin, args, options = {})
    
Contract를 배포합니다.

.. code-block:: javascript

    const contract = await Ahri.compileSolidity(solidity);
    const className = Object.keys(contract.contracts['Solidity.sol'])[0];
    const abi = contract.contracts['Solidity.sol'][className].abi;
    const bin = '0x' + contract.contracts['Solidity.sol'][className].evm.bytecode.object;
    
    const depResult = await Ahri.deployContract(abi, bin, [1, 'test'], options = {gas: 1500000})

------------------------------------------------------------------------------


callByUrl
---------------------
.. code-block:: javascript

    async callByUrl(url, method, args, value = 0, options = {})
    
``callByUrl`` 은 해당 url을 가진 Smart Contract를 호출하는 함수입니다. ``POST`` 일 경우 리턴값은 없습니다.

----------
Parameters
----------

1. ``url`` - ``String``: 타겟 Contract와 매핑된 Url
2. ``method`` - ``'GET'|'POST'``: Target을 호출할 method. pure, view 함수일 경우 ``GET`` 을, 일반적인 함수나 payable일 경우 ``POST`` 를 사용 합니다.
3. ``args`` - ``Array``: Contract에 넘겨 줄 arguments
4. ``value`` - ``int``: 지불할 비용(Peb). ``method`` 가 ``GET`` 일때는 무시됩니다. default: 0
5. ``options``

----------
Options
----------

1. ``gas`` - ``int``: gas 제한. default: 1500000
2. ``gasPrice`` - ``int``: gas price. default: caver default
3. ``anonymous`` - ``Boolean``: (v1.0.1) Method가 GET이고 anonymous가 true일경우 호출시 msg.sender를 ``0x0000000000000000000000000000000000000000`` 로 설정. Kaikas에 접근 권한을 묻지 않는다.

----------
Returns
----------

1. ``Object`` - Contract가 리턴한 값

.. code-block:: javascript

    let result = await Ahri.callByUrl('demo.klay/get', 'GET', []);
    console.log(result);
    //{0: "1", __length__: 1}
    
    await Ahri.callByUrl('demo.klay/set', 'POST', [3]);
    
    result = await Ahri.callByUrl('demo.klay/get', 'GET', []);
    console.log(result);
    //{0: "3", __length__: 1}

------------------------------------------------------------------------------


callByAddress
---------------------
.. code-block:: javascript

    async callByAddress(address, method, functionName, args, argTypes, resultTypes, value = 0, options = {})

``callByAddress`` 은 해당 address를 가진 Smart Contract를 호출하는 함수입니다. ``POST`` 일 경우 리턴값은 없습니다.

----------
Parameters
----------

1. ``address`` - ``Address``: 타겟 Contract의 주소
2. ``method`` - ``'GET'|'POST'``: Target을 호출할 method. pure, view 함수일 경우 ``GET`` 을, 일반적인 함수나 payable일 경우 ``POST`` 를 사용 합니다.
3. ``functionName`` - ``string``: 호출할 함수 이름
4. ``args`` - ``Array``: Contract에 넘겨 줄 arguments
5. ``argTypes`` - ``Array<Type>``: Contract에 넘겨 줄 arguments의 Types ex: ``['uint256', 'string', 'address']``
6. ``resultTypes`` - ``Array<Type>``: returns의 Types ex: ``['uint256', 'string', 'address']``
7. ``value`` - ``int``: 지불할 비용(Peb). ``method`` 가 ``GET`` 일때는 무시됩니다. dafult: 0
8. ``options``

----------
Options
----------

1. ``gas`` - ``int``: gas 제한. default: 1500000
2. ``gasPrice`` - ``int``: gas price. default: caver default
3. ``anonymous`` - ``Boolean``: (v1.0.1) Method가 GET이고 anonymous가 true일경우 호출시 msg.sender를 ``0x0000000000000000000000000000000000000000`` 로 설정. Kaikas에 접근 권한을 묻지 않는다.

.. code-block:: javascript

    let result = await Ahri.callByAddress('0x56f8eF1d4986460df8783d2A2147C1069203F848', 'GET', 'getValue', [], [], ['uint256']);
    console.log(result);
    //{0: "1", __length__: 1}
    
    await Ahri.callByAddress('0x56f8eF1d4986460df8783d2A2147C1069203F848', 'POST', 'setValue', [3], ['uint256'], []);
    
    result = await Ahri.callByAddress('0x56f8eF1d4986460df8783d2A2147C1069203F848', 'GET', 'getValue', [], [], ['uint256']);
    console.log(result);
    //{0: "3", __length__: 1}

------------------------------------------------------------------------------


fetch
---------------------
.. code-block:: javascript

    async fetch(url, req = {})

HTTP Header의 ``Klay-Address`` 에 지갑의 주소를 설정하여 fetch 요청을 보냅니다.

.. code-block:: javascript

    async fetch(url, req = {}) {
        const response = await fetch(url, {
            ...req,
            headers: {
                ...(req.headers || {}),
                'Klay-Address': caver.klay.accounts.wallet.getAccount(0).address,
            }
        });
        return response;
    }
    
------------------------------------------------------------------------------


getApiInterface
---------------------
.. code-block:: javascript

    async getApiInterface(url)
    
해당 Url의 Smart Contract의 Interface를 가져옵니다.


.. code-block:: javascript

    const interface = await Ahri.getApiInterface('demo.klay/get');
    console.log(interface);
    
    //{
    //    "address": "0x56f8eF1d4986460df8783d2A2147C1069203F848",
    //    "functionName": "getValue",
    //    "parameters": [],
    //    "result": [
    //        "uint256"
    //    ]
    //}
 
------------------------------------------------------------------------------


getEvents
---------------------
.. code-block:: javascript

    async getEvents(url, fromBlock, toBlock)

해당 Url의 Event들을 가져옵니다.

.. code-block:: javascript

    const events = await Ahri.getEvents('kumiho.klay/redistribution/event/Vote', prevBlockNum + 1, currentBlockNum)

    //[
    //    {
    //        "data": [
    //            "1",
    //            "0x242BCe82d002DB2De7cE19D5b005E7d534C05321"
    //        ],
    //        "blockNumber": 23334472,
    //        "logIndex": 0
    //    },
    //    {
    //        "data": [
    //            "2",
    //            "0x242BCe82d002DB2De7cE19D5b005E7d534C05321"
    //        ],
    //       "blockNumber": 23334480,
    //        "logIndex": 0
    //    },
    //    {
    //        "data": [
    //            "11",
    //            "0x242BCe82d002DB2De7cE19D5b005E7d534C05321"
    //        ],
    //        "blockNumber": 23334508,
    //        "logIndex": 0
    //    }
    //]

------------------------------------------------------------------------------


getRecentEvents
---------------------
.. code-block:: javascript

    async getRecentEvents(url, blockCount)

해당 Url의 Event들을 가져옵니다.

.. code-block:: javascript

    const events = await Ahri.getRecentEvents('kumiho.klay/redistribution/event/Vote', 100)

    //[
    //    {
    //        "data": [
    //            "1",
    //            "0x242BCe82d002DB2De7cE19D5b005E7d534C05321"
    //        ],
    //        "blockNumber": 23334472,
    //        "logIndex": 0
    //    },
    //    {
    //        "data": [
    //            "2",
    //            "0x242BCe82d002DB2De7cE19D5b005E7d534C05321"
    //        ],
    //       "blockNumber": 23334480,
    //        "logIndex": 0
    //    },
    //    {
    //        "data": [
    //            "11",
    //            "0x242BCe82d002DB2De7cE19D5b005E7d534C05321"
    //        ],
    //        "blockNumber": 23334508,
    //        "logIndex": 0
    //    }
    //]

