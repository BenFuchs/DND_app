# DND Character Page App

An interactive D&D character management app, including features such as an inventory system, currency counter, spell slot mechanism, and more. This app will be built as both a **web** and **mobile** application, providing flexibility for use across various devices like **iPads, phones, and desktops**.

## Key Features

1. **User Authentication**:
   - Registration & Login
   - Character Sheet Management (3 free character sheets, with the option to unlock more via one-time payments)
   - Delete and create character sheets
   - Logout functionality

2. **Character Creation**:
   - **Class Selector**: Filter abilities and features based on selected class.
   - **Race Selector**: Filter traits based on race.
   - **Fully Interactive Boxes**: Freeform fields like character name, physical traits, and backgrounds.
   - **Partially Interactive Boxes**: Regulated fields like inventory and currency, ensuring game balance.
   - **Spell Slots**: Adjusts according to class choice and level.

3. **Party System** *(optional feature)*:
   - Ability to host or join parties, either locally or through a server.
   - Trade inventory and currency between players.
   - Dungeon Master (DM) can manage items and give them to players directly.
   - Party rooms with password-protected access (similar to games like *Among Us*).

## Technologies Used

- **Backend**: Django (Python)
- **Database**: MySQL
- **Frontend**: React (for web), React Native (for mobile app) written in TypeScript

## App Flow

### Step 1: User Creation
- Registration and login.
- Character sheet creation and selection.
- Payment options for unlocking additional character slots.
- Logout functionality.

### Step 2: Character Creation
- Class and Race selectors.
- Interactive character creation fields.
- Spell slot system adjusted by class.
- Partially interactive fields (e.g., inventory, currency).

### Step 3: Party System *(optional)*
- Room creation with password and lobby system.
- Inventory/currency trading between users.
- DM tools to manage player items.

## To-Do List

- [ ] **Backend Setup**:
  - [V] User authentication
  - [V] Character sheet creation & deletion
  - [ ] Payment system for unlocking more sheets

- [ ] **Character Creation System**:
  - [V] Class selection logic (requires frontend)
  - [V] Race selection logic (requires frontend)
    |- [ ] change login into a component in the frontend
    |- [V] change sheet creation flow (see notebook for information)
  - [ ] Fully interactive character traits(links to dndbeyond or something) (requires frontend)
  - [ ] Partially interactive inventory and currency system (requires frontend)
  - [ ] Spell slot & selection based on class (requires frontend)

- [ ] **Party System** *(optional)*:
  - [ ] Server-hosted party system with room creation
  - [ ] DM tools for managing player items

- [ ] **Frontend Development**:
  - [ ] Create React pages for login, registration, and character sheets
  - [ ] Implement React Native components for mobile support

- [ ] **Testing**:
  - [ ] Unit testing for backend (Django)
  - [ ] Frontend testing for React/React Native components
  - [ ] End-to-end integration testing


## Existing flow
<!-- This is how a user would go about using the website for the first time -->
- [V] Registeration and Log in 
- [V] Creating a new sheet/Checking how many sheets exist per logged user/Deleting sheets
- [V] Race selection
- [ ] Appending appropriate traits per selected race to the sheet (frontend view left)
- [V] Class selection
- [ ] Appending appropriate traits and requirements per selected class to the sheet 
- [V] Stat setting and saving 

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BenFuchs/DND_app.git
   cd https://github.com/BenFuchs/DND_app.git


## notes:
  6/11/24:
  currently on character creation in the frontend. need to choose between 1 vs 2 endpoint route for the stat mechanic
  (1 endpoint with a flag or 2 seperate calls, 2 is probably simpler to implement to be honest)

  7/11/24:
  to do list:
  [ ] after logging in, show the user 3 buttons labeled with their character names, this will later allow the user to access information about that character if they want to play it 
  [ ] whole lot of design to do
  [ ] add logout functionality 
  [ ] Create component page for the character information for play, includes:
      [ ] stats
      [ ] Name
      [ ] Race
      [ ] Class
      [ ] Race-Traits (connect to dnd explanation links)
      [ ] Gold Counter (ability to add, remove gold like a calculator)
      [ ] inventory (at first, keep simple, let user write in it)
      [ ] Backstory section? 