import app from './src/app.js';
import config from './src/config/config.js';
import logger from './src/utils/logger.js';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.environment}`);
});
