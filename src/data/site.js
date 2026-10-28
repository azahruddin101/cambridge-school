export const site = {
  name: "Eastern Cambridge School",
  shortName: "ECS",
  motto: "Virtue of Wisdom",
  description:
    "A co-educational English medium school in Bhatpar Rani, Deoria — nurturing curious minds with modern facilities, caring teachers and timeless values.",
  location: "Mahuwabari Mela, Bhatpar Rani, Deoria",
  address: "Bhatpar Rani – Salempur Road, Uttar Pradesh 274702",
  phone: "+91-8052125031",
  phoneHref: "tel:+918052125031",
  email: "easterncambridgeschool@gmail.com",
  mapQuery: "Eastern Cambridge School, Bhatpar Rani, Uttar Pradesh 274702",
  socials: [
    {
      label: "Google",
      href: "https://www.google.com/search?q=eastern+cambridge+school+bhatpar+rani#lrd=0x3993b4bec01e85e7:0x3c139ef8baaaefa0,3,,,",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/pages/eastern-cambridge-school-mahuabari-mela-bhatpar-rani/1253332194694318",
    },
  ],
};

export const navigation = [
  { label: "About", href: "/about" },
  {
    label: "Messages",
    href: "/messages",
    children: [
      { label: "Chairman's Message", href: "/messages#chairman" },
      { label: "Director's Message", href: "/messages#director" },
      { label: "Principal's Message", href: "/messages#principal" },
    ],
  },
  {
    label: "Administration",
    href: "/administration",
    children: [
      { label: "Managing Committee", href: "/administration#committee" },
      { label: "Staff Details", href: "/administration#staff" },
    ],
  },
  {
    label: "Admissions",
    href: "/admissions",
    children: [
      { label: "Fee Structure", href: "/admissions/fee-structure" },
      { label: "Student Strength", href: "/admissions/student-strength" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];
