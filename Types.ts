// the cards and the deck
type Card = string;
type Suit = string[];
type Deck = Card[];

enum Royals {
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A'
};

const hearts = 'H2 H3 H4 H5 H6 H7 H8 H9 H10 HJ HQ HK HA'.split(' ');
const spades = 'S2 S3 S4 S5 S6 S7 S8 S9 S10 SJ SQ SK SA'.split(' ');
const diamonds = 'D2 D3 D4 D5 D6 D7 D8 D9 D10 DJ DQ DK DA'.split(' ');
const clubs = 'C2 C3 C4 C5 C6 C7 C8 C9 C10 CJ CQ CK CA'.split(' ');

type CreateDeck = (suit1: Suit, suit2: Suit, suit3: Suit, suit4: Suit) => Deck;

const createDeck: CreateDeck = (suit1, suit2, suit3, suit4) => {
  let deck = suit1.concat(suit2);
  deck = deck.concat(suit3);
  deck = deck.concat(suit4);
  return deck;
};

const fullDeck = createDeck(hearts, spades, diamonds, clubs);

// hands - might want to seperate out value and suit
interface PlayerCard {
  value: string;
  faceUp: boolean;
};


class Hand {
  public cards: PlayerCard[];
  public name: string;
  constructor(card1: PlayerCard, card2: PlayerCard, name: string = 'dealer') {
    this.cards = [card1, card2]
    this.name = name;
    // this might declare that the cards can only be two...
    // but I think not because of how I declare cards right above
  }
  public value(): number {
    const mapRoyalToVal: { [key in Royals]: number } = {
      J: 10,
      Q: 10,
      K: 10,
      A: 11,
    };
    const royalKeys = Object.keys(mapRoyalToVal) as Royals[];
    return this.cards.reduce((acc: number, card: PlayerCard) => {
      const cardVal = card.value.slice(1) as Royals; // a little worried about this as Royals
      let num: string | number = cardVal;
      if (acc > 21 && royalKeys.indexOf(cardVal) === 4) {
        num = '1';
      }
      else if (royalKeys.indexOf(cardVal) === 4 && (acc + 11) > 21) {
        num = '1';
      }
      else if (royalKeys.indexOf(cardVal) > -1) {
        num = mapRoyalToVal[cardVal]
      }
      acc += Number(num);
      return acc;
    }, 0)
  };
  public checkPair(): boolean {
    const card1 = this.cards[0];
    const card2 = this.cards[1];
    if (card1.value.slice(1) === card2.value.slice(1)) return true;
    return false;
  }
  public split(): [Hand, Hand] {
    const card1 = this.cards[0];
    const card2 = this.cards[1];
    const splitHandOne = new Hand(card1, dealCard(shuffledDeck), `${this.name} first hand`);
    const splitHandTwo = new Hand(card2, dealCard(shuffledDeck), `${this.name} second hand`);
    // come back to this;
    return [splitHandOne, splitHandTwo];
  }

  public hit(card: PlayerCard): PlayerCard {
    this.cards.push(card);
    return card;
  }

};

// shuffling and dealing
type Shuffle = (deck: Deck) => Deck;

const shuffle: Shuffle = unshuffledDeck => {
  const copyOfDeck = unshuffledDeck.slice(0);
  const shuffledDeck = [];
  const numCards = copyOfDeck.length;
  for (let i = 0; i < numCards; i++) {
    let indexToPick = Math.floor(numCards * Math.random());
    if (copyOfDeck[indexToPick] === 'picked') {
      i--;
      continue;
    } else {
      shuffledDeck.push(copyOfDeck[indexToPick]);
      copyOfDeck[indexToPick] = 'picked';
    }
  }
  return shuffledDeck;
};

type InitialDeal = (shuffledDeck: Deck, playerName: string) => [Hand, Hand];

const initialDeal: InitialDeal = (shuffledDeck, playerName) => {
  const playerCards = [];
  const dealerCards = [];
  for (let i = 0; i < 4; i++) {
    const card = shuffledDeck.pop();
    const handCard = {
      value: '',
      faceUp: true,
    }
    handCard.faceUp = true;
    if (i % 2 === 0 && card !== undefined) {
      handCard.value = card;
      playerCards.push(handCard);
    }
    if (i === 3 && card !== undefined) {
      handCard.value = card;
      dealerCards.push(handCard)
      if (card.indexOf('A') > -1) {
        console.log('need to add insurance function and show this card');
        console.log('also need to check for 21');
      }
    }
    else if (i === 1 && card !== undefined) {
      handCard.value = card;
      handCard.faceUp = false;
      dealerCards.push(handCard)
    }
  }
  const dealerHand = new Hand(dealerCards[0], dealerCards[1]);
  const playerHand = new Hand(playerCards[0], playerCards[1], playerName);
  return [dealerHand, playerHand];
};

type DealCard = (shuffledDeck: Deck) => PlayerCard;

const dealCard: DealCard = shuffledDeck => {
  const value = shuffledDeck.pop();
  if (value) {
    const cardToDeal: PlayerCard = {
      value,
      faceUp: true,
    }
    return cardToDeal;
  }
  throw new Error('shuffledDeck was empty')
};


type HitParticipant = (hand: Hand, deck: Deck) => PlayerCard;

const hitParticipant: HitParticipant = (hand, deck) => {
  const card = dealCard(deck);
  hand.hit(card);
  return card;
};

// need to deal with possibility that player has two hands
type FinishGame = (dealerHand: Hand, playerHand: Hand) => string;

const finishGame: FinishGame = (dealerHand, playerHand) => {
  if (playerHand.value() > dealerHand.value()) return `${playerHand.name} wins!`;
  return `${dealerHand.name} wins!`;
};

// simulate game
// need to shuffle the deck first though,
// so changes to it persist
const shuffledDeck = shuffle(fullDeck);

type StartGame = (playerName: string, shuffledDeck: Deck) => Hand[];

const startGame: StartGame = (playerName, deck) => {
  const initialHands = initialDeal(deck, playerName);
  const dealerHand = initialHands[0];
  const playerHand = initialHands[1];
  // need to check for blackjack
  if (playerHand.checkPair()) {
    console.log('need to offer split')
    // for now will always split
    const splitPlayerHands = playerHand.split();
    return [dealerHand].concat(splitPlayerHands)
  }
  console.log('playerHand: ', playerHand);
  console.log('dealerHand: ', dealerHand);
  return [dealerHand, playerHand];
}

const hands = startGame('Jake', shuffledDeck);

console.log(finishGame(hands[0], hands[1]));
