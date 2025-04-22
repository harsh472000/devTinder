app.get("/user", async (req, res) => {
    const email = req.body.emailId;
    try {
      const user = await User.findOne({ emailId: email });
      res.send(user);
    } catch (e) {
      res.status(400).send("Error while saving the user", e.message);
    }
  });
  
  app.delete("/user", async (req, res) => {
    const id = req.body.id;
    try {
      const user = await User.findByIdAndDelete(id);
      res.send("User deleted successfully");
    } catch (e) {
      res.status(400).send("Error while saving the user", e.message);
    }
  });
  
  app.patch("/user", async (req, res) => {
    const data = req.body;
    try {
      const user = await User.findByIdAndUpdate({ _id: data.id }, data, {
        returnDocument: "after",
        runValidators: true,
      });
      res.send("User updated successfully");
    } catch (e) {
      res.status(400).send("Error while saving the user", e.message);
    }
  });