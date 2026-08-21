/**
 * .dependency-cruiser.cjs
 *
 * Architecture rule: Controllers → Services → Repositories → Prisma → PostgreSQL
 *
 * - Repositories OWN Prisma calls.
 * - Services OWN transactions.
 * - Controllers own NEITHER Prisma calls nor transactions.
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-prisma-in-controllers',
      severity: 'error',
      comment:
        'Controllers must not import Prisma directly. Move Prisma access to a repository.',
      from: { path: 'src/controllers' },
      to: {
        path: '(src/lib/prisma|src/generated/prisma|@prisma/client)',
        pathNot: '',
      },
    },
    {
      name: 'no-prisma-in-services',
      severity: 'error',
      comment:
        'Services must not import PrismaClient or generated types directly. ' +
        'Use repositories for data access; use withTransaction from src/lib for transactions.',
      from: { path: 'src/services' },
      to: {
        path: 'src/generated/prisma',
        pathNot: '',
      },
    },
    {
      name: 'no-repo-in-controllers',
      severity: 'error',
      comment:
        'Controllers must not call repositories directly. Route through services.',
      from: { path: 'src/controllers' },
      to: { path: 'src/repositories' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};
