CREATE TABLE "ai_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"feature" text NOT NULL,
	"used_on" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"tokens_in" integer DEFAULT 0 NOT NULL,
	"tokens_out" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "ai_usage_feature_used_on_unique" UNIQUE("feature","used_on")
);
