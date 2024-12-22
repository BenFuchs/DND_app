import React from 'react';

const About = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to DnD Sheet Manager</h1>
      <p>
        DnD Sheet Manager is your ultimate companion for managing your Dungeons & Dragons characters, whether you’re playing on a desktop, tablet, or mobile device. Our platform makes it easy to create, customize, and keep track of your characters, inventory, and more.
      </p>
      <h2>Features</h2>
      <ul>
        <li><strong>Character Management:</strong> Create up to three free character sheets, with options to expand via one-time payments.</li>
        <li><strong>Interactive Character Creation:</strong> Select your race, class, and set stats using our guided creation system.</li>
        <li><strong>Spell Slots and Abilities:</strong> Automatically adjusted based on your class and level.</li>
        <li><strong>Inventory System:</strong> Add, remove, and manage items and gold easily.</li>
        <li><strong>Party Features:</strong> Join or host parties to trade items and interact with other players. (Optional feature)</li>
        <li><strong>Dungeon Master Tools:</strong> DM-specific features to manage items and interact with party members.</li>
      </ul>
      <h2>Technologies Used</h2>
      <p>
        The app is built using Django (Python) for the backend, MySQL for the database, and React/React Native with TypeScript for the frontend.
      </p>
      <h2>Getting Started</h2>
      <ol>
        <li>Register and log in to your account.</li>
        <li>Create your first character sheet and start customizing it to your liking.</li>
        <li>Explore interactive features like inventory management and spell slot tracking.</li>
        <li>Join or create a party to connect with other players and share resources.</li>
      </ol>
      <h2>Upcoming Features</h2>
      <ul>
        <li>Improved party management with private rooms and chat functionality.</li>
        <li>Level-up mechanics and automatic stat updates.</li>
        <li>Additional customization options for character sheets and inventory.</li>
      </ul>
      <p>
        Dive into the world of Dungeons & Dragons with ease and let us take care of the details while you focus on the adventure!
      </p>
    </div>
  );
};

export default About;
