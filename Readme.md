# DND Character Page App

An interactive **Dungeons & Dragons** character management app designed for **web** platforms, allowing players to seamlessly manage their characters across different devices like **desktops, tablets, and phones**.

## Features

- **User Authentication**: Register, log in, and manage character sheets.
- **Character Creation**: Select class, race, and attributes with interactive fields.
- **Inventory & Currency**: Manage items and gold with an intuitive interface.
- **Spell Slots**: Automatically adjusted based on class and level.
- **Party System**: Join or host rooms for collaborative gameplay (includes chat and item trading).
- **Friends List**: Search for and add friends, accept or reject invitations.
- **Live Chat & Trading**: WebSocket-based chat system for in-game interactions.

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/BenFuchs/DND_app.git
cd DND_app
```

### 2. Backend Setup
Ensure you have **Python** installed.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
```
Set up the database (PostgreSQL):
```bash
python manage.py migrate
python manage.py createsuperuser  # Optional: Create an admin user
```
Run the backend server:
```bash
python manage.py runserver
```

### 3. Frontend Setup (Web)
Ensure you have **Node.js** installed.
```bash
cd ../frontend
npm install
npm start
```

## Usage

1. **Register/Login**: Create an account or log in.
2. **Character Management**: Create, view, and delete character sheets.
3. **Inventory & Currency**: Manage your inventory and adjust gold values.
4. **Spell System**: Assign and track spell slots based on your class.
5. **Party & Chat**: Create or join a party, send messages, and trade gold/items.
6. **Friends List**: Search for players, send/accept friend requests.

## Deployment

To deploy the backend, use **Render** or a similar hosting platform. For the frontend, deploy via **Netlify** or **Vercel**.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature-branch`
5. Submit a pull request.

## License

This project is licensed under the **MIT License**. See `LICENSE` for details.

