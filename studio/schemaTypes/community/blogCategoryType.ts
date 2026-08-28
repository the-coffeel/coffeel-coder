import {defineField, defineType} from 'sanity'

export const blogCategoryType = defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Category Color',
      type: 'color',
      description: 'Choose a color for this category',
      options: {
        disableAlpha: true,
      },
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      color: 'color',
    },
    prepare({title, color}) {
      return {
        title,
        subtitle: color?.hex,
      }
    },
  },
})
