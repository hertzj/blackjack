// the cards and the deck
type Card = string;
type Suit = string[];
type Deck = Card[];

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
}

const fullDeck = createDeck(hearts, spades, diamonds, clubs);

// hands - might want to seperate out value and suit
interface PlayerCard {
  value: string;
  faceUp: boolean;
};

// a hand should be a class
// interface Hand {
//   cards: PlayerCard[]
//   calculateValue: CalculateValue;
//   value: number;
//   split: Split;
// }
// type CalculateValue = (...args: PlayerCard[]) => number;
// type Split = (card1: Card, card2: Card) => [Hand, Hand];

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
    const mapRoyalToVal = {
      J: 10,
      Q: 10,
      K: 10,
      A: 11,
    };
    const royalKeys = Object.keys(mapRoyalToVal);
    return this.cards.reduce((acc: number, card: PlayerCard) => {
      let num = card.value.slice(1);
      if (acc > 21 && royalKeys.indexOf(num) === 4) {
        num = '1';
      }
      else if (royalKeys.indexOf(num) === 4 && (acc + 11) > 21) {
        num = '1';
      }
      else if (royalKeys.indexOf(num) > -1) {
        num = mapRoyalToVal[num]
      }
      acc += Number(num);
      return acc;
    }, 0)
  };
  public split(): [Hand, Hand] {
    const card1 = this.cards[0];
    const card2 = this.cards[1];
    const splitHandOne = new Hand(card1, dealCard(shuffledDeck));
    const splitHandTwo = new Hand(card2, dealCard(shuffledDeck));
    // come back to this;
    return [splitHandOne, splitHandTwo];
  }

  public hit(card: PlayerCard): PlayerCard {
    this.cards.push(card);
    return card;
  }

}

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
}

const shuffledDeck = shuffle(fullDeck);


type InitialDeal = (shuffledDeck: Deck) => [Hand, Hand]

const initialDeal: InitialDeal = shuffledDeck => {
  const playerCards = [];
  const dealerCards = [];
  for (let i = 0; i < 4; i++) {
    const card = shuffledDeck.pop();
    const handCard = {
      value: '',
      faceUp: false
    }
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
    else if (card !== undefined) {
      handCard.value = card;
      handCard.faceUp = true;
      dealerCards.push(handCard)
    }
  }
  const playerHand = new Hand(playerCards[0], playerCards[1]);
  const dealerHand = new Hand(dealerCards[0], dealerCards[1]);
  return [playerHand, dealerHand];
}

type DealCard = (shuffledDeck: Deck) => PlayerCard;

const dealCard: DealCard = shuffledDeck => {
  const card: PlayerCard = shuffledDeck.pop();
  return card;
};


type HitParticipant = (hand: Hand, deck: Deck) => PlayerCard;

const hitParticipant: HitParticipant = (hand, deck) => {
  const card = dealCard(deck);
  hand.hit(card);
  return card;
}

// need to have players or some way to identify the hands
type FinishGame = (playerHand: Hand, dealerHand: Hand) => string;

const finishGame: FinishGame = (playerHand, dealerHand) => {
  if (playerHand.value > dealerHand.value) return playerHand.name;
  return dealerHand.name;
};
