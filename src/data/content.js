// Content adapted from easterncambridgeschool.co.in.
// Images live in /public/images (see scripts/optimize-images.mjs).

export const images = {
  mainBuilding: { src: "/images/campus/main-building.webp", width: 1280, height: 590, alt: "The main building of Eastern Cambridge School" },
  seniorWing: { src: "/images/campus/senior-wing.webp", width: 1280, height: 960, alt: "Eastern Cambridge Senior Secondary School wing and grounds" },
  reception: { src: "/images/campus/reception.webp", width: 1152, height: 864, alt: "School office and reception corridor" },
  assembly: { src: "/images/life/morning-assembly.webp", width: 1280, height: 960, alt: "Students gathered for the morning assembly" },
  sports: { src: "/images/life/sports-champions.webp", width: 1280, height: 853, alt: "School sports team with their trophies" },
  annualPrimary: { src: "/images/life/annual-day-primary.webp", width: 1280, height: 853, alt: "Primary students performing at the annual function" },
  annualMiddle: { src: "/images/life/annual-day-middle.webp", width: 1280, height: 853, alt: "Students dancing on stage beside a table of trophies" },
  scienceLab: { src: "/images/facilities/science-lab.webp", width: 1280, height: 853, alt: "Students conducting an experiment in the science lab" },
  computerLab: { src: "/images/facilities/computer-lab.webp", width: 1280, height: 853, alt: "Students working in the computer lab" },
  chairman: { src: "/images/people/chairman-a-i-yadav-hq.webp", width: 1164, height: 1351, alt: "Er. A. I. Yadav, Chairman" },
};

export const notice = {
  date: { day: "13", month: "Dec" },
  title: "Admissions Open",
  body: "Admissions are now open for the upcoming academic session. Visit the campus or call us to begin.",
};

export const thoughts = [
  {
    name: "Swami Vivekananda",
    image: "/images/people/swami-vivekananda.webp",
    quote: "You have to grow from the inside out. None can teach you, none can make you spiritual. There is no other teacher but your own soul.",
  },
  {
    name: "Dr. S. Radhakrishnan",
    image: "/images/people/dr-s-radhakrishnan.webp",
    quote: "Education is the ability to listen to almost anything without losing your temper or your self-confidence.",
  },
  {
    name: "Rabindranath Tagore",
    image: "/images/people/rabindranath-tagore.webp",
    quote: "True education consists in knowing the use of any useful material that has been collected, to know its real nature and to build along with it a true shelter for life.",
  },
];

export const facilities = [
  {
    title: "Smart Class",
    body: "Our classrooms have been transformed into technology-enabled spaces with interactive digital boards and PCs, connected to a knowledge centre on campus.",
    image: images.reception,
  },
  {
    title: "Conveyance",
    body: "School vans and buses run on fixed routes, bringing students safely from home to school and back every day.",
    image: images.seniorWing,
  },
  {
    title: "Computer Lab",
    body: "Computer education begins in Class I — building technology awareness, curiosity about modern tools and confident internet skills.",
    image: images.computerLab,
  },
  {
    title: "Science Lab",
    body: "Modern, well-equipped laboratories where students learn science the way it should be learned — by doing.",
    image: images.scienceLab,
  },
];

export const programs = [
  {
    grades: "Grade I – V",
    title: "Primary Years",
    body: "At this formative stage our teachers weave together content, skills and values — building the foundation every future step rests on.",
  },
  {
    grades: "Grade VI – VIII",
    title: "Middle Years",
    body: "A period of real academic growth and independence, where learning becomes more focused on specific subjects.",
  },
  {
    grades: "Grade IX – XII",
    title: "Secondary & Senior Secondary",
    body: "Students explore their strengths and interests across a range of fields, with a clear focus on their career goals.",
    tag: "Proposed",
  },
];

export const about = {
  lead: "Eastern Cambridge School is a premier co-educational English medium school of Eastern Uttar Pradesh, committed to providing high-quality education to every child it welcomes.",
  paragraphs: [
    "The school is run by the R.S.S.D. Education Welfare Society, registered under the Societies Registration Act, 1960.",
    "We are in the process of affiliation with the Central Board of Secondary Education (CBSE), offering the NCERT syllabus with the Continuous and Comprehensive Evaluation (CCE) pattern.",
  ],
  pillars: [
    { title: "Knowledge", body: "A progressive, NCERT-aligned curriculum that builds critical thinking and a genuine love of learning." },
    { title: "Character", body: "Values taught alongside every subject, so students grow into thoughtful, responsible people." },
    { title: "Confidence", body: "Arts, debates, sports and leadership roles that let every child discover what they are capable of." },
  ],
};

