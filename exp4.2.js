const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let playingCards = [
  { id: 1, suit: 'Hearts', value: 'Ace' },
  { id: 2, suit: 'Spades', value: 'King' },
  { id: 3, suit: 'Diamonds', value: '7' }
];
let nextId = 4;

app.get('/cards', (req, res) => {
  res.json(playingCards);
});

app.get('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = playingCards.find(c => c.id === cardId);
  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

app.post('/cards', (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ message: 'Suit and value are required' });
  }
  const newCard = {
    id: nextId++,
    suit: suit,
    value: value
  };
  playingCards.push(newCard);
  res.status(201).json(newCard);
});

app.delete('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const cardIndex = playingCards.findIndex(c => c.id === cardId);
  if (cardIndex !== -1) {
    const deletedCard = playingCards.splice(cardIndex, 1);
    res.json({ message: 'Card deleted successfully', card: deletedCard[0] });
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
