
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { stories as samples } from './stories';

/* ==========================================
   ARTICLE TYPES
   ========================================== */

export type Article = {
  id: number;
  slug: string;
  title: string;
  dek: string;
  category: string;
  author: string;
  cover: string;
  body: string;
  status: string;
  featured: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

/* ==========================================
   DATABASE CONFIGURATION
   ========================================== */

const dir = path.join(process.cwd(), 'data');

let db: DatabaseSync | undefined;

/* ==========================================
   SQLITE RESULT CONVERSION

   Converts SQLite query results into plain
   JavaScript objects compatible with Next.js
   Server-to-Client Component serialization.
   ========================================== */

function plainRow<T>(row: unknown): T {
  return { ...(row as Record<string, unknown>) } as T;
}

function plainRows<T>(rows: unknown[]): T[] {
  return rows.map((row) => plainRow<T>(row));
}

/* ==========================================
   INITIALIZE DATABASE
   ========================================== */

export function database(): DatabaseSync {
  if (db) {
    return db;
  }

  fs.mkdirSync(dir, { recursive: true });

  db = new DatabaseSync(
    path.join(dir, 'magazine.sqlite')
  );

  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      dek TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Human Stories',
      author TEXT NOT NULL DEFAULT 'The Human Footnote',
      cover TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      published_at TEXT
    );

    CREATE TABLE IF NOT EXISTS revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  /* ========================================
     INITIAL SAMPLE STORIES

     Only inserts samples when the articles
     table is completely empty.
     Existing articles are never overwritten.
     ======================================== */

  const result = db
    .prepare('SELECT COUNT(*) AS n FROM articles')
    .get() as { n: number };

  const count = result.n;

  if (count === 0) {
    const add = db.prepare(`
      INSERT INTO articles (
        slug,
        title,
        dek,
        category,
        author,
        cover,
        body,
        status,
        featured,
        published_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    for (const a of samples) {
      add.run(
        a.slug,
        a.title,
        a.dek,
        a.category,
        a.author,
        a.image,
        a.body.join('\n\n'),
        'sample',
        a.featured ? 1 : 0
      );
    }
  }

  return db;
}

/* ==========================================
   GET ALL ARTICLES

   includeAll = false:
   Returns published and sample articles.

   includeAll = true:
   Returns every article, including drafts.

   SQLite rows are converted to plain objects.
   ========================================== */

export function articles(
  includeAll = false
): Article[] {
  const query = `
    SELECT *
    FROM articles
    ${
      includeAll
        ? ''
        : "WHERE status IN ('published', 'sample')"
    }
    ORDER BY
      featured DESC,
      COALESCE(published_at, created_at) DESC
  `;

  const rows = database()
    .prepare(query)
    .all();

  return plainRows<Article>(rows);
}

/* ==========================================
   GET ARTICLE BY SLUG

   Used by public story pages and editing.

   Returns a plain JavaScript object.
   ========================================== */

export function article(
  slug: string,
  includeAll = false
): Article | undefined {
  const query = `
    SELECT *
    FROM articles
    WHERE slug = ?
    ${
      includeAll
        ? ''
        : "AND status IN ('published', 'sample')"
    }
  `;

  const row = database()
    .prepare(query)
    .get(slug);

  if (!row) {
    return undefined;
  }

  return plainRow<Article>(row);
}

/* ==========================================
   GET ARTICLE BY ID

   Used by the admin editor.

   Returns a plain JavaScript object.
   ========================================== */

export function articleById(
  id: number
): Article | undefined {
  const row = database()
    .prepare('SELECT * FROM articles WHERE id = ?')
    .get(id);

  if (!row) {
    return undefined;
  }

  return plainRow<Article>(row);
}
