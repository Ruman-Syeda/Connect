import dotenv from "dotenv"
import User from "./models/userModel.js"
import Community from "./models/communityModel.js"
import Event from "./models/eventModel.js"
import Post from "./models/postModel.js"
import Group from "./models/groupModel.js"
import connectDB from "./config/db.js"
import colors from 'colors';


dotenv.config()

// Connect to database
connectDB()

// Sample data - Users
const students = [
  // { name: "John Smith", email: "john.smith@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Emily Johnson", email: "emily.johnson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Michael Brown", email: "michael.brown@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Jessica Davis", email: "jessica.davis@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "David Wilson", email: "david.wilson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Sarah Martinez", email: "sarah.martinez@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Daniel Anderson", email: "daniel.anderson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Jennifer Taylor", email: "jennifer.taylor@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Christopher Thomas", email: "christopher.thomas@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Lisa Rodriguez", email: "lisa.rodriguez@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Matthew Hernandez", email: "matthew.hernandez@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Amanda Moore", email: "amanda.moore@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "James Jackson", email: "james.jackson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ashley Martin", email: "ashley.martin@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Robert Lee", email: "robert.lee@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Stephanie Perez", email: "stephanie.perez@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Kevin Thompson", email: "kevin.thompson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Michelle White", email: "michelle.white@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Brian Harris", email: "brian.harris@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Nicole Clark", email: "nicole.clark@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ahmed Khan", email: "ahmed.khan@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Fatima Ali", email: "fatima.ali@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ayesha Malik", email: "ayesha.malik@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Arjun Sharma", email: "arjun.sharma@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Priya Patel", email: "priya.patel@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ravi Kumar", email: "ravi.kumar@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Mehmet Yilmaz", email: "mehmet.yilmaz@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ayşe Demir", email: "ayse.demir@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Emre Çelik", email: "emre.celik@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Sana Siddiqui", email: "sana.siddiqui@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ishita Gupta", email: "ishita.gupta@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Kartik Mehta", email: "kartik.mehta@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Zeynep Kaya", email: "zeynep.kaya@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Burak Özkan", email: "burak.ozkan@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ali Raza", email: "ali.raza@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Zara Ahmed", email: "zara.ahmed@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Bilal Khan", email: "bilal.khan@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Cem Aksoy", email: "cem.aksoy@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ece Şahin", email: "ece.sahin@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Canan Aydın", email: "canan.aydin@my.centennialcollege.ca", password: "123456", role: "user" },
]

const alumni = [
  // { name: "Alex Johnson", email: "alex.johnson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Samantha Williams", email: "samantha.williams@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ryan Jones", email: "ryan.jones@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Olivia Brown", email: "olivia.brown@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ethan Davis", email: "ethan.davis@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Sophia Miller", email: "sophia.miller@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Jacob Wilson", email: "jacob.wilson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Emma Moore", email: "emma.moore@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "William Taylor", email: "william.taylor@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ava Anderson", email: "ava.anderson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Noah Thomas", email: "noah.thomas@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Isabella Jackson", email: "isabella.jackson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Liam White", email: "liam.white@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Charlotte Harris", email: "charlotte.harris@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Mason Martin", email: "mason.martin@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Amelia Thompson", email: "amelia.thompson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Benjamin Garcia", email: "benjamin.garcia@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Evelyn Martinez", email: "evelyn.martinez@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Lucas Robinson", email: "lucas.robinson@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Mia Clark", email: "mia.clark@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ahmet Yılmaz", email: "ahmet.yilmaz@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ayşe Kaya", email: "ayse.kaya@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Mehmet Demir", email: "mehmet.demir@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Fatma Çelik", email: "fatma.celik@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Emre Şahin", email: "emre.sahin@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Zeynep Aydın", email: "zeynep.aydin@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Ali Khan", email: "ali.khan@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Fatima Ahmed", email: "fatima.ahmed@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Hassan Raza", email: "hassan.raza@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Raza Ali", email: "raza.ali@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Arjun Mehta", email: "arjun.mehta@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Kim Min-Joon", email: "kim.minjoon@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Park Ji-Eun", email: "park.jieun@my.centennialcollege.ca", password: "123456", role: "user" },
  // { name: "Lee Seo-Jun", email: "lee.seojun@my.centennialcollege.ca", password: "123456", role: "user" },
]

