export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        Audio: "readonly",
        performance: "readonly",
        vhsEffects: "readonly",
        eventManager: "readonly",
        puzzleLoader: "readonly",
        tapeQualitySystem: "readonly",
        cleanupManager: "readonly",
        assetLoader: "readonly",
        ConnectionsGame: "readonly",
        VHSTapeRenderer: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": "error",
      "curly": "error",
      "no-eval": "error"
    }
  }
];