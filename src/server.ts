import createApp from "./app";
import { config } from 'dotenv';
import path from "path";

config({ path: path.resolve(process.cwd(), '.env.bank') });

async function start() {
  const app = await createApp();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Swagger UI available at http://localhost:3000/api-docs');
  });
}

start();
