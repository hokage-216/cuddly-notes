import { express } from "express";
import { path } from "path";

const app = express();
const port = 3004;

app.use(express.static('public'));