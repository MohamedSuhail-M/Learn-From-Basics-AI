export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  readingSnippet: string;
  keyFormula?: string;
  codeExample?: string;
  keyTakeaways: string[];
}

export interface CourseModuleDef {
  id: string;
  number: number;
  title: string;
  summary: string;
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
  /* -------------------------------------------------------------------------- */
  /* 1. MACHINE LEARNING & NEURAL TOPOLOGIES                                    */
  /* -------------------------------------------------------------------------- */
  {
    id: 'ml-foundations',
    title: 'Machine Learning & Neural Topologies',
    badge: 'Popular',
    description: 'Deep mathematical foundations of loss surfaces, backpropagation calculus, and high-dimensional manifold projections.',
    estimatedHours: '28 hrs',
    category: 'AI & Data',
    topics: ['Vector Calculus', 'Gradient Descent', 'Backpropagation', 'Activation Manifolds'],
    initialDocumentText: `Machine Learning Foundations: Linear regression, cost function minimization, matrix gradient calculus, vector projection, supervised classifiers, cross-entropy loss, backpropagation dynamics, and multilayer perceptron topologies.`,
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: Linear Algebra, Metric Spaces & Manifold Projections',
        summary: 'Rigorous exploration of vector spaces, Hilbert spaces, inner products, and orthogonal projections foundational to dimensionality reduction and parameter representations.',
        assessmentTitle: 'Module 1 Prerequisite Checkpoint: Linear Operators & Metric Spaces',
        lessons: [
          {
            id: 'm1-l1',
            title: 'Vector Spaces, Inner Products & Geometric Projections',
            duration: '25 min',
            readingSnippet: `In modern statistical machine learning, all high-dimensional input observations reside as elements within an inner product vector space V over real numbers R^d. The inner product provides geometric structure: it defines metric distances, norms (magnitudes), and orthogonal angles.

When computing similarity between feature embeddings or weights, the inner product measures the directional alignment:
⟨u, v⟩ = u^T v = ||u|| ||v|| cos(θ).

In linear regression and subspace projection, projecting an observation vector y onto the column space of a feature matrix X requires finding a projection operator P such that the residual vector (y - Py) is strictly orthogonal to every basis vector in X. This yields the normal equations:
X^T (y - Xw) = 0 => w = (X^T X)^(-1) X^T y.

Understanding why (X^T X) must be invertible—meaning X must have full column rank—is critical. If features exhibit exact multicollinearity, the Gram matrix (X^T X) becomes singular, requiring regularization techniques like L2 ridge penalties to restore strict positive-definiteness.`,
            keyFormula: 'P = X (X^T X)^(-1) X^T',
            codeExample: `import numpy as np

# Analytical Ordinary Least Squares projection
def analytical_ols(X: np.ndarray, y: np.ndarray) -> np.ndarray:
    # Add bias column
    X_bias = np.c_[np.ones((X.shape[0], 1)), X]
    # Solve Normal Equations: (X^T X)^-1 X^T y
    gram_matrix = X_bias.T @ X_bias
    weights = np.linalg.pinv(gram_matrix) @ X_bias.T @ y
    return weights`,
            keyTakeaways: [
              'Inner products define the metric distance and directional alignment in feature spaces.',
              'Orthogonal projections minimize Euclidean distance from an observation to a model subspace.',
              'Multicollinearity produces non-invertible Gram matrices, requiring pseudo-inversion or L2 regularization.'
            ],
          },
          {
            id: 'm1-l2',
            title: 'Spectral Decomposition & Principal Component Analysis',
            duration: '35 min',
            readingSnippet: `High-dimensional data matrices frequently suffer from the curse of dimensionality, where data points become exponentially equidistant and sparse. Principal Component Analysis (PCA) addresses this by identifying orthogonal axes of maximal empirical variance.

Given a zero-centered dataset matrix X in R^(N x d), the empirical covariance matrix Σ is defined as:
Σ = (1 / (N - 1)) X^T X.

Because Σ is a symmetric, real, positive semi-definite matrix, the Spectral Theorem guarantees that it can be diagonalized using an orthonormal basis of eigenvectors:
Σ = Q Λ Q^T, where Q is an orthogonal matrix of eigenvectors, and Λ is a diagonal matrix of non-negative eigenvalues (λ_1 >= λ_2 >= ... >= λ_d >= 0).

The first principal component corresponds to the eigenvector associated with the largest eigenvalue λ_1, which maximizes the variance of the projected points. Truncating the eigensystem to the top k eigenvectors yields an optimal low-rank linear approximation that minimizes the reconstruction mean-squared error.`,
            keyFormula: 'Σ v_i = λ_i v_i \\quad \\text{where } ||v_i||_2 = 1',
            codeExample: `import numpy as np

def compute_pca(X: np.ndarray, k: int):
    # 1. Zero-center the data
    X_centered = X - np.mean(X, axis=0)
    # 2. Compute empirical covariance matrix
    cov_matrix = np.cov(X_centered, rowvar=False)
    # 3. Spectral decomposition
    eigenvalues, eigenvectors = np.linalg.eigh(cov_matrix)
    # 4. Sort descending
    sorted_idx = np.argsort(eigenvalues)[::-1]
    top_k_eigenvectors = eigenvectors[:, sorted_idx[:k]]
    # 5. Project data into subspace
    return X_centered @ top_k_eigenvectors`,
            keyTakeaways: [
              'The Spectral Theorem ensures any symmetric covariance matrix has orthogonal eigenvectors.',
              'Eigenvalues quantify the total empirical variance preserved along each principal direction.',
              'Truncating to k principal components yields optimal linear compression in L2 reconstruction error.'
            ],
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Multivariable Optimization & Loss Landscapes',
        summary: 'Mathematical mechanics of directional derivatives, Hessian curvature, stochastic gradient descent, and adaptive momentum optimizers.',
        assessmentTitle: 'Module 2 Prerequisite Checkpoint: Optimization Dynamics & Hessians',
        lessons: [
          {
            id: 'm2-l1',
            title: 'Gradient Vectors, Directional Derivatives & Convexity',
            duration: '30 min',
            readingSnippet: `To optimize continuous loss functions L(w) in machine learning, we leverage multivariable differential calculus. The gradient operator ∇L(w) collects all partial derivatives across every parameter dimension.

The directional derivative along any unit vector u represents the instantaneous rate of change of L in that direction:
D_u L(w) = ∇L(w)^T u = ||∇L(w)|| cos(θ).

Because cos(θ) is minimized at θ = π (cos(π) = -1), the direction of steepest descent is precisely the negative gradient vector: -∇L(w).

Furthermore, the local curvature of the loss landscape is described by the Hessian matrix H(w), containing second-order partial derivatives:
H_ij = ∂²L / (∂w_i ∂w_j).

If H(w) is positive definite (all eigenvalues > 0) throughout the parameter space, the objective function is strictly convex, guaranteeing that any local minimum is the unique global minimum. In deep non-convex landscapes, saddle points where ∇L(w) = 0 but H has both positive and negative eigenvalues dominate over local minima.`,
            keyFormula: 'w_{t+1} = w_t - η ∇L(w_t)',
            codeExample: `def gradient_descent_step(weights, gradients, learning_rate=0.01):
    # Vectorized parameter update along the negative gradient
    return weights - (learning_rate * gradients)`,
            keyTakeaways: [
              'The negative gradient vector points along the direction of steepest instantaneous descent.',
              'The Hessian matrix measures second-order curvature and condition numbers of the loss surface.',
              'High-dimensional neural loss surfaces are dominated by saddle points rather than isolated local minima.'
            ],
          },
          {
            id: 'm2-l2',
            title: 'Stochastic Backpropagation & Computational Graphs',
            duration: '40 min',
            readingSnippet: `Backpropagation is an efficient realization of the multivariate chain rule applied across a directed acyclic computational graph. 

Consider a sequence of compositions where input x is mapped through linear transformation z = W x + b, followed by non-linear activation a = σ(z), leading to scalar loss L. To update weight matrix W, we must evaluate the sensitivity ∂L/∂W.

By the chain rule:
∂L/∂W = (∂L/∂a) · (∂a/∂z) · (∂z/∂W).

Defining the error term δ = ∂L/∂z = (∂L/∂a) ⊙ σ'(z), the gradient with respect to the weights becomes the outer product:
∂L/∂W = δ · x^T.

Without dynamic programming over the computational graph, computing analytical derivatives by expanding symbolic equations would require exponential complexity O(2^d). Backpropagation evaluates gradients in linear time O(|V| + |E|) with respect to graph vertices and edges by caching forward activations and propagating adjoint sensitivities backward.`,
            keyFormula: 'δ^{(l)} = ((W^{(l+1)})^T δ^{(l+1)}) ⊙ σ\'(z^{(l)})',
            codeExample: `import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def sigmoid_derivative(a):
    return a * (1.0 - a)

# Backward pass through a single Dense layer
def dense_backward(delta_next, W_next, a_current, z_current):
    # Propagate sensitivity backward through next layer weights
    delta = (W_next.T @ delta_next) * sigmoid_derivative(a_current)
    # Compute gradient with respect to incoming activations
    grad_W = delta @ a_current.T
    grad_b = np.sum(delta, axis=1, keepdims=True)
    return delta, grad_W, grad_b`,
            keyTakeaways: [
              'Backpropagation utilizes reverse-mode automatic differentiation in linear time complexity.',
              'Adjoint sensitivity vectors (deltas) are recursively propagated backwards from outputs to inputs.',
              'Activations computed during forward evaluation must be preserved in RAM for backward gradient computation.'
            ],
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Neural Topological Manifolds & Regularization',
        summary: 'Non-linear coordinate warping, universal approximation boundaries, vanishing/exploding gradients, and structural regularization constraints.',
        assessmentTitle: 'Module 3 Capstone: Non-linear Representation & Generalization',
        lessons: [
          {
            id: 'm3-l1',
            title: 'Activation Manifolds & Non-Linear Coordinate Transformations',
            duration: '35 min',
            readingSnippet: `A purely linear multilayer neural network f(x) = W_3 W_2 W_1 x is algebraically equivalent to a single linear transformation W* x, meaning deep architectures without non-linear activations cannot solve non-linearly separable problems like XOR.

Non-linear activation functions (ReLU, GELU, Swish) warp and twist the geometry of the input space. As data passes through successive hidden layers, the network acts as a continuous topological manifold deformation. Inputs entangled in low dimensions are mapped into higher dimensions where class boundaries can be separated by a simple linear hyperplane.

However, saturating activations such as standard Sigmoids or Tanh introduce the vanishing gradient problem: when |z| becomes large, their derivatives σ'(z) approach zero. As gradients multiply backwards through 10+ layers:
lim_{L -> ∞} ∏_{l=1}^L σ'(z^{(l)}) = 0,
causing initial layers to stall during training. Modern deep architectures bypass this using rectified linear units (ReLU: max(0, x)) with piecewise constant gradients of 1 for positive domains, combined with residual skip connections.`,
            keyFormula: 'x_{l+1} = \\text{ReLU}(W_l x_l + b_l) + x_l \\quad \\text{(Residual Topology)}',
            codeExample: `import numpy as np

def relu(x):
    return np.maximum(0, x)

def relu_derivative(x):
    return (x > 0).astype(float)

# Residual block mapping
def residual_block(x, W1, b1, W2, b2):
    residual = x
    out = relu(W1 @ x + b1)
    out = W2 @ out + b2
    # Skip connection preserves gradient flow during backprop
    return relu(out + residual)`,
            keyTakeaways: [
              'Non-linear activation functions fold coordinate systems to make complex distributions linearly separable.',
              'Saturating activations cause exponential gradient decay in deep networks.',
              'Residual skip connections provide identity gradient shortcuts (∂(x + f(x))/∂x = I + ∂f/∂x).'
            ],
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* 2. PYTHON FOR SYSTEM ARCHITECTS                                            */
  /* -------------------------------------------------------------------------- */
  {
    id: 'python-core',
    title: 'Python for System Architects',
    badge: 'Foundational',
    description: 'CPython memory mechanics, cyclic garbage collectors, descriptor protocols, coroutine event loops, and zero-copy streaming.',
    estimatedHours: '24 hrs',
    category: 'Programming',
    topics: ['Memory Allocation', 'OOP Polymorphism', 'Asyncio Event Loops', 'Generators'],
    initialDocumentText: `Advanced Python Engineering: Object-oriented classes, inheritance hierarchies, abstract base classes, generator pipelines, garbage collection lifecycle, multithreading GIL, and asyncio event loops.`,
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: CPython Data Model, PyObject Anatomy & Memory',
        summary: 'Deconstruct internal CPython reference counting, small integer caches, arenas/pools/blocks, and cyclic generational garbage collection.',
        assessmentTitle: 'Module 1 Prerequisite Checkpoint: Object Layouts & Memory Management',
        lessons: [
          {
            id: 'm1-l1',
            title: 'PyObject Header Anatomy, Small Int Caching & Refcounting',
            duration: '30 min',
            readingSnippet: `Every entity in Python—from an integer to a complex class instance—is allocated as a PyObject pointer on the heap in C. The fundamental PyObject definition contains two core header attributes:
1. ob_refcnt: A signed 64-bit integer tracking active variable references.
2. ob_type: A pointer to the type object determining method resolution and size.

When you execute x = 500, a PyObject is allocated on the heap, and its reference count starts at 1. When x is passed as a function argument or assigned to another variable y = x, ob_refcnt increments. When names exit their enclosing scope or del is invoked, ob_refcnt decrements. The instant ob_refcnt reaches zero, the memory block is immediately returned to Python's internal memory manager (pymalloc).

To avoid constant allocation overhead for common values, CPython pre-allocates an array of small integer objects covering the range [-5, 256]. Evaluating a = 100; b = 100 results in 'a is b' returning True because both variables point to the exact same pre-allocated memory address. For numbers outside this range, distinct PyObjects are allocated.`,
            keyFormula: 'PyObject \\{ ob_refcnt: ssize_t, *ob_type: struct _typeobject \\}',
            codeExample: `import sys

a = []
print("Initial refcount:", sys.getrefcount(a) - 1)  # getrefcount adds 1 temporary ref

b = a
print("After assignment b = a:", sys.getrefcount(a) - 1)

del b
print("After del b:", sys.getrefcount(a) - 1)`,
            keyTakeaways: [
              'All Python objects carry an internal C header with ob_refcnt and a pointer to their type struct.',
              'CPython automatically shares cached memory addresses for small integers between -5 and 256.',
              'Reference counting deallocates memory deterministically the exact instant refcount reaches zero.'
            ],
          },
          {
            id: 'm1-l2',
            title: 'Cyclic References & Generational Garbage Collection',
            duration: '35 min',
            readingSnippet: `While reference counting handles 95% of deallocations instantaneously, it fails fundamentally when objects reference each other cyclically.

Consider object A pointing to object B, while object B points back to object A:
a.partner = b; b.partner = a.
When names 'a' and 'b' are deleted from the outer scope, both objects still have ob_refcnt = 1 due to the internal cross-reference. Under pure reference counting, this memory would leak permanently.

To solve this, CPython runs a cyclic garbage collector (gc module) operating across three generations (Gen 0, Gen 1, Gen 2). Newly allocated container objects (lists, dicts, custom instances) enter Gen 0. The GC periodically detects isolated reference islands using a trial-deletion algorithm:
1. It copies all refcounts of tracked objects into a separate internal field.
2. For each tracked object, it decrements the copied refcount of all objects it references.
3. Any object whose copied refcount drops to zero cannot be reached from outside the cycle and is marked for reclamation.

Surviving objects are promoted to Gen 1 and eventually Gen 2, which is inspected far less frequently to minimize latency spikes.`,
            keyFormula: '\\text{Thresholds: } Gen_0 \\rightarrow Gen_1 \\rightarrow Gen_2 \\quad (700, 10, 10)',
            codeExample: `import gc

class Node:
    def __init__(self, val):
        self.val = val
        self.cycle = None

# Create isolated circular reference
n1 = Node(1)
n2 = Node(2)
n1.cycle = n2
n2.cycle = n1

del n1
del n2

# Force generational cycle detection
unreachable_count = gc.collect()
print(f"Cyclic objects reclaimed: {unreachable_count}")`,
            keyTakeaways: [
              'Circular reference chains cannot be resolved by standard reference counting alone.',
              'Generational GC isolates unreachable cyclic subgraphs via trial-deletion sweeps.',
              'Disabling or tuning GC thresholds is a common optimization for high-throughput memory services.'
            ],
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Meta-Programming, Descriptors & Custom Protocols',
        summary: 'Mastering __getattribute__, the descriptor protocol, metaclasses, and class construction hooks for robust library design.',
        assessmentTitle: 'Module 2 Prerequisite Checkpoint: Metaclasses & Protocol Mechanics',
        lessons: [
          {
            id: 'm2-l1',
            title: 'The Descriptor Protocol & Controlled Attribute Access',
            duration: '30 min',
            readingSnippet: `Descriptors represent the core engine beneath Python properties, class methods, static methods, and ORM schema definitions (e.g., SQLAlchemy, Django Models).

A descriptor is any object that implements at least one method of the descriptor protocol:
- __get__(self, instance, owner=None)
- __set__(self, instance, value)
- __delete__(self, instance)

When accessing an attribute via instance.attr, CPython evaluates lookup precedence in strict order:
1. Data Descriptors (implements BOTH __get__ and __set__) defined on the class.
2. The instance's own __dict__.
3. Non-Data Descriptors (implements ONLY __get__) defined on the class.
4. Class __dict__ values and base class inheritance tree (MRO).

Because data descriptors take precedence over the instance dictionary, they allow libraries to enforce validation, type checks, and lazy loading without polluting the consumer's syntax.`,
            keyFormula: '\\text{Precedence: Data Descriptor} > \\text{Instance \\_\\_dict\\_\\_} > \\text{Non-Data Descriptor}',
            codeExample: `class ValidatedString:
    def __init__(self, min_len=3):
        self.min_len = min_len

    def __set_name__(self, owner, name):
        self.private_name = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.private_name, "")

    def __set__(self, instance, value):
        if not isinstance(value, str) or len(value) < self.min_len:
            raise ValueError(f"Value must be str with min length {self.min_len}")
        setattr(instance, self.private_name, value)

class User:
    username = ValidatedString(min_len=5)

u = User()
u.username = "albatross"  # Valid
# u.username = "cat"      # Raises ValueError!`,
            keyTakeaways: [
              'Descriptors define attribute access behavior at the class level.',
              'Data descriptors (defining __set__) override instance dictionary lookups.',
              'Python @property and @classmethod are built-in implementations of descriptors.'
            ],
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Asynchronous Event Loops & Low-Latency I/O',
        summary: 'Demystify non-blocking I/O multiplexing (epoll/kqueue), coroutine state machines, task scheduling, and avoiding GIL bottlenecks.',
        assessmentTitle: 'Module 3 Capstone: Asyncio Event Loops & Concurrency',
        lessons: [
          {
            id: 'm3-l1',
            title: 'OS Multiplexing, Coroutine Bytecode & Event Loops',
            duration: '40 min',
            readingSnippet: `Traditional multithreading in CPython is bounded by the Global Interpreter Lock (GIL), an internal mutual exclusion lock preventing multiple OS threads from executing Python bytecode simultaneously on separate CPU cores.

For network-bound workloads (HTTP requests, database sockets), asynchronous I/O (asyncio) sidesteps thread context-switching overhead using cooperative multitasking managed by an event loop.

At the operating system level, the event loop leverages non-blocking I/O multiplexers like epoll (Linux) or kqueue (macOS). Instead of blocking an entire OS thread waiting for socket bytes, Python registers file descriptors with the kernel.

Under the hood, declaring 'async def' compiles a function into a coroutine object. When an 'await' expression is hit:
1. The coroutine suspends its stack frame and yields control back to the event loop.
2. The event loop monitors the registered socket.
3. When the kernel signals that bytes are ready, the event loop schedules the coroutine and calls its .send() method to resume execution exactly where it paused.

Because execution is single-threaded and cooperative, no locks are needed to prevent race conditions during pure compute segments between awaits.`,
            keyFormula: '\\text{Kernel Multiplexing: } epoll\\_wait() \\rightarrow \\text{Event Loop Dispatch} \\rightarrow coroutine.send()',
            codeExample: `import asyncio

async def fetch_database_record(record_id: int):
    # Simulates non-blocking OS I/O sleep
    await asyncio.sleep(0.05)
    return {"id": record_id, "status": "active"}

async def main():
    # Schedule 500 concurrent operations over single OS thread
    tasks = [fetch_database_record(i) for i in range(500)]
    results = await asyncio.gather(*tasks)
    print(f"Successfully retrieved {len(results)} records asynchronously.")

# Run through the asyncio event loop
asyncio.run(main())`,
            keyTakeaways: [
              'Asyncio utilizes single-threaded cooperative multitasking bounded by an OS event loop.',
              'Awaiting suspends the coroutine frame without blocking the operating system thread.',
              'CPU-intensive tasks block the entire event loop unless offloaded to a ProcessPoolExecutor.'
            ],
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* 3. DATA SCIENCE & STATISTICAL INFERENCE                                    */
  /* -------------------------------------------------------------------------- */
  {
    id: 'data-science',
    title: 'Data Science & Statistical Inference',
    badge: 'High Impact',
    description: 'Frequentist and Bayesian hypothesis testing, multivariate distribution densities, central limit convergence, and high-dimensional PCA reduction.',
    estimatedHours: '26 hrs',
    category: 'Analytics',
    topics: ['Probability Density', 'Hypothesis Testing', 'PCA Reduction', 'Pandas Vectorization'],
    initialDocumentText: `Data Science Principles: Probability distributions, central limit theorem, statistical hypothesis testing, p-values, feature scaling, covariance matrices, and dimensionality reduction via Principal Component Analysis.`,
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: Probability Densities & Sampling Distributions',
        summary: 'Continuous distributions, law of large numbers, Central Limit Theorem mechanics, and standard error of estimation.',
        assessmentTitle: 'Module 1 Prerequisite Checkpoint: Statistical Sampling & CLT',
        lessons: [
          {
            id: 'm1-l1',
            title: 'Probability Density Functions & Expectation Algebra',
            duration: '30 min',
            readingSnippet: `In continuous probability spaces, the Probability Density Function (PDF) f(x) does not denote the probability of a single exact value, which is infinitesimally zero (P(X = x) = 0). Instead, probabilities are computed as integrals across intervals:
P(a <= X <= b) = ∫_a^b f(x) dx.

The expected value E[X] represents the first moment (center of mass), while variance Var(X) measures the second central moment (dispersion):
E[X] = ∫_{-∞}^∞ x f(x) dx,
Var(X) = E[(X - E[X])^2] = E[X^2] - (E[X])^2.

When standardizing random variables to z-scores:
Z = (X - μ) / σ,
the transformed distribution possesses mean 0 and unit variance 1. Understanding moment generating functions allows data scientists to prove convergence bounds and recognize heavy-tailed distributions where standard variance diverges.`,
            keyFormula: 'Z = \\frac{X - \\mu}{\\sigma}',
            codeExample: `import numpy as np

# Empirical expectation and standard deviation
data = np.random.normal(loc=50.0, scale=12.0, size=100000)
mean_est = np.mean(data)
std_est = np.std(data, ddof=1)  # Bessel correction ddof=1 for unbiased estimator

# Standardize to Z-score
z_scores = (data - mean_est) / std_est
print(f"Standardized Mean: {np.mean(z_scores):.4f}, Std: {np.std(z_scores):.4f}")`,
            keyTakeaways: [
              'Continuous probability values are calculated across integrals, not discrete point evaluations.',
              'Sample variance requires Bessel correction (N - 1 denominator) to prevent downward bias.',
              'Z-score normalization transforms any normal distribution to N(0, 1).'
            ],
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Hypothesis Testing, Power & Bayesian Updates',
        summary: 'Formulating null/alternative hypotheses, Type I/II error tradeoffs, p-value calculations, and Bayesian posterior distributions.',
        assessmentTitle: 'Module 2 Prerequisite Checkpoint: Statistical Significance & Inference',
        lessons: [
          {
            id: 'm2-l1',
            title: 'Null Hypothesis Significance Testing & Type I/II Errors',
            duration: '35 min',
            readingSnippet: `Null Hypothesis Significance Testing (NHST) provides an objective mathematical framework to decide whether an observed empirical effect represents genuine reality or random sampling noise.

We define:
- H_0 (Null Hypothesis): There is no true difference or effect between treatments.
- H_1 (Alternative Hypothesis): A statistically significant difference exists.

A p-value is the probability of observing an effect at least as extreme as the empirical sample, assuming the null hypothesis is strictly true: P(Data | H_0).

Decision risks fall into two categories:
1. Type I Error (α - False Positive): Rejecting H_0 when H_0 is actually true. Typically set at α = 0.05.
2. Type II Error (β - False Negative): Failing to reject H_0 when an alternative effect exists.
Statistical power is defined as (1 - β), denoting the probability of correctly identifying a genuine effect. As sample size N increases, standard error shrinks, elevating statistical power without inflating α.`,
            keyFormula: 't = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{s_1^2 / n_1 + s_2^2 / n_2}}',
            codeExample: `from scipy import stats
import numpy as np

# A/B testing simulation
control = np.random.normal(10.2, 2.0, size=250)
treatment = np.random.normal(10.8, 2.0, size=250)

# Welch's Two-Sample t-test (assumes unequal variances)
t_stat, p_val = stats.ttest_ind(control, treatment, equal_var=False)

alpha = 0.05
print(f"t-statistic: {t_stat:.3f}, p-value: {p_val:.4e}")
if p_val < alpha:
    print("Reject H0: Statistically significant uplift detected.")`,
            keyTakeaways: [
              'A p-value measures P(Observed Data | H_0), NOT the probability that H_0 is true.',
              'Statistical power (1 - β) is the likelihood of detecting a real effect when one exists.',
              'Larger sample sizes reduce standard error, directly boosting statistical power.'
            ],
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Covariance Decompositions & High-Dimensional Feature Spaces',
        summary: 'Multivariate feature distributions, Gram matrices, collinearity metrics, and singular value decomposition.',
        assessmentTitle: 'Module 3 Capstone: Multicollinearity & Subspace Projections',
        lessons: [
          {
            id: 'm3-l1',
            title: 'Singular Value Decomposition (SVD) for Feature Compaction',
            duration: '40 min',
            readingSnippet: `While eigendecomposition applies exclusively to square matrices, Singular Value Decomposition (SVD) is a universal factorization applicable to any real rectangular matrix X in R^(m x n):
X = U Σ V^T.

Where:
- U is an m x m orthogonal matrix whose columns are left-singular vectors (eigenvectors of X X^T).
- Σ is an m x n diagonal matrix of non-negative singular values σ_i sorted in descending order.
- V^T is an n x n orthogonal matrix of right-singular vectors (eigenvectors of X^T X).

The Eckart-Young-Mirsky Theorem proves that truncating this decomposition to the top r singular values produces the best possible rank-r approximation of matrix X in both Frobenius and spectral norms. In modern recommender engines, latent factor embeddings and text embeddings compress sparse interaction graphs using truncated SVD.`,
            keyFormula: 'X \\approx \\sum_{i=1}^r \\sigma_i u_i v_i^T',
            codeExample: `import numpy as np

# Low-rank SVD compression
X = np.random.randn(50, 20)
U, s, Vt = np.linalg.svd(X, full_matrices=False)

# Truncate to rank-5
r = 5
X_approx = U[:, :r] @ np.diag(s[:r]) @ Vt[:r, :]
error = np.linalg.norm(X - X_approx, 'fro')
print(f"Frobenius reconstruction loss at rank {r}: {error:.4f}")`,
            keyTakeaways: [
              'SVD factors any rectangular matrix into orthogonal singular vectors and scaling values.',
              'Singular values directly correspond to the square roots of the eigenvalues of X^T X.',
              'The Eckart-Young theorem guarantees SVD provides the lowest-error low-rank approximation.'
            ],
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* 4. FULL-STACK NEXT.JS & DISTRIBUTED APIS                                   */
  /* -------------------------------------------------------------------------- */
  {
    id: 'fullstack-nextjs',
    title: 'Full-Stack Next.js & Distributed APIs',
    badge: 'Advanced',
    description: 'React Server Component serialization graphs, Suspense streaming pipelines, optimistic mutation states, and Edge cache invalidation.',
    estimatedHours: '22 hrs',
    category: 'Web Architecture',
    topics: ['React Server Components', 'Edge Caching', 'Database Migrations', 'JWT Security'],
    initialDocumentText: `Modern Web Engineering: React 19 architecture, Next.js App Router, server-side streaming, hydration cycles, Edge Middleware, distributed Postgres connection pooling, and token-based authentication.`,
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: React Server Components & Wire Serialization',
        summary: 'Deconstruct RSC payload streaming, server-client boundaries, bundle elimination, and Suspense progressive hydration.',
        assessmentTitle: 'Module 1 Prerequisite Checkpoint: RSC Graphs & Hydration Boundaries',
        lessons: [
          {
            id: 'm1-l1',
            title: 'The RSC Architecture & Virtual DOM Serialization',
            duration: '30 min',
            readingSnippet: `Traditional React client-side rendering (CSR) requires transmitting a massive JavaScript bundle containing UI components, formatting libraries, and state logic to the browser before anything renders.

The Next.js App Router utilizes React Server Components (RSC) to fundamentally re-architect this pipeline. By default, components inside the /app directory execute exclusively on the Node.js or Edge server runtime.

When an RSC renders:
1. It reads directly from server-side databases, filesystems, and caches without exposing API credentials.
2. Heavy third-party libraries (e.g., date-fns, markdown parsers) are executed on the server and completely omitted from the client JavaScript bundle.
3. Instead of outputting HTML alone, the server emits a special RSC payload—a JSON-like serialized stream containing virtual DOM nodes and instructions on where Client Components ('use client') should be hydrated into the UI tree.

Client Components must define a serialization boundary: any props passed from a Server Component to a Client Component must be JSON-serializable. Functions and custom class instances cannot cross this boundary.`,
            keyFormula: '\\text{Server Node} \\xrightarrow{\\text{RSC Payload Stream}} \\text{Client Hydration Reconciler}',
            codeExample: `// app/components/ServerFeed.tsx (Server Component by default)
import db from '@/lib/db';
import ClientLikeButton from './ClientLikeButton';

export default async function ServerFeed() {
  // Direct server database query - 0kb shipped to client JS bundle
  const posts = await db.query('SELECT id, title, content FROM posts LIMIT 10');

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="p-4 border rounded-xl">
          <h2 className="font-bold">{post.title}</h2>
          <p>{post.content}</p>
          {/* Client Component Boundary */}
          <ClientLikeButton postId={post.id} />
        </article>
      ))}
    </div>
  );
}`,
            keyTakeaways: [
              'Server Components render on the server without adding any JavaScript to the client bundle.',
              'RSC emits a serialized virtual DOM tree that client-side React reconciles dynamically.',
              'Props crossing the server-to-client boundary must be strictly JSON-serializable.'
            ],
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Server Actions & Cache Revalidation',
        summary: 'Progressive enhancement with Server Actions, optimistic UI reconciliation, revalidateTag, and stale-while-revalidate caches.',
        assessmentTitle: 'Module 2 Prerequisite Checkpoint: Data Mutations & Cache Invalidation',
        lessons: [
          {
            id: 'm2-l1',
            title: 'Server Actions, Form Submissions & Cache Tagging',
            duration: '35 min',
            readingSnippet: `Server Actions allow developers to define asynchronous server functions that can be called directly from client components or HTML form elements without manually wiring API routes.

Under the hood, Next.js treats Server Actions as hidden POST endpoints. When a form invokes a Server Action:
1. Next.js dispatches a POST request with serialized form parameters.
2. The server executes business logic (e.g., database mutation, auth verification).
3. The server calls 'revalidatePath()' or 'revalidateTag()', purging the Data Cache and Full Route Cache for affected pages.
4. The server returns the updated RSC payload in the same HTTP response, allowing the browser to refresh UI components without a full page reload.

By combining Server Actions with React's useOptimistic hook, applications can update the local UI instantly before the server round-trip completes, rolling back automatically if the action fails.`,
            keyFormula: 'revalidateTag("user-posts") \\rightarrow \\text{Purges Data Cache} \\rightarrow \\text{Fresh RSC Stream}',
            codeExample: `'use server';

import { revalidateTag } from 'next/cache';
import db from '@/lib/db';

export async function addCommentAction(postId: string, formData: FormData) {
  const content = formData.get('comment') as string;
  if (!content || content.length < 2) throw new Error('Comment too short');

  await db.query(
    'INSERT INTO comments (post_id, content, created_at) VALUES ($1, $2, NOW())',
    [postId, content]
  );

  // Invalidate cached reads tagged with this post
  revalidateTag(\`comments-\${postId}\`);
}`,
            keyTakeaways: [
              'Server Actions provide type-safe server mutations without boilerplate REST controllers.',
              'revalidateTag allows granular cache invalidation across distributed edge nodes.',
              'useOptimistic allows immediate UI updates while the server mutation processes.'
            ],
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Edge Middleware, Distributed Routing & Security',
        summary: 'Edge V8 isolates, cryptographic JWT verification at the edge, sub-millisecond rewrites, and Distributed Denial of Service (DDoS) rate limiting.',
        assessmentTitle: 'Module 3 Capstone: Edge Routing & Security Architecture',
        lessons: [
          {
            id: 'm3-l1',
            title: 'Edge Middleware Interceptors & Web Crypto Auth',
            duration: '30 min',
            readingSnippet: `Next.js Middleware runs globally before any request completes, executing inside a lightweight V8 Edge Runtime located in data centers closest to the end user.

Because the Edge Runtime lacks Node.js APIs (e.g., native fs, child_process), operations must use standard Web APIs (Request, Response, Headers, SubtleCrypto).

When an HTTP request arrives:
1. Middleware intercepts headers, cookies, and search parameters in under 5 milliseconds.
2. It verifies the cryptographic signature of session JSON Web Tokens (JWT) using the Web Crypto API (HMAC SHA-256).
3. If valid, the request continues with augmented request headers (e.g., x-user-id).
4. If invalid or expired, the Edge runtime immediately redirects to /sign-in, protecting downstream servers and database connection pools from unauthenticated traffic.`,
            keyFormula: '\\text{Request} \\rightarrow \\text{Edge V8 Middleware (<5ms)} \\rightarrow \\text{Node Origin / RSC Cache}',
            codeExample: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;

  // Intercept unauthenticated access to protected dashboard
  if (!sessionToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/sign-in', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/course/:path*'],
};`,
            keyTakeaways: [
              'Edge Middleware intercepts requests in lightweight V8 isolates close to users.',
              'Authentication validation at the edge protects backend origin databases from bad traffic.',
              'Edge runtimes require standard Web APIs rather than Node-specific modules.'
            ],
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* 5. CLOUD INFRASTRUCTURE & KUBERNETES                                       */
  /* -------------------------------------------------------------------------- */
  {
    id: 'cloud-devops',
    title: 'Cloud Infrastructure & Kubernetes',
    badge: 'DevOps',
    description: 'Linux cgroups, container namespaces, Kubernetes reconciliation controllers, Ingress routing, and declarative GitOps pipelines.',
    estimatedHours: '25 hrs',
    category: 'Cloud Engineering',
    topics: ['Docker Containerization', 'Kubernetes Pods', 'Ingress Controllers', 'CI/CD Pipelines'],
    initialDocumentText: `Cloud Native Systems: Linux namespaces, Docker multi-stage builds, Kubernetes pod schedulers, cluster services, declarative manifests, distributed ingress gateways, and automated CD deploy pipelines.`,
    curriculum: [
      {
        id: 'mod-1',
        number: 1,
        title: 'Module 1: Linux Kernel Primitives & Container Mechanics',
        summary: 'Deconstructing container runtimes using Linux namespaces (PID, NET, MNT), Control Groups (cgroups v2), and layered copy-on-write filesystems.',
        assessmentTitle: 'Module 1 Prerequisite Checkpoint: Kernel Isolation & Multi-Stage Builds',
        lessons: [
          {
            id: 'm1-l1',
            title: 'Namespaces, Cgroups v2 & Container Immutability',
            duration: '35 min',
            readingSnippet: `Containers are not virtual machines: they run directly on the host Linux kernel without a hypervisor or guest operating system. A container is simply an isolated Linux process bounded by two kernel primitives:

1. Namespaces (Visibility):
- PID Namespace: Gives the container process its own isolated process ID tree where the entrypoint process appears as PID 1.
- NET Namespace: Gives the container its own virtual network interface, IP routing table, and iptables rules.
- MNT Namespace: Isolates mount points so the container sees only its own root filesystem.

2. Control Groups (cgroups v2 - Resource Enforcement):
Cgroups limit how much hardware the process can consume. If a container exceeds its configured memory limit, the Linux kernel Out-Of-Memory (OOM) killer terminates PID 1 with exit code 137.

Multi-stage Docker builds take advantage of immutable layered filesystems (OverlayFS) to isolate heavy SDKs and compilers in intermediate stages, copying only static binaries into a minimal Alpine or distroless production base image.`,
            keyFormula: '\\text{Container} = \\text{Linux Process} + \\text{Namespaces (Isolation)} + \\text{cgroups (Limits)}',
            codeExample: `# Multi-stage Dockerfile optimizing attack surface and image size
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production minimal runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]`,
            keyTakeaways: [
              'Containers are standard Linux processes isolated via kernel namespaces and cgroups.',
              'Cgroups enforce hard limits on CPU and RAM; exceeding limits triggers kernel OOM kills.',
              'Multi-stage builds eliminate compilers and build dependencies from the final production image.'
            ],
          },
        ],
      },
      {
        id: 'mod-2',
        number: 2,
        title: 'Module 2: Kubernetes Control Plane & Pod Scheduling',
        summary: 'Kube-apiserver reconciliation loops, Raft consensus in etcd, kube-scheduler scoring, and ReplicaSet self-healing.',
        assessmentTitle: 'Module 2 Prerequisite Checkpoint: Orchestration & Distributed Consensus',
        lessons: [
          {
            id: 'm2-l1',
            title: 'The Declarative State Machine & Controller Reconciliation',
            duration: '40 min',
            readingSnippet: `Kubernetes operates on a declarative configuration model rather than an imperative one. Instead of issuing instructions like "launch three servers," an engineer submits a YAML manifest defining the Desired State.

The control plane continuously runs a reconciliation loop:
Current State (observed by kubelet) <---> Desired State (stored in etcd) -> Reconcile.

Key Control Plane Components:
- etcd: A distributed, consistent key-value store using the Raft consensus algorithm to persist cluster state.
- kube-apiserver: The stateless REST API gateway through which all cluster components communicate.
- kube-scheduler: Evaluates resource requests, node affinities, taints, and tolerations to pick the optimal worker node for newly declared pods.
- kube-controller-manager: Runs continuous loops (e.g., ReplicaSetController). If a worker node crashes and current replicas drop from 3 to 2, the controller reconciles the gap by asking the scheduler to place a replacement pod elsewhere.`,
            keyFormula: '\\text{Reconciliation Loop: } \\text{Observe} \\rightarrow \\text{Compare} \\rightarrow \\text{Act (Match Desired State)}',
            codeExample: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api-container
        image: api-service:v2.1
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
        readinessProbe:
          httpGet:
            path: /healthz
            port: 3000`,
            keyTakeaways: [
              'Kubernetes maintains desired state via continuous controller reconciliation loops.',
              'etcd guarantees strong data consistency across the cluster using Raft consensus.',
              'Readiness probes determine whether pods receive traffic; liveness probes trigger automatic restarts.'
            ],
          },
        ],
      },
      {
        id: 'mod-3',
        number: 3,
        title: 'Module 3: Ingress Traffic, Service Meshes & GitOps Delivery',
        summary: 'ClusterIP and NodePort networking, Envoy-based Ingress proxies, TLS termination, and ArgoCD declarative synchronization.',
        assessmentTitle: 'Module 3 Capstone: Ingress Gateways & Automated Delivery',
        lessons: [
          {
            id: 'm3-l1',
            title: 'Cluster Networking, Ingress Gateways & GitOps',
            duration: '35 min',
            readingSnippet: `Pods in Kubernetes are ephemeral: they are created, scaled, and destroyed dynamically, changing their private IP addresses constantly.

To provide a stable network endpoint, Kubernetes uses the Service abstraction:
- ClusterIP: Exposes an internal virtual IP backed by kube-proxy iptables or eBPF rules that load-balance requests across matching backend pod endpoints.
- Ingress Controller: Sits at the edge of the cluster (typically powered by NGINX or Envoy) to route external HTTP/HTTPS traffic to internal services based on domain names and path prefixes.

In production environments, cluster changes are deployed using GitOps (e.g., ArgoCD). A Git repository serves as the single source of truth for all Kubernetes manifests. An in-cluster GitOps operator monitors the repository, automatically applying tested changes and rolling back cluster state if an unauthorized manual change occurs.`,
            keyFormula: '\\text{Client} \\rightarrow \\text{Ingress (Envoy)} \\rightarrow \\text{ClusterIP Service} \\rightarrow \\text{Pod Endpoint}',
            codeExample: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  rules:
  - host: api.production.domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 3000`,
            keyTakeaways: [
              'Services provide stable virtual IPs and load balancing across ephemeral pods.',
              'Ingress controllers handle external routing, domain matching, and TLS termination.',
              'GitOps tools like ArgoCD treat Git as the single source of truth for cluster state.'
            ],
          },
        ],
      },
    ],
  },
];