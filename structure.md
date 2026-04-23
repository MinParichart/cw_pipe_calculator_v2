# CW Pipe Calculator - โครงสร้างโปรเจค

## 📊 Tech Stack

### Frontend
- **Framework**: Nuxt.js 3 (Vue 3 + TypeScript)
- **Styling**: Tailwind CSS
- **State Management**: Pinia (stores/)

### Backend
- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Architecture**: Express.js with MVC Pattern

---

## 📁 Directory Structure

```
cw_pipe_calculator/
├── frontend/                 # Nuxt.js Frontend Application
│   ├── components/          # Vue Components
│   │   ├── account/          # Authentication (Login, Register)
│   │   ├── audit/            # Audit Log
│   │   ├── calculator/       # Calculator UI Components
│   │   ├── criteria/         # Design Criteria Form
│   │   ├── layout/           # Layout Components (Navbar, Sidebar)
│   │   ├── network/          # Network Builder Component
│   │   ├── project/          # Project Forms
│   │   ├── projects/         # Project Cards
│   │   ├── reference/        # Pipe Specifications Catalog
│   │   ├── workflow/         # Workflow Components (Modal, Steps)
│   │   └── ...               # Other UI Components
│   │
│   ├── composables/         # Vue Composables (Reusable Logic)
│   │   ├── useApi.ts        # API Client (RESTful endpoints)
│   │   ├── useAuth.ts        # Authentication Logic
│   ├── usePipeCalculator.ts # Calculator Core Logic
│   │   └── useToast.ts       # Toast Notifications
│   │
│   ├── layouts/             # Nuxt Layout Templates
│   │   ├── default.vue       # Main Layout
│   │   └── ...
│   │
│   ├── pages/                # File-based Routing
│   │   ├── index.vue         # Landing Page
│   │   ├── register.vue      # Registration
│   │   ├── projects/        # Project Management
│   │   │   ├── index.vue     # Project List
│   │   │   ├── new.vue       # Create New Project
│   │   │   └── [id]/         # Dynamic Routes for Project Details
│   │   │       ├── index.vue       # Project Overview
│   │   │       ├── network.vue     # Network Builder (Step 3)
│   │   │       ├── calculation.vue  # Calculation (Step 4)
│   │   │       ├── fixtures.vue    # Fixture Management (Step 3)
│   │   │       ├── results.vue     # Results Display (Step 5)
│   │   │       ├── versions.vue    # Version History
│   │   │       ├── hydraulic.vue   # Hydraulic Calculations
│   │   │       ├── suggestion.vue   # AutoSuggest Results
│   │   │       ├── audit.vue       # Audit Log
│   │   │       └── documents.vue   # Document Management
│   │   ├── calculator/       # Calculator Pages
│   │   ├── dashboard/        # Dashboard
│   │   ├── profile/          # User Profile
│   │   ├── reference/        # Reference Data
│   │   └── settings/         # Settings
│   │
│   ├── stores/              # Pinia State Management
│   │   ├── auth.ts           # Auth State (user, token)
│   │   └── workflowStore.ts  # Workflow State (current step, data)
│   │
│   ├── utils/               # Utility Functions
│   ├── middleware/         # Nuxt Middleware
│   ├── plugins/            # Nuxt Plugins
│   ├── app.vue             # Root Component
│   └── nuxt.config.ts      # Nuxt Configuration
│
├── backend/                # NestJS/Express Backend
│   ├── prisma/             # Database Schema & Migrations
│   │   ├── schema.prisma    # Prisma Schema (Models: Project, Network, Node, Pipe, Fixture, etc.)
│   │   ├── seed.ts          # Database Seeding
│   │   └── migrations/       # Database Migration Files
│   │
│   ├── src/                 # Source Code
│   │   ├── controllers/      # Request Handlers (Project, Network, Node, Pipe, Fixture controllers)
│   │   ├── routes/           # API Routes Definition
│   │   ├── services/         # Business Logic Services
│   │   ├── middleware/       # Express Middleware (Auth, Validation)
│   │   ├── config/           # Configuration (Database, Environment)
│   │   ├── scripts/          # Utility Scripts
│   │   └── utils/            # Helper Functions
│   │
│   ├── uploads/             # File Upload Directory (Blueprints)
│   ├── package.json         # Backend Dependencies
│   └── tsconfig.json        # TypeScript Config
│
├── shared/                 # Shared Code between Frontend & Backend
│   └── types/               # TypeScript Type Definitions
│
├── docs/                   # Documentation
│   ├── pipe_calculator_system.md  # System Requirements
│   └── PROGRESS.md          # Project Progress
│
└── Root Files
    ├── .git/                # Git Repository
    ├── .claude/             # Claude Code Memory
    ├── DEMO_*.md            # Demo Documentation
    ├── *.csv                # Reference Data Tables
    └── README.md            # Project Overview
```

---

## 🏗️ Architecture Overview

### Frontend Architecture (Nuxt.js + Vue 3)

