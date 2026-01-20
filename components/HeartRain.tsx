
import React, { useEffect, useState } from 'react';

const HeartRain: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          size: Math.random() * 20 + 20
        }
      ]);
    }, 150);

    const cleanup = setTimeout(() => {
      clearInterval(interval);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(cleanup);
    };
  }, []);

  return (
    <>
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-particle"
          style={{
            left: `${heart.left}%`,
            top: '100%',
            fontSize: `${heart.size}px`,
          }}
        >
          ❤️
        </div>
      ))}
    </>
  );
};

export default HeartRain;
