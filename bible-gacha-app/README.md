# Bible Gacha

A minimalist web application for randomly drawing Bible verses from the King James Version.

## Features

- **Random Verse Drawing**: Click "Draw Gacha" to display a random verse from the entire Bible
- **Save Verses**: Save your favorite verses with the date they were saved
- **Saved List**: View all saved verses with the ability to delete individual entries
- **LocalStorage**: All saved verses persist in your browser's LocalStorage
- **Responsive Design**: Works seamlessly on mobile and desktop devices

## Design

- Dark background (#0a0a0a) with light beige verse cards (#f5f0e8)
- Minimal, single-column layout
- Serif typography (Georgia, Times New Roman)
- No external image assets - CSS only
- Fully responsive for mobile devices

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

The production build will be created in the `dist` directory.

## Data Source

The application uses `t_kjv.json` containing all verses from the King James Version Bible. Each verse includes:
- `id`: Unique identifier
- `b`: Book number
- `c`: Chapter number
- `v`: Verse number
- `t`: Verse text

## LocalStorage

Saved verses are stored in LocalStorage under the key `bible-gacha-saved-verses` with the following structure:
- `id`: Original verse ID
- `text`: Verse content
- `reference`: Book, chapter, and verse reference
- `savedDate`: Date saved (YYYY/MM/DD format)
- `timestamp`: Unique timestamp for deletion

## License

This project uses the King James Version Bible text, which is in the public domain.
