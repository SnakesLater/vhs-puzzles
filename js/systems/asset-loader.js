// Asset Loader - On-demand loading with caching and error recovery
class AssetLoader {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
    }

    // Load audio with fallback formats
    async loadAudio(basePath, formats = ['ogg', 'mp3', 'wav']) {
        const cacheKey = `audio_${basePath}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        if (this.loading.has(cacheKey)) {
            return this.loading.get(cacheKey);
        }

        const loadPromise = this._loadAudioWithFallback(basePath, formats);
        this.loading.set(cacheKey, loadPromise);

        try {
            const audio = await loadPromise;
            this.cache.set(cacheKey, audio);
            this.loading.delete(cacheKey);
            return audio;
        } catch (error) {
            this.loading.delete(cacheKey);
            console.warn(`Failed to load audio: ${basePath}`, error);
            return null;
        }
    }

    async _loadAudioWithFallback(basePath, formats) {
        for (const format of formats) {
            try {
                const audio = new Audio(`${basePath}.${format}`);
                // Set a reasonable timeout for loading
                const loadPromise = new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
                    audio.addEventListener('canplaythrough', () => {
                        clearTimeout(timeout);
                        resolve();
                    }, { once: true });
                    audio.addEventListener('error', () => {
                        clearTimeout(timeout);
                        reject(new Error('Load failed'));
                    }, { once: true });
                    audio.load();
                });
                await loadPromise;
                return audio;
            } catch (error) {
                continue;
            }
        }
        throw new Error(`No supported format found for ${basePath}`);
    }

    // Preload critical assets
    async preloadCritical() {
        const criticalAssets = [
            'assets/audio/click',
            'assets/audio/error'
        ];

        // Try to load, but don't fail if audio files don't exist
        const promises = criticalAssets.map(async (asset) => {
            try {
                return await this.loadAudio(asset, ['wav', 'mp3', 'ogg']);
            } catch (e) {
                console.warn(`Could not load ${asset}:`, e.message);
                return null;
            }
        });
        
        await Promise.allSettled(promises);
    }

    // Get cached asset
    get(key) {
        return this.cache.get(key);
    }

    // Clear cache
    clear() {
        this.cache.clear();
        this.loading.clear();
    }
}

const assetLoader = new AssetLoader();