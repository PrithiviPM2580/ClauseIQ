import app from '@/app';
import config from '@/config/env.config';

const PORT = config.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
