const mongoose = require('mongoose')
const Route = require('./models/Route')
require('dotenv').config()

const routes = [
  {
    id: 'route-1',
    name: 'Route One',
    color: 'orange',
    frequency: 'Every 10 mins',
    frequencyMinutes: 10,
    startTime: '06:30',
    endTime: '17:30',
    timing: '6:30 AM - 5:30 PM',
    eta: '5 mins',
    stops: [
      { name: 'Parking 900', served: '900, 1000, Square' },
      { name: 'Parking 404', served: '404, 406, 407' },
      { name: '27', served: '27, 28, Clinic' },
      { name: 'Parking 900', served: '900, 1000, Square' },
    ],
  },
  {
    id: 'route-2',
    name: 'Route Two',
    color: 'green',
    frequency: 'Every 10 mins',
    frequencyMinutes: 10,
    startTime: '06:30',
    endTime: '17:30',
    timing: '6:30 AM - 5:30 PM',
    eta: '3 mins',
    stops: [
      { name: 'Parking 900', served: '900, 1000, Square' },
      { name: '27', served: '27, 28, Clinic' },
      { name: 'Station 312', served: '4, 5, 6, 7, 14, 68, 75' },
      { name: 'Building 22', served: '22, 23, 24, 25, 59' },
      { name: 'Station 319', served: '700' },
      { name: 'Building 58', served: '57, 58' },
      { name: 'Station 309', served: '56, 57, 58, 70' },
      { name: 'Station 310', served: '800, 42, 61, 62' },
      { name: 'Station 312', served: '4, 5, 6, 7, 14, 68, 75' },
      { name: 'Building 22', served: '22, 23, 24, 25, 59' },
      { name: 'Station 314', served: '76, 77, Clinic' },
      { name: 'Parking 900', served: '900, 1000, Square' },
    ],
  },
  {
    id: 'route-3',
    name: 'Route Three',
    color: 'blue',
    frequency: 'Every 10 mins',
    frequencyMinutes: 10,
    startTime: '06:30',
    endTime: '17:30',
    timing: '6:30 AM - 5:30 PM',
    eta: '7 mins',
    stops: [
      { name: 'Parking 404', served: '404, 406, 407' },
      { name: 'Station 312', served: '4, 5, 6, 7, 14, 68, 75' },
      { name: 'Building 22', served: '22, 23, 24, 25, 59' },
      { name: 'Station 319', served: '700' },
      { name: 'Building 58', served: '57, 58' },
      { name: 'Station 309', served: '56, 57, 58, 70' },
      { name: 'Station 310', served: '800, 42, 61, 62' },
      { name: 'Station 312', served: '4, 5, 6, 7, 14, 68, 75' },
      { name: 'Building 22', served: '22, 23, 24, 25, 59' },
      { name: 'Station 314', served: '76, 77, Clinic' },
      { name: 'Parking 404', served: '404, 406, 407' },
    ],
  },
  {
    id: 'route-4',
    name: 'Route Four',
    color: 'brown',
    frequency: 'Every 10 mins',
    frequencyMinutes: 10,
    startTime: '06:30',
    endTime: '17:30',
    timing: '6:30 AM - 5:30 PM',
    eta: '7 mins',
    stops: [
      { name: 'Station 310 ( البداية )', served: '800, 42, 61, 62' },
      { name: 'Building 58 ( التحضيري )', served: '57, 58' },
      { name: 'Station 309', served: '56, 57, 58, 70' },
      { name: 'Station 310', served: '800, 42, 61, 62' },
    ],
  },
  {
    id: 'route-5',
    name: 'Route Five',
    color: 'red',
    frequency: 'Every 10 mins',
    frequencyMinutes: 10,
    startTime: '06:30',
    endTime: '17:30',
    timing: '6:30 AM - 5:30 PM',
    eta: 'No live GPS',
    stops: [
      { name: 'Station 319', served: '700' },
      { name: 'Building 58', served: '57, 58' },
      { name: 'Station 309', served: '56, 57, 58, 70' },
      { name: 'Station 310', served: '800, 42, 61, 62' },
      { name: 'Station 314', served: '76, 77, Clinic' },
      { name: 'Station 312', served: '4, 5, 6, 7, 14, 68, 3, 75' },
      { name: 'Building 22', served: '22, 23, 24, 25, 59' },
      { name: 'Station 314', served: '76, 77, Clinic' },
    ],
  },
  {
    id: 'route-6',
    name: 'Route Six',
    color: 'light red',
    frequency: 'Every 10 mins',
    frequencyMinutes: 10,
    startTime: '14:30',
    endTime: '21:30',
    timing: '2:30 PM - 9:30 PM',
    eta: 'No live GPS',
    stops: [
      { name: 'Station 310', served: '800, 42, 61, 62' },
      { name: 'Station 312', served: '4, 5, 6, 7, 14, 68, 75' },
      { name: 'Building 22', served: '22, 23, 24, 25, 59' },
      { name: 'Station 314', served: '76, 77, Clinic' },
      { name: 'Square', served: '900, Square' },
      { name: 'Restaurant', served: '57, 58' },
      { name: 'Parking 900', served: '900, 1000, Square' },
    ],
  },
  {
    id: 'route-7',
    name: 'Route Seven',
    color: 'yellow',
    frequency: 'According to courses schedule',
    timing: '8:00 AM - 4:00 PM',
    eta: 'No live GPS',
    stops: [
      { name: 'Station 316', served: '55, 63, 75' },
      { name: 'Station 319', served: '700' },
      { name: 'Station 310', served: '800, 42, 61, 62' },
      { name: 'Dhahran Techno Valley', served: 'DTV' },
    ],
  },
  {
    id: 'route-8',
    name: 'Route Eight',
    color: 'grey',
    frequency: 'Every 1 hour',
    timing: '8:00 AM - 4:00 PM',
    eta: 'No live GPS',
    trips: [
      { depart: '08:00', return: '10:00' },
      { depart: '09:00', return: '12:00' },
      { depart: '11:00', return: '14:00' },
      { depart: '13:00', return: '16:00' },
    ],
    stops: [
      { name: 'Station 316', served: '55, 63, 75' },
      { name: 'B.424', served: '404, 406, 407' },
      { name: 'Station 316', served: '55, 63, 75' },
    ],
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  await Route.deleteMany({})
  await Route.insertMany(routes)
  console.log('Routes seeded successfully')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})