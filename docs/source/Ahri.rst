
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

------------------------------------------------------------------------------


callByAddress
=====================
.. code-block:: javascript

    async callByAddress(address, method, functionName, args, argTypes, resultTypes, value = 0, options = {})

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
