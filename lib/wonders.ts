import type { Wonder } from "@/types/wonder"

export const wonders: Wonder[] = [
  {
    id: 1,
    name: "Le Colisée",
    image: "/colosseum-rome-modern-wonder.jpg",
    status: "locked",
    description: "Un amphithéâtre romain emblématique, le plus grand jamais construit dans l'Empire romain.",
    location: "Italie",
  },
  {
    id: 2,
    name: "Pétra",
    image: "/petra-jordan-modern-wonder.jpg",
    status: "locked",
    description: "Une cité antique taillée dans la roche rose, capitale des Nabatéens.",
    location: "Jordanie",
  },
  {
    id: 3,
    name: "Le Taj Mahal",
    image: "/taj-mahal-india-modern-wonder.jpg",
    status: "locked",
    description: "Un mausolée de marbre blanc construit par l'empereur moghol en mémoire de son épouse.",
    location: "Inde",
  },
  {
    id: 4,
    name: "La Grande Muraille de Chine",
    image: "/great-wall-of-china-modern-wonder.jpg",
    status: "locked",
    description: "Une série de fortifications construites sur plus de 2000 ans pour protéger la Chine.",
    location: "Chine",
  },
  {
    id: 5,
    name: "Chichén Itzá",
    image: "/chichen-itza-mexico-modern-wonder.jpg",
    status: "locked",
    description: "Une cité maya célèbre pour sa pyramide de Kukulcán et son observatoire astronomique.",
    location: "Mexique",
  },
  {
    id: 6,
    name: "Le Machu Picchu",
    image: "/machu-picchu-peru-modern-wonder.jpg",
    status: "locked",
    description: "Une ancienne cité inca perchée dans les montagnes des Andes.",
    location: "Pérou",
  },
  {
    id: 7,
    name: "Le Christ Rédempteur",
    image: "/christ-redeemer-brazil-modern-wonder.jpg",
    status: "locked",
    description: "Une statue monumentale du Christ dominant la ville de Rio de Janeiro.",
    location: "Brésil",
  },
  
  
  
  
]

export function getWonderById(id: number): Wonder | undefined {
  return wonders.find((wonder) => wonder.id === id)
}