const communityManagers = [
  // {
  //   name: "Nathan Rodriguez",
  //   email: "nathan.rodriguez@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "communityManager",
  // },
  // {
  //   name: "Abigail Lewis",
  //   email: "abigail.lewis@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "communityManager",
  // },
  // { name: "Elijah Lee", email: "elijah.lee@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // {
  //   name: "Harper Walker",
  //   email: "harper.walker@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "communityManager",
  // },
  // { name: "Owen Hall", email: "owen.hall@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // {
  //   name: "Scarlett Allen",
  //   email: "scarlett.allen@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "communityManager",
  // },
  // { name: "Aiden Young", email: "aiden.young@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // {
  //   name: "Zoe Hernandez",
  //   email: "zoe.hernandez@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "communityManager",
  // },
  // { name: "Caleb King", email: "caleb.king@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // { name: "Lily Wright", email: "lily.wright@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // {
  //   name: "Jackson Scott",
  //   email: "jackson.scott@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "communityManager",
  // },
  // { name: "Chloe Green", email: "chloe.green@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // { name: "Luke Adams", email: "luke.adams@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // { name: "Grace Baker", email: "grace.baker@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // {
  //   name: "Gabriel Gonzalez",
  //   email: "gabriel.gonzalez@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "communityManager",
  // },
  // { name: "Layla Nelson", email: "layla.nelson@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // { name: "Isaac Carter", email: "isaac.carter@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // {
  //   name: "Hannah Mitchell",
  //   email: "hannah.mitchell@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "communityManager",
  // },
  // { name: "Julian Perez", email: "julian.perez@my.centennialcollege.ca", password: "123456", role: "communityManager" },
  // { name: "Nora Roberts", email: "nora.roberts@my.centennialcollege.ca", password: "123456", role: "communityManager" },
]

const eventManagers = [
  // { name: "Wyatt Turner", email: "wyatt.turner@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // {
  //   name: "Audrey Phillips",
  //   email: "audrey.phillips@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "eventManager",
  // },
  // { name: "Eli Campbell", email: "eli.campbell@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Leah Parker", email: "leah.parker@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Hudson Evans", email: "hudson.evans@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Stella Edwards", email: "stella.edwards@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Ezra Collins", email: "ezra.collins@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Skylar Stewart", email: "skylar.stewart@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Josiah Sanchez", email: "josiah.sanchez@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Paisley Morris", email: "paisley.morris@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Asher Rogers", email: "asher.rogers@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Violet Reed", email: "violet.reed@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Leo Cook", email: "leo.cook@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Madelyn Morgan", email: "madelyn.morgan@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Mateo Bell", email: "mateo.bell@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // {
  //   name: "Penelope Murphy",
  //   email: "penelope.murphy@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "eventManager",
  // },
  // {
  //   name: "Maverick Bailey",
  //   email: "maverick.bailey@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "eventManager",
  // },
  // { name: "Hazel Rivera", email: "hazel.rivera@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // { name: "Sawyer Cooper", email: "sawyer.cooper@my.centennialcollege.ca", password: "123456", role: "eventManager" },
  // {
  //   name: "Ruby Richardson",
  //   email: "ruby.richardson@my.centennialcollege.ca",
  //   password: "123456",
  //   role: "eventManager",
  // },
]

// Admin user - replace with your own email
const admin = {
  // name: "Admin User",
  // email: "Rumi@my.centennialcollege.ca", // Change this to your email
  // password: "Ruman.",
  // role: "admin",
}

// Sample communities
const communities = [
  // {
  //   name: "Software Development",
  //   description: "A community for software development students and professionals",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   name: "Business Administration",
  //   description: "Connect with business students and alumni",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   name: "Healthcare Studies",
  //   description: "For healthcare students and professionals",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   name: "Engineering Technology",
  //   description: "Engineering students and graduates community",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
  // {
  //   name: "Arts and Design",
  //   description: "Creative arts and design community",
  //   image: "/placeholder.svg?height=200&width=200",
  // },
]

