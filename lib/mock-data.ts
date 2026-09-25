import { LearningPath, LearningPathStep } from './types';
import type {
  Concept,
  DependencyEdge,
  QuizQuestion,
  GapAnalysis,
} from './types';

export const mockConcepts: Concept[] = [
  { id: 'c1', name: 'Arrays', description: 'Contiguous memory storage allowing O(1) random access by index.' },
  { id: 'c2', name: 'Big O Notation', description: 'Describes the upper bound on time/space complexity as input grows.' },
  { id: 'c3', name: 'Pointers & Memory', description: 'Variables storing memory addresses; essential for linked structures.' },
  { id: 'c4', name: 'Linked Lists', description: 'Non-contiguous nodes linked by pointers; O(1) insert/delete, O(n) access.' },
  { id: 'c5', name: 'Stacks', description: 'LIFO structure; push/pop from top; used in call management and backtracking.' },
  { id: 'c6', name: 'Queues', description: 'FIFO structure; enqueue at rear, dequeue from front; used in BFS and scheduling.' },
  { id: 'c7', name: 'Trees', description: 'Hierarchical nodes connected by edges; foundation for BSTs and heaps.' },
  { id: 'c8', name: 'Binary Search Trees', description: 'Ordered binary tree enabling O(log n) search, insert, delete when balanced.' },
  { id: 'c9', name: 'Hash Tables', description: 'Key-value mapping using a hash function; average O(1) operations.' },
  { id: 'c10', name: 'Graphs', description: 'Vertices connected by edges; models networks and dependencies.' },
];

export const mockEdges: DependencyEdge[] = [
  { id: 'e1', source: 'c2', target: 'c1', type: 'related', confidence: 60, evidence: 'For example, accessing an array element is O(1), while searching an unsorted array is O(n).' },
  { id: 'e2', source: 'c1', target: 'c5', type: 'prerequisite', confidence: 95, evidence: 'Arrays are a prerequisite for understanding the array-based implementation of stacks.' },
  { id: 'e3', source: 'c1', target: 'c6', type: 'prerequisite', confidence: 90, evidence: 'Understanding linked lists is a prerequisite for understanding the linked-list implementation of queues.' },
  { id: 'e4', source: 'c3', target: 'c4', type: 'prerequisite', confidence: 95, evidence: 'Without understanding pointers, you cannot understand how linked lists or trees are implemented.' },
  { id: 'e5', source: 'c4', target: 'c5', type: 'builds-on', confidence: 80, evidence: 'A stack can be implemented using either an array or a linked list.' },
  { id: 'e6', source: 'c4', target: 'c6', type: 'builds-on', confidence: 85, evidence: 'Like stacks, queues can be implemented using arrays or linked lists.' },
  { id: 'e7', source: 'c3', target: 'c7', type: 'prerequisite', confidence: 95, evidence: 'Understanding pointers is a prerequisite for understanding how trees are implemented, since tree nodes contain pointers to their children.' },
  { id: 'e8', source: 'c7', target: 'c8', type: 'prerequisite', confidence: 95, evidence: 'BSTs build on the concept of binary trees.' },
  { id: 'e9', source: 'c2', target: 'c8', type: 'prerequisite', confidence: 90, evidence: 'Understanding Big O notation is a prerequisite for analyzing BST operations.' },
  { id: 'e10', source: 'c1', target: 'c9', type: 'prerequisite', confidence: 90, evidence: 'Understanding arrays is a prerequisite for understanding hash tables, since the hash table itself is backed by an array.' },
  { id: 'e11', source: 'c4', target: 'c9', type: 'prerequisite', confidence: 85, evidence: 'Linked lists are also a prerequisite for understanding collision resolution by chaining.' },
  { id: 'e12', source: 'c7', target: 'c10', type: 'prerequisite', confidence: 90, evidence: 'Understanding trees is a prerequisite for understanding graphs, since trees are a special case of graphs.' },
  { id: 'e13', source: 'c6', target: 'c10', type: 'prerequisite', confidence: 85, evidence: 'Queues are a prerequisite for breadth-first search, which uses a queue to track nodes to visit next.' },
  { id: 'e14', source: 'c8', target: 'c9', type: 'related', confidence: 55, evidence: 'A common example of a BST is an ordered dictionary.' },
  { id: 'e15', source: 'c5', target: 'c6', type: 'related', confidence: 50, evidence: 'Like stacks, queues can be implemented using arrays or linked lists.' },
];

