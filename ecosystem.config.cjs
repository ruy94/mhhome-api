module.exports = {
  apps: [
    {
      name: 'mhhome-pm2',
      cwd: '/home/duy-zalo/mhhome-api',
      script: 'dist/src/main.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
