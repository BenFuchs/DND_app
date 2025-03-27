import React, { useRef, useState } from 'react';
import styles from '../../StyleSheets/about.module.css';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";


const About = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1>Welcome to DnD Sheet Manager</h1>
      <div className={styles.cardsWrapper}>
        <div className={styles.cardContainer}>
          <Card 
            title="Features" 
            isActive={activeCard === 'Features'} 
            onHover={() => setActiveCard('Features')} 
            onLeave={() => activeCard === 'Features' && setActiveCard(null)}
          >
            <ul>
              <li><strong>Character Management:</strong> Create up to three free character sheets, with options to expand via one-time payments.</li>
              <li><strong>Interactive Character Creation:</strong> Select your race, class, and set stats using our guided creation system.</li>
              <li><strong>Spell Slots and Abilities:</strong> Automatically adjusted based on your class and level.</li>
              <li><strong>Inventory System:</strong> Add, remove, and manage items and gold easily.</li>
              <li><strong>Party Features:</strong> Join or host parties to trade items and interact with other players.</li>
            </ul>
          </Card>
        </div>
        <div className={styles.cardContainer}>
          <Card 
            title="Technologies" 
            isActive={activeCard === 'Technologies'} 
            onHover={() => setActiveCard('Technologies')} 
            onLeave={() => activeCard === 'Technologies' && setActiveCard(null)}
          >
            <p>
              The app is built using Django (Python) for the backend, Postgres for the database, and React TypeScript for the frontend.
            </p>
          </Card>
        </div>
        <div className={styles.cardContainer}>
          <Card 
            title="Getting Started" 
            isActive={activeCard === 'Getting Started'} 
            onHover={() => setActiveCard('Getting Started')} 
            onLeave={() => activeCard === 'Getting Started' && setActiveCard(null)}
          >
            <ol>
              <li>Register and log in to your account.</li>
              <li>Create your first character sheet and start customizing it to your liking.</li>
              <li>Explore interactive features like inventory management and spell slot tracking.</li>
              <li>Join or create a party to connect with other players and share resources.</li>
            </ol>
          </Card>
        </div>
        <div className={styles.cardContainer}>
          <Card 
            title="Upcoming Features" 
            isActive={activeCard === 'Upcoming Features'} 
            onHover={() => setActiveCard('Upcoming Features')} 
            onLeave={() => activeCard === 'Upcoming Features' && setActiveCard(null)}
          >
            <ul>
              <li>Improved party management with private rooms and chat functionality.</li>
              <li>Dungeon master tools for item creation.</li>
              <li>Additional customization options for character sheets and inventory.</li>
            </ul>
          </Card>
        </div>
      </div>
      <p className={styles.footerText}>
        Dive into the world of Dungeons & Dragons with ease and let us take care of the details while you focus on the adventure!
      </p>
      <div className={styles.centerLoginBtn}>
          <Button variant="contained" 
          onClick={(e) => {
            e.preventDefault();
            navigate("/login")
            }}
            >Login 
            </Button>
            <Button variant="contained" 
          onClick={(e) => {
            e.preventDefault();
            navigate("/register")
            }}
            >Register 
            </Button>
      </div>
    </div>
  );
};

type CardProps = {
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
};

const Card: React.FC<CardProps> = ({ title, children, isActive, onHover, onLeave }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  const handleMouseEnter = () => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight); // Set to content's full height
    }
    onHover();
  };

  const handleMouseLeave = () => {
    setHeight(0); // Collapse content
    onLeave();
  };

  return (
    <div 
      className={`${styles.card} ${isActive ? styles.open : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className={styles.cardTitle}>{title}</h2>
      <div
        ref={contentRef}
        className={styles.cardContent}
        style={{ height: isActive ? height : 0, transition: 'height 0.3s ease' }}
      >
        {children}
      </div>
    </div>
  );
};

export default About;
