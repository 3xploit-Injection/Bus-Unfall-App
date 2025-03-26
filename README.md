# IVB-APP

## IVB Unfallaufnehmer – Schnell. Einfach. Digital.

Mit der IVB Unfallaufnehmer-App wird die Schadensmeldung zum Kinderspiel! Laden Sie einfach ein paar Fotos Ihres Unfallwagens hoch, und unsere Experten bewerten den Schaden in kürzester Zeit. Kein Papierkram, keine langen Wartezeiten – Sie erhalten schnell eine zuverlässige Einschätzung der Kosten und des Schadensumfangs.

Egal ob kleiner Kratzer oder größerer Schaden: Mit IVB Unfallaufnehmer sind Sie immer auf der sicheren Seite. Probieren Sie es aus – unkompliziert und effizient!

➡️ ##Jetzt downloaden und stressfrei den Unfall melden!

----------------------------------------------------------------------------------------------------------------------------------------------------------------------
# How to Run

Öffne CMD

## Ins Projektverzeichnis wechseln (falls noch nicht geschehen)
cd dein-projektverzeichnis

## Abhängigkeiten installieren (falls noch nicht geschehen)
npm install

# Entwicklungsserver starten
npm run dev

zum Laufen zu bringen.

------------------------------------------------------------------

Aktuell sind zwei offizielle Plugins verfügbar:

@vitejs/plugin-react – nutzt Babel für Fast Refresh

@vitejs/plugin-react-swc – nutzt SWC für Fast Refresh


## ESLint-Konfiguration erweitern

In deinem Vite + React-Projekt kannst du die ESLint-Regeln anpassen, um Code-Qualität, Konsistenz und Best Practices durchzusetzen.

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
