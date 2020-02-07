"use strict";
var Royals;
(function (Royals) {
    Royals["Jack"] = "J";
    Royals["Queen"] = "Q";
    Royals["King"] = "K";
    Royals["Ace"] = "A";
})(Royals || (Royals = {}));
;
var hearts = 'H2 H3 H4 H5 H6 H7 H8 H9 H10 HJ HQ HK HA'.split(' ');
var spades = 'S2 S3 S4 S5 S6 S7 S8 S9 S10 SJ SQ SK SA'.split(' ');
var diamonds = 'D2 D3 D4 D5 D6 D7 D8 D9 D10 DJ DQ DK DA'.split(' ');
var clubs = 'C2 C3 C4 C5 C6 C7 C8 C9 C10 CJ CQ CK CA'.split(' ');
var createDeck = function (suit1, suit2, suit3, suit4) {
    var deck = suit1.concat(suit2);
    deck = deck.concat(suit3);
    deck = deck.concat(suit4);
    return deck;
};
var fullDeck = createDeck(hearts, spades, diamonds, clubs);
;
var Hand = /** @class */ (function () {
    function Hand(card1, card2, name) {
        if (name === void 0) { name = 'dealer'; }
        this.cards = [card1, card2];
        this.name = name;
        // this might declare that the cards can only be two...
        // but I think not because of how I declare cards right above
    }
    Hand.prototype.value = function () {
        var mapRoyalToVal = {
            J: 10,
            Q: 10,
            K: 10,
            A: 11,
        };
        var royalKeys = Object.keys(mapRoyalToVal);
        return this.cards.reduce(function (acc, card) {
            var cardVal = card.value.slice(1); // a little worried about this as Royals
            var num = cardVal;
            if (acc > 21 && royalKeys.indexOf(cardVal) === 4) {
                num = '1';
            }
            else if (royalKeys.indexOf(cardVal) === 4 && (acc + 11) > 21) {
                num = '1';
            }
            else if (royalKeys.indexOf(cardVal) > -1) {
                num = mapRoyalToVal[cardVal];
            }
            acc += Number(num);
            return acc;
        }, 0);
    };
    ;
    Hand.prototype.checkPair = function () {
        var card1 = this.cards[0];
        var card2 = this.cards[1];
        if (card1.value.slice(1) === card2.value.slice(1))
            return true;
        return false;
    };
    Hand.prototype.split = function () {
        var card1 = this.cards[0];
        var card2 = this.cards[1];
        var splitHandOne = new Hand(card1, dealCard(shuffledDeck), this.name + " first hand");
        var splitHandTwo = new Hand(card2, dealCard(shuffledDeck), this.name + " second hand");
        // come back to this;
        return [splitHandOne, splitHandTwo];
    };
    Hand.prototype.hit = function (card) {
        this.cards.push(card);
        return card;
    };
    return Hand;
}());
;
var shuffle = function (unshuffledDeck) {
    var copyOfDeck = unshuffledDeck.slice(0);
    var shuffledDeck = [];
    var numCards = copyOfDeck.length;
    for (var i = 0; i < numCards; i++) {
        var indexToPick = Math.floor(numCards * Math.random());
        if (copyOfDeck[indexToPick] === 'picked') {
            i--;
            continue;
        }
        else {
            shuffledDeck.push(copyOfDeck[indexToPick]);
            copyOfDeck[indexToPick] = 'picked';
        }
    }
    return shuffledDeck;
};
var initialDeal = function (shuffledDeck, playerName) {
    var playerCards = [];
    var dealerCards = [];
    for (var i = 0; i < 4; i++) {
        var card = shuffledDeck.pop();
        var handCard = {
            value: '',
            faceUp: true,
        };
        handCard.faceUp = true;
        if (i % 2 === 0 && card !== undefined) {
            handCard.value = card;
            playerCards.push(handCard);
        }
        if (i === 3 && card !== undefined) {
            handCard.value = card;
            dealerCards.push(handCard);
            if (card.indexOf('A') > -1) {
                console.log('need to add insurance function and show this card');
                console.log('also need to check for 21');
            }
        }
        else if (i === 1 && card !== undefined) {
            handCard.value = card;
            handCard.faceUp = false;
            dealerCards.push(handCard);
        }
    }
    var dealerHand = new Hand(dealerCards[0], dealerCards[1]);
    var playerHand = new Hand(playerCards[0], playerCards[1], playerName);
    return [dealerHand, playerHand];
};
var dealCard = function (shuffledDeck) {
    var value = shuffledDeck.pop();
    if (value) {
        var cardToDeal = {
            value: value,
            faceUp: true,
        };
        return cardToDeal;
    }
    throw new Error('shuffledDeck was empty');
};
var hitParticipant = function (hand, deck) {
    var card = dealCard(deck);
    hand.hit(card);
    return card;
};
var finishGame = function (dealerHand, playerHand) {
    if (playerHand.value > dealerHand.value)
        return playerHand.name + " wins!";
    return dealerHand.name + " wins!";
};
// simulate game
// need to shuffle the deck first though,
// so changes to it persist
var shuffledDeck = shuffle(fullDeck);
var startGame = function (playerName, deck) {
    var initialHands = initialDeal(deck, playerName);
    var dealerHand = initialHands[0];
    var playerHand = initialHands[1];
    // need to check for blackjack
    if (playerHand.checkPair()) {
        console.log('need to offer split');
        // for now will always split
        var splitPlayerHands = playerHand.split();
        return [dealerHand].concat(splitPlayerHands);
    }
    console.log('playerHand: ', playerHand);
    console.log('dealerHand: ', dealerHand);
    return [dealerHand, playerHand];
};
console.log(startGame('Jake', shuffledDeck));
