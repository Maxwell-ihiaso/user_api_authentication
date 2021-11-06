const mongoose = require('mongoose');

mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(`connection to database started...`))
.catch(error => console.log(error))

mongoose.connection.on('disconnected', () => console.log(`database connection closed successfully!`))

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0);
})