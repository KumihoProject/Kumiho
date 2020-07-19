pragma solidity >=0.5.0 <0.6.0;

contract KumihoAuction {
    address owner;
    uint16 public depositPercent; // 경매 보증금. 최소입찰가를 넘었는데 유찰시키면 보증금 압수.
    uint256 public minDeposit;
    uint16 public feePercent; // 낙찰시 수수료.
    uint256 public maxDuration; // 최대 경매 기간
    uint256 public minDuration;
    uint256 public bidderWinDuration; // endBlock 이후 bidderWinDuration동안 opener가 유찰/낙찰 시키지 않으면 참여자가 직접 낙찰

    // stage: 0: 없는경매 1: 경매중 2: 낙찰 3: 유찰
    // minimumBid: 최소입찰가
    struct Auction {
        uint8 stage;
        string domain;
        uint256 auctionEndBlock;
        address opener;
        uint256 minBid;
        uint256 deposit;
        address highestBidder;
        uint256 highestBid;
    }

    // mapping의 key는 hash(domain, opener)이다.
    mapping(uint256 => Auction) internal auctions;

    event AuctionOpen(string domain, uint256 auctionKey);
    event AuctionSuccess(string domain, uint256 auctionKey);
    event AuctionFail(string domain, uint256 auctionKey);

    event Participate(
        string domain,
        address bidder,
        uint256 amount,
        uint256 auctionKey
    );

    event DropPayment(address beneficiary, uint256 amount);
    event FailedDropPayment(address beneficiary, uint256 amount);
    event DepositRefund(address beneficiary, uint256 amount);
    event FailedDepositRefund(address beneficiary, uint256 amount);
    event FailRefund(address beneficiary, uint256 amount);
    event FailedFailRefund(address beneficiary, uint256 amount);
    event SuccessPayment(address beneficiary, uint256 amount);
    event FailedSuccessPayment(address beneficiary, uint256 amount);

    event ReqTransferDomainOwner(
        string domain,
        address newOwner,
        address owner
    );

    constructor() public {
        owner = msg.sender;
        minDeposit = 1 ether;
        depositPercent = 3;
        feePercent = 10;
        minDuration = 60 * 60; // 최소 1시간
        maxDuration = 60 * 60 * 24 * 7; // 최대 1주일
        bidderWinDuration = 60 * 60 * 24; // 하루
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setMinDeposit(uint256 _minDeposit) public onlyOwner {
        minDeposit = _minDeposit;
    }

    function setDepositPercent(uint16 _depositPercent) public onlyOwner {
        depositPercent = _depositPercent;
    }

    function setFeePercent(uint16 _feePercent) public onlyOwner {
        feePercent = _feePercent;
    }

    function setMaxDuration(uint256 _maxDuration) public onlyOwner {
        maxDuration = _maxDuration;
    }

    function setMinDuration(uint256 _minDuration) public onlyOwner {
        minDuration = _minDuration;
    }

    function setBidderWinDuration(uint256 _bidderWinDuration) public onlyOwner {
        bidderWinDuration = _bidderWinDuration;
    }

    function openAuction(
        string memory domain,
        uint256 auctionDuration,
        uint256 minBid
    ) public payable {
        // 경매 기간 검증
        uint256 auctionEndBlock = block.number + auctionDuration;
        require(
            auctionEndBlock > block.number + minDuration,
            "Auction end is too early"
        );
        // 경매 기간 검증
        require(
            auctionEndBlock < block.number + maxDuration,
            "Auction end is too far"
        );
        // 최저입찰가는 1 클레이보다는 커야한다.
        require(minBid >= 1 ether, "Minimum bid too small");
        // 보증금 체크
        require(
            msg.value >= (minBid / 100) * depositPercent,
            "Insufficient deposit fee (percent)"
        );
        require(msg.value >= minDeposit, "Insufficient deposit fee (1 ether)");

        uint256 auctionKey = uint256(
            keccak256(abi.encodePacked(domain, msg.sender))
        );

        Auction storage auction = auctions[auctionKey];

        require(auction.stage != 1, "Auction is opened");

        emit AuctionOpen(domain, auctionKey);

        auction.domain = domain;
        auction.auctionEndBlock = auctionEndBlock;
        auction.opener = msg.sender;
        auction.minBid = minBid;
        auction.deposit = msg.value;
        auction.highestBidder = address(0);
        auction.highestBid = 0;
        auction.stage = 1;
    }

    function getAuctionInfo(uint256 auctionKey)
        public
        view
        returns (
            uint8 stage,
            string memory domain,
            uint256 auctionEndBlock,
            address opener,
            uint256 minBid,
            uint256 deposit,
            address highestBidder,
            uint256 highestBid
        )
    {
        Auction storage auction = auctions[auctionKey];
        return (
            auction.stage,
            auction.domain,
            auction.auctionEndBlock,
            auction.opener,
            auction.minBid,
            auction.deposit,
            auction.highestBidder,
            auction.highestBid
        );
    }

    function participateAuction(uint256 auctionKey) public payable {
        Auction storage auction = auctions[auctionKey];
        require(auction.stage == 1, "Auction is not opened");
        require(auction.auctionEndBlock > block.number, "Auction is ended");
        require(
            msg.value >= auction.highestBid + 0.1 ether,
            "Value is smaller then highest"
        );
        require(msg.value % 0.1 ether == 0, "Value precision error");
        require(msg.value >= auction.minBid, "Value is smaller then highest");
        require(auction.highestBidder != msg.sender, "Same bidder");

        uint256 pastBid = auction.highestBid;
        address pastBidder = auction.highestBidder;

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit Participate(auction.domain, msg.sender, msg.value, auctionKey);

        if (address(uint160(pastBidder)).send(pastBid)) {
            emit DropPayment(pastBidder, pastBid);
        } else {
            emit FailedDropPayment(pastBidder, pastBid);
        }
    }

    // 유찰시키는 함수
    function failAuction(uint256 auctionKey) public payable {
        Auction storage auction = auctions[auctionKey];
        require(auction.stage == 1, "Auction is not opening");
        require(block.number > auction.auctionEndBlock, "Auction not ended");
        require(auction.opener == msg.sender, "Only opener can fail auction");

        auction.stage = 3;

        emit AuctionFail(auction.domain, auctionKey);
        // 만일 아무도 참여하지 않았을경우 보증금 전체를 환불
        if (auction.highestBidder == address(0)) {
            uint256 refund = auction.deposit;
            auction.deposit = 0;

            if (address(uint160(auction.opener)).send(refund)) {
                emit DepositRefund(auction.opener, refund);
            } else {
                emit FailedDepositRefund(auction.opener, refund);
            }
        } else {
            // 입찰 참여자가 있을경우 입찰금액 환불 및 보증금의 일부를 분배
            uint256 failRefund = auction.deposit / 3 + auction.highestBid;
            auction.deposit = 0;
            if (address(uint160(auction.highestBidder)).send(failRefund)) {
                emit FailRefund(auction.highestBidder, failRefund);
            } else {
                emit FailedFailRefund(auction.highestBidder, failRefund);
            }
        }
    }

    function successAuction(uint256 auctionKey) public payable {
        Auction storage auction = auctions[auctionKey];
        require(auction.stage == 1, "Auction is not opening");
        require(
            auction.highestBid >= auction.minBid,
            "highest bid is smaller then highestBid"
        );
        // auctionEndBlock이 지나야만 경매 종료 가능
        // auctionEndBlock + bidderWinDuration이 지나면 highest bidder가 경매 낙찰 가능
        require(block.number > auction.auctionEndBlock, "Auction not ended");
        if (block.number < auction.auctionEndBlock + bidderWinDuration) {
            require(
                auction.opener == msg.sender,
                "Only opener can success auction now"
            );
        } else {
            require(
                auction.opener == msg.sender ||
                    auction.highestBidder == msg.sender,
                "Only highest bider or opender can success auction"
            );
        }

        auction.stage = 2;

        uint256 successAmount = auction.highestBid -
            ((auction.highestBid / 100) * feePercent) +
            auction.deposit;
        auction.deposit = 0;

        emit AuctionSuccess(auction.domain, auctionKey);
        emit ReqTransferDomainOwner(
            auction.domain,
            auction.highestBidder,
            auction.opener
        );

        if (address(uint160(auction.opener)).send(successAmount)) {
            emit SuccessPayment(auction.opener, successAmount);
        } else {
            emit FailedSuccessPayment(auction.opener, successAmount);
        }
    }

    function withDraw(uint256 value) public payable onlyOwner {
        address(uint160(owner)).transfer(value);
    }

    function() external payable {}
}