// Messages are condensed from the originals on the current website.
export const messages = [
  {
    id: "chairman",
    role: "Chairman",
    name: "Er. A. I. Yadav",
    image: images.chairman,
    highlight: "Remember, doing just your duty is not enough. It should be accompanied by a mind with no selfishness.",
    body: [
      "The limits of our actions are clearly defined. Work performed within those limits, with an unselfish mind, becomes yajna — selfless service. Anything outside them is wrong action.",
      "This is the spirit in which Eastern Cambridge School was founded, and the spirit we hope every student carries with them.",
    ],
  },
  {
    id: "director",
    role: "Director",
    name: "Manoj Kumar Yadav",
    monogram: "MY",
    highlight: "Be inspired, work hard, question freely — and enjoy every moment of learning.",
    body: [
      "We welcome every prospective student to a progressive curriculum that builds critical thinking, in an environment that encourages curiosity.",
      "Beyond the classroom, students take part in arts, debates and sports, and senior students take on real leadership roles.",
      "Caring teachers and actively involved parents are at the heart of everything we do.",
    ],
  },
  {
    id: "principal",
    role: "Principal",
    name: "Office of the Principal",
    monogram: "P",
    highlight: "Quality education is more than theory — it is the values and skills that make us better human beings.",
    body: [
      "Eastern Cambridge School is the joint effort of a group of visionaries who set out to raise the standard of education in a region where development deserves support.",
      "We are grateful to every family that has placed its trust in us. Guided by experts from many fields, we will keep working towards education for all and a stronger nation.",
    ],
  },
];

