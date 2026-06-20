export interface Snippet {
  _id: string
  group: string
  title: string
  description: string
  tags: string
  snippetValue: string
  owner: string
  _tags: Array<{ name: string; color: string }>
}
