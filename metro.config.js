const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

// Configure Metro to handle Firebase ESM modules
const originalResolveRequest = config.resolver?.resolveRequest;
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'mjs', 'cjs'],
  unstable_enablePackageExports: true,
  resolveRequest: originalResolveRequest
    ? (context, realModuleName, platform, moduleName) => {
        // Handle Firebase package exports manually
        if (realModuleName && typeof realModuleName === 'string' && realModuleName.startsWith('firebase/')) {
          const firebaseModule = realModuleName.replace('firebase/', '');
          const firebasePath = path.resolve(
            __dirname,
            'node_modules',
            'firebase',
            firebaseModule,
            'dist',
            'esm',
            'index.esm.js'
          );
          
          // Check if file exists before returning
          if (fs.existsSync(firebasePath)) {
            return {
              filePath: firebasePath,
              type: 'sourceFile',
            };
          }
        }
        
        // Delegate to original resolver for everything else
        return originalResolveRequest(context, realModuleName, platform, moduleName);
      }
    : undefined,
};

module.exports = withNativeWind(config, { input: './src/globals.css' });

