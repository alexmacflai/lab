// Saved by the local development server. Camera images are never included.
export const SETTINGS = {
  "global": {
    "image": {
      "resolution": 96,
      "gamma": 1.2,
      "brightness": 0.2,
      "aspect": 0.8,
      "size": 0.94
    },
    "timing": {
      "fps": 12,
      "delay": 500,
      "jitter": 1
    }
  },
  "variants": {
    "library-cards": {
      "image": {
        "enabled": {
          "resolution": true,
          "gamma": true,
          "brightness": true,
          "aspect": true,
          "size": true
        },
        "values": {
          "resolution": 96,
          "gamma": 0.9,
          "brightness": 0.65,
          "aspect": 0.75,
          "size": 0.6
        }
      },
      "timing": {
        "enabled": {
          "jitter": true
        },
        "values": {
          "fps": 12,
          "delay": 500,
          "jitter": 0.5
        }
      }
    },
    "notebook-scraps": {
      "image": {
        "enabled": {
          "size": true,
          "aspect": true,
          "gamma": true,
          "brightness": true,
          "resolution": true
        },
        "values": {
          "resolution": 112,
          "gamma": 0.8,
          "brightness": 0.6,
          "aspect": 1.3333333333333333,
          "size": 0.64
        }
      }
    }
  }
};
