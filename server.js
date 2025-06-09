const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Importa le routes
const teamRoutes = require("./routes/teamRoutes");
const playerRoutes = require("./routes/playerRoutes");
const matchRoutes = require("./routes/matchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const classificaRoutes = require("./routes/classificaRoutes");
const standingsRoutes = require("./routes/standings");

app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/classifiche", classificaRoutes);
app.use("/api/standings", standingsRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connesso a MongoDB");
    app.listen(PORT, () =>
      console.log(`Server attivo su http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(err));
