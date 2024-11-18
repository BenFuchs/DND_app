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
  - [X] User authentication
  - [X] Character sheet creation & deletion
  - [ ] Payment system for unlocking more sheets

- [ ] **Character Creation System**:
  - [X] Class selection logic (requires frontend)
  - [X] Race selection logic (requires frontend)
    |- [ ] change login into a component in the frontend (QOL)
    |- [X] change sheet creation flow (see notebook for information)
  - [WIP] Fully interactive character traits(links to dndbeyond or something) (requires frontend)
  - [X] Partially interactive inventory and currency system 
  - [ ] Spell slot & selection based on class (requires frontend)

- [ ] **Party System** *(optional)*:
  - [ ] Server-hosted party system with room creation
  - [ ] DM tools for managing player items

- [ ] **Frontend Development**:
  - [X] Create React pages for login, registration, and character sheets
  - [ ] Implement React Native components for mobile support

- [ ] **Testing**:
  - [ ] Unit testing for backend (Django)
  - [ ] Frontend testing for React/React Native components
  - [ ] End-to-end integration testing


## Existing flow
<!- This is how a user would go about using the website for the first time ->
- [X] Registeration and Log in 
- [X] Creating a new sheet/Checking how many sheets exist per logged user/Deleting sheets
- [X] Race selection
- [X] Appending appropriate traits per selected race to the sheet 
- [X] Class selection
- [ ] Appending appropriate traits and requirements per selected class to the sheet 
- [X] Stat setting and saving 

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
 - [X] after logging in, show the user 3 buttons labeled with their character names, this will later allow the user to access information about that character if they want to play it 
 - [ ] whole lot of design to do (QOL)
 - [X] add logout functionality 
  [WIP] Create component page for the character information for play, includes:
     - [X] stats
     - [X] Name
     - [X] Race
     - [X] Class
     - [X] Race-Traits (connect to dnd explanation links)
     - [X] Gold Counter (ability to add, remove gold like a calculator)
     - [X] inventory (at first, keep simple, let user write in it)
     - [ ] Backstory section? 

  12/11/24: 
  in my inventory functions there is an issue with the possibility of one user having multiple sheets that are of the same race, thus getting the inventory sheet selection confused.
 - [X] add a foregin key between characterSheets model and the raceSheets models that allows better clarity. (maybe after character creation send the character name as a foregin key to the father model?)

 - [X] show inventory
 - [X] add to inventory from front end

 15/11/24:
 - [X] finish dice rolling tray modal
 - [WIP] start the race/class traits page -> will be a seperate component page like the inventory, a tab acccessible when youre in your character sheet


 16/11/24: 
 - [ ] organizes the backend urls, split it into different sections like the views (QOL)
 - [X] In game component, both the race and class display numbers, set to display the actual names instead 
 - [X] Finish race traits section
 - [ ] Finish class traits section

 17/11/24:
 - [WIP] Add levels to the model + frontend view
 - [X] set every classes health according to the correct hit die of their classes
 - [X] The order of stats being sent to the backend and being shown in the frontend during character creation are not the same (character creation shows a con roll of 10, but later con is set to 15 instead of some other stat that got that roll.)(FIXED)

 18/11/24:
 - [X] sheet.sheet_name  in the sheetsComp is grabbing the first character sheet of that race table and giving it that sheet name, instead of going through the racetable and getting the correct name (FIXED)
 - [ ] When adding/subtracting gold from a user, the gold becomes empty until thee page is refreshed, not sure why yet. (QOL)
 - [ ] Get beta version of the website up on netlify for beta testing by friends
 - [ ] Learn how to connect users to each other (Private messages)
 - [ ] Learn how to create Group servers like in among us 
 - [ ] Learn how to make group chat 
 - [ ] Learn how to make interactions between players (sending gold/ sendinng items/ etc)