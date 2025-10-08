import app from '@/app';
import config from '@/config/env.config';
import logger from '@/lib/logger.lib';

const PORT = config.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`, {
    service: 'server',
  });
});
