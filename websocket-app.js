const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8765 });

function getRandomElement(arr) {
  if (arr.length === 0) {
    throw new Error('Array cannot be empty');
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const array = ['BUY', 'SELL', 'BUY_ESTIMATED', 'SELL_ESTIMATED', 'UNKNOWN'];
const coins = ['BTC', 'ETH', 'DOGE', 'SOL'];

server.on('connection', (ws) => {
  console.log('Client connected');

  const sendData = () => {
    const data = {
      type: 'trade',
      symbol_id: `BITSTAMP_SPOT_${getRandomElement(coins)}_USD`,
      sequence: 2323346,
      time_exchange: new Date(),
      time_coinapi: new Date(),
      uuid: '770C7A3B-7258-4441-8182-83740F3E2457',
      price: 770.0,
      size: 0.05,
      taker_side: getRandomElement(array),
    };
    ws.send(JSON.stringify(data));
    console.log(`Sent: ${JSON.stringify(data)}`);
  };

  const interval = setInterval(sendData, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log('WebSocket server is running on ws://localhost:8765');
