# ChatGPT Clone with Azure OpenAI

A modern web application that provides a ChatGPT-like interface powered by Azure OpenAI. Built with React (TypeScript) and Python FastAPI.

## Features

- **Modern UI**: Clean, responsive interface inspired by ChatGPT
- **Light/Dark Mode**: Full theme support with CSS variables for seamless switching
- **Chat History**: Optional integration with Azure CosmosDB for conversation persistence
- **File Attachments**: Upload and process images in conversations
- **Citation Support**: Track and display sources for responses
- **Azure Integration**: Works with Azure OpenAI, Cognitive Search, and CosmosDB

## Screenshots

### Dark Mode (Default)
<img width="1078" height="801" alt="image" src="https://github.com/user-attachments/assets/4cbf4f0f-6b23-404c-a314-13cf0df6b248" />


### Light Mode
<img width="1083" height="794" alt="image" src="https://github.com/user-attachments/assets/d1da57d1-aacf-41cb-8853-e2f67e2b002e" />

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Python FastAPI
- **Styling**: CSS3 with CSS variables for theming
- **Optional Services**: Azure OpenAI, Azure CosmosDB, Azure Cognitive Search

## Quick Start

### Prerequisites
- Node.js (frontend)
- Python 3.9+ (backend)
- Azure OpenAI API access (optional - required for full functionality)

### Environment Setup

1. Copy `.env.sample` to `.env` and configure:
   ```bash
   cp .env.sample .env
   ```

2. Update the following required environment variables:
   - `AZURE_OPENAI_RESOURCE`: Your Azure OpenAI resource name
   - `AZURE_OPENAI_KEY`: Your Azure OpenAI API key
   - `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint
   - `AZURE_OPENAI_MODEL`: Model deployment name (e.g., gpt-35-turbo-16k)

### Running Locally

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

#### Backend
```bash
pip install -r requirements.txt
python app.py
```

## Configuration

### Optional Services

#### Chat History (Azure CosmosDB)
```env
AZURE_COSMOSDB_ACCOUNT=your-cosmos-account
AZURE_COSMOSDB_ACCOUNT_KEY=your-cosmos-key
AZURE_COSMOSDB_DATABASE=db_conversation_history
```

#### Document Search (Azure Cognitive Search)
```env
AZURE_SEARCH_SERVICE=your-search-service
AZURE_SEARCH_KEY=your-search-key
AZURE_SEARCH_INDEX=your-index-name
```

#### UI Customization
```env
UI_TITLE=Chat Application
UI_LOGO=./logo.svg
UI_FAVICON=./favicon.ico
```

## Styling

The application uses CSS variables for theming. Toggle between light and dark modes using the theme button in the header.

### Color Scheme

**Dark Mode** (Default):
- Primary Background: #212121
- Secondary Background: #303030
- Text: #ffffff

**Light Mode**:
- Primary Background: #ffffff
- Secondary Background: #ffffff
- Text: #0a0a0a

Button hover effects:
- New Chat: Green
- Attach: Purple
- Clear Chat: Red
- Chat History: Blue

## Development

### Building

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
pip install -r requirements-dev.txt
```

### Docker

Build and run with Docker:
```bash
docker build -f WebApp.Dockerfile -t chatgpt-clone .
docker run -p 8080:8080 chatgpt-clone
```

## License

See LICENSE file for details.

## Contributing

Contributions are welcome. Please submit pull requests with clear descriptions of changes.
