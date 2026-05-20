import { execSync } from "child_process";
import path from "path";

const root = process.cwd();
const seedScript = path.join(root, "scripts", "seed_large.py");

try {
  console.log("Initializing database by running python script...");
  execSync(`python3 "${seedScript}"`, { stdio: "inherit" });
} catch (error) {
  console.error("Failed to run seed script:", error);
  process.exit(1);
}
