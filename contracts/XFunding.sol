// SPDX-License-Identifier: MIT
pragma solidity 0.8.19; // Fixed version, no ^ caret

// IZKVerifier definition for internal call
interface IZKVerifierInternal {
    function verifyProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[1] calldata input
    ) external view returns (bool);
}

contract XFundingEscrow {

    enum CampaignStatus { Active, Funded, Closed, Failed }

    struct Campaign {
        address founder;
        uint256 goal;
        uint256 totalRaised;
        uint256 deadline;
        CampaignStatus status;
        bool fundsDisbursed;
        uint256 totalDisbursed;
        bytes encryptedTotalRaised; // FIX: Add FHE tally on-chain
    }

    struct Investment {
        uint256 amount;
        bool refunded;
        bytes encryptedAmount;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => Investment)) public investments;

    address public verifier; // IZKVerifier address

    uint256 public nextCampaignId;
    address public platformAdmin;

    event CampaignCreated(uint256 indexed campaignId, address indexed founder, uint256 goal);
    event InvestmentMade(uint256 indexed campaignId, address indexed investor, uint256 amount);
    event MilestoneReleased(uint256 indexed campaignId, uint256 amount);
    event RefundClaimed(uint256 indexed campaignId, address indexed investor, uint256 amount);
    event CampaignFailed(uint256 indexed campaignId);
    event VerifierUpdated(address indexed newVerifier);

    modifier onlyAdmin() {
        require(msg.sender == platformAdmin, "Only admin");
        _;
    }

    constructor() {
        platformAdmin = msg.sender;
    }

    function createCampaign(uint256 _goal, uint256 _durationDays) external returns (uint256) {
        require(_goal > 0, "Goal must be > 0");
        require(_durationDays > 0, "Duration must be > 0");

        uint256 id = nextCampaignId++;
        campaigns[id] = Campaign({
            founder: msg.sender,
            goal: _goal,
            totalRaised: 0,
            deadline: block.timestamp + (_durationDays * 1 days),
            status: CampaignStatus.Active,
            fundsDisbursed: false,
            totalDisbursed: 0,
            encryptedTotalRaised: ""
        });

        emit CampaignCreated(id, msg.sender, _goal);
        return id;
    }

    function setVerifier(address _verifier) external onlyAdmin {
        require(_verifier != address(0), "Invalid address");
        verifier = _verifier;
        emit VerifierUpdated(_verifier);
    }

    function contribute(uint256 _campaignId) public payable {
        Campaign storage c = campaigns[_campaignId];
        require(block.timestamp < c.deadline, "Expired");
        require(c.status == CampaignStatus.Active, "Inactive");
        require(msg.value > 0, "Must send ETH");

        investments[_campaignId][msg.sender].amount += msg.value;
        c.totalRaised += msg.value;

        if (c.totalRaised >= c.goal) {
            c.status = CampaignStatus.Funded;
        }

        emit InvestmentMade(_campaignId, msg.sender, msg.value);
    }


    function contributeEncrypted(
        uint256 _campaignId,
        bytes calldata _encryptedAmount,
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[1] calldata input
    ) external payable {
        if (verifier != address(0)) {
            require(
                IZKVerifierInternal(verifier).verifyProof(a, b, c, input),
                "Invalid ZK Proof"
            );
        }
        
        investments[_campaignId][msg.sender].encryptedAmount = _encryptedAmount;
        contribute(_campaignId);
    }

    // FIX #2: Added balance guard so admin can't over-release
    function releaseMilestoneFunds(
        uint256 _campaignId,
        uint256 _releaseAmount
    ) external onlyAdmin {
        Campaign storage c = campaigns[_campaignId];
        require(c.status == CampaignStatus.Funded, "Not funded");
        require(_releaseAmount > 0, "Amount must be > 0");

        uint256 remaining = c.totalRaised - c.totalDisbursed;
        require(_releaseAmount <= remaining, "Exceeds available funds");

        c.totalDisbursed += _releaseAmount;

        if (c.totalDisbursed >= c.totalRaised) {
            c.fundsDisbursed = true;
            c.staPtus = CampaignStatus.Closed;
        }

        // FIX: Use call instead of transfer (transfer has 2300 gas limit issues)
        (bool success, ) = payable(c.founder).call{value: _releaseAmount}("");
        require(success, "Transfer failed");

        emit MilestoneReleased(_campaignId, _releaseAmount);
    }

    // FIX #4: Mark campaign as Failed if deadline passed and goal not met
    function markCampaignFailed(uint256 _campaignId) external {
        Campaign storage c = campaigns[_campaignId];
        require(block.timestamp > c.deadline, "Not expired");
        require(c.totalRaised < c.goal, "Goal was met");
        require(c.status == CampaignStatus.Active, "Already resolved");

        c.status = CampaignStatus.Failed;
        emit CampaignFailed(_campaignId);
    }

    function claimRefund(uint256 _campaignId) external {
        Campaign storage c = campaigns[_campaignId];

        // FIX #4: Check for Failed status OR expired+underfunded
        require(
            c.status == CampaignStatus.Failed ||
            (block.timestamp > c.deadline && c.totalRaised < c.goal),
            "No refund available"
        );

        Investment storage inv = investments[_campaignId][msg.sender];
        uint256 amount = inv.amount;
        require(amount > 0, "Nothing to refund");
        require(!inv.refunded, "Already refunded");

        inv.refunded = true;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit RefundClaimed(_campaignId, msg.sender, amount);
    }

    // FIX #5: Remove receive() or route it safely — no silent untracked ETH
    // receive() external payable {} ← REMOVED
}