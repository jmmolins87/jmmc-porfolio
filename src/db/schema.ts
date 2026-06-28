import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  titleEs: text('title_es').notNull(),
  titleEn: text('title_en').notNull(),
  descriptionEs: text('description_es'),
  descriptionEn: text('description_en'),
  contentEs: text('content_es').notNull(),
  contentEn: text('content_en').notNull(),
  coverImage: text('cover_image'),
  tags: text('tags').array().default([]).notNull(),
  readTimeEs: text('read_time_es'),
  readTimeEn: text('read_time_en'),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
});

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isRead: boolean('is_read').default(false).notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'editor'] }).default('editor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
