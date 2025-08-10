
import { integer, pgTable, varchar, boolean, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),

  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar(),
});


export const courseTabel = pgTable("courses",{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  cid: varchar().notNull(),
  title: varchar(),
  description: varchar(),
  chapters: integer().notNull(),
  includeVideo: boolean().default(false),
  targetAudience: varchar(),
  difficulty: varchar().notNull(),
  category: varchar(),
  courseJson: json(),
  userEmail: varchar('userEmail').references(()=>usersTable.email).notNull(),
  bannerImage: varchar().default(''),
  courseContent: json().default({})

})