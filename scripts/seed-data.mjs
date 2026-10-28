// Initial content imported by `npm run seed` — the same data the original site
// published. After seeding, everything here is managed from the admin panel.
export const committee = [
  { name: "Manoj Kumar Yadav", role: "President", place: "Malhana, Deoria" },
  { name: "Murli Yadav", role: "Secretary", place: "Sohanpur, Deoria" },
  { name: "Yasmin Niyazi", role: "Teacher Member", place: "Bhatpar Rani, Deoria" },
  { name: "Babita Yadav", role: "Teacher Member", place: "Jiraso, Deoria" },
  { name: "Archana Devi", role: "Parent Member", place: "Chhotkagaon, Deoria" },
  { name: "Bahadur Rai", role: "Parent Member", place: "Bhatpar Rani, Deoria" },
  { name: "Gautam Sharma", role: "Educationist", place: "Jagaur, Bhatpar Rani" },
  { name: "Preeti Gupta", role: "Educationist", place: "Surajkund, Gorakhpur" },
  { name: "Rita Devi", role: "Member", place: "Chhotkagaon, Deoria" },
  { name: "Mamta Devi", role: "Member", place: "Khadesar, Deoria" },
  { name: "Ramprawesh Yadav", role: "Member", place: "Khadesar, Deoria" },
];

export const faculty = [
  { name: "Pradyuman Yadav", qualification: "D.P.Ed", role: "PTI" },
  { name: "Avinash Kumar Dwivedi", qualification: "B.A., BLIS", role: "Librarian" },
  { name: "Meera Sagar", qualification: "B.A., B.Ed", role: "Counsellor" },
  { name: "Yasmin Niyazi", qualification: "B.Sc, B.Ed, TET", role: "TGT" },
  { name: "Prabhunath Yadav", qualification: "B.A., B.Ed", role: "TGT" },
  { name: "Babita Yadav", qualification: "B.Com, M.Com, B.Ed", role: "TGT" },
  { name: "Ashmita Chaurasia", qualification: "M.A., B.Ed", role: "TGT" },
  { name: "Lalsa Yadav", qualification: "B.A., B.Ed", role: "TGT" },
  { name: "Rinki Kumari", qualification: "M.A., B.Ed", role: "PRT" },
  { name: "Ram Udal Pal", qualification: "M.A., B.Ed", role: "PRT" },
  { name: "Deepanjali Srivastav", qualification: "B.A., B.Ed", role: "PRT" },
  { name: "Beena Yadav", qualification: "M.A., B.Ed", role: "PRT" },
  { name: "Kumari Rashmi", qualification: "B.A., B.Ed", role: "PRT" },
  { name: "Kiran Kumari Yadav", qualification: "B.Com, B.Ed", role: "PRT" },
  { name: "Dhanjay Kumar Prajapati", qualification: "B.A., B.Ed", role: "PRT" },
  { name: "Kumari Suman Singh", qualification: "M.A., B.Ed", role: "PRT" },
  { name: "Sandeep Kumar Kushwaha", qualification: "M.Com", role: "PRT" },
  { name: "Pawan Pandey", qualification: "B.A., B.Ed", role: "PRT" },
  { name: "Ratnesh Yadav", qualification: "B.Com, B.Ed", role: "PRT" },
  { name: "Sushma Jasiwal", qualification: "B.Ed", role: "PRT" },
  { name: "Shobha Sharma", qualification: "M.A., B.Ed", role: "PRT" },
  { name: "Kumari Shweta Pandey", qualification: "B.A., B.Ed", role: "PRT" },
  { name: "Surya Pratap Yadav", qualification: "M.A., B.Ed", role: "PRT" },
  { name: "Km. Ratnanjali", qualification: "M.A., B.Ed", role: "PRT" },
];

export const fees = {
  session: "2019 – 2020",
  columns: ["Std I – III", "Std IV – V", "Std VI – VIII"],
  rows: [
    { head: "Admission Fee", duration: "Once", values: [900, 900, 900], inTotal: true },
    { head: "Tuition Fee + Smart Class", duration: "Monthly", values: [525, 625, 725], inTotal: true },
    { head: "Amenities / Misc. Charges", duration: "Yearly", values: [500, 600, 700], inTotal: true },
    { head: "ID Card & Report Card", duration: "Yearly", values: [100, 100, 100], inTotal: true },
    { head: "Examination Fee", duration: "Aug & Jan", values: [200, 300, 400], inTotal: false },
    { head: "Laboratory Fee", duration: "Yearly", values: [0, 0, 0], inTotal: false },
  ],
  // Totals are calculated, not stored
  schedule: {
    columns: ["April", "May – Jul", "Aug – Sep", "Oct – Nov", "Dec – Jan", "Feb – Mar"],
    rows: [
      { label: "Class 1 – 3", values: [2025, 1575, 1250, 1050, 1250, 1050] },
      { label: "Class 4 – 5", values: [2225, 1875, 1550, 1250, 1550, 1250] },
      { label: "Class 6 – 8", values: [2425, 2175, 1850, 1450, 1850, 1450] },
    ],
  },
};

export const strength = [
  { cls: "I", sections: 1, boys: 24, girls: 16 },
  { cls: "II", sections: 1, boys: 23, girls: 17 },
  { cls: "III", sections: 1, boys: 28, girls: 12 },
  { cls: "IV", sections: 1, boys: 24, girls: 15 },
  { cls: "V", sections: 1, boys: 20, girls: 18 },
  { cls: "VI", sections: 1, boys: 25, girls: 15 },
  { cls: "VII", sections: 1, boys: 27, girls: 13 },
  { cls: "VIII", sections: 1, boys: 22, girls: 3 },
];

// Stored in MongoDB (GridFS) by the seed script
export const gallery = [
  { src: "/images/campus/main-building.webp", alt: "The main building of Eastern Cambridge School", width: 1280, height: 590 },
  { src: "/images/life/sports-champions.webp", alt: "School sports team with their trophies", width: 1280, height: 853 },
  { src: "/images/life/annual-day-primary.webp", alt: "Primary students performing at the annual function", width: 1280, height: 853 },
  { src: "/images/facilities/science-lab.webp", alt: "Students conducting an experiment in the science lab", width: 1280, height: 853 },
  { src: "/images/campus/senior-wing.webp", alt: "Eastern Cambridge Senior Secondary School wing and grounds", width: 1280, height: 960 },
  { src: "/images/life/annual-day-middle.webp", alt: "Students dancing on stage beside a table of trophies", width: 1280, height: 853 },
  { src: "/images/life/morning-assembly.webp", alt: "Students gathered for the morning assembly", width: 1280, height: 960 },
  { src: "/images/facilities/computer-lab.webp", alt: "Students working in the computer lab", width: 1280, height: 853 },
  { src: "/images/campus/reception.webp", alt: "School office and reception corridor", width: 1152, height: 864 },
];
