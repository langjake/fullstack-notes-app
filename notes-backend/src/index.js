let express = require('express') 
let cors = require("cors");
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());



async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('Successfully connected to the database')
    
    // Test query
    const noteCount = await prisma.note.count()
    console.log(`Number of notes in the database: ${noteCount}`)

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

testDatabaseConnection()  //test successful


app.get("/api/notes", async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    console.log("Retrieved notes from database:", notes);
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const newNote = await prisma.note.create({
      data: { title, content },
    });
    console.log("Created new note:", newNote);
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});
//update note
app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);
  
    if (!title || !content) {
      return res.status(400).send("title and content fields required");
    }
  
    if (!id || isNaN(id)) {
      return res.status(400).send("ID must be a valid number");
    }
  
    try {
      const updatedNote = await prisma.note.update({
        where: { id },
        data: { title, content },
      });
      res.json(updatedNote);
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
  });
  app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
  
    if (!id || isNaN(id)) {
      return res.status(400).send("ID field required");
    }
  
    try {
      await prisma.note.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
  });

app.listen(4000, () => {
  console.log("server running on localhost:4000");
});
