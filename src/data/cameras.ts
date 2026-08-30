export type CameraCategory = 'city' | 'nature'

export type Camera = {
  id: string
  name: string
  place: string
  country: string
  category: CameraCategory
  /** IANA timezone for local clock */
  timezone: string
  /** YouTube video ID of the live stream */
  videoId: string
}

/**
 * Single-location public live cams only (EarthCam + NASA).
 * Avoid multi-city mashup streams — their titles do not match the frame.
 * Video IDs can change when a stream restarts — update as needed.
 */
export const cameras: Camera[] = [
  // —— City ——
  {
    id: 'times-square',
    name: 'Times Square North',
    place: 'New York',
    country: 'USA',
    category: 'city',
    timezone: 'America/New_York',
    videoId: 'JQ_jwk_7OVE',
  },
  {
    id: 'world-trade-center',
    name: 'World Trade Center',
    place: 'New York',
    country: 'USA',
    category: 'city',
    timezone: 'America/New_York',
    videoId: '5C9oM7C2Q9k',
  },
  {
    id: 'brooklyn-bridge',
    name: 'Brooklyn Bridge',
    place: 'New York',
    country: 'USA',
    category: 'city',
    timezone: 'America/New_York',
    videoId: 'tErYxn2UM5Y',
  },
  {
    id: 'abbey-road',
    name: 'Abbey Road Crossing',
    place: 'London',
    country: 'UK',
    category: 'city',
    timezone: 'Europe/London',
    videoId: 'zMCea32gpmg',
  },
  {
    id: 'chicago',
    name: 'Skydeck',
    place: 'Chicago',
    country: 'USA',
    category: 'city',
    timezone: 'America/Chicago',
    videoId: 'O0UGT7AT3aw',
  },
  {
    id: 'new-orleans',
    name: 'Street View',
    place: 'New Orleans',
    country: 'USA',
    category: 'city',
    timezone: 'America/Chicago',
    videoId: 'QhFYcPBmkcI',
  },
  {
    id: 'washington',
    name: 'Washington Monument',
    place: 'Washington, D.C.',
    country: 'USA',
    category: 'city',
    timezone: 'America/New_York',
    videoId: 'oDCAAfOSqvA',
  },
  {
    id: 'philadelphia',
    name: 'Liberty Bell',
    place: 'Philadelphia',
    country: 'USA',
    category: 'city',
    timezone: 'America/New_York',
    videoId: 'F1EQEDL4ddU',
  },
  {
    id: 'milwaukee',
    name: 'City Cam',
    place: 'Milwaukee',
    country: 'USA',
    category: 'city',
    timezone: 'America/Chicago',
    videoId: 'MT5Og9gOKuM',
  },
  {
    id: 'cleveland',
    name: 'Terminal Tower',
    place: 'Cleveland',
    country: 'USA',
    category: 'city',
    timezone: 'America/New_York',
    videoId: 'iHqqkh_Lths',
  },
  {
    id: 'mallorca',
    name: 'Harbor View',
    place: 'Mallorca',
    country: 'Spain',
    category: 'city',
    timezone: 'Europe/Madrid',
    videoId: 'jtdyLykT_XY',
  },
  {
    id: 'tamariu',
    name: 'Coastal Town',
    place: 'Tamariu',
    country: 'Spain',
    category: 'city',
    timezone: 'Europe/Madrid',
    videoId: 'fTh5ssC1z-c',
  },
  {
    id: 'seaside-heights',
    name: 'Boardwalk North',
    place: 'Seaside Heights',
    country: 'USA',
    category: 'city',
    timezone: 'America/New_York',
    videoId: 'OBgCrw-IyhE',
  },

  // —— Nature ——
  {
    id: 'botswana-waterhole',
    name: 'African Watering Hole',
    place: 'Chobe',
    country: 'Botswana',
    category: 'nature',
    timezone: 'Africa/Gaborone',
    videoId: 'F2PYgMegiuY',
  },
  {
    id: 'giraffe',
    name: 'Giraffe Paddock',
    place: 'Greenville, SC',
    country: 'USA',
    category: 'nature',
    timezone: 'America/New_York',
    videoId: 'sLRtUoPNH2k',
  },
  {
    id: 'pigeon-river',
    name: 'Pigeon River',
    place: 'Hartford, TN',
    country: 'USA',
    category: 'nature',
    timezone: 'America/New_York',
    videoId: '6tq8S2pp8PQ',
  },
  {
    id: 'baltimore-aquarium',
    name: 'Aquarium Cam',
    place: 'Baltimore',
    country: 'USA',
    category: 'nature',
    timezone: 'America/New_York',
    videoId: 'KSxc-N67TU4',
  },
  {
    id: 'sanibel',
    name: 'Sanibel Island',
    place: 'Florida',
    country: 'USA',
    category: 'nature',
    timezone: 'America/New_York',
    videoId: '4LTSTw4jnZc',
  },
  {
    id: 'spirit-lake',
    name: 'Spirit Lake',
    place: 'Iowa',
    country: 'USA',
    category: 'nature',
    timezone: 'America/Chicago',
    videoId: 'XIe9vQkAd7Q',
  },
  {
    id: 'anglins-pier',
    name: 'Anglins Pier',
    place: 'Lauderdale-By-The-Sea',
    country: 'USA',
    category: 'nature',
    timezone: 'America/New_York',
    videoId: 'tAdTOOsrZBQ',
  },
  {
    id: 'wildlife-mi',
    name: 'Wildlife Cam',
    place: 'Gaylord, MI',
    country: 'USA',
    category: 'nature',
    timezone: 'America/Detroit',
    videoId: 'IU_-Pl9O5jQ',
  },
  {
    id: 'ruidoso',
    name: 'Mountain Town',
    place: 'Ruidoso',
    country: 'USA',
    category: 'nature',
    timezone: 'America/Denver',
    videoId: 'XoANQufSSXY',
  },
  {
    id: 'iss',
    name: 'Earth from ISS',
    place: 'Low Earth Orbit',
    country: 'Space',
    category: 'nature',
    timezone: 'UTC',
    videoId: 'awQzjn72bI0',
  },
]

export const INTERVAL_MS = 45_000
