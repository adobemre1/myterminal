
import { CloudProvider } from "../types";

export const CLOUD_PROVIDERS: CloudProvider[] = [
    // --- FRONTEND & STATIC ---
    {
        id: "vercel",
        name: "Vercel",
        category: "Frontend",
        description: "The creators of Next.js. Best for frontend frameworks and Serverless Functions.",
        icon: "▲",
        freeTierFeatures: ["Unlimited Personal Projects", "Serverless Functions", "Edge Network"],
        url: "https://vercel.com",
        configFile: "vercel.json",
        configTemplate: `{\n  "version": 2,\n  "builds": [\n    { "src": "package.json", "use": "@vercel/node" }\n  ],\n  "routes": [\n    { "src": "/(.*)", "dest": "/" }\n  ]\n}`
    },
    {
        id: "netlify",
        name: "Netlify",
        category: "Frontend",
        description: "Fastest way to build the fastest sites. Pioneers of the Jamstack.",
        icon: "💠",
        freeTierFeatures: ["100GB Bandwidth", "Serverless Functions", "Instant Rollbacks"],
        url: "https://netlify.com",
        configFile: "netlify.toml",
        configTemplate: `[build]\n  command = "npm run build"\n  publish = "dist"`
    },
    {
        id: "cloudflare-pages",
        name: "Cloudflare Pages",
        category: "Frontend",
        description: "JAMstack platform on the global edge network.",
        icon: "☁️",
        freeTierFeatures: ["Unlimited Sites", "Unlimited Requests", "Unlimited Bandwidth"],
        url: "https://pages.cloudflare.com",
        configFile: "wrangler.toml",
        configTemplate: `name = "my-app"\ncompatibility_date = "2023-01-01"\n[site]\nbucket = "./dist"`
    },
    {
        id: "github-pages",
        name: "GitHub Pages",
        category: "Frontend",
        description: "Hosted directly from your GitHub repository.",
        icon: "🐙",
        freeTierFeatures: ["Completely Free", "Custom Domains", "HTTPS"],
        url: "https://pages.github.com",
        configFile: ".github/workflows/gh-pages.yml",
        configTemplate: `name: Deploy\non: [push]\njobs:\n  deploy:\n    runs-on: ubuntu-latest`
    },
    {
        id: "gitlab-pages",
        name: "GitLab Pages",
        category: "Frontend",
        description: "Static sites with GitLab CI.",
        icon: "🦊",
        freeTierFeatures: ["Integrated CI/CD", "Custom Domains", "HTTPS"],
        url: "https://docs.gitlab.com/ee/user/project/pages/",
        configFile: ".gitlab-ci.yml",
        configTemplate: `pages:\n  script:\n  - mkdir .public\n  - cp -r * .public\n  - mv .public public\n  artifacts:\n    paths: [public]`
    },
    {
        id: "surge",
        name: "Surge.sh",
        category: "Frontend",
        description: "Static web publishing for Front-End Developers.",
        icon: "⚡",
        freeTierFeatures: ["Unlimited Publishing", "Custom Domains", "CLI Tool"],
        url: "https://surge.sh",
        configFile: "CNAME",
        configTemplate: `my-project.surge.sh`
    },
    {
        id: "azure-static",
        name: "Azure Static Web Apps",
        category: "Frontend",
        description: "Streamlined full-stack development from source code to global high availability.",
        icon: "🔷",
        freeTierFeatures: ["Free SSL", "Global distribution", "GitHub/Azure DevOps integration"],
        url: "https://azure.microsoft.com/en-us/services/app-service/static/",
        configFile: "staticwebapp.config.json",
        configTemplate: `{\n  "routes": [\n    {\n      "route": "/login",\n      "rewrite": "/.auth/login/github"\n    }\n  ]\n}`
    },
    {
        id: "aws-amplify",
        name: "AWS Amplify",
        category: "Frontend",
        description: "Build, deploy, and host web and mobile apps.",
        icon: "🟧",
        freeTierFeatures: ["1000 Build Minutes/mo", "5GB Storage", "15GB Serve"],
        url: "https://aws.amazon.com/amplify/",
        configFile: "amplify.yml",
        configTemplate: `version: 1\nfrontend:\n  phases:\n    build:\n      commands: ['npm run build']\n  artifacts:\n    baseDirectory: dist\n    files: ['**/*']`
    },

    // --- BACKEND & PAAS ---
    {
        id: "render",
        name: "Render",
        category: "Fullstack",
        description: "The modern cloud. Fastest way to host your web apps, APIs, and static sites.",
        icon: "®️",
        freeTierFeatures: ["Web Services", "PostgreSQL", "Redis", "Private Networking"],
        url: "https://render.com",
        configFile: "render.yaml",
        configTemplate: `services:\n  - type: web\n    name: my-app\n    env: node\n    plan: free`
    },
    {
        id: "railway",
        name: "Railway",
        category: "Fullstack",
        description: "Infrastructure, accessible. Canvas based deployment.",
        icon: "🚂",
        freeTierFeatures: ["$5.00 Credit/Month", "Postgres/Redis/Mongo", "Custom Domains"],
        url: "https://railway.app",
        configFile: "railway.json",
        configTemplate: `{\n  "build": { "builder": "NIXPACKS" }\n}`
    },
    {
        id: "flyio",
        name: "Fly.io",
        category: "Backend",
        description: "Deploy app servers close to your users. Runs full Docker containers.",
        icon: "🦋",
        freeTierFeatures: ["3 Shared VMs", "3GB Volume", "160MB Outbound"],
        url: "https://fly.io",
        configFile: "fly.toml",
        configTemplate: `app = "my-app"\nprimary_region = "iad"`
    },
    {
        id: "koyeb",
        name: "Koyeb",
        category: "Backend",
        description: "Serverless platform for Docker apps, APIs, and databases.",
        icon: "🦅",
        freeTierFeatures: ["$5.50 Free Credit", "Global Edge", "Git-driven"],
        url: "https://koyeb.com",
        configFile: "koyeb.yaml",
        configTemplate: `app: my-app\nservices:\n  - name: web\n    git: { repository: github.com/user/repo }`
    },
    {
        id: "zeabur",
        name: "Zeabur",
        category: "Fullstack",
        description: "Deploy fullstack apps with one click.",
        icon: "🦓",
        freeTierFeatures: ["$5.00 Credit", "Auto-detection", "Serverless"],
        url: "https://zeabur.com",
        configFile: "zeabur.json",
        configTemplate: `{\n  "serviceName": "my-app"\n}`
    },
    {
        id: "glitch",
        name: "Glitch",
        category: "Fullstack",
        description: "Friendly community and instant hosting for Node.js.",
        icon: "🎏",
        freeTierFeatures: ["Live Editing", "Remix Culture"],
        url: "https://glitch.com",
        configFile: "glitch.json",
        configTemplate: `{\n  "install": "npm install",\n  "start": "node server.js"\n}`
    },
    {
        id: "pythonanywhere",
        name: "PythonAnywhere",
        category: "Backend",
        description: "Host, run, and code Python in the cloud.",
        icon: "🐍",
        freeTierFeatures: ["1 Web App", "Beginner Console", "MySQL"],
        url: "https://pythonanywhere.com",
        configFile: "wsgi.py",
        configTemplate: `import sys\npath = '/home/username/mysite'\nif path not in sys.path:\n    sys.path.append(path)\nfrom flask_app import app as application`
    },
    {
        id: "deno-deploy",
        name: "Deno Deploy",
        category: "Backend",
        description: "Serverless JavaScript hosting at the edge.",
        icon: "🦕",
        freeTierFeatures: ["100k requests/day", "Global Edge"],
        url: "https://deno.com/deploy",
        configFile: "deno.json",
        configTemplate: `{\n  "tasks": { "start": "deno run --allow-net main.ts" }\n}`
    },
    {
        id: "app-runner",
        name: "AWS App Runner",
        category: "Backend",
        description: "Fully managed service for running containers.",
        icon: "🅰️",
        freeTierFeatures: ["Not Forever Free but generous trial"],
        url: "https://aws.amazon.com/apprunner/",
        configFile: "apprunner.yaml",
        configTemplate: `version: 1.0\nruntime: python3`
    },
    {
        id: "cloud-run",
        name: "Google Cloud Run",
        category: "Backend",
        description: "Develop and deploy highly scalable containerized applications.",
        icon: "🏃",
        freeTierFeatures: ["2 million requests/mo", "360,000 GB-seconds memory"],
        url: "https://cloud.google.com/run",
        configFile: "service.yaml",
        configTemplate: `apiVersion: serving.knative.dev/v1\nkind: Service\nmetadata:\n  name: my-service`
    },
    {
        id: "digitalocean-app",
        name: "DigitalOcean App Platform",
        category: "Backend",
        description: "Build, deploy, and scale apps quickly.",
        icon: "🌊",
        freeTierFeatures: ["3 Static Sites free", "Starter tier for dynamic"],
        url: "https://www.digitalocean.com/products/app-platform/",
        configFile: ".do/app.yaml",
        configTemplate: `name: my-app\nservices:\n- name: web\n  github:\n    repo: user/repo`
    },
    
    // --- DATABASE & BaaS ---
    {
        id: "supabase",
        name: "Supabase",
        category: "Database",
        description: "The Open Source Firebase Alternative.",
        icon: "⚡",
        freeTierFeatures: ["500MB DB", "Auth", "Edge Functions", "Realtime"],
        url: "https://supabase.com",
        configFile: "supabase/config.toml",
        configTemplate: `project_id = "your-project-id"`
    },
    {
        id: "firebase",
        name: "Firebase",
        category: "Database",
        description: "Google's platform for mobile and web apps.",
        icon: "🔥",
        freeTierFeatures: ["Spark Plan", "Firestore", "Auth"],
        url: "https://firebase.google.com",
        configFile: "firebase.json",
        configTemplate: `{\n  "hosting": { "public": "public" }\n}`
    },
    {
        id: "neon",
        name: "Neon",
        category: "Database",
        description: "Serverless Postgres. Separates storage and compute.",
        icon: "🐘",
        freeTierFeatures: ["0.5GB Storage", "Compute auto-suspend"],
        url: "https://neon.tech",
        configFile: "README.md",
        configTemplate: `DATABASE_URL=postgres://user:pass@ep-xyz.aws.neon.tech/neondb`
    },
    {
        id: "planetscale",
        name: "PlanetScale",
        category: "Database",
        description: "MySQL compatible serverless database platform.",
        icon: "🪐",
        freeTierFeatures: ["5GB Storage", "1 billion row reads/mo"],
        url: "https://planetscale.com",
        configFile: ".pscale.yml",
        configTemplate: `org: my-org\ndatabase: my-db`
    },
    {
        id: "cockroach",
        name: "CockroachDB",
        category: "Database",
        description: "Distributed SQL database.",
        icon: "🪳",
        freeTierFeatures: ["5GB Storage", "250M Request Units"],
        url: "https://www.cockroachlabs.com/",
        configFile: "db-init.sql",
        configTemplate: `CREATE DATABASE mydb;`
    },
    {
        id: "mongodb",
        name: "MongoDB Atlas",
        category: "Database",
        description: "The multi-cloud database service.",
        icon: "🍃",
        freeTierFeatures: ["512MB Storage", "Shared Clusters"],
        url: "https://www.mongodb.com/atlas",
        configFile: "mongoose.connect.js",
        configTemplate: `mongoose.connect(process.env.MONGO_URI);`
    },
    {
        id: "upstash",
        name: "Upstash",
        category: "Database",
        description: "Serverless Redis and Kafka.",
        icon: "🚀",
        freeTierFeatures: ["10k requests/day", "Redis & Kafka"],
        url: "https://upstash.com",
        configFile: ".env.example",
        configTemplate: `UPSTASH_REDIS_REST_URL=\nUPSTASH_REDIS_REST_TOKEN=`
    },
    {
        id: "appwrite",
        name: "Appwrite",
        category: "Database",
        description: "Secure backend for Flutter / Vue / React / etc.",
        icon: "🅰️",
        freeTierFeatures: ["Auth", "DB", "Storage", "Functions"],
        url: "https://appwrite.io",
        configFile: "appwrite.json",
        configTemplate: `{\n  "projectId": "..."\n}`
    },
    {
        id: "convex",
        name: "Convex",
        category: "Database",
        description: "The backend application platform.",
        icon: "🌊",
        freeTierFeatures: ["1M functions/mo", "Realtime sync"],
        url: "https://www.convex.dev",
        configFile: "convex.json",
        configTemplate: `{\n  "functions": "convex/"\n}`
    },
    {
        id: "xata",
        name: "Xata",
        category: "Database",
        description: "Serverless Data Platform for Jamstack.",
        icon: "🦋",
        freeTierFeatures: ["750MB Data", "Search & Analytics"],
        url: "https://xata.io",
        configFile: ".xatarc",
        configTemplate: `{\n  "databaseUrl": "..."\n}`
    },

    // --- AUTHENTICATION ---
    {
        id: "clerk",
        name: "Clerk",
        category: "Auth",
        description: "Complete user management and auth.",
        icon: "🔒",
        freeTierFeatures: ["10,000 Monthly Active Users", "Social Login"],
        url: "https://clerk.com",
        configFile: "middleware.ts",
        configTemplate: `import { authMiddleware } from "@clerk/nextjs";\nexport default authMiddleware();`
    },
    {
        id: "auth0",
        name: "Auth0",
        category: "Auth",
        description: "Secure access for everyone.",
        icon: "🔑",
        freeTierFeatures: ["7,000 Active Users", "Unlimited Logins"],
        url: "https://auth0.com",
        configFile: "auth0-config.json",
        configTemplate: `{\n  "domain": "...",\n  "clientId": "..."\n}`
    },
    {
        id: "stytch",
        name: "Stytch",
        category: "Auth",
        description: "Passwordless authentication infrastructure.",
        icon: "🧵",
        freeTierFeatures: ["5,000 Monthly Active Users"],
        url: "https://stytch.com",
        configFile: "stytch.js",
        configTemplate: `const client = new Stytch.Client({...})`
    },
    {
        id: "supertokens",
        name: "SuperTokens",
        category: "Auth",
        description: "Open source auth solution.",
        icon: "🛡️",
        freeTierFeatures: ["5,000 MAU", "Self-hostable"],
        url: "https://supertokens.com",
        configFile: "supertokens.init.js",
        configTemplate: `SuperTokens.init({...})`
    },

    // --- AI & VECTOR ---
    {
        id: "pinecone",
        name: "Pinecone",
        category: "AI",
        description: "Vector database for ML applications.",
        icon: "🌲",
        freeTierFeatures: ["1 Starter Index", "100k Vectors"],
        url: "https://pinecone.io",
        configFile: "pinecone.init.py",
        configTemplate: `pinecone.init(api_key="...", environment="us-west1-gcp")`
    },
    {
        id: "weaviate",
        name: "Weaviate",
        category: "AI",
        description: "Open source vector search engine.",
        icon: "W",
        freeTierFeatures: ["Sandboxed Cluster", "14 day persistence"],
        url: "https://weaviate.io",
        configFile: "docker-compose.yml",
        configTemplate: `services:\n  weaviate:\n    image: semitechnologies/weaviate`
    },
    {
        id: "huggingface",
        name: "Hugging Face Spaces",
        category: "AI",
        description: "Host ML demos and apps.",
        icon: "🤗",
        freeTierFeatures: ["2 CPU Cores", "16GB RAM (CPU Basic)"],
        url: "https://huggingface.co/spaces",
        configFile: "README.md",
        configTemplate: `---\ntitle: My Space\nsdk: streamlit\n---`
    },
    {
        id: "replicate",
        name: "Replicate",
        category: "AI",
        description: "Run AI models in the cloud.",
        icon: "®️",
        freeTierFeatures: ["Pay per second (Trial credits)"],
        url: "https://replicate.com",
        configFile: ".env",
        configTemplate: `REPLICATE_API_TOKEN=r8_...`
    },

    // --- CMS ---
    {
        id: "contentful",
        name: "Contentful",
        category: "CMS",
        description: "Headless CMS for building digital experiences.",
        icon: "📝",
        freeTierFeatures: ["5 Users", "25k records", "2 Locales"],
        url: "https://contentful.com",
        configFile: "contentful.js",
        configTemplate: `createClient({ space: '...', accessToken: '...' })`
    },
    {
        id: "strapi",
        name: "Strapi",
        category: "CMS",
        description: "Open source Node.js Headless CMS.",
        icon: "🚀",
        freeTierFeatures: ["Self-hosted Free", "Community Edition"],
        url: "https://strapi.io",
        configFile: "config/server.js",
        configTemplate: `module.exports = ({ env }) => ({ host: env('HOST'), port: env.int('PORT') });`
    },
    {
        id: "sanity",
        name: "Sanity",
        category: "CMS",
        description: "Platform for structured content.",
        icon: "🧠",
        freeTierFeatures: ["Generous quotas", "Real-time collaboration"],
        url: "https://sanity.io",
        configFile: "sanity.config.ts",
        configTemplate: `export default defineConfig({...})`
    },

    // --- DEVOPS ---
    {
        id: "circleci",
        name: "CircleCI",
        category: "DevOps",
        description: "Continuous Integration and Delivery.",
        icon: "⭕",
        freeTierFeatures: ["6,000 build minutes/mo"],
        url: "https://circleci.com",
        configFile: ".circleci/config.yml",
        configTemplate: `version: 2.1\njobs:\n  build:\n    docker: [{image: circleci/node}]`
    },
    {
        id: "github-actions",
        name: "GitHub Actions",
        category: "DevOps",
        description: "Automate your workflow from idea to production.",
        icon: "🐙",
        freeTierFeatures: ["2,000 minutes/mo"],
        url: "https://github.com/features/actions",
        configFile: ".github/workflows/main.yml",
        configTemplate: `name: CI\non: [push]\njobs:\n  build:`
    },
    {
        id: "terraform-cloud",
        name: "Terraform Cloud",
        category: "DevOps",
        description: "Managed service for Terraform CLI.",
        icon: "🏗️",
        freeTierFeatures: ["500 Resources", "State Management"],
        url: "https://app.terraform.io",
        configFile: "backend.tf",
        configTemplate: `terraform {\n  backend "remote" {\n    organization = "my-org"\n  }\n}`
    },
    {
        id: "docker-hub",
        name: "Docker Hub",
        category: "DevOps",
        description: "World's easiest way to create and manage containers.",
        icon: "🐳",
        freeTierFeatures: ["Unlimited Public Repos", "1 Private Repo"],
        url: "https://hub.docker.com",
        configFile: "Dockerfile",
        configTemplate: `FROM node:18\nWORKDIR /app`
    }
];