// Sample events
const events = [
  {
    title: "Career Fair 2023",
    description: "Annual career fair with top employers",
    date: new Date("2023-11-15"),
    location: "Progress Campus, Event Center",
    image: "/placeholder.svg?height=300&width=500",
    capacity: 500,
    registrationDeadline: new Date("2023-11-10"),
  },
  {
    title: "Tech Symposium",
    description: "Latest technology trends and innovations",
    date: new Date("2023-12-05"),
    location: "Online (Zoom)",
    image: "/placeholder.svg?height=300&width=500",
    capacity: 200,
    registrationDeadline: new Date("2023-12-01"),
  },
  {
    title: "Alumni Networking Mixer",
    description: "Connect with successful alumni",
    date: new Date("2024-01-20"),
    location: "Downtown Toronto, The Venue",
    image: "/placeholder.svg?height=300&width=500",
    capacity: 150,
    registrationDeadline: new Date("2024-01-15"),
  },
  {
    title: "Hackathon 2024",
    description: "48-hour coding challenge with prizes",
    date: new Date("2024-02-10"),
    location: "Progress Campus, SETAS Building",
    image: "/placeholder.svg?height=300&width=500",
    capacity: 100,
    registrationDeadline: new Date("2024-02-05"),
  },
  {
    title: "Industry Speaker Series",
    description: "Guest speakers from leading companies",
    date: new Date("2024-03-15"),
    location: "Morningside Campus, Lecture Hall",
    image: "/placeholder.svg?height=300&width=500",
    capacity: 250,
    registrationDeadline: new Date("2024-03-10"),
  },
]

// Import all data
const importData = async () => {
  try {
    // Clear existing data
   // await User.deleteMany()
    //await Community.deleteMany()
    //await Event.deleteMany()
    //await Post.deleteMany()
    //await Group.deleteMany()

    //console.log("Data cleared".red.inverse)

    // Create users
    // const createdStudents = await User.insertMany(students)
    // const createdAlumni = await User.insertMany(alumni)
    // const createdCommunityManagers = await User.insertMany(communityManagers)
    // const createdEventManagers = await User.insertMany(eventManagers)

    // // Create admin user
    // const adminUser = await User.create(admin)

    // console.log(`${createdStudents.length} students created`.green.inverse)
    // console.log(`${createdAlumni.length} alumni created`.green.inverse)
    // console.log(`${createdCommunityManagers.length} community managers created`.green.inverse)
    // console.log(`${createdEventManagers.length} event managers created`.green.inverse)
    // console.log("Admin user created".green.inverse)

    // Create communities and assign to community managers
    const createdCommunities = []

    for (let i = 0; i < communities.length; i++) {
      const manager = createdCommunityManagers[i % createdCommunityManagers.length]

      const community = await Community.create({
        ...communities[i],
        manager: manager._id,
        members: [manager._id],
      })

      createdCommunities.push(community)

      // Update manager's communities
      await User.findByIdAndUpdate(manager._id, {
        $push: { communities: community._id },
      })
    }

    console.log(`${createdCommunities.length} communities created`.green.inverse)

    // Create events and assign to event managers
    const createdEvents = []

    for (let i = 0; i < events.length; i++) {
      const manager = createdEventManagers[i % createdEventManagers.length]

      const event = await Event.create({
        ...events[i],
        organizer: manager._id,
        attendees: [manager._id],
      })

      createdEvents.push(event)

      // Update manager's events
      await User.findByIdAndUpdate(manager._id, {
        $push: { events: event._id },
      })
    }

    console.log(`${createdEvents.length} events created`.green.inverse)

    console.log("Data imported!".green.inverse)
    process.exit()
  } catch (error) {
    console.error(colors.inverse.red(error.message || error));
    process.exit(1);
  }
  
  
}

// Delete all data
// const destroyData = async () => {
//   try {
//     await User.deleteMany()
//     await Community.deleteMany()
//     await Event.deleteMany()
//     await Post.deleteMany()
//     await Group.deleteMany()

//     console.log("Data destroyed!".red.inverse)
//     process.exit()
//   } catch (error) {
//     console.error(`${error}`.red.inverse)
//     process.exit(1)
//   }
// }

// Run script based on command line argument
if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
