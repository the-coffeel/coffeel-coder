import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Community')
        .child(
          S.list()
            .title('Community')
            .items([
              S.documentTypeListItem('blog').title('Posts'),
              S.documentTypeListItem('blogCategory').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ]),
        ),

      // Add other top-level sections here, e.g.:
      // S.listItem()
      //   .title('Settings')
      //   .child(S.editor().schemaType('siteSettings').documentId('siteSettings')),

      // Fallback: show any remaining document types not explicitly listed above
      ...S.documentTypeListItems().filter(
        (listItem) => !['blog', 'blogCategory', 'author'].includes(listItem.getId() as string),
      ),
    ])