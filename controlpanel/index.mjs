import dotenv from "dotenv";
import inquirer from "inquirer";
import { connectDB } from "../../config/db";
// import User from "../models/user.model";
// import Product from "../models/product.model";
import Party from "../models/party.model"; // Add Party model
import fs from "fs";

dotenv.config();

const load = async (Model) => {
  await Model.insertMany(
    JSON.parse(
      fs.readFileSync(`${__dirname}/${Model.collection.name}.json`, "utf-8")
    ),
    { validateBeforeSave: false }
  );
  console.log(`${Model.collection.name} successfully loaded!`);
};

const copy = async (Model) => {
  const doc = await Model.find();
  fs.writeFileSync(
    `${__dirname}/${Model.collection.name}.json`,
    JSON.stringify(doc, null, 2) // Format JSON with indentation
  );
  console.log(`${Model.collection.name} successfully exported!`);
};

const deleteAll = async (Model) => {
  await Model.deleteMany();
  console.log(`${Model.collection.name} successfully deleted!`);
};

const exportCollection = async (collection) => {
  switch (collection) {
    case "users":
      await copy(User);
      break;
    case "products":
      await copy(Product);
      break;
    case "parties":
      await copy(Party); // Handle Party collection
      break;
    default:
      console.log("Invalid collection");
  }
};

const loadIntoCollection = async (collection) => {
  switch (collection) {
    case "users":
      await load(User);
      break;
    case "products":
      await load(Product);
      break;
    case "parties":
      await load(Party); // Handle Party collection
      break;
    default:
      console.log("Invalid collection");
  }
};

const deleteCollection = async (collection) => {
  switch (collection) {
    case "users":
      await deleteAll(User);
      break;
    case "products":
      await deleteAll(Product);
      break;
    case "parties":
      await deleteAll(Party); // Handle Party collection
      break;
    default:
      console.log("Invalid collection");
  }
};

const main = async () => {
  await connectDB();

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What action would you like to perform?",
      choices: ["Import", "Export", "Delete", "Test"],
    },
    {
      type: "list",
      name: "collection",
      message: "Which collection?",
      choices: ["users", "products", "parties"], // Include Party collection
    },
  ]);

  const { action, collection } = answers;

  switch (action.toLowerCase()) {
    case "import":
      await loadIntoCollection(collection);
      break;
    case "export":
      await exportCollection(collection);
      break;
    case "delete":
      await deleteCollection(collection);
      break;
    case "test":
      const products = await Product.find({
        _id: {
          $in: [
            "65cb8111db3ee278cd7ebea9",
            "65cb8111db3ee278cd7ebeaa",
            "65cb8111db3ee278cd7ebeab",
            "65cb8111db3ee278cd7ebeb7",
            "65cb8111db3ee278cd7ebebb",
          ],
        },
      });
      console.log(products);
      break;
    default:
      console.log("Invalid action");
  }

  process.exit();
};

main();
