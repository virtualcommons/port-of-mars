import testDataSource from "@port-of-mars/server/datasource";
import { loadFixtures } from "@port-of-mars/server/util";

async function setup() {
  await testDataSource.initialize();
  await testDataSource.synchronize(); // Be cautious with this in a real DB
  await loadFixtures();
}

setup().catch(err => {
  console.error("Failed to set up tests:", err);
  process.exit(1);
});
