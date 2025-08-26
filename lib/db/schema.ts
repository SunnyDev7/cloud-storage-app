import { pgTable, text, uuid, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  //informations of basic folder/files
  name: text("name").notNull(), //name of file or folder
  path: text("path").notNull(), //store here the path from imagekit  --> /docuemnt/files/resume.pdf
  size: integer("size").notNull(), //size of file or folder
  type: text("type"), //this means if its a file or folder

  //storage infromation
  fileUrl: text("file_url").notNull(), //url to access the files
  thumbnailUrl: text("thumbnail_url"),

  //Ownership info
  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"), //Parent folder Id (null for root items)

  //folder/files flags
  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  //Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


/* 
parent: A folder or file which is at the root level with one or many children files/folder.

children: A folder or file having one or more parent files/folder.  
*/
export const filesRelations = relations(files, ({one, many}) => ({
    parent: one(files, { 
        fields: [files.parentId],
        references: [files.id]
    }),

    //relationship to child folder/file
    children: many(files)
}))

//Type definition
export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert;