```
┌─────────────────────────────────────────────────────────────┐
│                        Nuxt.js App                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages (File-based Routing)                                  │  │
│  │  ├── projects/[id]/index.vue     → Project Overview        │  │
│  │  ├── projects/[id]/network.vue   → Network Builder (Step 3)│  │
│  │  ├── projects/[id]/calculation.vue → Calculation (Step 4)  │  │
│  │  └── ...                                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components (Reusable UI)                                   │  │
│  │  ├── network/NetworkBuilder.vue → Canvas, Node, Pipe UI   │  │
│  │  ├── calculator/*.vue           → Calculator UI Components  │  │
│  │  └── ...                                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Composables (Business Logic)                             │  │
│  │  ├── useApi.ts       → API Calls (axios/fetch)              │  │
│  │  ├── useAuth.ts      → Login/Register Logic                │  │
│  │  └── usePipeCalculator.ts → Calculations                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pinia Stores (State Management)                             │  │
│  │  ├── auth.ts        → User Auth State                     │  │
│  │  └── workflowStore.ts → Current Step, Project Data        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture (Express.js + Prisma)

```
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Backend                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes (API Endpoints)                                  │  │
│  │  ├── /api/projects         → Project CRUD               │  │
│  │  ├── /api/networks          → Network CRUD               │  │
│  │  ├── /api/nodes            → Node CRUD                   │  │
│  │  ├── /api/pipes            → Pipe CRUD                   │  │
│  │  ├── /api/fixtures         → Fixture CRUD               │  │
│  │  └── ...                                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controllers (Request Handlers)                           │  │
│  │  ├── projectController  → Handle Project Requests      │  │
│  │  ├── networkController  → Handle Network Requests      │  │
│  │  ├── nodeController     → Handle Node Requests         │  │
│  │  ├── pipeController     → Handle Pipe Requests         │  │
│  │  └── fixtureController   → Handle Fixture Requests       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                                │  │
│  │  ├── projectService    → Project Business Logic         │  │
│  │  ├── networkService    → Network Calculations           │  │
│  │  └── ...                                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Prisma ORM (Database Layer)                              │  │
│  │  ├── schema.prisma      → Database Models               │  │
│  │  ├── migrations/        → Database Migrations           │  │
│  │  └── seed.ts            → Database Seeding               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Files for Each Feature

### 1. Network Builder (Step 3)
- **Frontend**: `frontend/components/network/NetworkBuilder.vue`
- **Backend**:
  - `backend/src/routes/network.routes.ts`
  - `backend/src/controllers/network.controller.ts`
  - `backend/src/controllers/node.controller.ts`
  - `backend/src/controllers/pipe.controller.ts`

### 2. Calculator (Step 4)
- **Frontend**: `frontend/components/calculator/*.vue`
- **Backend**:
  - `backend/src/routes/calculation.routes.ts`
  - `backend/src/controllers/calculation.controller.ts`

### 3. Fixture Management
- **Frontend**: `frontend/components/network/NetworkBuilder.vue` (Modal)
- **Backend**:
  - `backend/src/routes/fixture.routes.ts`
  - `backend/src/controllers/fixture.controller.ts`
  - `backend/prisma/schema.prisma` (Fixture model)

### 4. Project Management
- **Frontend**: `frontend/pages/projects/[id]/*.vue`
- **Backend**:
  - `backend/src/routes/project.routes.ts`
  - `backend/src/controllers/project.controller.ts`
  - `backend/prisma/schema.prisma` (Project model)

---

## 🔄 Data Flow Example

### Adding a Fixture to Node
```
User Action: Click "เพิ่มสุขภัณฑ์" in Modal
    ↓
Frontend: NetworkBuilder.vue
    ├── addFixture(type)
    ↓
    Composable: useApi.ts
    ├── fixturesApi.add(nodeId, { type })
    ↓
    API Call: POST /api/nodes/{nodeId}/fixtures
    ↓
    Backend: fixture.controller.ts
    ├── fixturesService.add()
    ↓
    Database: Prisma (fixtures table)
    ↓
    Response: { id, type, quantity, nodeId }
    ↓
    Frontend: Update selectedNodeFixtures.value
    └── Update node.fixtures in nodes array
```

---

## 🎯 Core Components Breakdown

### NetworkBuilder.vue (2000+ lines)
- **Purpose**: Canvas-based Network Builder
- **Key Features**:
  - Draggable nodes (FIXTURE, TEE, ELBOW, etc.)
  - Pipe connections (automatic routing)
  - Fixture management modal
  - Sidebar for node editing
  - Blueprint upload for scale calibration
- **State**: nodes[], pipes[], selectedNode, selectedPipe, selectedNodeFixtures

### Pinia Stores
- **auth.ts**: User authentication state (user, token, isAuthenticated)
- **workflowStore.ts**: Multi-step workflow state (currentStep, projectData)

### API Layer (useApi.ts)
- RESTful endpoints wrapper
- Error handling
- Token-based authentication

---

## 🚀 Development Workflow

### Running the Project
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Database Migrations
```bash
cd backend
npx prisma migrate dev
```

---

## 📝 Notes

- **Frontend**: ~2000 lines in NetworkBuilder.vue (largest component)
- **Backend**: Prisma-based ORM with PostgreSQL
- **State Management**: Pinia for global state, reactive refs for component state
- **Routing**: File-based routing (Nuxt 3)
- **API Communication**: RESTful APIs with axios
- **Authentication**: JWT-based auth tokens

โครงสร้างนี้ออกแบบีง่าง่ายและเข้าใจง่าย สำหรับการแยก Layer ชัดเจน!
