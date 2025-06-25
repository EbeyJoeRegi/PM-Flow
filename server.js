const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Import cors

const app = express();
const PORT = 3000;

app.use(cors()); // ✅ Enable CORS for all origins
app.use(bodyParser.json());

// Mock users list
const users = [
  {
    id: 1,
    email: 'admin@incture.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'john@incture.com',
    password: 'johnpass',
    name: 'John Doe',
    role: 'manager'
  },
    {
    id: 3,
    email: 'eli@incture.com',
    password: 'elipass',
    name: 'Eli Doe',
    role: 'member'
  }
];

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (user) {
    const { id, name, role } = user;
    return res.status(200).json({ id, name, role });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Mock Login API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
