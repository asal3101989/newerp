// pm2 ecosystem config — production process manager
// Start all processes: pm2 start ecosystem.config.js
// Stop all:           pm2 stop all
// Logs:               pm2 logs
// Auto-start on boot: pm2 startup  (then run the command it prints)
//                     pm2 save

module.exports = {
  apps: [
    {
      name: "nirmaan-api",
      script: "dist/api/main.js",
      interpreter: "node",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/api-err.log",
      out_file: "./logs/api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
    {
      name: "nirmaan-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start --hostname 127.0.0.1 --port 7000",
      interpreter: "node",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/frontend-err.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
