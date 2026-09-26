export interface PresetCourse {
  id: string;
  title: string;
  badge: string;
  description: string;
  estimatedHours: string;
  category: string;
  topics: string[];
  initialDocumentText: string;
}

export const PRESET_COURSES: PresetCourse[] = [
  {
    id: 'ml-foundations',
    title: 'Machine Learning & Neural Topologies',
    badge: 'Popular',
    description: 'Master supervised learning, loss gradients, and deep neural layer activation manifolds.',
    estimatedHours: '18 hrs',
    category: 'AI & Data',
    topics: ['Vector Calculus', 'Gradient Descent', 'Backpropagation', 'Activation Manifolds'],
    initialDocumentText: `Machine Learning Foundations: Linear regression, cost function minimization, matrix gradient calculus, vector projection, supervised classifiers, cross-entropy loss, backpropagation dynamics, and multilayer perceptron topologies.`,
  },
  {
    id: 'python-core',
    title: 'Python for System Architects',
    badge: 'Foundational',
    description: 'Core OOP, decorators, asynchronous concurrency, and clean memory lifecycle management.',
    estimatedHours: '12 hrs',
    category: 'Programming',
    topics: ['Memory Allocation', 'OOP Polymorphism', 'Asyncio Event Loops', 'Generators'],
    initialDocumentText: `Advanced Python Engineering: Object-oriented classes, inheritance hierarchies, abstract base classes, generator pipelines, garbage collection lifecycle, multithreading GIL, and asyncio event loops.`,
  },
  {
    id: 'data-science',
    title: 'Data Science & Statistical Inference',
    badge: 'High Impact',
    description: 'Exploratory data analytics, hypothesis testing, Bayesian inference, and feature engineering.',
    estimatedHours: '20 hrs',
    category: 'Analytics',
    topics: ['Probability Density', 'Hypothesis Testing', 'PCA Reduction', 'Pandas Vectorization'],
    initialDocumentText: `Data Science Principles: Probability distributions, central limit theorem, statistical hypothesis testing, p-values, feature scaling, covariance matrices, and dimensionality reduction via Principal Component Analysis.`,
  },
  {
    id: 'fullstack-nextjs',
    title: 'Full-Stack Next.js & Distributed APIs',
    badge: 'Advanced',
    description: 'Server Components, Edge runtimes, state hydration, and secure API gateways.',
    estimatedHours: '16 hrs',
    category: 'Web Architecture',
    topics: ['React Server Components', 'Edge Caching', 'Database Migrations', 'JWT Security'],
    initialDocumentText: `Modern Web Engineering: React 19 architecture, Next.js App Router, server-side streaming, hydration cycles, Edge Middleware, distributed Postgres connection pooling, and token-based authentication.`,
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Infrastructure & Kubernetes',
    badge: 'DevOps',
    description: 'Container orchestration, CI/CD automated deployment pipelines, and microservice meshes.',
    estimatedHours: '14 hrs',
    category: 'Cloud Engineering',
    topics: ['Docker Containerization', 'Kubernetes Pods', 'Ingress Controllers', 'CI/CD Pipelines'],
    initialDocumentText: `Cloud Native Systems: Linux namespaces, Docker multi-stage builds, Kubernetes pod schedulers, cluster services, declarative manifests, distributed ingress gateways, and automated CD deploy pipelines.`,
  },
];