// Gallery photos, served from public/images. Static for now: the admin panel's
// Gallery section is hidden until the gallery is made dynamic again.
export const gallery = [
  { id: "students-dressed-as-radha-and-krishna", src: "/images/gallery/students-dressed-as-radha-and-krishna.webp", alt: "Students dressed as Radha and Krishna for Janmashtami", width: 1600, height: 1196 },
  { id: "pre-primary-students-in-fruit-costumes", src: "/images/gallery/pre-primary-students-in-fruit-costumes.webp", alt: "Pre-primary students in fruit costumes on Activity Day", width: 1593, height: 1031 },
  { id: "childrens-day-celebration", src: "/images/gallery/childrens-day-celebration.webp", alt: "Children's Day celebration", width: 1280, height: 720 },
  { id: "ravindranath-tagore-house-at-the-annual", src: "/images/gallery/ravindranath-tagore-house-at-the-annual.webp", alt: "Ravindranath Tagore House at the annual sports meet", width: 1280, height: 720 },
  { id: "annual-prize-distribution-ceremony-and-ptm", src: "/images/gallery/annual-prize-distribution-ceremony-and-ptm.webp", alt: "Annual Prize Distribution Ceremony and PTM 2026–27", width: 1600, height: 1074 },
  { id: "lunch-together-on-a-school-excursion", src: "/images/gallery/lunch-together-on-a-school-excursion.webp", alt: "Lunch together on a school excursion", width: 1600, height: 1074 },
  { id: "pre-primary-students-with-glasses-of", src: "/images/gallery/pre-primary-students-with-glasses-of.webp", alt: "Pre-primary students with glasses of fresh juice", width: 1600, height: 1074 },
  { id: "young-students-with-their-paper-fruit", src: "/images/gallery/young-students-with-their-paper-fruit.webp", alt: "Young students with their paper fruit crafts", width: 1600, height: 1074 },
  { id: "christmas-celebration-with-students-and-teachers", src: "/images/gallery/christmas-celebration-with-students-and-teachers.webp", alt: "Christmas celebration with students and teachers", width: 1600, height: 1074 },
  { id: "a-student-tying-a-rakhi-on", src: "/images/gallery/a-student-tying-a-rakhi-on.webp", alt: "A student tying a rakhi on Raksha Bandhan", width: 1280, height: 960 },
  { id: "kabaddi-match-on-the-school-ground", src: "/images/gallery/kabaddi-match-on-the-school-ground.webp", alt: "Kabaddi match on the school ground", width: 1280, height: 575 },
  { id: "the-senior-secondary-campus-and-school", src: "/images/gallery/the-senior-secondary-campus-and-school.webp", alt: "The senior secondary campus and school bus fleet", width: 1280, height: 644 },
  { id: "children-in-janmashtami-costumes", src: "/images/gallery/children-in-janmashtami-costumes.webp", alt: "Children in Janmashtami costumes", width: 1600, height: 719 },
  { id: "students-cheering-in-their-classroom", src: "/images/gallery/students-cheering-in-their-classroom.webp", alt: "Students cheering in their classroom", width: 1280, height: 575 },
  { id: "students-on-an-educational-tour-to", src: "/images/gallery/students-on-an-educational-tour-to.webp", alt: "Students on an educational tour to Ayodhya", width: 1600, height: 1074 },
  { id: "medal-and-certificate-winners-at-the", src: "/images/gallery/medal-and-certificate-winners-at-the.webp", alt: "Medal and certificate winners at the sports meet", width: 1599, height: 899 },
  { id: "winners-on-the-podium-at-an", src: "/images/gallery/winners-on-the-podium-at-an.webp", alt: "Winners on the podium at an athletics meet", width: 1280, height: 960 },
  { id: "prize-winners-on-stage-at-the", src: "/images/gallery/prize-winners-on-stage-at-the.webp", alt: "Prize winners on stage at the annual ceremony", width: 1600, height: 1074 },
  { id: "scouts-and-guides-cooking-at-camp", src: "/images/gallery/scouts-and-guides-cooking-at-camp.webp", alt: "Scouts and guides cooking at camp", width: 1280, height: 720 },
  { id: "students-showing-their-drawings-in-class", src: "/images/gallery/students-showing-their-drawings-in-class.webp", alt: "Students showing their drawings in class", width: 1280, height: 859 },
  { id: "morning-assembly-on-the-school-ground", src: "/images/gallery/morning-assembly-on-the-school-ground.webp", alt: "Morning assembly on the school ground", width: 1280, height: 859 },
  { id: "paddle-boats-on-a-school-excursion", src: "/images/gallery/paddle-boats-on-a-school-excursion.webp", alt: "Paddle boats on a school excursion", width: 1280, height: 859 },
  { id: "holi-rangoli-made-by-students", src: "/images/gallery/holi-rangoli-made-by-students.webp", alt: "Holi rangoli made by students", width: 960, height: 1280 },
  { id: "students-during-a-yoga-session", src: "/images/gallery/students-during-a-yoga-session.webp", alt: "Students during a yoga session", width: 1599, height: 720 },
  { id: "the-main-building-of-eastern-cambridge", src: "/images/campus/main-building.webp", alt: "The main building of Eastern Cambridge School", width: 1280, height: 590 },
  { id: "school-sports-team-with-their-trophies", src: "/images/life/sports-champions.webp", alt: "School sports team with their trophies", width: 1280, height: 853 },
  { id: "primary-students-performing-at-the-annual", src: "/images/life/annual-day-primary.webp", alt: "Primary students performing at the annual function", width: 1280, height: 853 },
  { id: "students-conducting-an-experiment-in-the", src: "/images/facilities/science-lab.webp", alt: "Students conducting an experiment in the science lab", width: 1280, height: 853 },
  { id: "eastern-cambridge-senior-secondary-school-wing", src: "/images/campus/senior-wing.webp", alt: "Eastern Cambridge Senior Secondary School wing and grounds", width: 1280, height: 960 },
  { id: "students-dancing-on-stage-beside-a", src: "/images/life/annual-day-middle.webp", alt: "Students dancing on stage beside a table of trophies", width: 1280, height: 853 },
  { id: "students-gathered-for-the-morning-assembly", src: "/images/life/morning-assembly.webp", alt: "Students gathered for the morning assembly", width: 1280, height: 960 },
  { id: "students-working-in-the-computer-lab", src: "/images/facilities/computer-lab.webp", alt: "Students working in the computer lab", width: 1280, height: 853 },
  { id: "school-office-and-reception-corridor", src: "/images/campus/reception.webp", alt: "School office and reception corridor", width: 1152, height: 864 },
];
