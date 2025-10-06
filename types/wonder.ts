export interface Wonder {
  id: number
  name: string
  image: string
  status: "completed" | "locked"
  description: string
  location: string
}
