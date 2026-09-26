export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  readingSnippet: string;
  keyFormula?: string;
}

export interface CourseModuleDef {
  id: string;
  number: number;
  title: string;
  lessons: CourseLesson[];
  assessmentTitle: string;
}

export interface PresetCourse {
  id: string;
  title: string;
  badge: string;
  description: string;
  estimatedHours: string;
  category: string;
  topics: string[];
  initialDocumentText: string;
  curriculum: CourseModuleDef[];
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
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: Matrix Algebra & Topological Vector Spaces',
        assessmentTitle: 'Module 1 Checkpoint: Linear Algebra & Projections',
        lessons: [
          {
            id: 'm1-l1',
            title: 'Vector Geometry & Inner Products',
            duration: '14 min',
            readingSnippet: 'Mathematical grounding provides the prerequisite base for gradient calculations. Understanding vector dot products and projections is essential before evaluating neural manifolds.',
            keyFormula: 'A · B = ||A|| ||B|| cos(θ)',
          },
          {
            id: 'm1-l2',
            title: 'Eigendecomposition & Manifold Projection',
            duration: '22 min',
            readingSnippet: 'Eigenvectors point in directions where a linear transformation acts as a simple scalar stretch. In ML, this is foundational for PCA and covariance analysis.',
            keyFormula: 'A v = λ v',
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Multivariable Gradient Optimization',
        assessmentTitle: 'Module 2 Checkpoint: Gradient Calculus & Loss',
        lessons: [
          {
            id: 'm2-l1',
            title: 'Loss Surfaces & Directional Derivatives',
            duration: '18 min',
            readingSnippet: 'In multivariate calculus, gradient vectors store the directional derivatives along every axis. Parameter updates follow the negative descent direction.',
            keyFormula: '∇f(x, y) = [ ∂f/∂x, ∂f/∂y ]^T',
          },
          {
            id: 'm2-l2',
            title: 'Stochastic Backpropagation Dynamics',
            duration: '25 min',
            readingSnippet: 'Backpropagation applies the multivariate chain rule backwards across layered computational graphs to calculate loss gradients with respect to each weight.',
            keyFormula: 'w := w - η (∂L/∂w)',
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Neural Topological Manifolds',
        assessmentTitle: 'Module 3 Capstone: Deep Neural Architectures',
        lessons: [
          {
            id: 'm3-l1',
            title: 'Activation Manifolds & Non-Linear Boundaries',
            duration: '30 min',
            readingSnippet: 'Non-linear activations fold and stretch space so that non-linearly separable input data can be linearly classified in higher-dimensional hidden layers.',
            keyFormula: 'σ(z) = 1 / (1 + e^(-z))',
          },
        ],
      },
    ],
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
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: Data Model & Object Lifecycle',
        assessmentTitle: 'Module 1 Checkpoint: Dunder Methods & Memory',
        lessons: [
          {
            id: 'm1-l1',
            title: 'Reference Counting & PyObject Allocation',
            duration: '15 min',
            readingSnippet: 'CPython tracks references via ob_refcnt. When refcount hits zero, memory deallocation occurs, with a cyclic garbage collector resolving self-referential containers.',
            keyFormula: 'sys.getrefcount(obj) -> int',
          },
          {
            id: 'm1-l2',
            title: 'Dunder Protocols & Metaclasses',
            duration: '20 min',
            readingSnippet: 'By implementing special protocols like __iter__, __getitem__, and __call__, custom classes seamlessly hook into native Python syntax and operators.',
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Generators, Closures & Decorators',
        assessmentTitle: 'Module 2 Checkpoint: Closures & Coroutines',
        lessons: [
          {
            id: 'm2-l1',
            title: 'Lexical Scoping & Variable Enclosures',
            duration: '16 min',
            readingSnippet: 'Closures capture and retain access to outer variables even after the parent scope has finished executing, forming the basis for parameter decorators.',
          },
          {
            id: 'm2-l2',
            title: 'Lazy Evaluation with Generator Pipelines',
            duration: '22 min',
            readingSnippet: 'Generators yield values on demand instead of allocating massive collections in RAM, preserving memory throughput across high-volume pipelines.',
            keyFormula: 'yield chunk',
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Asynchronous Concurrency & Asyncio',
        assessmentTitle: 'Module 3 Capstone: Event Loops & Task Scheduling',
        lessons: [
          {
            id: 'm3-l1',
            title: 'The Global Interpreter Lock & Event Loops',
            duration: '28 min',
            readingSnippet: 'Asyncio leverages cooperative multitasking around non-blocking I/O multiplexing (epoll/kqueue), allowing a single Python thread to handle thousands of concurrent sockets.',
            keyFormula: 'await asyncio.gather(*tasks)',
          },
        ],
      },
    ],
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
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: Descriptive Statistics & Probability Distributions',
        assessmentTitle: 'Module 1 Checkpoint: Distributions & Variance',
        lessons: [
          {
            id: 'm1-l1',
            title: 'Measures of Central Tendency & Dispersion',
            duration: '14 min',
            readingSnippet: 'Skewed distributions require medians and interquartile ranges, while symmetric normal distributions rely on variance and standard deviations for dispersion analysis.',
            keyFormula: 'σ² = (1/N) * Σ(x_i - μ)²',
          },
          {
            id: 'm1-l2',
            title: 'The Central Limit Theorem in Sample Estimation',
            duration: '18 min',
            readingSnippet: 'Regardless of the population distribution, the sample mean distribution converges to a Gaussian distribution as the sample size grows sufficiently large.',
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Hypothesis Testing & Significance',
        assessmentTitle: 'Module 2 Checkpoint: P-Values & Null Hypotheses',
        lessons: [
          {
            id: 'm2-l1',
            title: 'Type I / II Errors & Confidence Intervals',
            duration: '20 min',
            readingSnippet: 'Hypothesis testing balances false positive discovery against statistical power, measuring significance through critical z-scores and t-scores.',
          },
          {
            id: 'm2-l2',
            title: 'Two-Sample T-Tests & ANOVA',
            duration: '24 min',
            readingSnippet: 'Compare sample population variances across multiple experiment groups to verify if observed metric differences are statistically significant.',
            keyFormula: 't = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂)',
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Dimensionality Reduction & PCA',
        assessmentTitle: 'Module 3 Capstone: Covariance & Decomposition',
        lessons: [
          {
            id: 'm3-l1',
            title: 'Principal Component Analysis & Eigenvector Projection',
            duration: '26 min',
            readingSnippet: 'PCA compresses high-dimensional feature spaces into orthogonal vectors of maximal variance, eliminating multicollinear noise.',
            keyFormula: 'Cov(X) = (1/n) * X^T X',
          },
        ],
      },
    ],
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
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: React Server Components & Streaming',
        assessmentTitle: 'Module 1 Checkpoint: RSC & Hydration Boundary',
        lessons: [
          {
            id: 'm1-l1',
            title: 'Server-First Component Execution Graph',
            duration: '16 min',
            readingSnippet: 'RSCs render purely on the server without shipping JavaScript client bundles, reducing hydration overhead and memory consumption in the browser.',
          },
          {
            id: 'm1-l2',
            title: 'Suspense Boundaries & Chunked HTML Streaming',
            duration: '20 min',
            readingSnippet: 'Next.js streams initial shell HTML immediately while progressive child components stream down the wire as server database queries resolve.',
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Server Actions & Data Mutation',
        assessmentTitle: 'Module 2 Checkpoint: Mutations & Caching',
        lessons: [
          {
            id: 'm2-l1',
            title: 'Server Actions & Form State Revalidation',
            duration: '22 min',
            readingSnippet: 'Server Actions execute secure server logic without requiring explicit REST endpoints, triggering revalidatePath to refresh cached client views.',
            keyFormula: 'revalidatePath("/dashboard")',
          },
          {
            id: 'm2-l2',
            title: 'Optimistic UI Updates & Pending States',
            duration: '18 min',
            readingSnippet: 'Improve perceived performance by updating the UI optimistically before the network round-trip confirms database writes.',
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Edge Middleware & Authentication',
        assessmentTitle: 'Module 3 Capstone: Edge Gateways & Security',
        lessons: [
          {
            id: 'm3-l1',
            title: 'Edge Middleware Interceptors & JWT Verification',
            duration: '25 min',
            readingSnippet: 'Edge Middleware inspects HTTP headers and signs cryptographically validated auth tokens at locations geographically closest to the user.',
          },
        ],
      },
    ],
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
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: Containerization & Linux Primitives',
        assessmentTitle: 'Module 1 Checkpoint: Namespaces & Dockerfiles',
        lessons: [
          {
            id: 'm1-l1',
            title: 'Linux Cgroups & Namespace Isolation',
            duration: '15 min',
            readingSnippet: 'Containers are isolated Linux processes governed by cgroups for CPU/memory limitations and namespaces for PID/network sandboxing.',
          },
          {
            id: 'm1-l2',
            title: 'Multi-Stage Docker Production Builds',
            duration: '18 min',
            readingSnippet: 'Separate compile-time dependencies from production deployment artifacts to shrink image footprints and reduce container vulnerabilities.',
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Kubernetes Cluster Orchestration',
        assessmentTitle: 'Module 2 Checkpoint: Deployments & Services',
        lessons: [
          {
            id: 'm2-l1',
            title: 'Pod Lifecycle & ReplicaSet Scheduling',
            duration: '22 min',
            readingSnippet: 'The Kubernetes control plane continuously reconciles current state against declared YAML manifests to guarantee high availability.',
            keyFormula: 'kubectl apply -f deployment.yaml',
          },
          {
            id: 'm2-l2',
            title: 'ClusterIP, NodePort & Ingress Routing',
            duration: '24 min',
            readingSnippet: 'Services provide stable virtual IPs and DNS names that route traffic across ephemeral, auto-scaling backend pods.',
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Automated GitOps & Microservices',
        assessmentTitle: 'Module 3 Capstone: Ingress Gateways & GitOps',
        lessons: [
          {
            id: 'm3-l1',
            title: 'Declarative GitOps Pipelines & Mesh Gateways',
            duration: '28 min',
            readingSnippet: 'GitOps agents watch code repositories and apply tested configuration states directly to clusters without manual SSH intervention.',
          },
        ],
      },
    ],
  },
];