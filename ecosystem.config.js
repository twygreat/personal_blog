module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      env_file: '.env',
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};