export const mockQuiz: QuizQuestion[] = [
  {
    id: 'q1',
    conceptId: 'c1',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'],
    correctIndex: 1,
  },
  {
    id: 'q2',
    conceptId: 'c2',
    question: 'Big O notation describes which of the following?',
    options: ['The exact runtime of an algorithm', 'The lower bound on complexity', 'The upper bound on time/space complexity as input grows', 'The average case performance only'],
    correctIndex: 2,
  },
  {
    id: 'q3',
    conceptId: 'c4',
    question: 'In a singly linked list, what is the time complexity of random access to an element?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
  },
  {
    id: 'q4',
    conceptId: 'c7',
    question: 'Which statement about trees is correct?',
    options: ['Every node has exactly two children', 'Each node has a parent except the root', 'Trees cannot be used for searching', 'Trees are a type of queue'],
    correctIndex: 1,
  },
  {
    id: 'q5',
    conceptId: 'c9',
    question: 'What is the average time complexity of insert and lookup in a hash table?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
    correctIndex: 2,
  },
];

export const mockGapAnalysis: GapAnalysis = {
  results: [
    { conceptId: 'c1', status: 'mastered', explanation: 'Correctly identified O(1) array access — strong understanding of arrays.' },
    { conceptId: 'c2', status: 'mastered', explanation: 'Correctly identified Big O as the upper bound on complexity.' },
    { conceptId: 'c4', status: 'weak', explanation: 'Selected O(1) for linked list random access — should be O(n) due to traversal from head.' },
    { conceptId: 'c7', status: 'mastered', explanation: 'Correctly identified that each node has a parent except the root.' },
    { conceptId: 'c9', status: 'mastered', explanation: 'Correctly identified O(1) average hash table operations.' },
  ],
  summary: '4 of 5 concepts mastered. Linked Lists identified as a knowledge gap.',
};

export function mockLearningPath(goalConceptId: string): LearningPath {
  const goal = mockConcepts.find((c) => c.id === goalConceptId);
  const goalName = goal?.name || 'Unknown';

  // Build a chain for common goals
  const chain: { conceptId: string; conceptName: string; masteryStatus: 'mastered' | 'weak' | 'unknown' }[] = [
    { conceptId: 'c1', conceptName: 'Arrays', masteryStatus: 'mastered' },
    { conceptId: 'c2', conceptName: 'Big O Notation', masteryStatus: 'mastered' },
    { conceptId: 'c3', conceptName: 'Pointers & Memory', masteryStatus: 'unknown' },
    { conceptId: 'c4', conceptName: 'Linked Lists', masteryStatus: 'weak' },
    { conceptId: 'c5', conceptName: 'Stacks', masteryStatus: 'unknown' },
    { conceptId: 'c6', conceptName: 'Queues', masteryStatus: 'unknown' },
    { conceptId: 'c7', conceptName: 'Trees', masteryStatus: 'mastered' },
    { conceptId: 'c8', conceptName: 'Binary Search Trees', masteryStatus: 'unknown' },
    { conceptId: 'c9', conceptName: 'Hash Tables', masteryStatus: 'mastered' },
    { conceptId: 'c10', conceptName: 'Graphs', masteryStatus: 'unknown' },
  ];

  const goalIndex = chain.findIndex((c) => c.conceptId === goalConceptId);
  const steps = (goalIndex >= 0 ? chain.slice(0, goalIndex + 1) : chain).map((c, i) => ({
    conceptId: c.conceptId,
    conceptName: c.conceptName,
    order: i + 1,
    isBlocking: c.masteryStatus === 'weak',
    masteryStatus: c.masteryStatus,
    reason: c.masteryStatus === 'weak'
      ? 'You scored below threshold on this concept — it must be mastered before proceeding.'
      : c.masteryStatus === 'mastered'
        ? 'Already mastered — no review needed.'
        : 'Not yet assessed — recommended to study before the goal.',
  }));

  const blocking = steps.find((s) => s.isBlocking) || null;

  const whyExplanation = blocking
    ? `"${blocking.conceptName}" is the first concept blocking your path to "${goalName}". According to the source material: "Without understanding pointers, you cannot understand how linked lists or trees are implemented." Since Linked Lists build on Pointers & Memory and are themselves a prerequisite for Stacks, Queues, and ultimately Hash Tables (via collision resolution by chaining), mastering Linked Lists is essential before you can proceed to more advanced structures. Your quiz showed you selected O(1) for random access in a linked list — the correct answer is O(n) because you must traverse from the head. Review the section on Linked Lists (3.4) and Pointers (3.5) before continuing.`
    : `All prerequisite concepts on the path to "${goalName}" are mastered. You are ready to proceed.`;

  return {
    goalConceptId,
    goalConceptName: goalName,
    steps,
    blockingConceptId: blocking?.conceptId ?? undefined,
    whyExplanation,
  };
}
