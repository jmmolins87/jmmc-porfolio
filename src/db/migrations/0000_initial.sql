CREATE TYPE "lang" AS ENUM ('es', 'en');

CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text UNIQUE NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"cover_image" text,
	"tags" text[] DEFAULT '{}',
	"read_time" text,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"lang" "lang" DEFAULT 'es' NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL
);
