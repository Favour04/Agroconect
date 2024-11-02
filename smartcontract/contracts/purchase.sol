// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

import "hardhat/console.sol";

contract Purchase {
    uint public value;
    address public seller;
    address public buyer;
    uint256 public paymentTimestamp;
    uint256 public CONFIRMATION_PERIOD;

    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, DISPUTE, INACTIVE }
    State public state;

    error InvalidState();

     modifier condition(bool condition_) {
        require(condition_);
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this.");
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this.");
        _;
    }

    modifier inState(State _state) {
        if (state != _state) revert InvalidState();
        _;
    }

    event Aborted();
    event PurchaseConfirmed();

    constructor(uint256 _amount) {
        seller = msg.sender;
        value = _amount;
        state = State.AWAITING_PAYMENT;
    }

    function abort() public onlySeller {
        require(state != State.DISPUTE, "Cant abort in dipute state");
        emit Aborted();
        state = State.INACTIVE;
        console.log("Purchase aborted");
    }

    function makePurchase() public onlyBuyer 
                            inState(State.AWAITING_PAYMENT)
                            condition(msg.value == value) 
                            payable {
        emit PurchaseConfirmed();
        buyer = payable(msg.sender);
        paymentTimestamp = block.timestamp;
        state = State.AWAITING_DELIVERY;
        console.log("Purchase confirmed");
    }

    function confirmDelivery() public onlyBuyer inState(State.AWAITING_DELIVERY) {
        state = State.COMPLETE;
        (bool success, ) = seller.call{value: value}("");
        require(success, "Transfer failed.");
        console.log("Delivery confirmed");
    }

    function dispute() public onlyBuyer inState(State.AWAITING_DELIVERY) {
        require(block.timestamp - paymentTimestamp > CONFIRMATION_PERIOD,
                 "Can't dispute before confirmation period");
        state = State.DISPUTE;
    }

    function resolveDispute() public onlySeller inState(State.DISPUTE) {
        state = State.COMPLETE;
        (bool success, ) = buyer.call{value: value}("");
        require(success, "Transfer failed.");
        // An abitractor can be added here to resolve the dispute
        // payment will be rulled in favour of the buyer or seller
        // based on the decision of the abitractor
        // if the abitractor is not added, the payment will be rulled in favour of the buyer
    }
}