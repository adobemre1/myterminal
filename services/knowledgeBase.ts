
import { LibraryDefinition, SupportedLanguage } from "../types";

export const KNOWLEDGE_BASE: LibraryDefinition[] = [
  // --- FRONTEND FRAMEWORKS ---
  {
    id: "react-nextjs",
    name: "React (Next.js)",
    category: "Frontend",
    description: "The React Framework for the Web. Used by some of the world's largest companies. Features App Router and Server Components.",
    icon: "⚛️",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are a Next.js Expert. Use App Router, Server Components, and TypeScript. Create a 'vercel.json' for optimal caching on Vercel Hobby Plan.",
    features: [
        "Server Components (RSC) by default",
        "File-system based App Router",
        "Built-in Vercel Optimizations",
        "Hybrid Static & Server Rendering"
    ],
    defaultFiles: ["package.json", "next.config.js", "app/page.tsx", "app/layout.tsx"],
    sampleCommand: "npm run dev",
    docsUrl: "https://nextjs.org/docs",
    architectureNotes: "Uses a file-system based router. `app/` directory is for the App Router. `layout.tsx` wraps pages. Server Components fetch data directly.",
    bestPractices: ["Use Server Components for data fetching", "Use Client Components for interactivity", "Optimize images with next/image"],
    ecosystemTools: ["Tailwind CSS", "Shadcn UI", "Prisma"]
  },
  {
    id: "vue-nuxt",
    name: "Vue (Nuxt 3)",
    category: "Frontend",
    description: "The Intuitive Web Framework. Nuxt provides a better developer experience for building Vue apps with auto-imports and modules.",
    icon: "💚",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are a Nuxt 3 Expert. Use Composition API. Create a 'netlify.toml' for seamless deployment on Netlify Free Tier.",
    features: [
        "Auto-imports for Components & Composables",
        "Server-Side Rendering (SSR) out of the box",
        "Module ecosystem (Pinia, Tailwind)",
        "Zero-config TypeScript support"
    ],
    defaultFiles: ["nuxt.config.ts", "app.vue", "pages/index.vue"],
    sampleCommand: "npx nuxi dev",
    docsUrl: "https://nuxt.com",
    architectureNotes: "Nuxt automatically imports components found in `components/`. Pages in `pages/` create routes. `server/` directory holds API routes.",
    bestPractices: ["Use <script setup>", "Leverage Nuxt Modules", "Use useFetch for data"],
    ecosystemTools: ["Pinia", "VueUse", "Nuxt UI"]
  },
  {
    id: "svelte-kit",
    name: "SvelteKit",
    category: "Frontend",
    description: "Cybernetically enhanced web apps. Write less code, build smaller bundles. Transitions and stores built-in.",
    icon: "🔥",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are a SvelteKit Expert. Use Svelte 5 runes. Configure 'adapter-auto' to detect Vercel or Netlify environments automatically.",
    features: [
        "True reactivity without Virtual DOM",
        "Scoped CSS by default",
        "Adapter system for any platform",
        "Top-tier performance metrics"
    ],
    defaultFiles: ["svelte.config.js", "src/routes/+page.svelte", "src/app.html"],
    sampleCommand: "npm run dev",
    docsUrl: "https://kit.svelte.dev",
    architectureNotes: "Uses `+page.svelte` for views and `+page.server.ts` for data loading. Adapters handle deployment targets.",
    bestPractices: ["Use Stores for state", "Use Runes in Svelte 5", "Keep logic in +page.server.ts"],
    ecosystemTools: ["Tailwind", "Lucide Icons", "Supabase"]
  },
  {
    id: "astro-build",
    name: "Astro",
    category: "Frontend",
    description: "The web framework for content-driven websites. Zero JS by default. Use React, Vue, or Svelte components together.",
    icon: "🚀",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are an Astro Expert. Focus on Islands Architecture. Use Tailwind. Optimize for static hosting (GitHub Pages/Vercel).",
    features: [
        "Islands Architecture (Partial Hydration)",
        "Framework Agnostic (Use React, Vue, Svelte)",
        "Zero JS frontend by default",
        "Edge-ready middleware"
    ],
    defaultFiles: ["astro.config.mjs", "src/pages/index.astro", "src/layouts/Layout.astro"],
    sampleCommand: "npm run dev",
    docsUrl: "https://astro.build",
    architectureNotes: "Generates static HTML by default. `client:load` directive hydrates components. `.astro` files act as server-side templates.",
    bestPractices: ["Default to static", "Use collections for content", "Minimize client-side JS"],
    ecosystemTools: ["Starlight", "Tailwind", "React"]
  },
  {
    id: "angular-cli",
    name: "Angular",
    category: "Frontend",
    description: "The platform for building mobile and desktop web applications. Comprehensive tooling and strict structure.",
    icon: "🛡️",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are an Angular Expert. Use Standalone Components (no NgModules). Use Signals for reactivity. Structure for enterprise scalability.",
    features: [
        "Standalone Components",
        "Signals for fine-grained reactivity",
        "Dependency Injection",
        "RxJS integration"
    ],
    defaultFiles: ["angular.json", "src/main.ts", "src/app/app.component.ts"],
    sampleCommand: "ng serve",
    docsUrl: "https://angular.io",
    architectureNotes: "Angular enforces a strict structure. Services handle logic, Components handle view. Dependency Injection wires them together.",
    bestPractices: ["Use Signals over Zones", "Prefer Standalone Components", "Strict Typing"],
    ecosystemTools: ["RxJS", "Angular Material", "Nx"]
  },

  // --- BACKEND & API ---
  {
    id: "python-fastapi",
    name: "FastAPI",
    category: "Backend",
    description: "Modern, high-performance web framework for APIs with Python 3.8+ based on standard Python type hints.",
    icon: "⚡",
    language: SupportedLanguage.PYTHON,
    specializedPrompt: "You are a FastAPI Expert. Use Pydantic v2. Create a 'Procfile' for Heroku Free Tier or 'render.yaml' for Render.com free tier.",
    features: [
        "Automatic Swagger/OpenAPI documentation",
        "High performance (on par with NodeJS/Go)",
        "Native Async/Await support",
        "Pydantic data validation"
    ],
    defaultFiles: ["main.py", "requirements.txt", "schemas.py", "models.py"],
    sampleCommand: "uvicorn main:app --reload",
    docsUrl: "https://fastapi.tiangolo.com",
    architectureNotes: "Uses Python type hints to validate data and generate OpenAPI specs. `Depends` is used for Dependency Injection.",
    bestPractices: ["Use Pydantic models", "Async database drivers", "Dependency Injection"],
    ecosystemTools: ["SQLAlchemy", "Pydantic", "Uvicorn"]
  },
  {
    id: "node-express",
    name: "Node (Express)",
    category: "Backend",
    description: "Fast, unopinionated, minimalist web framework for Node.js. The standard for Node web apps.",
    icon: "🟩",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are a Node/Express Expert. Use TypeScript. Structure for Serverless Functions (Vercel/AWS Lambda) to minimize cost.",
    features: [
        "Vast ecosystem of NPM packages",
        "Middleware-first architecture",
        "Great for Microservices",
        "Easy integration with MongoDB/Postgres"
    ],
    defaultFiles: ["package.json", "src/server.ts", "src/routes.ts"],
    sampleCommand: "npm start",
    docsUrl: "https://expressjs.com",
    architectureNotes: "Request flows through a series of middleware functions. Routing handles endpoints.",
    bestPractices: ["Use TypeScript", "Separate routes and controllers", "Async/Await"],
    ecosystemTools: ["Mongoose", "Passport", "Helmet"]
  },
  {
    id: "go-gin",
    name: "Go (Gin)",
    category: "Backend",
    description: "High-performance HTTP web framework written in Go (Golang). Fastest full-featured web framework for Go.",
    icon: "🐹",
    language: SupportedLanguage.GO,
    specializedPrompt: "You are a Go Expert. Use Gin. Produce a small binary via Docker multi-stage build (distroless) for cheap container hosting (Fly.io).",
    features: [
        "Radically small memory footprint",
        "Compilation to single static binary",
        "Built-in concurrency (Goroutines)",
        "Strict static typing"
    ],
    defaultFiles: ["go.mod", "main.go", "Dockerfile"],
    sampleCommand: "go run main.go",
    docsUrl: "https://gin-gonic.com",
    architectureNotes: "Go compiles to machine code. Gin provides a router and context for handlers. Concurrency is handled via Goroutines.",
    bestPractices: ["Check errors explicitly", "Use Interfaces", "Keep main.go clean"],
    ecosystemTools: ["GORM", "Viper", "Air"]
  },
  {
    id: "java-spring",
    name: "Java Spring Boot",
    category: "Backend",
    description: "Enterprise-grade Java framework. Convention over configuration. Massive ecosystem.",
    icon: "🍃",
    language: SupportedLanguage.JAVA,
    specializedPrompt: "You are a Spring Boot Expert. Use Maven. Create a REST API with Spring Data JPA and H2 Database for dev.",
    features: [
        "Dependency Injection (IoC)",
        "Auto-configuration",
        "Embedded Tomcat/Jetty",
        "Production-ready metrics (Actuator)"
    ],
    defaultFiles: ["pom.xml", "src/main/java/com/example/demo/DemoApplication.java", "application.properties"],
    sampleCommand: "./mvnw spring-boot:run",
    docsUrl: "https://spring.io/projects/spring-boot",
    architectureNotes: "Annotated classes (@RestController, @Service, @Repository) define the beans managed by the Spring Container.",
    bestPractices: ["Constructor Injection", "DTO Pattern", "Global Exception Handling"],
    ecosystemTools: ["Hibernate", "Maven", "Lombok"]
  },
  {
    id: "csharp-dotnet",
    name: ".NET 8 Web API",
    category: "Backend",
    description: "High-performance, cross-platform framework from Microsoft. C# is the primary language.",
    icon: "#️⃣",
    language: SupportedLanguage.CSHARP,
    specializedPrompt: "You are a .NET 8 Expert. Create a Minimal API structure. Use Entity Framework Core.",
    features: [
        "Cross-platform (Linux/Mac/Win)",
        "Minimal APIs for low boilerplate",
        "Entity Framework Core ORM",
        "High Performance (Kestrel)"
    ],
    defaultFiles: ["Program.cs", "appsettings.json", "MyProject.csproj"],
    sampleCommand: "dotnet run",
    docsUrl: "https://dotnet.microsoft.com",
    architectureNotes: "Minimal APIs define routes in Program.cs. Controllers are optional but supported.",
    bestPractices: ["Async all the way down", "Dependency Injection", "Use Records for DTOs"],
    ecosystemTools: ["EF Core", "NuGet", "Azure"]
  },
  {
    id: "php-laravel",
    name: "Laravel",
    category: "Backend",
    description: "The PHP Framework for Web Artisans. Elegant syntax, batteries included.",
    icon: "🐘",
    language: SupportedLanguage.PHP,
    specializedPrompt: "You are a Laravel Expert. Use Eloquent ORM. Setup API routes. Create a Dockerfile for deployment.",
    features: [
        "Eloquent ORM (Active Record)",
        "Blade Templating",
        "Robust Queue System",
        "Built-in Auth & Broadcasting"
    ],
    defaultFiles: ["composer.json", "artisan", ".env.example", "routes/api.php"],
    sampleCommand: "php artisan serve",
    docsUrl: "https://laravel.com",
    architectureNotes: "MVC (Model-View-Controller). Service Providers bootstrap the app. Facades provide static access to classes.",
    bestPractices: ["Fat Models, Skinny Controllers", "Use Resource Classes", "Feature Tests"],
    ecosystemTools: ["Composer", "Sail", "Forge"]
  },
  {
    id: "ruby-rails",
    name: "Ruby on Rails",
    category: "Backend",
    description: "Compress the complexity of modern web apps. The framework that pioneered MVC.",
    icon: "💎",
    language: SupportedLanguage.RUBY,
    specializedPrompt: "You are a Rails 7 Expert. Use Hotwire for interactivity. Configure for Postgres.",
    features: [
        "Convention over Configuration",
        "Active Record ORM",
        "Hotwire (HTML over the wire)",
        "Scaffolding"
    ],
    defaultFiles: ["Gemfile", "config/routes.rb", "app/controllers/application_controller.rb"],
    sampleCommand: "rails server",
    docsUrl: "https://rubyonrails.org",
    architectureNotes: "Strict MVC folder structure. Routes map URLs to Controller Actions which render Views.",
    bestPractices: ["RESTful resources", "Keep controllers thin", "Use concerns"],
    ecosystemTools: ["Bundler", "Sidekiq", "RSpec"]
  },
  {
    id: "rust-actix",
    name: "Rust (Actix)",
    category: "System",
    description: "Extremely fast and secure web framework for Rust. Actor-based concurrency.",
    icon: "🦀",
    language: SupportedLanguage.RUST,
    specializedPrompt: "You are a Rust Expert using Actix-web. Focus on memory safety and async performance.",
    features: [
        "Zero-cost abstractions",
        "Memory safety without GC",
        "Actor model",
        "WebSockets support"
    ],
    defaultFiles: ["Cargo.toml", "src/main.rs"],
    sampleCommand: "cargo run",
    docsUrl: "https://actix.rs",
    architectureNotes: "Async runtime (Tokio) powers Actix. Handlers are async functions. Extractors access request data safely.",
    bestPractices: ["Unwrap safely", "Use efficient types", "Modularity"],
    ecosystemTools: ["Cargo", "Tokio", "Serde"]
  },

  // --- CLOUD & BaaS ---
  {
    id: "supabase-integration",
    name: "Supabase",
    category: "Database",
    description: "The Open Source Firebase Alternative. Build in a weekend, scale to millions.",
    icon: "⚡",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are a Supabase Architect. Use 'supabase-js'. Create a 'supabase/config.toml'. Design database schema (SQL) compatible with the Free Tier limits (500MB).",
    features: [
        "Auto-generated APIs from Database",
        "Realtime Subscriptions",
        "Row Level Security (RLS)",
        "Edge Functions (Deno)"
    ],
    defaultFiles: ["supabase/config.toml", "src/utils/supabaseClient.ts"],
    sampleCommand: "supabase start",
    docsUrl: "https://supabase.com",
    architectureNotes: "PostgreSQL is the core. The Realtime Engine listens to WAL (Write Ahead Log). GoTrue handles Auth.",
    bestPractices: ["Enable RLS", "Use Types generated from DB", "Edge Functions for logic"],
    ecosystemTools: ["PostgreSQL", "Deno", "GoTrue"]
  },
  {
    id: "firebase-full",
    name: "Firebase",
    category: "Database",
    description: "Google's mobile platform that helps you quickly develop high-quality apps and grow your business.",
    icon: "🔥",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are a Firebase Expert. Create 'firebase.json' and '.firebaserc'. Use Firestore and Cloud Functions. Optimize for the Spark (Free) Plan.",
    features: [
        "Realtime NoSQL Database (Firestore)",
        "Simple Authentication (Social Login)",
        "Cloud Functions trigger system",
        "Free hosting with SSL"
    ],
    defaultFiles: ["firebase.json", "firestore.rules", "functions/index.ts"],
    sampleCommand: "firebase emulators:start",
    docsUrl: "https://firebase.google.com",
    architectureNotes: "Serverless architecture. Functions trigger on DB events. Frontend accesses DB directly securely via Rules.",
    bestPractices: ["Security Rules are mandatory", "Batch writes", "Denormalize data"],
    ecosystemTools: ["Firestore", "Cloud Functions", "Analytics"]
  },

  // --- AI & DATA ---
  {
    id: "python-pytorch",
    name: "PyTorch",
    category: "AI_Data",
    description: "An open source machine learning framework that accelerates the path from research prototyping to production deployment.",
    icon: "🔥",
    language: SupportedLanguage.PYTHON,
    specializedPrompt: "You are a PyTorch Expert. Create model classes. Use Google Colab compatible notebook structure (.ipynb) or modular .py scripts.",
    features: [
        "Dynamic Computational Graphs",
        "Pythonic feel and ease of use",
        "TorchScript for production",
        "Native ONNX support"
    ],
    defaultFiles: ["train.py", "model.py", "requirements.txt"],
    sampleCommand: "python train.py",
    docsUrl: "https://pytorch.org",
    architectureNotes: "Models extend `nn.Module`. The `forward` pass defines computation. Autograd handles backpropagation.",
    bestPractices: ["Use DataLoaders", "Modularize models", "Checkpoint training"],
    ecosystemTools: ["Hugging Face", "Lightning", "TensorBoard"]
  },
  {
    id: "tensorflow-keras",
    name: "TensorFlow",
    category: "AI_Data",
    description: "An end-to-end open source platform for machine learning. Comprehensive, flexible ecosystem of tools.",
    icon: "🧠",
    language: SupportedLanguage.PYTHON,
    specializedPrompt: "You are a TensorFlow Expert. Use Keras API. Save models in SavedModel format. Prepare for TFLite conversion.",
    features: [
        "Production-grade scalability (TFX)",
        "Keras high-level API integration",
        "JS and Lite (Mobile) variants",
        "Pre-trained Model Garden"
    ],
    defaultFiles: ["main.py", "model.h5", "requirements.txt"],
    sampleCommand: "tensorboard --logdir logs",
    docsUrl: "https://tensorflow.org",
    architectureNotes: "Static computational graph (TF1) vs Eager Execution (TF2). Keras Layers build the model.",
    bestPractices: ["Use Keras Functional API", "tf.data pipelines", "Profile performance"],
    ecosystemTools: ["TFX", "TF Lite", "Colab"]
  },
  {
    id: "langchain-py",
    name: "LangChain",
    category: "AI_Data",
    description: "Building applications with LLMs through composability. Chains, Agents, and Retrieval.",
    icon: "🦜",
    language: SupportedLanguage.PYTHON,
    specializedPrompt: "You are a LangChain Expert. Create a RAG pipeline. Use OpenAI or Gemini embeddings.",
    features: [
        "Chain interface",
        "Document Loaders",
        "Vector Store integration",
        "Memory management"
    ],
    defaultFiles: ["app.py", "chains.py", ".env"],
    sampleCommand: "python app.py",
    docsUrl: "https://python.langchain.com",
    architectureNotes: "Chains link LLM calls. Agents use tools to decide actions. Memory stores context.",
    bestPractices: ["Use LCEL (LangChain Expression Language)", "Stream responses", "Cache embeddings"],
    ecosystemTools: ["Pinecone", "OpenAI", "Smith"]
  },

  // --- DEVOPS ---
  {
    id: "docker-k8s",
    name: "Docker & K8s",
    category: "DevOps",
    description: "Develop, ship, and run applications anywhere. The standard for containerization.",
    icon: "🐳",
    language: SupportedLanguage.DOCKERFILE,
    specializedPrompt: "You are a DevOps Engineer. Create multi-stage Dockerfiles. Generate Kubernetes manifests (Deployment, Service) and Helm Charts.",
    features: [
        "Isolation of environments",
        "Write Once, Run Anywhere",
        "Microservices enablement",
        "Layered filesystem caching"
    ],
    defaultFiles: ["Dockerfile", ".dockerignore", "k8s/deployment.yaml"],
    sampleCommand: "docker-compose up -d",
    docsUrl: "https://docker.com",
    architectureNotes: "Images are built from Layers. Containers are runtime instances. K8s orchestrates pods.",
    bestPractices: ["Multi-stage builds", "Non-root users", "Health checks"],
    ecosystemTools: ["Kubernetes", "Helm", "Compose"]
  },
  {
    id: "terraform-infra",
    name: "Terraform",
    category: "DevOps",
    description: "Infrastructure as Code. Provision and manage any cloud, infrastructure, or service.",
    icon: "🏗️",
    language: SupportedLanguage.YAML,
    specializedPrompt: "You are a Terraform Expert. Use HCL. Modularize infrastructure (VPC, EC2/Cloud Run, RDS).",
    features: [
        "Infrastructure as Code",
        "State management",
        "Multi-cloud support",
        "Plan/Apply workflow"
    ],
    defaultFiles: ["main.tf", "variables.tf", "outputs.tf"],
    sampleCommand: "terraform init && terraform plan",
    docsUrl: "https://terraform.io",
    architectureNotes: "Declarative configuration. State file tracks real-world resources. Modules allow reuse.",
    bestPractices: ["Remote State", "Locking", "Module reuse"],
    ecosystemTools: ["AWS", "GCP", "Azure"]
  },

  // --- MOBILE ---
  {
    id: "react-native",
    name: "React Native",
    category: "Mobile",
    description: "Create native apps for Android and iOS using React.",
    icon: "📱",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are a React Native Expert. Use Expo. Handle navigation with Expo Router.",
    features: [
        "Native Components",
        "Fast Refresh",
        "Cross-platform",
        "Access to device APIs"
    ],
    defaultFiles: ["App.tsx", "app.json", "package.json"],
    sampleCommand: "npx expo start",
    docsUrl: "https://reactnative.dev",
    architectureNotes: "JS thread bridges to Native thread. UI renders to native views (UIView/AndroidView).",
    bestPractices: ["Use Expo", "Optimize images", "Avoid bridge traffic"],
    ecosystemTools: ["Expo", "Reanimated", "Tamagui"]
  },
  {
    id: "flutter-dart",
    name: "Flutter",
    category: "Mobile",
    description: "Google's UI toolkit for building beautiful, natively compiled applications from a single codebase.",
    icon: "🦋",
    language: SupportedLanguage.DART,
    specializedPrompt: "You are a Flutter Expert. Use Dart. Implement State Management (Provider/Riverpod).",
    features: [
        "Compiles to native ARM code",
        "Skia Graphics Engine",
        "Hot Reload",
        "Widget composition"
    ],
    defaultFiles: ["lib/main.dart", "pubspec.yaml"],
    sampleCommand: "flutter run",
    docsUrl: "https://flutter.dev",
    architectureNotes: "Everything is a Widget. Skia renders pixels directly. No native bridge for UI.",
    bestPractices: ["Use const widgets", "State management", "Async/Await"],
    ecosystemTools: ["Dart", "Riverpod", "Firebase"]
  },
  {
    id: "swift-ios",
    name: "Swift (iOS)",
    category: "Mobile",
    description: "Apple's powerful and intuitive programming language for iOS, iPadOS, macOS, tvOS, and watchOS.",
    icon: "🍎",
    language: SupportedLanguage.SWIFT,
    specializedPrompt: "You are an iOS Expert. Use SwiftUI. Focus on MVVM pattern.",
    features: [
        "Safe & Fast",
        "SwiftUI declarative syntax",
        "Deep Apple Ecosystem integration",
        "ARC Memory Management"
    ],
    defaultFiles: ["ContentView.swift", "App.swift", "Package.swift"],
    sampleCommand: "xcodebuild",
    docsUrl: "https://developer.apple.com/swift/",
    architectureNotes: "SwiftUI uses a declarative state-driven model. Combine framework handles async events.",
    bestPractices: ["MVVM", "Protocol Oriented Programming", "SwiftUI Previews"],
    ecosystemTools: ["Xcode", "CocoaPods", "TestFlight"]
  },
  {
    id: "kotlin-android",
    name: "Kotlin (Android)",
    category: "Mobile",
    description: "Modern, concise and safe programming language. The preferred language for Android development.",
    icon: "🤖",
    language: SupportedLanguage.KOTLIN,
    specializedPrompt: "You are an Android Expert. Use Jetpack Compose. Follow Material Design 3 guidelines.",
    features: [
        "Interoperable with Java",
        "Null Safety",
        "Coroutines",
        "Jetpack Compose UI"
    ],
    defaultFiles: ["MainActivity.kt", "build.gradle.kts"],
    sampleCommand: "./gradlew installDebug",
    docsUrl: "https://kotlinlang.org",
    architectureNotes: "Jetpack Compose renders UI based on state. Coroutines handle background tasks without blocking main thread.",
    bestPractices: ["Unidirectional Data Flow", "Dependency Injection (Hilt)", "ViewModel"],
    ecosystemTools: ["Android Studio", "Gradle", "Jetpack"]
  },

  // --- EMERGING ---
  {
    id: "bun-js",
    name: "Bun",
    category: "Emerging_Tech",
    description: "Incredibly fast JavaScript runtime, bundler, test runner, and package manager.",
    icon: "🥯",
    language: SupportedLanguage.TYPESCRIPT,
    specializedPrompt: "You are a Bun Expert. Use 'Bun.serve'. Leverage the built-in SQLite and password hashing.",
    features: [
        "Drop-in Node.js replacement",
        "Zig-powered speed",
        "Built-in TypeScript",
        ".env support out of box"
    ],
    defaultFiles: ["index.ts", "bun.lockb"],
    sampleCommand: "bun run index.ts",
    docsUrl: "https://bun.sh",
    architectureNotes: "Uses JavaScriptCore (Safari) engine instead of V8. Integrated toolchain reduces dev dependencies.",
    bestPractices: ["Use built-in APIs", "Hot reload", "Bun.file()"],
    ecosystemTools: ["ElysiaJS", "Hono", "Zig"]
  },
  {
    id: "solidity-eth",
    name: "Solidity",
    category: "Blockchain",
    description: "Object-oriented, high-level language for implementing smart contracts on Ethereum.",
    icon: "⛓️",
    language: SupportedLanguage.TYPESCRIPT, // Proxy for Solidity
    specializedPrompt: "You are a Solidity Expert. Write secure Smart Contracts. Use Hardhat for testing.",
    features: [
        "Smart Contracts",
        "EVM Compatible",
        "Static Typing",
        "Inheritance"
    ],
    defaultFiles: ["contracts/Token.sol", "hardhat.config.js", "test/Token.js"],
    sampleCommand: "npx hardhat test",
    docsUrl: "https://soliditylang.org",
    architectureNotes: "Code runs on the EVM (Ethereum Virtual Machine). Gas optimization is critical.",
    bestPractices: ["Security audits (Reentrancy)", "Gas optimization", "Events for logging"],
    ecosystemTools: ["Hardhat", "Ethers.js", "OpenZeppelin"]
  }
];

export const getLibraryById = (id: string) => KNOWLEDGE_BASE.find(lib => lib.id === id);
