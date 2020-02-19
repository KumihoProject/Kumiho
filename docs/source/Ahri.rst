
====
Ahri
====

``Ahri`` 는 Kumiho 플랫폼을 사용하기 위한 SDK입니다. 

.. code-block:: javascript

    const Ahri = window.Ahri;

------------------------------------------------------------------------------


compileSolidity
=====================
.. code-block:: javascript

    async compileSolidity(solidity, host)
    
솔리디티를 컴파일 하는 함수. ``${host}/api/compile`` 로 요청합니다. host의 기본값은 ``https://kumiho.org`` 입니다. ``Solidity.sol`` 로 컴파일 됩니다.

.. code-block:: javascript

    const result = await Ahri.compileSolidity(solidity);
    
    console.log(result);
    
    //{
    //  contracts: {Solidity.sol: {…}},
    //  sources: {Solidity.sol: {…}},
    //}

------------------------------------------------------------------------------


deployContract
=====================
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
=====================
.. code-block:: javascript

    async callByUrl(url, method, args, value = 0, options = {})
    
``callByUrl`` 은 해당 url을 가진 Smart Contract를 호출하는 함수입니다. ``POST`` 일 경우 리턴값은 없습니다.

----------
Parameters
----------

1. ``url`` - ``String``: 타겟 Contract와 매핑된 Url
2. ``method`` - ``'GET'|'POST'``: Target을 호출할 method. pure, view 함수일 경우 ``GET`` 을, 일반적인 함수나 payable일 경우 ``POST`` 를 사용 합니다.
3. ``args`` - ``Array``: Contract에 넘겨 줄 arguments
4. ``value`` - ``int``: 지불할 비용(Peb). ``method`` 가 ``GET`` 일때는 무시됩니다.

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
=====================
.. code-block:: javascript

    async callByAddress(address, method, functionName, args, argTypes, resultTypes, value = 0, options = {})

``callByAddress`` 은 해당 address를 가진 Smart Contract를 호출하는 함수입니다. ``POST`` 일 경우 리턴값은 없습니다.

.. code-block:: javascript

    let result = await Ahri.callByAddress('0x56f8eF1d4986460df8783d2A2147C1069203F848', 'GET', 'getValue', [], [], ['uint256']);
    console.log(result);
    //{0: "1", __length__: 1}
    
    await Ahri.callByAddress('0x56f8eF1d4986460df8783d2A2147C1069203F848', 'POST', 'setValue', [13], ['uint256'], []);
    
    result = await Ahri.callByAddress('0x56f8eF1d4986460df8783d2A2147C1069203F848', 'GET', 'getValue', [], [], ['uint256']);
    console.log(result);
    //{0: "3", __length__: 1}

------------------------------------------------------------------------------


fetch
=====================
.. code-block:: javascript

    async fetch(url, req = {})

------------------------------------------------------------------------------


getApiInterface
=====================
.. code-block:: javascript

    async getApiInterface(url)
