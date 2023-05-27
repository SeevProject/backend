import path from "path";
import { parseTemplateFromFile } from "../parser";

const temp = parseTemplateFromFile("test", path.join(__dirname, "./cv.html"));

console.log(JSON.stringify(temp, null, 2));
