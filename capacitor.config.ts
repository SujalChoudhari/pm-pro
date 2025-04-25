import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.projectmanagerpro.app",
  appName: "Project Manager Pro",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    CapacitorFileSystem: {
      readPermission: true,
      writePermission: true,
    },
  },
}

export default config
