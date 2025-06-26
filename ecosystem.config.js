module.exports = {
  apps: [{
    name: "blog",
    script: "npm",
    args: "start",
    instances: "max",
    exec_mode: "cluster",
    env: {
      PORT: 1999,
      NODE_ENV: "production"
    },
    watch: false,
    max_memory_restart: "1G"
  }]
}