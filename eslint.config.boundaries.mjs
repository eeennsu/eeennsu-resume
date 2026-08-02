// Generated from modules/fsd/layers.json. Do not hand-edit: the layer graph has
// one owner, edits here are invisible to it, and an edited file stops being
// refreshed - which freezes the policies at whatever they were that day.
// Your own rules go in eslint.config.mjs, which imports this file.
// Regenerate with:  /harness-bootstrap next
import boundaries from 'eslint-plugin-boundaries';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        {
                "type": "routing",
                "pattern": "src/app"
        },
        {
                "type": "app",
                "pattern": "src/app"
        },
        {
                "type": "screens",
                "pattern": "src/screens/*",
                "capture": [
                        "slice"
                ]
        },
        {
                "type": "widgets",
                "pattern": "src/widgets/*",
                "capture": [
                        "slice"
                ]
        },
        {
                "type": "features",
                "pattern": "src/features/*",
                "capture": [
                        "slice"
                ]
        },
        {
                "type": "entities",
                "pattern": "src/entities/*",
                "capture": [
                        "slice"
                ]
        },
        {
                "type": "shared",
                "pattern": "src/shared"
        },
        {
                "type": "data",
                "pattern": "src/data"
        },
        {
                "type": "db",
                "pattern": "src/db"
        },
        {
                "type": "subjects",
                "pattern": "src/subjects"
        }
],
      'import/resolver': {
      "typescript": {
            "alwaysTryTypes": true
    }
},
    },
    rules: {
      'boundaries/dependencies': [
        'warn',
        {
          default: 'disallow',
          // Order is fixed for a stable diff. Every entry below is an allow, so
          // order does not change the outcome today; a disallow added later must
          // come last, because the last matching policy wins.
          policies: [
          {
                    "from": {
                              "element": {
                                        "type": "routing"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "types": {
                                                            "anyOf": [
                                                                      "app",
                                                                      "screens",
                                                                      "widgets",
                                                                      "features",
                                                                      "shared",
                                                                      "data",
                                                                      "db",
                                                                      "subjects"
                                                            ]
                                                  }
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "app"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "screens"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "app"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "widgets"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "app"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "features"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "app"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "entities"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "app"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "shared"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "app"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "app"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "app"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "screens"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "screens"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "screens"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "widgets"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "screens"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "features"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "screens"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "entities"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "screens"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "shared"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "screens"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "screens"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "screens"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "widgets"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "widgets"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "widgets"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "features"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "widgets"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "entities"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "widgets"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "shared"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "widgets"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "widgets"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "widgets"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "features"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "features"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "features"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "entities"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "features"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "shared"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "features"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "features"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "features"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "entities"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "entities"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "entities"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "shared"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "entities"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "entities"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "entities"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "shared"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "shared"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "shared"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "data"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "shared"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "data"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "data"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "data"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "db"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "shared"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "db"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "db"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "db"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "subjects"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "shared"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "subjects"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "data"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "subjects"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "db"
                                        }
                              }
                    }
          },
          {
                    "from": {
                              "element": {
                                        "type": "subjects"
                              }
                    },
                    "allow": {
                              "to": {
                                        "element": {
                                                  "type": "subjects"
                                        }
                              }
                    }
          }
],
        },
      ],
      // Turned on so an unresolved alias fails loudly instead of silently
      // passing every boundary check.
      'boundaries/no-unknown-dependencies': 'warn',
    },
  },
];
