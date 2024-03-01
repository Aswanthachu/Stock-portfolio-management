import { useEffect, useState } from 'react';
import WebSocket from 'socket.io-client';

const Hello = () => {
    const [stockData, setStockData] = useState(null);
    const socketUrl = 'wss://ws.twelvedata.com/v1/quote?symbol=${symbol}&&apikey=6d42f255bb554840ae21e07a2c623ab8'; // Replace with the actual WebSocket URL
  
    useEffect(() => {
      // Create a WebSocket connection
      const socket = new WebSocket(socketUrl);
  
      // Define an event handler for when the WebSocket connection is opened
      socket.onopen = () => {
        console.log('WebSocket connection established.');
  
        // Send a request for AAPL stock data (make sure to format it according to Twelve Data's API)
        const request = {
          action: 'get_stock',
          symbol: 'AAPL', // Replace with the stock symbol you want
        };
  
        socket.send(JSON.stringify(request));
      };
  
      // Define an event handler for when a message is received from the WebSocket
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket data:', data);
  
        // Update state with the received stock data
        setStockData(data);
      };
  
      // Cleanup: close the WebSocket when the component unmounts
      return () => {
        socket.close();
      };
    }, [socketUrl]);

  
    return (
      <div>
        <h1>AAPL Stock Details</h1>
        {stockData ? (
          <div>
            <p>Symbol: {stockData.symbol}</p>
            <p>Price: {stockData.price}</p>
            {/* Include more stock details here */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };

export default Hello